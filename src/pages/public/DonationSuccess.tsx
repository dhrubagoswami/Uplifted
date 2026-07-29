import { Link, useParams } from 'react-router-dom'
import { Check, Download, Share2 } from 'lucide-react'
import { useDonationById } from '../../hooks/useDonationById'
import { useCurrency } from '../../hooks/useCurrency'
import { Skeleton } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'
import { Button } from '../../components/ui/Button'

const CONFETTI_COLORS = ['#4F46E5', '#7C3AED', '#C026D3', '#818CF8']

// Deterministic per page-load, computed once at module scope so it stays
// pure across renders (no Math.random() calls during render).
const CONFETTI = Array.from({ length: 24 }).map((_, i) => ({
  left: (i * 37) % 100,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  duration: 1.6 + ((i * 13) % 12) / 10,
  delay: ((i * 7) % 10) / 25,
}))

export default function DonationSuccess() {
  const { id = '' } = useParams<{ id: string }>()
  const { format } = useCurrency()
  const donationQuery = useDonationById(id)
  const donation = donationQuery.data

  if (donationQuery.isPending) {
    return (
      <div className="mx-auto max-w-[680px] px-5 sm:px-8 lg:px-12 py-24">
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (donationQuery.isError || !donation) {
    return (
      <div className="mx-auto max-w-[680px] px-5 sm:px-8 lg:px-12 py-24">
        <ErrorState
          title="We couldn't find this receipt"
          description="The donation link may be incorrect or the record has expired."
        />
      </div>
    )
  }

  return (
    <div className="relative mx-auto flex max-w-[680px] flex-col items-center gap-7 px-5 sm:px-8 lg:px-12 py-20 text-center">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 overflow-hidden">
        {CONFETTI.map((p, i) => (
          <div
            key={i}
            className="motion-reduce:hidden"
            style={{
              position: 'absolute',
              top: 0,
              left: `${p.left}%`,
              width: 8,
              height: 14,
              background: p.color,
              animation: `confetti-fall ${p.duration}s ease-in ${p.delay}s forwards`,
            }}
          />
        ))}
      </div>

      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success-soft text-success">
        <Check size={30} strokeWidth={2.5} />
      </div>

      <h1 className="font-display text-4xl font-semibold leading-tight tracking-[-0.02em] text-text">
        You just funded {donation.unitLabel}.
      </h1>
      <p className="font-sans text-[15.5px] text-text-2">
        Your gift of <span className="font-semibold text-text">{format(donation.amount)}</span> to{' '}
        {donation.campaignTitle} is confirmed.
      </p>

      <div className="flex w-full flex-col gap-3.5 rounded-[18px] border border-border bg-surface p-6 text-left">
        <div className="flex justify-between">
          <span className="font-sans text-[13px] text-text-2">Transaction ID</span>
          <span className="font-mono text-[13px] text-text">{donation.receiptNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-sans text-[13px] text-text-2">Amount</span>
          <span className="font-sans text-[13px] font-semibold text-text">{format(donation.amount)}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-sans text-[13px] text-text-2">Date</span>
          <span className="font-sans text-[13px] text-text">
            {new Date(donation.timestamp).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>
        <Button variant="secondary" size="sm" className="mt-1.5 w-full justify-center gap-2">
          <Download size={15} />
          Download receipt (80G)
        </Button>
      </div>

      {donation.frequency === 'once' && (
        <div className="flex w-full items-center justify-between gap-4 rounded-[18px] bg-gradient-to-br from-[#4F46E5] via-[#7C3AED] to-[#C026D3] p-6 text-left">
          <div>
            <div className="font-sans text-[15px] font-semibold text-white">Make this monthly?</div>
            <div className="mt-0.5 font-sans text-[13px] text-white/85">
              {format(donation.amount)}/month keeps this campaign funded steadily.
            </div>
          </div>
          <button className="whitespace-nowrap rounded-[10px] bg-white px-4 py-2.5 font-sans text-[13.5px] font-semibold text-primary">
            Switch to monthly
          </button>
        </div>
      )}

      <div className="mt-2 flex gap-3">
        <Button variant="secondary" className="gap-2">
          <Share2 size={15} />
          Share
        </Button>
        <Link
          to="/campaigns"
          className="rounded-[10px] bg-primary px-5 py-3 font-sans text-sm font-semibold text-white no-underline"
        >
          Explore more campaigns
        </Link>
      </div>
    </div>
  )
}
