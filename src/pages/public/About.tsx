const NUMBERS = [
  { value: '₹4.2 Cr', label: 'raised to date' },
  { value: '18,400', label: 'donors' },
  { value: '62', label: 'verified campaigns' },
  { value: '4', label: 'partner organizations' },
]

const TEAM = [
  { name: 'Ishaan Bhatt', role: 'Co-founder & CEO', initial: 'I' },
  { name: 'Maya Krishnan', role: 'Co-founder & COO', initial: 'M' },
  { name: 'Devika Nair', role: 'Head of Verification', initial: 'D' },
  { name: 'Kabir Singh', role: 'Head of Product', initial: 'K' },
]

export default function About() {
  return (
    <div>
      <div className="mx-auto max-w-[820px] px-12 pt-20 text-center">
        <h1 className="mb-5 font-display text-[44px] font-semibold tracking-[-0.02em] text-text">
          Giving deserves proof.
        </h1>
        <p className="mb-20 font-sans text-[16.5px] leading-relaxed text-text-2">
          Uplifted started with a simple frustration: donors give and rarely learn what happened
          next. We built a platform where every campaign is verified before it launches, and every
          rupee maps to something you can see — a filter installed, a meal served, a child back in
          school.
        </p>
      </div>

      <div className="mx-auto grid max-w-[1240px] grid-cols-2 gap-6 px-12 pb-24 sm:grid-cols-4">
        {NUMBERS.map((n) => (
          <div key={n.label} className="rounded-2xl border border-border bg-surface px-4 py-7 text-center">
            <div className="font-display text-[32px] font-bold text-text">{n.value}</div>
            <div className="mt-1 font-sans text-[13px] text-text-2">{n.label}</div>
          </div>
        ))}
      </div>

      <div className="mx-auto max-w-[1240px] px-12 pb-24">
        <h2 className="mb-8 text-center font-display text-[26px] font-semibold text-text">Team</h2>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {TEAM.map((m) => (
            <div key={m.name} className="flex flex-col items-center gap-2.5 text-center">
              <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-surface-2 font-sans text-[22px] font-semibold text-primary">
                {m.initial}
              </span>
              <div>
                <div className="font-sans text-[14.5px] font-semibold text-text">{m.name}</div>
                <div className="font-sans text-[13px] text-text-2">{m.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
