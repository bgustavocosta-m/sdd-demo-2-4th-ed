import { useState } from 'react'
import { createRoom } from '../net/usePeerRoom'
import { navigate } from '../router/useHashPath'
import { ArrowLeftIcon } from './icons'
import { ProfileForm } from './ProfileForm'
import { Screen } from './Shell'

/** Profile + create: registers the host peer, then goes to the room. */
export function CreateScreen() {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  return (
    <Screen>
      <a className="back-link" href="#/">
        <ArrowLeftIcon />
        All games
      </a>
      <div className="stack-8">
        <h1 className="h1">Tic-tac-toe</h1>
        <p className="lede">Tell your opponent who they’re playing.</p>
      </div>
      <ProfileForm
        mark="X"
        submitLabel={busy ? 'Creating…' : 'Create room'}
        busy={busy}
        error={error}
        onSubmit={(p) => {
          setBusy(true)
          setError(null)
          createRoom(p)
            .then((slug) => navigate(`/tic-tac-toe/room/${slug}`))
            .catch(() => {
              setError('Could not create a room. Please try again.')
              setBusy(false)
            })
        }}
      />
    </Screen>
  )
}
