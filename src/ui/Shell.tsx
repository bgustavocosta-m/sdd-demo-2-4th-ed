import type { ReactNode } from 'react'
import type { Mark } from '../game/ticTacToe'
import { isValidSlug } from '../room/slug'
import { GridIcon } from './icons'

/** Page column with the `board games` header; room screens pass their slug for the badge. */
export function Screen({ slug, children }: { slug?: string; children: ReactNode }) {
  return (
    <div className="screen">
      <header className="header">
        <a className="wordmark" href="#/">
          <GridIcon />
          board games
        </a>
        {slug !== undefined && isValidSlug(slug) && <span className="room-badge">room {slug}</span>}
      </header>
      <main className="column">{children}</main>
    </div>
  )
}

/** Emoji in a round tile tinted with its player's mark. */
export function Avatar({ emoji, mark, size = 'md' }: { emoji: string; mark: Mark; size?: 'sm' | 'md' | 'lg' }) {
  return (
    <span className={`avatar avatar-${size} tint-${mark.toLowerCase()}`} aria-hidden="true">
      {emoji}
    </span>
  )
}

export function MarkGlyph({ mark, muted = false }: { mark: Mark; muted?: boolean }) {
  return <span className={muted ? 'mark mark-muted' : `mark mark-${mark.toLowerCase()}`}>{mark}</span>
}

interface AlertProps {
  slug?: string
  icon: ReactNode
  title: string
  reason: ReactNode
  /** Extra content inside the card, below the reason. */
  children?: ReactNode
  /** Content above the card. */
  before?: ReactNode
  /** Content between the card and the actions. */
  after?: ReactNode
}

/** The alert-card pattern shared by every dead-end room screen. */
export function AlertScreen({ slug, icon, title, reason, children, before, after }: AlertProps) {
  return (
    <Screen slug={slug}>
      {before}
      <div className="card alert-card" role="alert">
        <span className="icon-tile">{icon}</span>
        <div className="stack-8">
          <h1 className="h1">{title}</h1>
          <p className="lede">{reason}</p>
        </div>
        {children}
      </div>
      {after}
      <div className="actions">
        <a className="btn btn-primary" href="#/tic-tac-toe">
          Create a new room
        </a>
        <a className="btn btn-secondary" href="#/">
          Back to games
        </a>
      </div>
    </Screen>
  )
}
