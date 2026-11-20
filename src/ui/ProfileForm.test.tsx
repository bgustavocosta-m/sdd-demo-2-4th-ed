import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ProfileForm } from './ProfileForm'
import { cleanName, EMOJIS, loadProfile } from './profile'

afterEach(() => {
  cleanup()
  localStorage.clear()
})

describe('cleanName', () => {
  it('trims and accepts 1–20 chars', () => {
    expect(cleanName('  Ana ')).toBe('Ana')
    expect(cleanName('x'.repeat(20))).toBe('x'.repeat(20))
  })
  it('rejects empty and too long', () => {
    expect(cleanName('   ')).toBeNull()
    expect(cleanName('x'.repeat(21))).toBeNull()
  })
})

describe('ProfileForm', () => {
  it('has 12 emojis with the first selected by default', () => {
    render(<ProfileForm submitLabel="Go" onSubmit={() => {}} />)
    expect(EMOJIS).toHaveLength(12)
    const first = screen.getByRole('radio', { name: EMOJIS[0] }) as HTMLInputElement
    expect(first.checked).toBe(true)
  })
  it('disables submit without a name', () => {
    render(<ProfileForm submitLabel="Go" onSubmit={() => {}} />)
    expect((screen.getByRole('button', { name: 'Go' }) as HTMLButtonElement).disabled).toBe(true)
  })
  it('submits the trimmed profile and remembers it', () => {
    const onSubmit = vi.fn()
    render(<ProfileForm submitLabel="Go" onSubmit={onSubmit} />)
    fireEvent.change(screen.getByLabelText('Your name'), { target: { value: '  Ana  ' } })
    fireEvent.click(screen.getByRole('radio', { name: EMOJIS[2] }))
    fireEvent.click(screen.getByRole('button', { name: 'Go' }))
    expect(onSubmit).toHaveBeenCalledWith({ name: 'Ana', emoji: EMOJIS[2] })
    expect(loadProfile()).toEqual({ name: 'Ana', emoji: EMOJIS[2] })
  })
  it('counts the trimmed name against the 20 character limit', () => {
    render(<ProfileForm submitLabel="Go" onSubmit={() => {}} />)
    expect(screen.getByText('0 / 20 characters')).toBeTruthy()
    fireEvent.change(screen.getByLabelText('Your name'), { target: { value: ' Ana  ' } })
    expect(screen.getByText('3 / 20 characters')).toBeTruthy()
    expect((screen.getByLabelText('Your name') as HTMLInputElement).maxLength).toBe(20)
  })
  it('previews X for the host and O for the guest', () => {
    render(<ProfileForm submitLabel="Go" onSubmit={() => {}} />)
    expect(screen.getByText('You’ll play X and move first')).toBeTruthy()
    cleanup()
    render(<ProfileForm mark="O" submitLabel="Go" onSubmit={() => {}} />)
    fireEvent.change(screen.getByLabelText('Your name'), { target: { value: 'Bo' } })
    expect(screen.getByText(`as ${EMOJIS[0]} Bo`, { exact: false })).toBeTruthy()
  })
  it('prefills the remembered profile', () => {
    localStorage.setItem('sdd-ttt-profile', JSON.stringify({ name: 'Bo', emoji: EMOJIS[3] }))
    render(<ProfileForm submitLabel="Go" onSubmit={() => {}} />)
    expect((screen.getByLabelText('Your name') as HTMLInputElement).value).toBe('Bo')
    expect((screen.getByRole('radio', { name: EMOJIS[3] }) as HTMLInputElement).checked).toBe(true)
  })
})
