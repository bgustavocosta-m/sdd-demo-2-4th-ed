import { useState } from 'react'
import { other, type Mark, type Profile } from '../game/ticTacToe'
import { isHosting, usePeerRoom } from '../net/usePeerRoom'
import { navigate } from '../router/useHashPath'
import { isValidSlug } from '../room/slug'
import { Board } from './Board'
import { PlayerBar } from './PlayerBar'
import { ProfileForm } from './ProfileForm'

export function RoomScreen({ slug }: { slug: string }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const needsProfile = isValidSlug(slug) && !isHosting(slug) && !profile
  if (needsProfile) {
    return (
      <main>
        <h1>Join tic-tac-toe</h1>
        <ProfileForm submitLabel="Join room" onSubmit={setProfile} />
      </main>
    )
  }
  return <Room slug={slug} profile={profile} />
}

function NewRoom({ message }: { message: string }) {
  return (
    <main>
      <h1>{message}</h1>
      <button onClick={() => navigate('/tic-tac-toe')}>Create a new room</button>
    </main>
  )
}

function Rematch({ votes, me, onVote }: { votes: Mark[]; me: Mark; onVote: () => void }) {
  const mine = votes.includes(me)
  const theirs = votes.includes(other(me))
  return (
    <div className="rematch">
      <button onClick={onVote} disabled={mine}>
        {mine ? 'Rematch requested' : 'Rematch'}
      </button>
      <p>{theirs ? 'Opponent wants a rematch' : mine ? 'Waiting for opponent…' : ''}</p>
    </div>
  )
}

function Room({ slug, profile }: { slug: string; profile: Profile | null }) {
  const { role, status, state, sendMove, sendRematch } = usePeerRoom({ slug, profile })
  const [copied, setCopied] = useState(false)
  const me = role === 'host' ? 'X' : 'O'

  switch (status) {
    case 'invalid':
      return <NewRoom message="Invalid room link" />
    case 'full':
      return <NewRoom message="Room is full" />
    case 'not-found':
      return <NewRoom message="Room not found or host left" />
    case 'error':
      return <NewRoom message="Connection error" />
    case 'opponent-left':
      return <NewRoom message="Opponent left" />
    case 'connecting':
      return (
        <main>
          <p>Connecting…</p>
        </main>
      )
    case 'waiting': {
      const link = window.location.href
      return (
        <main>
          <h1>Waiting for opponent</h1>
          <p>Send this link to a friend:</p>
          <p className="link">
            <code>{link}</code>
          </p>
          <button
            onClick={() => {
              void navigator.clipboard?.writeText(link).then(() => setCopied(true))
            }}
          >
            {copied ? 'Copied!' : 'Copy link'}
          </button>
        </main>
      )
    }
  }

  return (
    <main>
      <h1>Tic-tac-toe</h1>
      {state && (
        <>
          <PlayerBar state={state} me={me} />
          <Board state={state} canMove={status === 'playing' && !state.result && state.turn === me} onMove={sendMove} />
          {state.result && status === 'playing' && <Rematch votes={state.rematchVotes} me={me} onVote={sendRematch} />}
        </>
      )}
    </main>
  )
}
