import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCampaign } from '../../hooks/useCampaign'
import { useDonationsByCampaign } from '../../hooks/useDonationsByCampaign'
import { useCampaigns } from '../../hooks/useCampaigns'
import { useOrganizations } from '../../hooks/useOrganizations'
import { useCurrency } from '../../hooks/useCurrency'
import { ProgressMeter } from '../../components/ui/ProgressMeter'
import { Badge } from '../../components/ui/Badge'
import { Avatar } from '../../components/ui/Avatar'
import { Skeleton } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'
import { Accordion } from '../../components/ui/Accordion'
import { Checkbox } from '../../components/ui/Checkbox'
import { CampaignCard } from '../../components/campaign/CampaignCard'
import { DonationTicker } from '../../components/campaign/DonationTicker'
import { timeAgo } from '../../lib/format'
import type { Category } from '../../types'
import { cn } from '../../lib/cn'

const CATEGORY_COLORS: Record<Category, string> = {
  Education: '#3B82F6',
  Health: '#10B981',
  Water: '#06B6D4',
  Hunger: '#F59E0B',
  Disaster: '#EF4444',
  Animals: '#8B5CF6',
  Environment: '#22C55E',
  'Women & Child': '#EC4899',
}

const TABS = [
  { key: 'story', label: 'Story' },
  { key: 'impact', label: 'Impact' },
  { key: 'updates', label: 'Updates' },
  { key: 'donors', label: 'Donors' },
  { key: 'faq', label: 'FAQ' },
] as const

type TabKey = (typeof TABS)[number]['key']

const CHIP_AMOUNTS = [50000, 200000, 500000, 2500000]

function coverImage(slug: string): string {
  return `https://picsum.photos/seed/${slug}/1200/514`
}

export default function CampaignDetail() {
  const { slug = '' } = useParams<{ slug: string }>()
  const [tab, setTab] = useState<TabKey>('story')
  const [selectedChip, setSelectedChip] = useState(1)
  const [anon, setAnon] = useState(false)

  const { format } = useCurrency()
  const campaignQuery = useCampaign(slug)
  const campaign = campaignQuery.data
  const orgByIdQuery = useOrganizations({ limit: 20 })
  const donationsQuery = useDonationsByCampaign(campaign?.id)
  const similarQuery = useCampaigns({ category: campaign ? [campaign.category] : undefined, limit: 4 })

  const org = orgByIdQuery.data?.data.find((o) => o.id === campaign?.orgId)
  const orgNameById = new Map((orgByIdQuery.data?.data ?? []).map((o) => [o.id, o.name]))
  const similar = (similarQuery.data?.data ?? []).filter((c) => c.id !== campaign?.id).slice(0, 3)

  if (campaignQuery.isPending) {
    return (
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12 py-8">
        <Skeleton className="aspect-[21/9] w-full rounded-[20px]" />
        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-[1.6fr_1fr]">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  if (campaignQuery.isError || !campaign) {
    return (
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12 py-24">
        <ErrorState
          title="Campaign not found"
          description="This campaign may have been removed or the link is incorrect."
          onRetry={() => campaignQuery.refetch()}
        />
      </div>
    )
  }

  const selectedAmount = CHIP_AMOUNTS[selectedChip]

  return (
    <div>
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12 pt-8">
        <div className="relative aspect-[21/9] overflow-hidden rounded-[20px] bg-surface-2">
          <img src={coverImage(campaign.slug)} alt="" className="h-full w-full object-cover" />
          <div className="absolute left-5 top-5 flex gap-2">
            <Badge color={CATEGORY_COLORS[campaign.category]}>{campaign.category}</Badge>
            {campaign.urgent && <Badge variant="danger">Urgent</Badge>}
          </div>
          {campaign.verified && (
            <div className="absolute right-5 top-5 flex items-center gap-1.5 rounded-full bg-[rgba(20,17,31,0.55)] px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#34D399]" />
              <span className="font-sans text-xs font-semibold text-white">Verified</span>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-12 px-5 sm:px-8 lg:px-12 py-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <div className="flex min-w-0 flex-col gap-7">
          <div>
            <h1 className="mb-3 font-display text-[36px] font-semibold tracking-[-0.02em] text-text">
              {campaign.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-2 font-sans text-xs font-semibold text-primary">
                {(org?.name ?? '?').charAt(0)}
              </span>
              {org && (
                <Link
                  to={`/organizations/${org.slug}`}
                  className="font-sans text-[14.5px] font-medium text-text no-underline"
                >
                  {org.name}
                </Link>
              )}
              {org && (
                <span className="font-sans text-[13.5px] text-text-2">
                  · {org.location} · View organization
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-1 border-b border-border">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={cn(
                  'border-b-2 px-4.5 py-3 font-sans text-[14.5px] font-semibold',
                  tab === t.key ? 'border-primary text-primary' : 'border-transparent text-text-2',
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'story' && (
            <div className="flex flex-col gap-4 font-sans text-[15.5px] leading-relaxed text-text">
              {campaign.story.map((p, i) => (
                <p key={i} className="m-0">
                  {p}
                </p>
              ))}
            </div>
          )}

          {tab === 'impact' && (
            <div className="flex flex-col overflow-hidden rounded-[14px] border border-border">
              {CHIP_AMOUNTS.map((a) => {
                const u = Math.max(1, Math.round(a / campaign.unitCost))
                return (
                  <div
                    key={a}
                    className="flex justify-between border-b border-border bg-surface px-[18px] py-4 last:border-b-0"
                  >
                    <span className="font-mono text-sm font-medium text-primary">{format(a)}</span>
                    <span className="text-right font-sans text-sm text-text">
                      funds {u} {campaign.impactUnit}
                      {u > 1 ? 's' : ''}
                    </span>
                  </div>
                )
              })}
            </div>
          )}

          {tab === 'updates' && (
            <div className="flex flex-col">
              {campaign.updates.length === 0 && (
                <p className="font-sans text-sm text-text-2">No updates posted yet.</p>
              )}
              {campaign.updates.map((u) => (
                <div key={u.date + u.title} className="flex gap-4 border-b border-border py-4 last:border-b-0">
                  <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                  <div>
                    <div className="mb-1 font-sans text-xs text-text-2">{u.date}</div>
                    <div className="mb-1 font-sans text-[15px] font-semibold text-text">{u.title}</div>
                    <div className="font-sans text-sm leading-relaxed text-text-2">{u.body}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'donors' && (
            <div className="flex flex-col">
              {donationsQuery.isPending && (
                <div className="flex flex-col gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              )}
              {!donationsQuery.isPending && (donationsQuery.data ?? []).length === 0 && (
                <p className="font-sans text-sm text-text-2">No donors yet — be the first to give.</p>
              )}
              {(donationsQuery.data ?? []).map((don) => (
                <div
                  key={don.id}
                  className="flex items-center justify-between border-b border-border py-3 last:border-b-0"
                >
                  <div className="flex items-center gap-2.5">
                    <Avatar name={don.donorName ?? undefined} anonymous={!don.donorName} size="sm" />
                    <span className="font-sans text-sm font-medium text-text">
                      {don.donorName ?? 'Anonymous'}
                    </span>
                  </div>
                  <span className="font-sans text-[13.5px] tabular-nums text-text-2">
                    {format(don.amount)} · {timeAgo(don.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {tab === 'faq' && (
            <Accordion items={campaign.faqs.map((f) => ({ q: f.q, a: f.a }))} />
          )}
        </div>

        <div className="sticky top-24 flex flex-col gap-5 rounded-[20px] border border-border bg-surface p-6 shadow-[0_20px_48px_rgba(20,17,31,.10)] dark:shadow-[0_12px_40px_rgba(0,0,0,.6)]">
          <ProgressMeter
            goal={campaign.goal}
            raised={campaign.raised}
            unitCost={campaign.unitCost}
            unitLabel={campaign.impactUnit}
            daysLeft={campaign.daysLeft}
            completed={campaign.completed}
          />
          <div className="flex gap-5 border-y border-border py-3.5">
            <div>
              <div className="font-sans text-xs text-text-2">Donors</div>
              <div className="font-display text-[19px] font-semibold text-text">{campaign.donorCount}</div>
            </div>
            <div>
              <div className="font-sans text-xs text-text-2">Days left</div>
              <div className="font-display text-[19px] font-semibold text-text">{campaign.daysLeft}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {CHIP_AMOUNTS.map((a, i) => {
              const active = selectedChip === i
              const u = Math.max(1, Math.round(a / campaign.unitCost))
              return (
                <button
                  key={a}
                  type="button"
                  onClick={() => setSelectedChip(i)}
                  className={cn(
                    'flex flex-col items-start gap-0.5 rounded-xl border p-3 text-left',
                    active ? 'border-primary bg-surface-2' : 'border-border bg-transparent',
                  )}
                >
                  <span className="font-display text-base font-semibold text-text">{format(a)}</span>
                  <span className="font-sans text-[11.5px] text-text-2">
                    {u} {campaign.impactUnit}
                    {u > 1 ? 's' : ''}
                  </span>
                </button>
              )
            })}
          </div>

          <Checkbox
            id="anon-donate"
            checked={anon}
            onChange={(e) => setAnon(e.target.checked)}
            label="Give anonymously"
          />

          <Link
            to={`/campaigns/${campaign.slug}/donate`}
            className="rounded-xl bg-gradient-to-br from-[#4F46E5] via-[#7C3AED] to-[#C026D3] py-[15px] text-center font-sans text-[15.5px] font-semibold text-white no-underline shadow-[0_8px_32px_rgba(79,70,229,.28)]"
          >
            Give {format(selectedAmount)}
          </Link>

          <div className="flex items-center gap-2">
            <div className="flex">
              {(donationsQuery.data ?? []).slice(0, 4).map((d, i) => (
                <span
                  key={d.id}
                  style={{ marginLeft: i > 0 ? -8 : 0 }}
                  className="flex h-[26px] w-[26px] items-center justify-center rounded-full border-2 border-surface bg-surface-2 font-sans text-[10.5px] font-semibold text-primary"
                >
                  {d.donorName ? d.donorName.charAt(0) : '·'}
                </span>
              ))}
            </div>
            <span className="font-sans text-xs text-text-2">+{campaign.donorCount} donors</span>
          </div>

          <div className="border-t border-border pt-4">
            <DonationTicker
              title="Recent gifts"
              donations={donationsQuery.data}
              isPending={donationsQuery.isPending}
              rowCount={4}
              maxHeight={220}
            />
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12 pb-24">
          <h2 className="mb-6 font-display text-2xl font-semibold text-text">Similar campaigns</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((c) => (
              <CampaignCard key={c.id} campaign={c} orgName={orgNameById.get(c.orgId) ?? ''} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
