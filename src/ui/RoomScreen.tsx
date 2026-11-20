import { useState } from 'react'
import { other, type Profile } from '../game/ticTacToe'
import { isHosting, usePeerRoom } from '../net/usePeerRoom'
import { isValidSlug } from '../room/slug'
import { Board } from './Board'
import { CopyLinkButton } from './CopyLinkButton'
import { BrokenLinkIcon, ConnectingIcon, FullIcon, InfoIcon, LeftIcon, NotFoundIcon, OfflineIcon } from './icons'
import { PlayerBar } from './PlayerBar'
import { loadProfile } from './profile'
import { ProfileForm } from './ProfileForm'
import { ResultScreen } from './ResultScreen'
import { AlertScreen, Avatar, MarkGlyph, Screen } from './Shell'

export function RoomScreen({ slug }: { slug: string }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const needsProfile = isValidSlug(slug) && !isHosting(slug) && !profile
  if (needsProfile) {
    return (
      <Screen slug={slug}>
        <div className="stack-8">
          <span className="eyebrow">Tic-tac-toe invite</span>
          <h1 className="h1">You’re invited</h1>
        </div>
        <ProfileForm mark="O" submitLabel="Join game" onSubmit={setProfile} />
      </Screen>
    )
  }
  return <Room slug={slug} profile={profile} />
}

function Waiting({ slug }: { slug: string }) {
  const [host] = useState(loadProfile)
  const link = window.location.href
  return (
    <Screen slug={slug}>
      <div className="card waiting-card">
        <span className="mini-grid" aria-hidden="true">
          {Array.from({ length: 9 }, (_, i) => (
            <span key={i} />
          ))}
        </span>
        <div className="stack-8">
          <h1 className="h1 h1-sm" role="status">
            Waiting for opponent
          </h1>
          <p className="lede">Send this link to a friend. The room stays open as long as this tab does.</p>
        </div>
        <div className="link-box">
          <label className="label-sm" htmlFor="room-link">
            Room link
          </label>
          <input id="room-link" className="input input-mono" type="text" readOnly value={link} />
          <CopyLinkButton link={link} />
        </div>
      </div>

      <section className="stack-10" aria-label="Players">
        <div className="card player-row">
          <Avatar emoji={host.emoji} mark="X" />
          <span className="grow strong">
            {host.name} <span className="muted-text">(you)</span>
          </span>
          <MarkGlyph mark="X" />
        </div>
        <div className="player-row open-seat">
          <span className="avatar avatar-md avatar-empty" aria-hidden="true" />
          <span className="grow muted-text">Open seat</span>
          <MarkGlyph mark="O" muted />
        </div>
      </section>

      <a className="text-link" href="#/">
        Close room
      </a>
    </Screen>
  )
}

function Room({ slug, profile }: { slug: string; profile: Profile | null }) {
  const { role, status, state, sendMove, sendRematch } = usePeerRoom({ slug, profile })
  const me = role === 'host' ? 'X' : 'O'

  switch (status) {
    case 'invalid':
      return (
        <AlertScreen
          icon={<BrokenLinkIcon />}
          title="Invalid room link"
          reason="This link doesn’t point to a room. Room codes are 6 letters and numbers. Check you copied the whole link."
        >
          <div className="opened">
            <span className="label-xs">You opened</span>
            <code className="mono">
              #/tic-tac-toe/room/<span className="bad-slug">{slug}</span>
            </code>
          </div>
        </AlertScreen>
      )
    case 'full':
      return (
        <AlertScreen
          slug={slug}
          icon={<FullIcon />}
          title="Room is full"
          reason="Two players are already in this room. Rooms hold two players, and spectating isn’t available."
        />
      )
    case 'not-found':
      return (
        <AlertScreen
          slug={slug}
          icon={<NotFoundIcon />}
          title="Room not found or host left"
          reason="A room only exists while its host’s tab is open. If the host closed or refreshed the page, the room is gone."
          after={
            <p className="footnote">
              <InfoIcon />
              Start a new room and send the fresh link to your friend.
            </p>
          }
        />
      )
    case 'error':
      return (
        <AlertScreen
          slug={slug}
          icon={<OfflineIcon />}
          title="Connection error"
          reason="Couldn’t reach the other browser. Check your connection and try again."
        />
      )
    case 'opponent-left': {
      const them = state?.players[other(me)]
      return (
        <AlertScreen
          slug={slug}
          icon={<LeftIcon />}
          title="Opponent left"
          reason={
            them
              ? `${them.emoji} ${them.name} closed the tab or lost connection, so this game has ended.`
              : 'Your opponent closed the tab or lost connection, so this game has ended.'
          }
          before={state && <Board state={state} variant="faded" />}
        />
      )
    }
    case 'connecting':
      return (
        <AlertScreen
          slug={slug}
          icon={<ConnectingIcon />}
          title="Connecting…"
          reason="Reaching the host’s browser. This takes a few seconds."
        />
      )
    case 'waiting':
      return <Waiting slug={slug} />
  }

  if (!state) return null
  if (state.result) return <ResultScreen slug={slug} state={state} me={me} onRematch={sendRematch} />
  return (
    <Screen slug={slug}>
      <PlayerBar state={state} me={me} />
      <Board state={state} canMove={state.turn === me} onMove={sendMove} />
      <p className="hint center">Tap an empty square on your turn.</p>
    </Screen>
  )
}
