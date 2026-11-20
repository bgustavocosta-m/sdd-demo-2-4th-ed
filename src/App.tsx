import { useState } from 'react'
import { createRoom } from './net/usePeerRoom'
import { navigate, useHashPath } from './router/useHashPath'
import { Home } from './ui/Home'
import { ProfileForm } from './ui/ProfileForm'
import { RoomScreen } from './ui/RoomScreen'

const ROOM = /^\/tic-tac-toe\/room\/([^/]*)$/

function CreateRoom() {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  return (
    <main>
      <h1>Tic-tac-toe</h1>
      <ProfileForm
        submitLabel={busy ? 'Creating…' : 'Create room'}
        busy={busy}
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
      {error && <p className="error">{error}</p>}
      <button onClick={() => navigate('/')}>Back</button>
    </main>
  )
}

export default function App() {
  const path = useHashPath()
  const room = ROOM.exec(path)
  if (room) return <RoomScreen key={room[1]} slug={room[1]} />
  if (path === '/tic-tac-toe') return <CreateRoom />
  return <Home />
}
