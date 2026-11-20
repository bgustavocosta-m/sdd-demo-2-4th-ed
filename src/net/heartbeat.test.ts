import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createHeartbeat } from './heartbeat'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('createHeartbeat', () => {
  it('pings immediately and then every interval', () => {
    const send = vi.fn()
    const hb = createHeartbeat({ send, onTimeout: vi.fn() })
    expect(send).toHaveBeenCalledTimes(1)
    expect(send).toHaveBeenLastCalledWith({ type: 'ping' })
    hb.onPong()
    vi.advanceTimersByTime(2000)
    expect(send).toHaveBeenCalledTimes(2)
    hb.stop()
  })

  it('times out after 3 missed pongs (6 s by default)', () => {
    const onTimeout = vi.fn()
    createHeartbeat({ send: vi.fn(), onTimeout })
    vi.advanceTimersByTime(5999)
    expect(onTimeout).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(onTimeout).toHaveBeenCalledTimes(1)
  })

  it('fires the timeout only once and stops pinging', () => {
    const send = vi.fn()
    const onTimeout = vi.fn()
    createHeartbeat({ send, onTimeout })
    vi.advanceTimersByTime(20000)
    expect(onTimeout).toHaveBeenCalledTimes(1)
    expect(send).toHaveBeenCalledTimes(3)
  })

  it('a pong resets the missed count', () => {
    const onTimeout = vi.fn()
    const hb = createHeartbeat({ send: vi.fn(), onTimeout })
    vi.advanceTimersByTime(4000) // 3 pings out, none answered
    hb.onPong()
    vi.advanceTimersByTime(7999) // next tick (6 s) starts a fresh count of 3
    expect(onTimeout).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(onTimeout).toHaveBeenCalledTimes(1)
  })

  it('keeps going while pongs keep arriving', () => {
    const onTimeout = vi.fn()
    let hb: ReturnType<typeof createHeartbeat> | undefined = undefined
    hb = createHeartbeat({ send: () => hb?.onPong(), onTimeout })
    hb.onPong()
    vi.advanceTimersByTime(60000)
    expect(onTimeout).not.toHaveBeenCalled()
    hb.stop()
  })

  it('honours custom interval and maxMissed', () => {
    const onTimeout = vi.fn()
    createHeartbeat({ send: vi.fn(), onTimeout, interval: 100, maxMissed: 2 })
    vi.advanceTimersByTime(199)
    expect(onTimeout).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(onTimeout).toHaveBeenCalledTimes(1)
  })

  it('stop() cancels pings and the timeout', () => {
    const send = vi.fn()
    const onTimeout = vi.fn()
    const hb = createHeartbeat({ send, onTimeout })
    hb.stop()
    vi.advanceTimersByTime(20000)
    expect(send).toHaveBeenCalledTimes(1)
    expect(onTimeout).not.toHaveBeenCalled()
  })

  it('uses injected timers', () => {
    let tick = () => {}
    const clear = vi.fn()
    const onTimeout = vi.fn()
    createHeartbeat({
      send: vi.fn(),
      onTimeout,
      timers: { setInterval: (fn) => ((tick = fn), 7), clearInterval: clear },
    })
    tick()
    tick()
    tick()
    expect(onTimeout).toHaveBeenCalledTimes(1)
    expect(clear).toHaveBeenCalledWith(7)
  })
})
