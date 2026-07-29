export interface PagePlaceholderProps {
  title: string
  phase: string
}

export function PagePlaceholder({ title, phase }: PagePlaceholderProps) {
  return (
    <div className="mx-auto flex max-w-[1240px] flex-col items-start gap-2 px-12 py-24">
      <div className="rounded-full bg-surface-2 px-3 py-1 font-sans text-xs font-semibold text-text-2">
        {phase}
      </div>
      <h1 className="font-display text-2xl font-semibold text-text">{title}</h1>
      <p className="font-sans text-sm text-text-2">
        This screen's layout and routing are wired up. Its real content lands in a later build
        phase.
      </p>
    </div>
  )
}
