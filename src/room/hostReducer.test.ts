import { describe, expect, it } from 'vitest'
import { hostHandle, initialHost } from './hostReducer'

const host = { name: 'Ana', emoji: '🦊' }
const hello = { type: 'hello', name: 'Bo', emoji: '🐼' } as const

describe('hostHandle', () => {
  it('starts waiting', () => {
    expect(initialHost(host)).toEqual({ host, game: null })
  })
  it('first hello starts the game with the guest as O and replies with state', () => {
    const { state, replies } = hostHandle(initialHost(host), hello)
    expect(state.game?.players).toEqual({ X: host, O: { name: 'Bo', emoji: '🐼' } })
    expect(state.game?.turn).toBe('X')
    expect(replies).toEqual([{ type: 'state', state: state.game }])
  })
  it('a second hello gets full and keeps the game', () => {
    const s1 = hostHandle(initialHost(host), hello).state
    const { state, replies } = hostHandle(s1, { ...hello, name: 'Cy' })
    expect(state).toBe(s1)
    expect(replies).toEqual([{ type: 'full' }])
  })
  it('applies a legal guest move as O', () => {
    let s = hostHandle(initialHost(host), hello).state
    s = { ...s, game: { ...s.game!, turn: 'O' } }
    const { state, replies } = hostHandle(s, { type: 'move', cell: 3 })
    expect(state.game?.board[3]).toBe('O')
    expect(replies).toEqual([{ type: 'state', state: state.game }])
  })
  it('ignores a guest move out of turn', () => {
    const s = hostHandle(initialHost(host), hello).state
    const r = hostHandle(s, { type: 'move', cell: 3 })
    expect(r.state).toBe(s)
    expect(r.replies).toEqual([])
  })
  it('ignores a move before the game starts', () => {
    const s = initialHost(host)
    expect(hostHandle(s, { type: 'move', cell: 0 })).toEqual({ state: s, replies: [] })
  })
  it('hostMove plays as X', async () => {
    const { hostMove } = await import('./hostReducer')
    const s = hostHandle(initialHost(host), hello).state
    const r = hostMove(s, 0)
    expect(r.state.game?.board[0]).toBe('X')
    expect(r.replies).toEqual([{ type: 'state', state: r.state.game }])
    expect(hostMove(r.state, 1).replies).toEqual([])
  })
})
