const DONOR_PATH = [
  { n: '1', title: 'Pick a verified campaign', body: 'Filter by cause, urgency, or organization.' },
  { n: '2', title: 'Choose an amount', body: 'One-time or monthly, with a live impact readout.' },
  { n: '3', title: 'Pay your way', body: 'UPI, cards, net banking, wallets, or PayPal.' },
  {
    n: '4',
    title: 'Track the outcome',
    body: 'Updates and a running impact ledger, campaign by campaign.',
  },
]

const ORG_PATH = [
  {
    n: '1',
    title: 'Apply with documentation',
    body: 'Registration certificate, 80G status, and leadership details.',
  },
  {
    n: '2',
    title: 'Pass verification',
    body: 'Our team confirms registration and audit history before launch.',
  },
  { n: '3', title: 'Launch your campaign', body: 'Set a goal, an impact unit, and a story — live within days.' },
  { n: '4', title: 'Report quarterly', body: 'Fund-use reports keep your verified badge active.' },
]

const FEE_ROWS = [
  { label: 'Platform fee', value: '0%', accent: false },
  { label: 'Payment gateway fee', value: '2.1%', accent: true },
  { label: 'Covered by donor (optional, default on)', value: 'Your choice', accent: false },
]

const VERIFICATION_STAGES = [
  { title: 'Application received', body: 'Organization submits registration and leadership documentation.' },
  { title: 'Registration check', body: 'Legal charity status confirmed against government records.' },
  { title: '80G tax status', body: 'Verified active so donor receipts are valid for tax filing.' },
  { title: 'Fund-use review', body: 'Prior spending reviewed where the organization has a history.' },
  { title: 'Quarterly re-verification', body: 'Standing is re-checked every quarter, not just once.' },
]

const SECURITY_ITEMS = [
  { title: '256-bit SSL', body: 'All traffic encrypted end to end.' },
  { title: 'PCI-DSS Level 1', body: 'Highest tier of payment data compliance.' },
  { title: 'Tokenization', body: 'Card details never touch our servers in the clear.' },
  { title: 'No card storage', body: 'Saved cards are stored by the payment partner, not us.' },
]

function PathCard({ heading, steps }: { heading: string; steps: typeof DONOR_PATH }) {
  return (
    <div className="rounded-[20px] border border-border bg-surface p-8">
      <div className="mb-4 font-sans text-xs font-bold uppercase tracking-[0.08em] text-primary">
        {heading}
      </div>
      {steps.map((s) => (
        <div key={s.n} className="flex gap-3.5 border-b border-border py-4 last:border-b-0">
          <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-surface-2 font-sans text-[12.5px] font-bold text-primary">
            {s.n}
          </span>
          <div>
            <div className="font-sans text-[14.5px] font-semibold text-text">{s.title}</div>
            <div className="mt-0.5 font-sans text-[13.5px] text-text-2">{s.body}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function HowItWorks() {
  return (
    <div>
      <div className="mx-auto max-w-[1240px] px-12 pt-16 text-center">
        <h1 className="mb-3 font-display text-[44px] font-semibold tracking-[-0.02em] text-text">
          How Uplifted works
        </h1>
        <p className="mx-auto mb-16 max-w-[560px] font-sans text-base text-text-2">
          Transparent by default — for the people giving and the organizations receiving.
        </p>
      </div>

      <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-12 px-12 pb-24 lg:grid-cols-2">
        <PathCard heading="For donors" steps={DONOR_PATH} />
        <PathCard heading="For organizations" steps={ORG_PATH} />
      </div>

      <div className="mx-auto max-w-[820px] px-12 pb-24">
        <h2 className="mb-6 text-center font-display text-[26px] font-semibold text-text">
          Where your rupee goes
        </h2>
        <div className="flex flex-col overflow-hidden rounded-[14px] border border-border">
          {FEE_ROWS.map((row) => (
            <div
              key={row.label}
              className="flex justify-between border-b border-border bg-surface px-5 py-4 last:border-b-0"
            >
              <span className="font-sans text-[14.5px] text-text">{row.label}</span>
              <span
                className={`font-display text-[15px] font-semibold ${row.accent ? 'text-primary' : 'text-text'}`}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[820px] px-12 pb-24">
        <h2 className="mb-8 text-center font-display text-[26px] font-semibold text-text">
          Verification process
        </h2>
        <div className="flex flex-col">
          {VERIFICATION_STAGES.map((stage, i) => (
            <div key={stage.title} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span className="h-3 w-3 flex-shrink-0 rounded-full bg-primary" />
                {i < VERIFICATION_STAGES.length - 1 && <span className="w-0.5 flex-1 bg-border" />}
              </div>
              <div className="pb-8">
                <div className="font-sans text-[15px] font-semibold text-text">{stage.title}</div>
                <div className="mt-1 font-sans text-[13.5px] leading-relaxed text-text-2">{stage.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1240px] px-12 pb-24">
        <div className="grid grid-cols-2 gap-6 rounded-[20px] border border-border bg-surface p-10 text-center sm:grid-cols-4">
          {SECURITY_ITEMS.map((item) => (
            <div key={item.title}>
              <div className="font-sans text-[14.5px] font-semibold text-text">{item.title}</div>
              <div className="mt-1 font-sans text-xs text-text-2">{item.body}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
