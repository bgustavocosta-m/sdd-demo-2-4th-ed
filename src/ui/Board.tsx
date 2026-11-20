import type { GameState } from '../game/ticTacToe'

interface Props {
  state: GameState
  canMove: boolean
  onMove: (cell: number) => void
}

export function Board({ state, canMove, onMove }: Props) {
  const line = state.result?.winner ? state.result.line : []
  return (
    <div className="board" role="grid" aria-label="Board">
      {state.board.map((cell, i) => (
        <button
          key={i}
          className={line.includes(i) ? 'cell win' : 'cell'}
          aria-label={`Cell ${i + 1}${cell ? `, ${cell}` : ''}`}
          disabled={!canMove || cell !== null}
          onClick={() => onMove(i)}
        >
          {cell}
        </button>
      ))}
    </div>
  )
}
