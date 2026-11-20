import { describe, expect, it } from 'vitest'
import { ALPHABET, hostPeerId, isValidSlug, makeSlug } from './slug'

describe('makeSlug', () => {
  it('makes 6 chars from the alphabet', () => {
    for (let i = 0; i < 200; i++) {
      const s = makeSlug()
      expect(s).toHaveLength(6)
      for (const ch of s) expect(ALPHABET).toContain(ch)
      expect(isValidSlug(s)).toBe(true)
    }
  })
  it('uses the injected random source', () => {
    const rand = (n: number) => new Uint32Array(n).map((_, i) => i)
    expect(makeSlug(rand)).toBe('abcdef')
    expect(makeSlug((n) => new Uint32Array(n).fill(ALPHABET.length - 1))).toBe('999999')
  })
  it('alphabet has no look-alikes', () => {
    expect(ALPHABET).toBe('abcdefghjkmnpqrstuvwxyz23456789')
  })
})

describe('isValidSlug', () => {
  it.each(['abc234', 'zzzzzz', '999999'])('accepts %s', (s) => expect(isValidSlug(s)).toBe(true))
  it.each(['', 'abc23', 'abc2345', 'ABC234', 'abcd1i', 'abcdel', 'abcdeo', 'abcde0', 'abc 23'])(
    'rejects %j',
    (s) => expect(isValidSlug(s)).toBe(false),
  )
})

it('hostPeerId prefixes the slug', () => {
  expect(hostPeerId('abc234')).toBe('sdd-ttt-abc234')
})
