import type { GameState, Mark } from '../game/ticTacToe'

interface Props {
  state: GameState
  me: Mark
}

export function PlayerBar({ state, me }: Props) {
  const { result, turn, players } = state
  const status = result
    ? result.winner === null
      ? "It's a draw"
      : result.winner === me
        ? 'You win!'
        : `${players[result.winner].name} wins`
    : turn === me
      ? 'Your turn'
      : `${players[turn].name}'s turn`
  return (
    <div className="player-bar">
      <ul className="players">
        {(['X', 'O'] as const).map((m) => (
          <li key={m} className={!result && turn === m ? 'player active' : 'player'}>
            <span className="mark">{m}</span> {players[m].emoji} {players[m].name}
            {m === me && ' (you)'}
          </li>
        ))}
      </ul>
      <p className="status" role="status">
        {status}
      </p>
    </div>
  )
}
