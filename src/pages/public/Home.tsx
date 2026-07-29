import { Link } from 'react-router-dom'

const PHASES = [
  { id: 'P0', label: 'Scaffold & tokens', done: true },
  { id: 'P1', label: 'Data layer & API services', done: true },
  { id: 'P2', label: 'UI primitive library', done: true },
  { id: 'P3', label: 'Layouts, routing & contexts', done: true },
  { id: 'P4', label: 'Public zone screens', done: false },
  { id: 'P5', label: 'Donation flow', done: false },
  { id: 'P6', label: 'Donor account zone', done: false },
  { id: 'P7', label: 'Admin zone', done: false },
  { id: 'P8', label: 'Kiosk zone', done: false },
  { id: 'P9', label: 'Audit & production polish', done: false },
]

export default function Home() {
  const doneCount = PHASES.filter((p) => p.done).length

  return (
    <div className="mx-auto flex max-w-[720px] flex-col items-center gap-8 px-6 py-24 text-center">
      <div className="flex flex-col items-center gap-3">
        <span className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#4F46E5] via-[#7C3AED] to-[#C026D3]" />
        <h1 className="font-display text-3xl font-semibold text-text">Uplifted</h1>
        <p className="max-w-md font-sans text-sm text-text-2">
          This is a build-in-progress preview. Routing, layouts, the data layer, and the
          component library are wired up — real campaign, donation, and admin screens land in
          the phases below.
        </p>
      </div>

      <div className="w-full rounded-2xl border border-border bg-surface p-6 text-left">
        <div className="mb-4 flex items-center justify-between">
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-2">
            Build progress
          </span>
          <span className="font-sans text-xs font-semibold text-text-2">
            {doneCount} of {PHASES.length} phases
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {PHASES.map((phase) => (
            <div
              key={phase.id}
              className="flex items-center gap-3 rounded-lg px-2 py-1.5"
            >
              <span
                className={
                  'flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full font-sans text-[10px] font-bold ' +
                  (phase.done ? 'bg-primary text-white' : 'border border-border text-text-2')
                }
              >
                {phase.done ? '✓' : ''}
              </span>
              <span className="font-mono text-[11px] text-text-2">{phase.id}</span>
              <span className={'font-sans text-sm ' + (phase.done ? 'text-text' : 'text-text-2')}>
                {phase.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Link
        to="/dev/sitemap"
        className="font-sans text-sm font-semibold text-primary no-underline"
      >
        View full route sitemap →
      </Link>
    </div>
  )
}
