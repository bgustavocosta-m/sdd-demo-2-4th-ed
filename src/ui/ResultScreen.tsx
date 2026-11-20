import { other, type GameState, type Mark } from '../game/ticTacToe'
import { Board } from './Board'
import { CheckIcon } from './icons'
import { Avatar, Screen } from './Shell'

interface Props {
  slug: string
  state: GameState
  me: Mark
  onRematch: () => void
}

function howWon(line: number[]): string {
  const step = line[1] - line[0]
  if (step === 1) return 'Three in a row.'
  if (step === 3) return 'Three in a column.'
  return 'Three in a row on the diagonal.'
}

/** Game over: outcome, final board with the winning line, and rematch voting. */
export function ResultScreen({ slug, state, me, onRematch }: Props) {
  const { result, players, rematchVotes } = state
  if (!result) return null
  const them = other(me)
  const winner = result.winner
  const headline = winner === null ? 'It’s a draw' : winner === me ? 'You win' : `${players[winner].name} wins`
  const starter = winner ? other(winner) : other(state.startedBy)
  const reason = winner ? 'lost this one' : 'went second this game'
  const voted = rematchVotes.includes(me)

  return (
    <Screen slug={slug}>
      <div className="headline-block" role="status">
        {winner && <span className="result-avatar" aria-hidden="true">{players[winner].emoji}</span>}
        <span className="h2">{headline}</span>
        <span className="subline">{result.winner ? howWon(result.line) : 'Board full.'}</span>
      </div>

      <Board state={state} variant="final" />

      <section className="card rematch" aria-labelledby="rematch-h">
        <div className="rematch-head">
          <h2 id="rematch-h" className="h3">
            Rematch?
          </h2>
          <span className="hint">{rematchVotes.length} of 2 votes</span>
        </div>
        <ul className="vote-list">
          {[me, them].map((m) => (
            <li key={m} className="vote-row">
              <Avatar emoji={players[m].emoji} mark={m} size="sm" />
              <span className="grow strong">
                {players[m].name} {m === me && <span className="muted-text">(you)</span>}
              </span>
              {rematchVotes.includes(m) ? (
                <span className="voted">
                  <CheckIcon size={16} />
                  Voted
                </span>
              ) : (
                <span className="hint">Deciding…</span>
              )}
            </li>
          ))}
        </ul>
        <p className="rematch-note">
          When both vote, a new game starts and{' '}
          <strong>{starter === me ? 'you move first' : `${players[starter].name} moves first`}</strong>, since{' '}
          {starter === me ? 'you' : 'they'} {reason}.
        </p>
      </section>

      <div className="actions actions-row">
        <a className="btn btn-secondary" href="#/">
          Leave
        </a>
        <button type="button" className="btn btn-primary" onClick={onRematch} disabled={voted}>
          {voted ? `Waiting for ${players[them].name}` : 'Rematch'}
        </button>
      </div>
    </Screen>
  )
}
