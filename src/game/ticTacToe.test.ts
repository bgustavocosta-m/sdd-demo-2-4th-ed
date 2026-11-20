import { describe, expect, it } from 'vitest'
import { applyMove, newGame, winner, type Board, type Players } from './ticTacToe'

const players: Players = {
  X: { name: 'Ana', emoji: '🦊' },
  O: { name: 'Bo', emoji: '🐼' },
}

function play(cells: number[]) {
  let s = newGame(players)
  for (const c of cells) s = applyMove(s, s.turn, c)
  return s
}

describe('newGame', () => {
  it('starts empty with X to move', () => {
    const s = newGame(players)
    expect(s.board).toEqual(Array(9).fill(null))
    expect(s.turn).toBe('X')
    expect(s.startedBy).toBe('X')
    expect(s.result).toBeNull()
    expect(s.rematchVotes).toEqual([])
    expect(s.players).toEqual(players)
  })
})

describe('winner', () => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ]
  it.each(lines)('detects line %i-%i-%i', (a, b, c) => {
    const board: Board = Array(9).fill(null)
    board[a] = board[b] = board[c] = 'O'
    expect(winner(board)).toEqual({ winner: 'O', line: [a, b, c] })
  })
  it('returns null with no line', () => {
    expect(winner(['X', 'O', 'X', null, null, null, null, null, null])).toBeNull()
  })
})

describe('applyMove', () => {
  it('places the mark and passes the turn', () => {
    const s = applyMove(newGame(players), 'X', 4)
    expect(s.board[4]).toBe('X')
    expect(s.turn).toBe('O')
  })
  it('ignores the wrong turn', () => {
    const s = newGame(players)
    expect(applyMove(s, 'O', 0)).toBe(s)
  })
  it('ignores an occupied cell', () => {
    const s = applyMove(newGame(players), 'X', 0)
    expect(applyMove(s, 'O', 0)).toBe(s)
  })
  it('ignores out-of-range cells', () => {
    const s = newGame(players)
    expect(applyMove(s, 'X', 9)).toBe(s)
    expect(applyMove(s, 'X', -1)).toBe(s)
    expect(applyMove(s, 'X', 1.5)).toBe(s)
  })
  it('records a win and ignores moves after it', () => {
    const s = play([0, 3, 1, 4, 2])
    expect(s.result).toEqual({ winner: 'X', line: [0, 1, 2] })
    expect(applyMove(s, s.turn, 8)).toBe(s)
  })
  it('records a draw', () => {
    const s = play([0, 1, 2, 4, 3, 5, 7, 6, 8])
    expect(s.result).toEqual({ winner: null })
  })
})
