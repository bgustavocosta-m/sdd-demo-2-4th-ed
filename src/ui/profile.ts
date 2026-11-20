import type { Profile } from '../game/ticTacToe'

export const EMOJIS = ['🦊', '🐼', '🐸', '🐙', '🦁', '🐵', '🐧', '🦄', '🐢', '🐝', '🐳', '🌵']
const KEY = 'sdd-ttt-profile'

/** Trimmed name if it is 1–20 characters, else null. */
export function cleanName(raw: string): string | null {
  const name = raw.trim()
  return name.length >= 1 && name.length <= 20 ? name : null
}

export function loadProfile(): Profile {
  try {
    const p = JSON.parse(localStorage.getItem(KEY) ?? 'null')
    if (p && typeof p.name === 'string' && EMOJIS.includes(p.emoji)) return { name: p.name, emoji: p.emoji }
  } catch {
    /* ignore */
  }
  return { name: '', emoji: EMOJIS[0] }
}

export function saveProfile(p: Profile): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(p))
  } catch {
    /* ignore */
  }
}
