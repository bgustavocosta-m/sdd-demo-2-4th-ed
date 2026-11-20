import { useState, type FormEvent } from 'react'
import type { Profile } from '../game/ticTacToe'
import { cleanName, EMOJIS, loadProfile, saveProfile } from './profile'

interface Props {
  submitLabel: string
  busy?: boolean
  onSubmit: (p: Profile) => void
}

export function ProfileForm({ submitLabel, busy = false, onSubmit }: Props) {
  const [initial] = useState(loadProfile)
  const [name, setName] = useState(initial.name)
  const [emoji, setEmoji] = useState(initial.emoji)
  const clean = cleanName(name)

  function submit(e: FormEvent) {
    e.preventDefault()
    if (!clean) return
    const p = { name: clean, emoji }
    saveProfile(p)
    onSubmit(p)
  }

  return (
    <form className="profile" onSubmit={submit}>
      <label>
        Name
        <input value={name} maxLength={40} onChange={(e) => setName(e.target.value)} autoFocus />
      </label>
      <fieldset className="emojis">
        <legend>Avatar</legend>
        {EMOJIS.map((e) => (
          <label key={e} className={e === emoji ? 'emoji picked' : 'emoji'}>
            <input type="radio" name="emoji" value={e} aria-label={e} checked={e === emoji} onChange={() => setEmoji(e)} />
            {e}
          </label>
        ))}
      </fieldset>
      {name.trim().length > 20 && <p className="error">Name must be 20 characters or fewer.</p>}
      <button type="submit" disabled={!clean || busy}>
        {submitLabel}
      </button>
    </form>
  )
}
