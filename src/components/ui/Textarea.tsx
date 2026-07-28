import { forwardRef } from 'react'
import type { TextareaHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'w-full font-sans text-[14px] px-3.5 py-3 rounded-[10px] border bg-surface text-text placeholder:text-text-3 resize-y',
          'focus:outline-none focus:ring-2 focus:ring-primary/40',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-2',
          error ? 'border-danger' : 'border-border',
          className,
        )}
        {...props}
      />
    )
  },
)
Textarea.displayName = 'Textarea'
