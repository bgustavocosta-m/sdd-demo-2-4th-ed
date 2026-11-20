import type { ReactNode } from 'react'

/** Inline stroke icon: decorative, so hidden from assistive tech. */
function Icon({ size = 24, width = 2, children }: { size?: number; width?: number; children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export const GridIcon = () => (
  <Icon size={22}>
    <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
  </Icon>
)
export const ArrowRightIcon = () => (
  <Icon size={16} width={2.2}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
)
export const ArrowLeftIcon = () => (
  <Icon size={16} width={2.2}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </Icon>
)
export const PeersIcon = () => (
  <Icon size={18}>
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="12" r="3" />
    <path d="M9 12h6" />
  </Icon>
)
export const CopyIcon = () => (
  <Icon size={18}>
    <rect x="9" y="9" width="12" height="12" rx="2" />
    <path d="M5 15V5a2 2 0 0 1 2-2h10" />
  </Icon>
)
export const CheckIcon = ({ size = 18 }: { size?: number }) => (
  <Icon size={size} width={2.5}>
    <path d="M5 12l5 5L20 7" />
  </Icon>
)
export const InfoIcon = () => (
  <Icon size={18}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 8h.01" />
  </Icon>
)
export const LeftIcon = () => (
  <Icon size={30}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="M16 17l5-5-5-5" />
    <path d="M21 12H9" />
  </Icon>
)
export const FullIcon = () => (
  <Icon size={30}>
    <circle cx="9" cy="8" r="4" />
    <path d="M1 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
    <path d="M17 4a4 4 0 0 1 0 8" />
    <path d="M23 21v-1a6 6 0 0 0-4-5.6" />
  </Icon>
)
export const BrokenLinkIcon = () => (
  <Icon size={30}>
    <path d="M9 17H7a5 5 0 0 1 0-10h2" />
    <path d="M15 7h2a5 5 0 0 1 4 8" />
    <path d="M8 12h3" />
    <path d="M3 3l18 18" />
  </Icon>
)
export const NotFoundIcon = () => (
  <Icon size={30}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
    <path d="M8.5 8.5l5 5M13.5 8.5l-5 5" />
  </Icon>
)
export const ConnectingIcon = () => (
  <Icon size={30}>
    <path d="M12 3a9 9 0 1 0 9 9" />
    <path d="M12 7v5l3 2" />
  </Icon>
)
export const OfflineIcon = () => (
  <Icon size={30}>
    <path d="M2 8.8a15 15 0 0 1 4.2-2.6M10 5.1A15 15 0 0 1 22 8.8" />
    <path d="M5 12.6a10 10 0 0 1 3.4-2M15 10.6a10 10 0 0 1 4 2" />
    <path d="M8.5 16.4a5 5 0 0 1 7 0" />
    <path d="M12 20h.01" />
    <path d="M3 3l18 18" />
  </Icon>
)
