import { describe, expect, it } from 'vitest'
import { guestStatus } from './guestStatus'

describe('guestStatus', () => {
  it('peer-unavailable while connecting → not-found', () => {
    expect(guestStatus('connecting', { type: 'peer-error', error: 'peer-unavailable' })).toBe('not-found')
  })
  it('any other peer error while connecting → error', () => {
    expect(guestStatus('connecting', { type: 'peer-error', error: 'network' })).toBe('error')
  })
  it('full while connecting → full', () => {
    expect(guestStatus('connecting', { type: 'full' })).toBe('full')
  })
  it('state → playing', () => {
    expect(guestStatus('connecting', { type: 'state' })).toBe('playing')
    expect(guestStatus('playing', { type: 'state' })).toBe('playing')
  })
  it('close while connecting → not-found (host went away)', () => {
    expect(guestStatus('connecting', { type: 'close' })).toBe('not-found')
  })
  it('close while playing → opponent-left', () => {
    expect(guestStatus('playing', { type: 'close' })).toBe('opponent-left')
  })
  it('peer errors while playing do not end the game', () => {
    expect(guestStatus('playing', { type: 'peer-error', error: 'network' })).toBe('playing')
  })
  it.each(['full', 'not-found', 'error', 'opponent-left', 'invalid'] as const)('%s is final', (s) => {
    expect(guestStatus(s, { type: 'close' })).toBe(s)
    expect(guestStatus(s, { type: 'state' })).toBe(s)
    expect(guestStatus(s, { type: 'full' })).toBe(s)
    expect(guestStatus(s, { type: 'peer-error', error: 'peer-unavailable' })).toBe(s)
  })
})
