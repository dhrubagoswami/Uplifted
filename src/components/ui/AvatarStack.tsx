import { Avatar } from './Avatar'
import { cn } from '../../lib/cn'

export interface AvatarStackProps {
  names: string[]
  max?: number
  className?: string
}

export function AvatarStack({ names, max = 4, className }: AvatarStackProps) {
  const visible = names.slice(0, max)
  const overflow = names.length - visible.length

  return (
    <div className={cn('flex items-center', className)}>
      {visible.map((name, i) => (
        <Avatar
          key={name + i}
          name={name}
          size="sm"
          className={cn('ring-2 ring-surface', i > 0 && '-ml-2')}
        />
      ))}
      {overflow > 0 && (
        <span className="-ml-2 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-surface-2 font-sans text-[11px] font-semibold text-text-2 ring-2 ring-surface">
          +{overflow}
        </span>
      )}
    </div>
  )
}
