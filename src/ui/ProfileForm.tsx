import { useId, useState, type FormEvent } from 'react'
import type { Mark, Profile } from '../game/ticTacToe'
import { cleanName, EMOJIS, loadProfile, saveProfile } from './profile'
import { Avatar, MarkGlyph } from './Shell'

interface Props {
  /** The mark this player will get: X for the host, O for a guest. */
  mark?: Mark
  submitLabel: string
  busy?: boolean
  error?: string | null
  onSubmit: (p: Profile) => void
}

export function ProfileForm({ mark = 'X', submitLabel, busy = false, error = null, onSubmit }: Props) {
  const [initial] = useState(loadProfile)
  const [name, setName] = useState(initial.name)
  const [emoji, setEmoji] = useState(initial.emoji)
  const nameId = useId()
  const clean = cleanName(name)
  const tint = mark.toLowerCase()

  function submit(e: FormEvent) {
    e.preventDefault()
    if (!clean) return
    const p = { name: clean, emoji }
    saveProfile(p)
    onSubmit(p)
  }

  return (
    <form className="profile" onSubmit={submit}>
      <div className="stack-8">
        <label className="label" htmlFor={nameId}>
          Your name
        </label>
        <input
          id={nameId}
          className="input"
          value={name}
          maxLength={20}
          autoComplete="nickname"
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
        <span className="hint">{name.trim().length} / 20 characters</span>
      </div>

      <fieldset className="avatars">
        <legend className="label">Avatar</legend>
        <div className={`avatar-grid pick-${tint}`}>
          {EMOJIS.map((e) => (
            <label key={e} className={e === emoji ? 'avatar-tile picked' : 'avatar-tile'}>
              <input type="radio" name="emoji" value={e} aria-label={e} checked={e === emoji} onChange={() => setEmoji(e)} />
              {e}
            </label>
          ))}
        </div>
      </fieldset>

      {mark === 'X' && (
        <div className="card player-row">
          <Avatar emoji={emoji} mark="X" size="lg" />
          <span className="player-meta">
            <span className="strong">{clean ?? 'Your name'}</span>
            <span className="hint">You’ll play X and move first</span>
          </span>
          <MarkGlyph mark="X" />
        </div>
      )}

      <div className="actions">
        {mark === 'O' && (
          <p className="summary">
            You’ll play <MarkGlyph mark="O" /> as {emoji} {clean ?? '…'}
          </p>
        )}
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <button className="btn btn-primary" type="submit" disabled={!clean || busy}>
          {submitLabel}
        </button>
      </div>
    </form>
  )
}
