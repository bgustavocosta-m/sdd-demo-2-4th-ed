export const ALPHABET = 'abcdefghjkmnpqrstuvwxyz23456789'
const SLUG_RE = /^[a-hjkmnp-z2-9]{6}$/

type Rand = (n: number) => Uint32Array
const cryptoRand: Rand = (n) => crypto.getRandomValues(new Uint32Array(n))

/** A 6-character room slug. */
export function makeSlug(rand: Rand = cryptoRand): string {
  return Array.from(rand(6), (v) => ALPHABET[v % ALPHABET.length]).join('')
}

export function isValidSlug(s: string): boolean {
  return SLUG_RE.test(s)
}

export function hostPeerId(slug: string): string {
  return `sdd-ttt-${slug}`
}
