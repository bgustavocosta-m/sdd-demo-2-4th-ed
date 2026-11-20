import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { CopyLinkButton } from './CopyLinkButton'

const writeText = vi.fn(() => Promise.resolve())

beforeEach(() => {
  vi.useFakeTimers()
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
})
afterEach(() => {
  cleanup()
  vi.useRealTimers()
  writeText.mockClear()
})

it('copies the link and reads "Link copied" for about 1.8 s', async () => {
  render(<CopyLinkButton link="https://x.test/#/tic-tac-toe/room/abcdef" />)
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Copy link' }))
  })
  expect(writeText).toHaveBeenCalledWith('https://x.test/#/tic-tac-toe/room/abcdef')
  expect(screen.getByRole('button', { name: 'Link copied' })).toBeTruthy()
  act(() => vi.advanceTimersByTime(1700))
  expect(screen.getByRole('button', { name: 'Link copied' })).toBeTruthy()
  act(() => vi.advanceTimersByTime(100))
  expect(screen.getByRole('button', { name: 'Copy link' })).toBeTruthy()
})
