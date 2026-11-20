import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, expect, it } from 'vitest'
import { applyMove, newGame, voteRematch, type GameState } from '../game/ticTacToe'
import { ResultScreen } from './ResultScreen'

afterEach(cleanup)

const players = { X: { name: 'Ana', emoji: '🦊' }, O: { name: 'Bo', emoji: '🐸' } }

function xWinsDiagonal(): GameState {
  let s = newGame(players)
  for (const [m, c] of [['X', 0], ['O', 1], ['X', 4], ['O', 2], ['X', 8]] as const) s = applyMove(s, m, c)
  return s
}

it('shows the outcome, the winning line and who starts next', () => {
  const { container } = render(<ResultScreen slug="abcdef" state={xWinsDiagonal()} me="O" onRematch={() => {}} />)
  expect(screen.getByText('Ana wins')).toBeTruthy()
  expect(container.querySelectorAll('.win-x')).toHaveLength(3)
  expect(screen.getByText('0 of 2 votes')).toBeTruthy()
  expect(screen.getByText('you move first')).toBeTruthy()
  expect((screen.getByRole('button', { name: 'Rematch' }) as HTMLButtonElement).disabled).toBe(false)
})

it('after voting, the button waits for the opponent', () => {
  const state = voteRematch(xWinsDiagonal(), 'X')
  render(<ResultScreen slug="abcdef" state={state} me="X" onRematch={() => {}} />)
  expect(screen.getByText('You win')).toBeTruthy()
  expect(screen.getByText('1 of 2 votes')).toBeTruthy()
  expect(screen.getByText('Voted')).toBeTruthy()
  expect(screen.getByText('Deciding…')).toBeTruthy()
  const btn = screen.getByRole('button', { name: 'Waiting for Bo' }) as HTMLButtonElement
  expect(btn.disabled).toBe(true)
})

it('after a draw, whoever went second starts next', () => {
  let s = newGame(players)
  for (const [m, c] of [['X', 0], ['O', 1], ['X', 2], ['O', 4], ['X', 3], ['O', 5], ['X', 7], ['O', 6], ['X', 8]] as const)
    s = applyMove(s, m, c)
  render(<ResultScreen slug="abcdef" state={s} me="X" onRematch={() => {}} />)
  expect(screen.getByText('It’s a draw')).toBeTruthy()
  expect(screen.getByText('Bo moves first')).toBeTruthy()
})
