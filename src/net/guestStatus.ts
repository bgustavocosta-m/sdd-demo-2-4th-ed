export type RoomStatus =
  | 'invalid'
  | 'connecting'
  | 'waiting'
  | 'full'
  | 'not-found'
  | 'playing'
  | 'opponent-left'
  | 'error'

export type GuestEvent =
  | { type: 'peer-error'; error: string }
  | { type: 'full' }
  | { type: 'state' }
  | { type: 'close' }

/** How a guest's room status reacts to network events. Error screens and "Opponent left" are final. */
export function guestStatus(current: RoomStatus, event: GuestEvent): RoomStatus {
  if (current !== 'connecting' && current !== 'playing') return current
  switch (event.type) {
    case 'state':
      return 'playing'
    case 'full':
      return current === 'connecting' ? 'full' : current
    case 'close':
      return current === 'playing' ? 'opponent-left' : 'not-found'
    case 'peer-error':
      if (current === 'playing') return current
      return event.error === 'peer-unavailable' ? 'not-found' : 'error'
  }
}
