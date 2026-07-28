import { Check } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface StepIndicatorProps {
  labels: string[]
  currentStep: number
  className?: string
}

export function StepIndicator({ labels, currentStep, className }: StepIndicatorProps) {
  return (
    <div className={cn('mb-10 flex items-center', className)}>
      {labels.map((label, i) => {
        const n = i + 1
        const active = n === currentStep
        const done = n < currentStep
        const hasConnector = n < labels.length

        return (
          <div key={label} className={cn('flex items-center', hasConnector && 'flex-1')}>
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full font-sans text-[13px] font-semibold',
                  done || active
                    ? 'bg-primary text-white'
                    : 'border border-border bg-surface-2 text-text-2',
                )}
              >
                {done ? <Check size={14} /> : n}
              </div>
              <div
                className={cn(
                  'whitespace-nowrap font-sans text-[12.5px] font-medium',
                  active ? 'text-text' : 'text-text-2',
                )}
              >
                {label}
              </div>
            </div>
            {hasConnector && (
              <div
                className={cn('mx-2.5 mb-5 h-0.5 flex-1', done ? 'bg-primary' : 'bg-border')}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
