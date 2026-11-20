import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, expect, it } from 'vitest'
import { Home } from './Home'

afterEach(cleanup)

it('links the wordmark home', () => {
  render(<Home />)
  expect(screen.getByRole('link', { name: 'board games' }).getAttribute('href')).toBe('#/')
})

it('links tic-tac-toe to #/tic-tac-toe', () => {
  render(<Home />)
  expect(screen.getByRole('link', { name: /Tic-tac-toe/ }).getAttribute('href')).toBe('#/tic-tac-toe')
})

it('shows checkers as coming soon and not clickable', () => {
  render(<Home />)
  const card = screen.getByText('Coming soon').closest('[aria-disabled]')
  expect(card?.getAttribute('aria-disabled')).toBe('true')
  expect(screen.queryByRole('link', { name: /Checkers/ })).toBeNull()
  expect(screen.queryByRole('button', { name: /Checkers/ })).toBeNull()
})
