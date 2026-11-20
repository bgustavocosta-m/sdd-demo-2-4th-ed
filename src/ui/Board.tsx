import type { GameState } from '../game/ticTacToe'

const ROWS = ['top', 'middle', 'bottom']
const COLS = ['left', 'centre', 'right']

interface Props {
  state: GameState
  /** `play`: buttons; `final`: the result board; `faded`: decorative last board. */
  variant?: 'play' | 'final' | 'faded'
  canMove?: boolean
  onMove?: (cell: number) => void
}

export function Board({ state, variant = 'play', canMove = false, onMove }: Props) {
  const result = state.result
  const line = result?.winner ? result.line : []
  const winTint = result?.winner ? ` win-${result.winner.toLowerCase()}` : ''

  const cellClass = (i: number) => {
    const mark = state.board[i]
    let c = 'cell'
    if (mark) c += ` mark-${mark.toLowerCase()}`
    if (variant === 'final') c += line.includes(i) ? winTint : ' muted'
    return c
  }

  if (variant !== 'play') {
    return (
      <div
        className={`board board-${variant}`}
        {...(variant === 'faded' ? { 'aria-hidden': true } : { role: 'img', 'aria-label': 'Final board' })}
      >
        {state.board.map((cell, i) => (
          <div key={i} className={cellClass(i)}>
            {cell}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="board board-play" role="group" aria-label="Board">
      {state.board.map((cell, i) => (
        <button
          key={i}
          type="button"
          className={cellClass(i)}
          aria-label={`${ROWS[Math.floor(i / 3)]} ${COLS[i % 3]}, ${cell ?? 'empty'}`}
          disabled={!canMove || cell !== null}
          onClick={() => onMove?.(i)}
        >
          {cell}
        </button>
      ))}
    </div>
  )
}
