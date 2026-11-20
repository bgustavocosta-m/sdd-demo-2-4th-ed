import type { Message } from './protocol'

export interface HeartbeatTimers {
  setInterval: (fn: () => void, ms: number) => unknown
  clearInterval: (id: unknown) => void
}

export interface HeartbeatOptions {
  send: (msg: Message) => void
  onTimeout: () => void
  interval?: number
  maxMissed?: number
  timers?: HeartbeatTimers
}

const globalTimers: HeartbeatTimers = {
  setInterval: (fn, ms) => setInterval(fn, ms),
  clearInterval: (id) => clearInterval(id as ReturnType<typeof setInterval>),
}

/**
 * Pings now and every `interval` ms. Once `maxMissed` pings in a row go unanswered,
 * calls `onTimeout` once and stops. `onPong` resets the count.
 */
export function createHeartbeat({
  send,
  onTimeout,
  interval = 2000,
  maxMissed = 3,
  timers = globalTimers,
}: HeartbeatOptions) {
  let missed = 0
  let stopped = false

  const tick = () => {
    if (stopped) return
    if (missed >= maxMissed) {
      stop()
      onTimeout()
      return
    }
    missed++
    send({ type: 'ping' })
  }

  const id = timers.setInterval(tick, interval)
  function stop() {
    stopped = true
    timers.clearInterval(id)
  }
  tick()

  return {
    onPong: () => {
      missed = 0
    },
    stop,
  }
}
