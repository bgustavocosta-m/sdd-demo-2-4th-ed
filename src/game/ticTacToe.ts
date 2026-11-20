export type Mark = 'X' | 'O'
export type Cell = Mark | null
export type Board = Cell[]
export interface Profile {
  name: string
  emoji: string
}
export type Players = Record<Mark, Profile>
export type Result = { winner: Mark; line: number[] } | { winner: null } | null

export interface GameState {
  board: Board
  turn: Mark
  players: Players
  result: Result
  rematchVotes: Mark[]
  startedBy: Mark
}

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

export const other = (m: Mark): Mark => (m === 'X' ? 'O' : 'X')

export function newGame(players: Players, startedBy: Mark = 'X'): GameState {
  return { board: Array(9).fill(null), turn: startedBy, players, result: null, rematchVotes: [], startedBy }
}

/** The winning mark and line, or null. */
export function winner(board: Board): { winner: Mark; line: number[] } | null {
  for (const line of LINES) {
    const [a, b, c] = line
    const m = board[a]
    if (m && m === board[b] && m === board[c]) return { winner: m, line }
  }
  return null
}

/** Plays `mark` at `cell`; returns the same state if the move is invalid. */
export function applyMove(state: GameState, mark: Mark, cell: number): GameState {
  if (state.result || state.turn !== mark) return state
  if (!Number.isInteger(cell) || cell < 0 || cell > 8 || state.board[cell]) return state
  const board = state.board.slice()
  board[cell] = mark
  const result = winner(board) ?? (board.every(Boolean) ? { winner: null } : null)
  return { ...state, board, turn: other(mark), result }
}
