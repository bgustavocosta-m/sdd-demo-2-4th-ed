import { other, type GameState, type Mark } from '../game/ticTacToe'
import { Avatar, MarkGlyph } from './Shell'

interface Props {
  state: GameState
  me: Mark
}

/** Both player cards (the one to move is highlighted) and the live turn headline. */
export function PlayerBar({ state, me }: Props) {
  const { turn, players } = state
  const them = players[other(me)]
  return (
    <>
      <section className="player-cards" aria-label="Players">
        {(['X', 'O'] as const).map((m) => (
          <div key={m} className={turn === m ? `player-card active active-${m.toLowerCase()}` : 'player-card'}>
            <Avatar emoji={players[m].emoji} mark={m} size="sm" />
            <span className="player-meta">
              <span className="player-name">{players[m].name}</span>
              <span className="hint-sm">{m === me ? 'You' : 'Opponent'}</span>
            </span>
            <MarkGlyph mark={m} />
          </div>
        ))}
      </section>
      <div className="headline-block" role="status" aria-live="polite">
        <span className="h2">{turn === me ? 'Your turn' : `${players[turn].name}’s turn`}</span>
        <span className="subline">{turn === me ? `You’re ${me}` : `Waiting for ${them.name} to move…`}</span>
      </div>
    </>
  )
}
