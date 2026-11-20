import { navigate, useHashPath } from './router/useHashPath'
import { Home } from './ui/Home'

export default function App() {
  const path = useHashPath()

  if (path === '/tic-tac-toe') {
    return (
      <main>
        <h1>Tic-tac-toe</h1>
        <p>Coming next: pick a name and create a room.</p>
        <button onClick={() => navigate('/')}>Back</button>
      </main>
    )
  }
  return <Home />
}
