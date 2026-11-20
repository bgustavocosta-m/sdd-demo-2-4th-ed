import { useSyncExternalStore } from 'react'

/** The path part of the hash route, e.g. `#/tic-tac-toe` → `/tic-tac-toe`. */
export function currentPath(): string {
  const path = window.location.hash.replace(/^#/, '')
  return path === '' ? '/' : path
}

/** Go to a hash route. */
export function navigate(path: string): void {
  window.location.hash = path
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}

/** The current hash route path; re-renders on `hashchange`. */
export function useHashPath(): string {
  return useSyncExternalStore(subscribe, currentPath)
}
