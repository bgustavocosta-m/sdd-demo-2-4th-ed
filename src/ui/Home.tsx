import { navigate } from '../router/useHashPath'

export function Home() {
  return (
    <main className="home">
      <h1>Board games</h1>
      <p>Pick a game to play with a friend.</p>
      <ul className="games">
        <li>
          <button className="game" onClick={() => navigate('/tic-tac-toe')}>
            Tic-tac-toe
          </button>
        </li>
        <li>
          <button className="game" disabled>
            Checkers — coming soon
          </button>
        </li>
      </ul>
    </main>
  )
}
