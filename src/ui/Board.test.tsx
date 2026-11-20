import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, expect, it } from 'vitest'
import { applyMove, newGame } from '../game/ticTacToe'
import { Board } from './Board'

afterEach(cleanup)

const players = { X: { name: 'Ana', emoji: '🦊' }, O: { name: 'Bo', emoji: '🐸' } }

it('labels each cell with its position and contents', () => {
  const state = applyMove(newGame(players), 'X', 4)
  render(<Board state={state} canMove onMove={() => {}} />)
  expect(screen.getByRole('button', { name: 'top left, empty' })).toBeTruthy()
  const centre = screen.getByRole('button', { name: 'middle centre, X' }) as HTMLButtonElement
  expect(centre.disabled).toBe(true)
  expect(screen.getByRole('button', { name: 'bottom right, empty' })).toBeTruthy()
})
