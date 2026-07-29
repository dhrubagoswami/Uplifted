import { useSearchParams } from 'react-router-dom'
import { Search, LayoutGrid, List as ListIcon } from 'lucide-react'
import { useCampaigns } from '../../hooks/useCampaigns'
import { useOrganizations } from '../../hooks/useOrganizations'
import { useDebounce } from '../../hooks/useDebounce'
import { CampaignCard } from '../../components/campaign/CampaignCard'
import { Skeleton } from '../../components/ui/Skeleton'
import { EmptyState } from '../../components/ui/EmptyState'
import { ErrorState } from '../../components/ui/ErrorState'
import { Button } from '../../components/ui/Button'
import type { Category } from '../../types'
import type { ListCampaignsParams } from '../../api/campaigns'
import { cn } from '../../lib/cn'

const CATEGORY_DEFS: { name: Category; color: string }[] = [
  { name: 'Education', color: '#3B82F6' },
  { name: 'Health', color: '#10B981' },
  { name: 'Water', color: '#06B6D4' },
  { name: 'Hunger', color: '#F59E0B' },
  { name: 'Disaster', color: '#EF4444' },
  { name: 'Animals', color: '#8B5CF6' },
  { name: 'Environment', color: '#22C55E' },
  { name: 'Women & Child', color: '#EC4899' },
]

const SORT_OPTIONS: { value: NonNullable<ListCampaignsParams['sort']>; label: string }[] = [
  { value: 'trending', label: 'Trending' },
  { value: 'newest', label: 'Newest' },
  { value: 'ending', label: 'Ending soon' },
  { value: 'closest', label: 'Closest to goal' },
  { value: 'funded', label: 'Most funded' },
]

export default function CampaignsBrowse() {
  const [searchParams, setSearchParams] = useSearchParams()

  const q = searchParams.get('q') ?? ''
  const sort = (searchParams.get('sort') as ListCampaignsParams['sort']) ?? 'trending'
  const categories = searchParams.getAll('category') as Category[]
  const verifiedOnly = searchParams.get('verified') === '1'
  const urgentOnly = searchParams.get('urgent') === '1'
  const view = searchParams.get('view') === 'list' ? 'list' : 'grid'
  const limit = Number(searchParams.get('limit') ?? 9)

  const debouncedQ = useDebounce(q, 300)

  function updateParams(patch: Record<string, string | string[] | null>) {
    const next = new URLSearchParams(searchParams)
    for (const [key, value] of Object.entries(patch)) {
      next.delete(key)
      if (value === null) continue
      if (Array.isArray(value)) {
        value.forEach((v) => next.append(key, v))
      } else {
        next.set(key, value)
      }
    }
    setSearchParams(next)
  }

  const campaignsQuery = useCampaigns({
    q: debouncedQ || undefined,
    sort,
    category: categories.length ? categories : undefined,
    verifiedOnly: verifiedOnly || undefined,
    urgentOnly: urgentOnly || undefined,
    limit,
  })
  const orgsQuery = useOrganizations({ limit: 20 })

  const campaigns = campaignsQuery.data?.data ?? []
  const orgNameById = new Map((orgsQuery.data?.data ?? []).map((o) => [o.id, o.name]))
  const total = campaignsQuery.data?.total ?? 0
  const canLoadMore = campaigns.length < total

  function toggleCategory(name: Category) {
    const next = categories.includes(name)
      ? categories.filter((c) => c !== name)
      : [...categories, name]
    updateParams({ category: next.length ? next : null })
  }

  function clearFilters() {
    setSearchParams(new URLSearchParams())
  }

  const hasFilters = !!q || categories.length > 0 || verifiedOnly || urgentOnly

  return (
    <div>
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12 pt-12">
        <h1 className="mb-2 font-display text-[40px] font-semibold tracking-[-0.02em] text-text">
          Browse campaigns
        </h1>
        <p className="mb-8 font-sans text-[15.5px] text-text-2">
          {campaignsQuery.isPending ? '…' : total} verified causes, updated live.
        </p>
      </div>

      <div className="sticky top-[76px] z-30 border-b border-border bg-bg/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-3 px-5 sm:px-8 lg:px-12 py-4">
          <div className="relative min-w-[220px] flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-2" />
            <input
              value={q}
              onChange={(e) => updateParams({ q: e.target.value || null })}
              placeholder="Search campaigns..."
              className="w-full rounded-[10px] border border-border bg-surface py-2.5 pl-9 pr-3.5 font-sans text-sm text-text placeholder:text-text-3 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => updateParams({ sort: e.target.value })}
            className="rounded-[10px] border border-border bg-surface px-3 py-2.5 font-sans text-[13.5px] text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => updateParams({ verified: verifiedOnly ? null : '1' })}
            className={cn(
              'whitespace-nowrap rounded-[10px] border px-3.5 py-2.5 font-sans text-[13.5px] font-medium',
              verifiedOnly ? 'border-primary bg-surface-2 text-primary' : 'border-border bg-surface text-text',
            )}
          >
            Verified only
          </button>
          <button
            type="button"
            onClick={() => updateParams({ urgent: urgentOnly ? null : '1' })}
            className={cn(
              'whitespace-nowrap rounded-[10px] border px-3.5 py-2.5 font-sans text-[13.5px] font-medium',
              urgentOnly ? 'border-danger bg-danger/10 text-danger' : 'border-border bg-surface text-text',
            )}
          >
            Urgent only
          </button>
          <div className="flex gap-1 rounded-[10px] border border-border bg-surface p-1">
            <button
              type="button"
              aria-label="Grid view"
              onClick={() => updateParams({ view: null })}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-[7px]',
                view === 'grid' ? 'bg-surface-2 text-primary' : 'text-text-2',
              )}
            >
              <LayoutGrid size={15} />
            </button>
            <button
              type="button"
              aria-label="List view"
              onClick={() => updateParams({ view: 'list' })}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-[7px]',
                view === 'list' ? 'bg-surface-2 text-primary' : 'text-text-2',
              )}
            >
              <ListIcon size={15} />
            </button>
          </div>
        </div>
        <div className="mx-auto flex max-w-[1240px] flex-wrap gap-2.5 px-5 sm:px-8 lg:px-12 pb-3.5">
          {CATEGORY_DEFS.map((cat) => {
            const active = categories.includes(cat.name)
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => toggleCategory(cat.name)}
                className={cn(
                  'flex items-center gap-1.5 rounded-full border px-3 py-[7px] font-sans text-[12.5px] font-medium',
                  active ? 'border-primary bg-surface-2 text-primary' : 'border-border bg-transparent text-text-2',
                )}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: cat.color }} />
                {cat.name}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12 pb-24 pt-8">
        {campaignsQuery.isError && <ErrorState onRetry={() => campaignsQuery.refetch()} />}

        {campaignsQuery.isPending && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <Skeleton key={i} className="h-[380px] w-full" />
            ))}
          </div>
        )}

        {!campaignsQuery.isPending && !campaignsQuery.isError && campaigns.length === 0 && (
          <EmptyState
            icon={<Search size={20} />}
            title="No campaigns match these filters"
            description="Clear them and start over."
            action={
              hasFilters ? (
                <Button size="sm" onClick={clearFilters} className="mt-1.5">
                  Clear filters
                </Button>
              ) : undefined
            }
          />
        )}

        {!campaignsQuery.isPending && !campaignsQuery.isError && campaigns.length > 0 && (
          <>
            <div
              className={cn(
                'grid gap-6',
                view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1',
              )}
            >
              {campaigns.map((c) => (
                <CampaignCard
                  key={c.id}
                  campaign={c}
                  orgName={orgNameById.get(c.orgId) ?? ''}
                  variant={view === 'grid' ? 'grid' : 'featured'}
                />
              ))}
            </div>
            {canLoadMore && (
              <div className="mt-10 flex justify-center">
                <Button
                  variant="secondary"
                  onClick={() => updateParams({ limit: String(limit + 9) })}
                >
                  Load more
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
