import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { currentPath, navigate, useHashPath } from './useHashPath'

afterEach(() => {
  window.location.hash = ''
})

describe('currentPath', () => {
  it('is "/" when there is no hash', () => {
    window.location.hash = ''
    expect(currentPath()).toBe('/')
  })

  it('strips the leading "#"', () => {
    window.location.hash = '#/tic-tac-toe'
    expect(currentPath()).toBe('/tic-tac-toe')
  })
})

describe('navigate', () => {
  it('sets location.hash to the path', () => {
    navigate('/tic-tac-toe/room/abc234')
    expect(window.location.hash).toBe('#/tic-tac-toe/room/abc234')
  })
})

describe('useHashPath', () => {
  it('returns the current path and updates on hashchange', async () => {
    window.location.hash = '#/'
    const { result } = renderHook(() => useHashPath())
    expect(result.current).toBe('/')

    await act(async () => {
      navigate('/tic-tac-toe')
      window.dispatchEvent(new HashChangeEvent('hashchange'))
    })
    expect(result.current).toBe('/tic-tac-toe')
  })
})
