import { useEffect, useRef, useState } from 'react'
import { CheckIcon, CopyIcon } from './icons'

const COPIED_MS = 1800

/** Copies `link`, then reads "Link copied" for about 1.8 s. */
export function CopyLinkButton({ link }: { link: string }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  function copy() {
    void navigator.clipboard?.writeText(link).then(() => {
      setCopied(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), COPIED_MS)
    })
  }

  return (
    <button type="button" className={copied ? 'btn btn-copy copied' : 'btn btn-copy'} onClick={copy}>
      {copied ? <CheckIcon /> : <CopyIcon />}
      {copied ? 'Link copied' : 'Copy link'}
    </button>
  )
}
