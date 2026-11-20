import { applyMove, newGame, voteRematch, type GameState, type Profile } from '../game/ticTacToe'
import type { Message } from '../net/protocol'

export interface HostState {
  host: Profile
  game: GameState | null
}
export interface HostResult {
  state: HostState
  replies: Message[]
}

export const initialHost = (host: Profile): HostState => ({ host, game: null })

const withGame = (state: HostState, game: GameState): HostResult =>
  game === state.game ? { state, replies: [] } : { state: { ...state, game }, replies: [{ type: 'state', state: game }] }

/** Host handling of a message from a guest connection. */
export function hostHandle(state: HostState, msg: Message): HostResult {
  switch (msg.type) {
    case 'hello':
      if (state.game) return { state, replies: [{ type: 'full' }] }
      return withGame(state, newGame({ X: state.host, O: { name: msg.name, emoji: msg.emoji } }))
    case 'move':
      return state.game ? withGame(state, applyMove(state.game, 'O', msg.cell)) : { state, replies: [] }
    case 'rematch':
      return state.game ? withGame(state, voteRematch(state.game, 'O')) : { state, replies: [] }
    default:
      return { state, replies: [] }
  }
}

/** The host's own move (always X). */
export function hostMove(state: HostState, cell: number): HostResult {
  return state.game ? withGame(state, applyMove(state.game, 'X', cell)) : { state, replies: [] }
}

/** The host's own rematch vote (always X). */
export function hostRematch(state: HostState): HostResult {
  return state.game ? withGame(state, voteRematch(state.game, 'X')) : { state, replies: [] }
}
