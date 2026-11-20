import { describe, expect, it } from 'vitest'
import { newGame } from '../game/ticTacToe'
import { parseMessage } from './protocol'

const state = newGame({ X: { name: 'A', emoji: '🦊' }, O: { name: 'B', emoji: '🐼' } })

describe('parseMessage', () => {
  it.each([
    { type: 'hello', name: 'Bo', emoji: '🐼' },
    { type: 'move', cell: 4 },
    { type: 'rematch' },
    { type: 'full' },
    { type: 'ping' },
    { type: 'pong' },
    { type: 'state', state },
  ])('accepts $type', (m) => expect(parseMessage(m)).toEqual(m))

  it.each([
    null, undefined, 42, 'hello', [], {},
    { type: 'nope' },
    { type: 'hello', name: '', emoji: '🐼' },
    { type: 'hello', name: 'x'.repeat(21), emoji: '🐼' },
    { type: 'hello', name: 'Bo' },
    { type: 'move', cell: '4' },
    { type: 'move', cell: 9 },
    { type: 'move', cell: 1.5 },
    { type: 'state', state: { board: [] } },
    { type: 'state', state: { ...state, board: Array(9).fill('Z') } },
    { type: 'state', state: { ...state, turn: 'Q' } },
    { type: 'state' },
  ])('rejects %j', (m) => expect(parseMessage(m)).toBeNull())
})
