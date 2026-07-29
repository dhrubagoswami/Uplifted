import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useOrganization, useOrganizationCampaigns } from '../../hooks/useOrganizations'
import { useCurrency } from '../../hooks/useCurrency'
import { CampaignCard } from '../../components/campaign/CampaignCard'
import { Badge } from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'
import { EmptyState } from '../../components/ui/EmptyState'
import { FileText } from 'lucide-react'
import { cn } from '../../lib/cn'

const TABS = [
  { key: 'about', label: 'About' },
  { key: 'campaigns', label: 'Campaigns' },
  { key: 'reports', label: 'Impact reports' },
  { key: 'financials', label: 'Financials' },
  { key: 'team', label: 'Team' },
] as const

type TabKey = (typeof TABS)[number]['key']

// TODO(design): reports/allocation/team aren't part of the Organization data
// model -- the design shows fixed demo content on every org profile. Kept as
// static placeholder content matching the surrounding design until a real
// field is added to Organization.
const REPORTS = [
  { title: 'Q1 2026 impact report', size: 'PDF · 2.1 MB' },
  { title: 'Q4 2025 impact report', size: 'PDF · 1.8 MB' },
  { title: 'Annual audit 2025', size: 'PDF · 3.4 MB' },
]
const ALLOCATION = [
  { label: 'Program delivery', pct: 82, color: '#4F46E5' },
  { label: 'Operations', pct: 12, color: '#7C3AED' },
  { label: 'Fundraising', pct: 6, color: '#C026D3' },
]
const TEAM = [
  { name: 'Vikram Menon', role: 'Program Director', initial: 'V' },
  { name: 'Lakshmi Rao', role: 'Finance Lead', initial: 'L' },
  { name: 'Suresh Nair', role: 'Field Operations', initial: 'S' },
  { name: 'Deepa Iyer', role: 'Donor Relations', initial: 'D' },
]

export default function OrganizationProfile() {
  const { slug = '' } = useParams<{ slug: string }>()
  const [tab, setTab] = useState<TabKey>('about')
  const { format } = useCurrency()

  const orgQuery = useOrganization(slug)
  const org = orgQuery.data
  const campaignsQuery = useOrganizationCampaigns(org?.id)
  const campaigns = campaignsQuery.data ?? []
  const totalRaised = campaigns.reduce((a, c) => a + c.raised, 0)

  if (orgQuery.isPending) {
    return (
      <div className="mx-auto max-w-[1240px] px-12 py-12">
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  if (orgQuery.isError || !org) {
    return (
      <div className="mx-auto max-w-[1240px] px-12 py-24">
        <ErrorState
          title="Organization not found"
          description="This organization may have been removed or the link is incorrect."
          onRetry={() => orgQuery.refetch()}
        />
      </div>
    )
  }

  return (
    <div>
      <div className="h-[200px] bg-gradient-to-br from-[#4F46E5] via-[#7C3AED] to-[#C026D3]" />
      <div className="mx-auto max-w-[1240px] px-12">
        <div className="-mt-11 mb-7 flex items-end gap-5">
          <div className="flex h-24 w-24 items-center justify-center rounded-[20px] border-4 border-bg bg-surface font-display text-[32px] font-bold text-primary">
            {org.name.charAt(0)}
          </div>
          <div className="pb-1.5">
            <div className="flex items-center gap-2.5">
              <h1 className="font-display text-[28px] font-semibold text-text">{org.name}</h1>
              {org.verified ? (
                <Badge variant="success">Verified</Badge>
              ) : (
                <span className="rounded-full bg-warning/15 px-2.5 py-1 font-sans text-xs font-semibold text-warning">
                  Verification pending
                </span>
              )}
            </div>
            <div className="mt-1 font-sans text-sm text-text-2">
              {org.location} · Est. {org.founded} · {org.website}
            </div>
          </div>
        </div>

        <div className="mb-7 flex gap-8 border-y border-border py-5">
          <div>
            <div className="font-sans text-xs text-text-2">Registration</div>
            <div className="mt-0.5 font-mono text-sm text-text">{org.regNumber}</div>
          </div>
          <div>
            <div className="font-sans text-xs text-text-2">Campaigns</div>
            <div className="mt-0.5 font-display text-lg font-semibold text-text">{campaigns.length}</div>
          </div>
          <div>
            <div className="font-sans text-xs text-text-2">Total raised</div>
            <div className="mt-0.5 font-display text-lg font-semibold text-text">{format(totalRaised)}</div>
          </div>
        </div>

        <div className="mb-7 flex gap-1 border-b border-border">
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

        {tab === 'about' && (
          <p className="mb-24 max-w-[720px] font-sans text-[15.5px] leading-relaxed text-text">
            {org.mission}
          </p>
        )}

        {tab === 'campaigns' && (
          <div className="mb-24">
            {campaignsQuery.isPending && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-[380px] w-full" />
                ))}
              </div>
            )}
            {!campaignsQuery.isPending && campaigns.length === 0 && (
              <EmptyState title="No campaigns yet" description="This organization hasn't launched a campaign." />
            )}
            {!campaignsQuery.isPending && campaigns.length > 0 && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {campaigns.map((c) => (
                  <CampaignCard key={c.id} campaign={c} orgName={org.name} />
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'reports' && (
          <div className="mb-24 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {REPORTS.map((r) => (
              <div
                key={r.title}
                className="flex items-center gap-3 rounded-[14px] border border-border bg-surface p-4"
              >
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px] bg-surface-2 text-primary">
                  <FileText size={16} />
                </span>
                <div>
                  <div className="font-sans text-[13.5px] font-semibold text-text">{r.title}</div>
                  <div className="font-sans text-xs text-text-2">{r.size}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'financials' && (
          <div className="mb-24 flex max-w-[480px] flex-col overflow-hidden rounded-[14px] border border-border">
            {ALLOCATION.map((a) => (
              <div
                key={a.label}
                className="flex items-center justify-between border-b border-border bg-surface px-[18px] py-3.5 last:border-b-0"
              >
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: a.color }} />
                  <span className="font-sans text-sm text-text">{a.label}</span>
                </div>
                <span className="font-sans text-sm font-semibold text-text">{a.pct}%</span>
              </div>
            ))}
          </div>
        )}

        {tab === 'team' && (
          <div className="mb-24 grid grid-cols-2 gap-5 sm:grid-cols-4">
            {TEAM.map((m) => (
              <div key={m.name} className="flex flex-col items-center gap-2.5 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-2 font-sans text-xl font-semibold text-primary">
                  {m.initial}
                </span>
                <div>
                  <div className="font-sans text-sm font-semibold text-text">{m.name}</div>
                  <div className="font-sans text-xs text-text-2">{m.role}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
