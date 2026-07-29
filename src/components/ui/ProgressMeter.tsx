import { useEffect, useRef, useState } from 'react'
import { formatINR } from '../../lib/format'
import { cn } from '../../lib/cn'

export interface ProgressMeterProps {
  /** integer paise */
  goal: number
  /** integer paise */
  raised: number
  /** integer paise */
  unitCost: number
  unitLabel: string
  daysLeft: number
  completed?: boolean
  thin?: boolean
  /** Force the collapsed continuous-bar rendering regardless of measured width. */
  forceBar?: boolean
  className?: string
}

const SEGMENT_CAP = 60
const COLLAPSE_WIDTH = 640

export function ProgressMeter({
  goal,
  raised,
  unitCost,
  unitLabel,
  daysLeft,
  completed = false,
  thin = false,
  forceBar = false,
  className,
}: ProgressMeterProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [narrow, setNarrow] = useState(false)
  const [inView, setInView] = useState(false)
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      setNarrow(entry.contentRect.width < COLLAPSE_WIDTH)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true)
      },
      { threshold: 0.2 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!inView || animated) return
    const id = requestAnimationFrame(() => setAnimated(true))
    return () => cancelAnimationFrame(id)
  }, [inView, animated])

  const totalUnits = Math.max(1, Math.round(goal / unitCost))
  const fundedUnits = Math.min(totalUnits, Math.round(raised / unitCost))
  const segCount = Math.min(totalUnits, SEGMENT_CAP)
  const targetScaledFunded = Math.round((fundedUnits / totalUnits) * segCount)
  const scaledFunded = animated ? targetScaledFunded : 0
  const pct = animated ? Math.min(100, Math.round((raised / goal) * 100)) : 0

  const unitWord = totalUnits === 1 ? unitLabel : `${unitLabel}s`
  let captionMain = `${fundedUnits} of ${totalUnits} ${unitWord} funded`
  if (segCount < totalUnits) captionMain += ' (scaled)'
  captionMain += ` · ${formatINR(raised)} of ${formatINR(goal)}`

  const daysLeftText = completed ? 'Completed' : daysLeft <= 0 ? 'Last day' : `${daysLeft} days left`
  const urgent = !completed && daysLeft <= 5

  const collapsed = forceBar || narrow

  return (
    <div ref={containerRef} className={cn('flex w-full flex-col gap-2.5', className)}>
      {collapsed ? (
        <div className="relative h-2.5 overflow-hidden rounded-full border border-border bg-surface-2">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#3F7A5C] via-[#5B9E77] to-[#7FBF8C] transition-[width] duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
            style={{ width: `${pct}%` }}
          />
        </div>
      ) : (
        <div className="flex w-full gap-[3px]">
          {Array.from({ length: segCount }).map((_, i) => {
            const funded = i < scaledFunded
            const isLeading = i === scaledFunded - 1
            return (
              <div
                key={i}
                className={cn(
                  'flex-1 rounded-sm transition-colors duration-500 motion-reduce:transition-none',
                  thin ? 'h-2' : 'h-3.5',
                  funded
                    ? 'bg-gradient-to-r from-[#3F7A5C] via-[#5B9E77] to-[#7FBF8C]'
                    : 'border border-border bg-surface-2',
                )}
                style={
                  isLeading
                    ? { boxShadow: '0 0 10px var(--accent), 0 0 2px var(--accent)' }
                    : undefined
                }
              />
            )
          })}
        </div>
      )}
      <div className="flex flex-wrap items-baseline justify-between gap-x-3.5 gap-y-1.5">
        <div className="font-sans text-sm leading-normal text-text-2">{captionMain}</div>
        {!completed || daysLeftText ? (
          <div
            className={cn(
              'font-sans text-[13px] font-semibold',
              urgent ? 'text-danger' : 'text-text-2',
            )}
          >
            {daysLeftText}
          </div>
        ) : null}
      </div>
    </div>
  )
}
