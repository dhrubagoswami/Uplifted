import { cn } from '../../lib/cn'

export interface LogoProps {
  size?: number
  className?: string
}

export function Logo({ size = 30, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={cn('flex-shrink-0 rounded-[9px]', className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3F7A5C" />
          <stop offset="55%" stopColor="#5B9E77" />
          <stop offset="100%" stopColor="#7FBF8C" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#logo-g)" />
      <path
        d="M32 47C32 47 19 38 19 25C19 15 27 11 33.5 13.5C40 16 42 25 37.5 33C34.5 38.5 32 47 32 47Z"
        fill="#FFFFFF"
      />
      <path
        d="M32 46C32 39 29.5 29 21.5 22.5"
        stroke="#3F7A5C"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}
