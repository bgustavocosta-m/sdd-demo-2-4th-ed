import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, it } from 'vitest'
import { Home } from './Home'

afterEach(() => {
  cleanup()
  window.location.hash = ''
})

it('shows tic-tac-toe and checkers coming soon', () => {
  render(<Home />)
  expect(screen.getByRole('button', { name: 'Tic-tac-toe' })).toBeTruthy()
  const checkers = screen.getByRole('button', { name: 'Checkers — coming soon' })
  expect((checkers as HTMLButtonElement).disabled).toBe(true)
})

it('goes to #/tic-tac-toe when tic-tac-toe is picked', () => {
  render(<Home />)
  fireEvent.click(screen.getByRole('button', { name: 'Tic-tac-toe' }))
  expect(window.location.hash).toBe('#/tic-tac-toe')
})
