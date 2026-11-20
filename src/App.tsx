import { useHashPath } from './router/useHashPath'
import { CreateScreen } from './ui/CreateScreen'
import { Home } from './ui/Home'
import { RoomScreen } from './ui/RoomScreen'

const ROOM = /^\/tic-tac-toe\/room\/([^/]*)$/

export default function App() {
  const path = useHashPath()
  const room = ROOM.exec(path)
  if (room) return <RoomScreen key={room[1]} slug={room[1]} />
  if (path === '/tic-tac-toe') return <CreateScreen />
  return <Home />
}
