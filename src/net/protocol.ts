import type { GameState, Mark, Profile } from '../game/ticTacToe'

export type Message =
  | { type: 'hello'; name: string; emoji: string }
  | { type: 'move'; cell: number }
  | { type: 'rematch' }
  | { type: 'state'; state: GameState }
  | { type: 'full' }
  | { type: 'ping' }
  | { type: 'pong' }

type Obj = Record<string, unknown>
const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v)
const isMark = (v: unknown): v is Mark => v === 'X' || v === 'O'
const isCell = (v: unknown): v is number => Number.isInteger(v) && (v as number) >= 0 && (v as number) <= 8
const isName = (v: unknown): v is string => typeof v === 'string' && v.trim().length >= 1 && v.length <= 20
const isEmoji = (v: unknown): v is string => typeof v === 'string' && v.length >= 1 && v.length <= 16
const isProfile = (v: unknown): v is Profile => isObj(v) && isName(v.name) && isEmoji(v.emoji)

function isResult(v: unknown): boolean {
  if (v === null) return true
  if (!isObj(v)) return false
  if (v.winner === null) return true
  return isMark(v.winner) && Array.isArray(v.line) && v.line.length === 3 && v.line.every(isCell)
}

function isGameState(v: unknown): v is GameState {
  return (
    isObj(v) &&
    Array.isArray(v.board) &&
    v.board.length === 9 &&
    v.board.every((c) => c === null || isMark(c)) &&
    isMark(v.turn) &&
    isMark(v.startedBy) &&
    isObj(v.players) &&
    isProfile(v.players.X) &&
    isProfile(v.players.O) &&
    isResult(v.result) &&
    Array.isArray(v.rematchVotes) &&
    v.rematchVotes.every(isMark)
  )
}

/** Validates an incoming peer message; anything malformed → null. */
export function parseMessage(data: unknown): Message | null {
  if (!isObj(data)) return null
  switch (data.type) {
    case 'hello':
      return isName(data.name) && isEmoji(data.emoji) ? { type: 'hello', name: data.name, emoji: data.emoji } : null
    case 'move':
      return isCell(data.cell) ? { type: 'move', cell: data.cell } : null
    case 'state':
      return isGameState(data.state) ? { type: 'state', state: data.state } : null
    case 'rematch':
    case 'full':
    case 'ping':
    case 'pong':
      return { type: data.type }
    default:
      return null
  }
}
