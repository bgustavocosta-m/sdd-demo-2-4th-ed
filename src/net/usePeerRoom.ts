import Peer, { type DataConnection } from 'peerjs'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { GameState, Profile } from '../game/ticTacToe'
import { hostHandle, hostMove, initialHost, type HostState } from '../room/hostReducer'
import { hostPeerId, isValidSlug, makeSlug } from '../room/slug'
import { createHeartbeat } from './heartbeat'
import { parseMessage, type Message } from './protocol'

export type RoomStatus =
  | 'invalid'
  | 'connecting'
  | 'waiting'
  | 'full'
  | 'not-found'
  | 'playing'
  | 'opponent-left'
  | 'error'

const CONN_OPTS = { reliable: true, serialization: 'json' } as const
const MAX_ATTEMPTS = 3

/** Host peers opened by `createRoom`, handed to the room screen by slug. */
const hostedRooms = new Map<string, { peer: Peer; profile: Profile }>()

export const isHosting = (slug: string) => hostedRooms.has(slug)

function openHostPeer(slug: string): Promise<Peer> {
  return new Promise((resolve, reject) => {
    const peer = new Peer(hostPeerId(slug))
    peer.once('open', () => resolve(peer))
    peer.once('error', (err) => {
      peer.destroy()
      reject(err)
    })
  })
}

/** Registers a host peer, retrying a new slug on `unavailable-id`. Resolves once the peer is open. */
export async function createRoom(profile: Profile): Promise<string> {
  for (let attempt = 1; ; attempt++) {
    const slug = makeSlug()
    try {
      const peer = await openHostPeer(slug)
      hostedRooms.set(slug, { peer, profile })
      return slug
    } catch (err) {
      const type = (err as { type?: string }).type
      if (type !== 'unavailable-id' || attempt >= MAX_ATTEMPTS) throw err
    }
  }
}

const send = (conn: DataConnection, msg: Message) => conn.send(msg)

/**
 * Pings the other side, answers its pings, and calls `onLeft` once when the
 * connection closes or the heartbeat times out (which also closes it).
 */
function keepAlive(conn: DataConnection, onLeft: () => void) {
  let done = false
  const leave = () => {
    if (done) return
    done = true
    heartbeat.stop()
    onLeft()
  }
  const heartbeat = createHeartbeat({
    send: (msg) => send(conn, msg),
    onTimeout: () => {
      leave()
      conn.close()
    },
  })
  conn.on('close', leave)
  return {
    /** Handles `ping`/`pong`; returns true if the message was one of them. */
    handle(msg: Message): boolean {
      if (msg.type === 'ping') send(conn, { type: 'pong' })
      else if (msg.type === 'pong') heartbeat.onPong()
      else return false
      return true
    },
    stop() {
      done = true
      heartbeat.stop()
    },
  }
}

interface Options {
  slug: string
  profile: Profile | null
}

export function usePeerRoom({ slug, profile }: Options) {
  const valid = isValidSlug(slug)
  const role = hostedRooms.has(slug) ? 'host' : 'guest'
  const [status, setStatus] = useState<RoomStatus>(!valid ? 'invalid' : role === 'host' ? 'waiting' : 'connecting')
  const [state, setState] = useState<GameState | null>(null)
  const hostRef = useRef<HostState | null>(null)
  const guestConn = useRef<DataConnection | null>(null)
  const sendToGuestRef = useRef<(msgs: Message[]) => void>(() => {})

  // Host: accept the first guest that says hello; later ones get `full`.
  useEffect(() => {
    const room = hostedRooms.get(slug)
    if (!valid || !room) return
    const { peer } = room
    hostRef.current ??= initialHost(room.profile)
    let disposed = false
    let alive: ReturnType<typeof keepAlive> | null = null

    const onConnection = (conn: DataConnection) => {
      conn.on('data', (raw) => {
        const msg = parseMessage(raw)
        if (!msg || !hostRef.current) return
        const isGuest = guestConn.current === conn
        if (isGuest && alive?.handle(msg)) return
        if (!isGuest && msg.type !== 'hello') return
        if (isGuest && msg.type === 'hello') return
        const { state: next, replies } = hostHandle(hostRef.current, msg)
        if (msg.type === 'hello' && replies[0]?.type === 'full') {
          send(conn, { type: 'full' })
          setTimeout(() => conn.close(), 500)
          return
        }
        if (msg.type === 'hello') {
          guestConn.current = conn
          alive = keepAlive(conn, () => !disposed && setStatus('opponent-left'))
        }
        hostRef.current = next
        replies.forEach((r) => send(conn, r))
        setState(next.game)
        if (next.game) setStatus('playing')
      })
    }
    sendToGuestRef.current = (msgs) => {
      const c = guestConn.current
      if (c) msgs.forEach((m) => send(c, m))
    }
    peer.on('connection', onConnection)
    return () => {
      disposed = true
      alive?.stop()
      peer.off('connection', onConnection)
    }
  }, [slug, valid])

  // Guest: connect to the host once we have a profile.
  useEffect(() => {
    if (!valid || role !== 'guest' || !profile) return
    let disposed = false
    const peer = new Peer()
    const update = (s: RoomStatus) => !disposed && setStatus(s)
    let alive: ReturnType<typeof keepAlive> | null = null
    peer.on('error', (err) => update(err.type === 'peer-unavailable' ? 'not-found' : 'error'))
    peer.on('open', () => {
      const conn = peer.connect(hostPeerId(slug), CONN_OPTS)
      guestConn.current = conn
      conn.on('open', () => {
        send(conn, { type: 'hello', name: profile.name, emoji: profile.emoji })
        alive = keepAlive(conn, () => update('opponent-left'))
      })
      conn.on('data', (raw) => {
        const msg = parseMessage(raw)
        if (disposed || !msg || alive?.handle(msg)) return
        if (msg.type === 'full') {
          disposed = true
          alive?.stop()
          setStatus('full')
        } else if (msg.type === 'state') {
          setState(msg.state)
          setStatus('playing')
        }
      })
    })
    return () => {
      disposed = true
      alive?.stop()
      guestConn.current = null
      peer.destroy()
    }
  }, [slug, valid, role, profile])

  // Host peer lives until the room screen is left for good (survives StrictMode remounts).
  useEffect(() => {
    const room = hostedRooms.get(slug)
    if (!room) return
    const onUnload = () => room.peer.destroy()
    window.addEventListener('beforeunload', onUnload)
    return () => {
      window.removeEventListener('beforeunload', onUnload)
      setTimeout(() => {
        if (window.location.hash.endsWith(`/room/${slug}`)) return
        room.peer.destroy()
        hostedRooms.delete(slug)
      }, 0)
    }
  }, [slug])

  const sendMove = useCallback(
    (cell: number) => {
      if (role === 'host') {
        if (!hostRef.current) return
        const { state: next, replies } = hostMove(hostRef.current, cell)
        hostRef.current = next
        sendToGuestRef.current(replies)
        setState(next.game)
      } else if (guestConn.current) {
        send(guestConn.current, { type: 'move', cell })
      }
    },
    [role],
  )

  return { role, status, state, sendMove } as const
}
