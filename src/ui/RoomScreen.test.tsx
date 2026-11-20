import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { RoomScreen } from './RoomScreen'

type Handler = (arg?: unknown) => void

// A fake PeerJS: records every Peer built and lets the test fire its events.
const peers = vi.hoisted(() => [] as FakePeer[])
interface FakePeer {
  handlers: Record<string, Handler>
  conn: { handlers: Record<string, Handler> }
}
vi.mock('peerjs', () => ({
  default: class {
    handlers: Record<string, Handler> = {}
    conn = {
      handlers: {} as Record<string, Handler>,
      on(ev: string, h: Handler) {
        this.handlers[ev] = h
      },
      send() {},
    }
    constructor() {
      peers.push(this as unknown as FakePeer)
    }
    on(ev: string, h: Handler) {
      this.handlers[ev] = h
    }
    connect() {
      return this.conn
    }
    destroy() {}
  },
}))

beforeEach(() => {
  peers.length = 0
  localStorage.clear()
})
afterEach(() => {
  cleanup()
  window.location.hash = ''
})

async function joinAsGuest(slug: string) {
  render(<RoomScreen slug={slug} />)
  fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Bo' } })
  fireEvent.click(screen.getByRole('button', { name: 'Join room' }))
  await screen.findByText('Connecting…')
  const peer = peers[0]
  act(() => peer.handlers.open())
  return peer
}

it.each(['', 'ABCDEF', 'abcde', 'abcdefg', 'abcde1', 'abcdeo', 'abcdel', 'abcdei'])(
  'slug %j → "Invalid room link" without touching the network',
  (slug) => {
    render(<RoomScreen slug={slug} />)
    expect(screen.getByRole('heading', { name: 'Invalid room link' })).toBeTruthy()
    expect(peers).toHaveLength(0)
  },
)

it('"Create a new room" goes to the create page', () => {
  render(<RoomScreen slug="nope" />)
  fireEvent.click(screen.getByRole('button', { name: 'Create a new room' }))
  expect(window.location.hash).toBe('#/tic-tac-toe')
})

it('peer-unavailable → "Room not found or host left", and a later close keeps it', async () => {
  const peer = await joinAsGuest('abcdef')
  act(() => peer.handlers.error({ type: 'peer-unavailable' }))
  expect(screen.getByRole('heading', { name: 'Room not found or host left' })).toBeTruthy()
  act(() => peer.conn.handlers.close())
  expect(screen.getByRole('heading', { name: 'Room not found or host left' })).toBeTruthy()
  expect(screen.getByRole('button', { name: 'Create a new room' })).toBeTruthy()
})

it('full from the host → "Room is full", and the host closing keeps it', async () => {
  const peer = await joinAsGuest('abcdef')
  act(() => peer.conn.handlers.data({ type: 'full' }))
  expect(screen.getByRole('heading', { name: 'Room is full' })).toBeTruthy()
  act(() => peer.conn.handlers.close())
  expect(screen.getByRole('heading', { name: 'Room is full' })).toBeTruthy()
  expect(screen.getByRole('button', { name: 'Create a new room' })).toBeTruthy()
})
