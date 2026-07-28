import { useState } from 'react'
import { cn } from '../../lib/cn'

export interface AccordionItem {
  q: string
  a: string
}

export interface AccordionProps {
  items: AccordionItem[]
  className?: string
}

export function Accordion({ items, className }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className={cn('flex flex-col gap-px', className)}>
      {items.map((item, i) => {
        const open = openIndex === i
        return (
          <div key={item.q} className="border-b border-border">
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpenIndex(open ? null : i)}
              className="flex w-full items-center justify-between gap-4 py-4 text-left font-sans"
            >
              <span className="text-[15px] font-semibold text-text">{item.q}</span>
              <span className="text-lg text-text-2">{open ? '−' : '+'}</span>
            </button>
            {open && (
              <div className="pb-4 font-sans text-sm leading-relaxed text-text-2">{item.a}</div>
            )}
          </div>
        )
      })}
    </div>
  )
}
