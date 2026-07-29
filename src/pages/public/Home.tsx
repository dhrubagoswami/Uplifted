import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { useCampaigns } from '../../hooks/useCampaigns'
import { useOrganizations } from '../../hooks/useOrganizations'
import { useDonationTicker } from '../../hooks/useDonationTicker'
import { useCurrency } from '../../hooks/useCurrency'
import { CampaignCard } from '../../components/campaign/CampaignCard'
import { DonationTicker } from '../../components/campaign/DonationTicker'
import { Skeleton } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'
import type { Category } from '../../types'

const FEATURED_SLUGS = ['rebuild-wayanad', 'clean-water-vidarbha', 'school-meals-400-children']

const HOW_IT_WORKS_STEPS = [
  {
    n: '1',
    title: 'Pick a verified cause',
    body: 'Browse 60+ campaigns, each checked for registration and audit status before it ever goes live.',
  },
  {
    n: '2',
    title: 'Give in seconds',
    body: 'UPI, cards, net banking, wallets or PayPal — one flow, four steps, no account required.',
  },
  {
    n: '3',
    title: 'Watch it become impact',
    body: 'Every rupee maps to a real unit — a filter, a meal, a school year — and you can watch it happen.',
  },
]

const IMPACT_TILES = [
  { value: '96,400', label: 'meals served' },
  { value: '2,180', label: 'water filters installed' },
  { value: '1,340', label: 'students sponsored' },
  { value: '6,200', label: 'treatments funded' },
]

const CHECKLIST = [
  { title: 'Registration check', body: 'Legal charity registration verified against government records.' },
  { title: '80G tax status', body: 'Confirmed active so every donor receipt is valid for tax filing.' },
  { title: 'Quarterly audit', body: 'Fund-use reports reviewed every quarter, not just at onboarding.' },
  { title: 'Fund-use reporting', body: 'Organizations publish where money went, campaign by campaign.' },
]

const CATEGORIES: { name: Category; color: string }[] = [
  { name: 'Education', color: '#3B82F6' },
  { name: 'Health', color: '#10B981' },
  { name: 'Water', color: '#06B6D4' },
  { name: 'Hunger', color: '#F59E0B' },
  { name: 'Disaster', color: '#EF4444' },
  { name: 'Animals', color: '#8B5CF6' },
  { name: 'Environment', color: '#22C55E' },
  { name: 'Women & Child', color: '#EC4899' },
]

const TESTIMONIALS = [
  {
    quote:
      'I gave once for the Wayanad relief and ended up setting a monthly gift after watching the ticker update live.',
    name: 'Rhea Kapoor',
    role: 'Donor since 2025',
    initial: 'R',
  },
  {
    quote:
      'The segmented meter changed how our team reports to funders — everyone finally sees units, not just percentages.',
    name: 'Amit Deshpande',
    role: 'Program Lead, Nirmal Jal Trust',
    initial: 'A',
  },
  {
    quote:
      'Verification status right on the campaign page is what got my company to sponsor two campaigns instead of one.',
    name: 'Fatima Sheikh',
    role: 'CSR Manager',
    initial: 'F',
  },
]

export default function Home() {
  const { format } = useCurrency()
  const campaignsQuery = useCampaigns({ limit: 100 })
  const orgsQuery = useOrganizations({ limit: 20 })
  const tickerQuery = useDonationTicker(6)

  const campaigns = campaignsQuery.data?.data ?? []
  const orgs = orgsQuery.data?.data ?? []
  const orgNameById = new Map(orgs.map((o) => [o.id, o.name]))

  const featured = FEATURED_SLUGS.map((slug) => campaigns.find((c) => c.slug === slug)).filter(
    (c): c is NonNullable<typeof c> => !!c,
  )

  const totalRaised = campaigns.reduce((a, c) => a + c.raised, 0)
  const totalDonors = campaigns.reduce((a, c) => a + c.donorCount, 0)
  const verifiedCount = campaigns.filter((c) => c.verified).length

  const isPending = campaignsQuery.isPending || orgsQuery.isPending
  const isError = campaignsQuery.isError || orgsQuery.isError

  if (isError) {
    return (
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12 py-24">
        <ErrorState onRetry={() => campaignsQuery.refetch()} />
      </div>
    )
  }

  return (
    <div>
      <section className="relative mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-16 px-5 sm:px-8 lg:px-12 pb-24 pt-[120px] lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col gap-6">
          <div className="font-sans text-[12.5px] font-bold uppercase tracking-[0.1em] text-primary">
            Verified giving
          </div>
          <h1 className="font-display text-[64px] font-bold leading-[1.03] tracking-[-0.03em] text-text">
            Give with proof, not promises.
          </h1>
          <p className="max-w-[520px] font-sans text-lg leading-relaxed text-text-2">
            Every campaign on Uplifted is registration-checked and audited. Watch your rupee turn
            into a water filter, a meal, a school year — in real time.
          </p>
          <div className="mt-2 flex gap-3.5">
            <Link
              to="/campaigns"
              className="rounded-xl bg-gradient-to-br from-[#4F46E5] via-[#7C3AED] to-[#C026D3] px-[26px] py-[15px] font-sans text-[15.5px] font-semibold text-white no-underline shadow-[0_8px_32px_rgba(79,70,229,.28)]"
            >
              Explore campaigns
            </Link>
            <Link
              to="/how-it-works"
              className="rounded-xl border border-border px-[26px] py-[15px] font-sans text-[15.5px] font-semibold text-text no-underline"
            >
              How it works
            </Link>
          </div>
          <div className="mt-5 flex flex-wrap gap-9">
            <div>
              <div className="font-display text-[28px] font-semibold text-text">
                {isPending ? <Skeleton className="h-8 w-24" /> : format(totalRaised)}
              </div>
              <div className="font-sans text-[13px] text-text-2">raised</div>
            </div>
            <div>
              <div className="font-display text-[28px] font-semibold text-text">
                {isPending ? <Skeleton className="h-8 w-16" /> : totalDonors.toLocaleString('en-IN')}
              </div>
              <div className="font-sans text-[13px] text-text-2">donors</div>
            </div>
            <div>
              <div className="font-display text-[28px] font-semibold text-text">
                {isPending ? <Skeleton className="h-8 w-10" /> : verifiedCount}
              </div>
              <div className="font-sans text-[13px] text-text-2">verified campaigns</div>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-border bg-surface p-6 shadow-[0_20px_48px_rgba(20,17,31,.10)] dark:shadow-[0_12px_40px_rgba(0,0,0,.6)]">
          <DonationTicker
            title="Live giving"
            donations={tickerQuery.data}
            isPending={tickerQuery.isPending}
            rowCount={6}
            maxHeight={420}
          />
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12 pb-24">
        <div className="mb-8 flex items-baseline justify-between">
          <h2 className="font-display text-[30px] font-semibold tracking-[-0.01em] text-text">
            Featured campaigns
          </h2>
          <Link to="/campaigns" className="font-sans text-[14.5px] font-semibold text-primary no-underline">
            View all campaigns →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isPending
            ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-[380px] w-full" />)
            : featured.map((c) => (
                <CampaignCard key={c.id} campaign={c} orgName={orgNameById.get(c.orgId) ?? ''} />
              ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12 pb-24">
        <h2 className="mb-10 text-center font-display text-[30px] font-semibold tracking-[-0.01em] text-text">
          How it works
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {HOW_IT_WORKS_STEPS.map((step) => (
            <div key={step.n} className="flex flex-col gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-2 font-display text-[15px] font-bold text-primary">
                {step.n}
              </div>
              <div className="font-sans text-lg font-semibold text-text">{step.title}</div>
              <div className="font-sans text-[14.5px] leading-relaxed text-text-2">{step.body}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#4F46E5] via-[#7C3AED] to-[#C026D3] px-5 sm:px-8 lg:px-12 py-20">
        <div className="mx-auto grid max-w-[1240px] grid-cols-2 gap-6 sm:grid-cols-4">
          {IMPACT_TILES.map((tile) => (
            <div key={tile.label} className="flex flex-col gap-1.5">
              <div className="font-display text-4xl font-bold text-white">{tile.value}</div>
              <div className="font-sans text-sm text-white/85">{tile.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-16 px-5 sm:px-8 lg:px-12 py-24 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="flex w-fit items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            <span className="font-sans text-xs font-semibold text-primary">Verification standard</span>
          </div>
          <h2 className="font-display text-[30px] font-semibold tracking-[-0.01em] text-text">
            Verified means verified.
          </h2>
          <p className="font-sans text-[15.5px] leading-relaxed text-text-2">
            Every organization on Uplifted clears a four-part check before its first campaign goes
            live — and again every quarter after that.
          </p>
        </div>
        <div className="flex flex-col gap-3.5">
          {CHECKLIST.map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-3 rounded-[14px] border border-border bg-surface p-4"
            >
              <span className="mt-0.5 flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full bg-success-soft text-success">
                <Check size={13} strokeWidth={3} />
              </span>
              <div>
                <div className="font-sans text-[14.5px] font-semibold text-text">{item.title}</div>
                <div className="mt-0.5 font-sans text-[13.5px] text-text-2">{item.body}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12 pb-24">
        <h2 className="mb-7 text-center font-display text-2xl font-semibold text-text">Browse by cause</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to={`/campaigns?category=${encodeURIComponent(cat.name)}`}
              className="flex items-center gap-2 rounded-full border border-border bg-surface px-[18px] py-2.5 no-underline"
            >
              <span className="h-2 w-2 rounded-full" style={{ background: cat.color }} />
              <span className="font-sans text-sm font-medium text-text">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12 pb-24">
        <h2 className="mb-7 text-center font-display text-2xl font-semibold text-text">
          What donors and partners say
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="flex flex-col gap-4 rounded-[18px] border border-border bg-surface p-6"
            >
              <div className="font-sans text-[15px] leading-relaxed text-text">&ldquo;{t.quote}&rdquo;</div>
              <div className="mt-auto flex items-center gap-2.5">
                <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-surface-2 font-sans text-[13px] font-semibold text-primary">
                  {t.initial}
                </span>
                <div>
                  <div className="font-sans text-[13.5px] font-semibold text-text">{t.name}</div>
                  <div className="font-sans text-xs text-text-2">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
