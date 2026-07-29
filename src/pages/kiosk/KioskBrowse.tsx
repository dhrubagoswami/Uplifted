import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCampaigns } from '../../hooks/useCampaigns'
import { Skeleton } from '../../components/ui/Skeleton'
import { EmptyState } from '../../components/ui/EmptyState'
import { cn } from '../../lib/cn'
import type { Category } from '../../types'

const CATEGORIES: ('all' | Category)[] = ['all', 'Water', 'Hunger', 'Health', 'Disaster', 'Education']
const PER_PAGE = 4

function coverImage(slug: string): string {
  return `https://picsum.photos/seed/${slug}/400/220`
}

export default function KioskBrowse() {
  const [category, setCategory] = useState<'all' | Category>('all')
  const [page, setPage] = useState(0)
  const campaignsQuery = useCampaigns({ limit: 1000 })

  const all = campaignsQuery.data?.data ?? []
  const filtered = category === 'all' ? all : all.filter((c) => c.category === category)
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const clampedPage = Math.min(page, totalPages - 1)
  const pageCampaigns = filtered.slice(clampedPage * PER_PAGE, clampedPage * PER_PAGE + PER_PAGE)

  function selectCategory(c: 'all' | Category) {
    setCategory(c)
    setPage(0)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex items-center justify-between px-6 pb-4 pt-6">
        <Link
          to="/kiosk"
          aria-label="Back to attract screen"
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-2 text-text no-underline"
        >
          <ChevronLeft size={24} />
        </Link>
        <div className="font-display text-[22px] font-semibold text-text">Choose a cause</div>
        <div className="w-14" />
      </div>

      <div className="flex gap-2.5 overflow-x-auto px-6 pb-4">
        {CATEGORIES.map((c) => {
          const active = category === c
          return (
            <button
              key={c}
              type="button"
              onClick={() => selectCategory(c)}
              className={cn(
                'flex-shrink-0 rounded-full px-5 py-3 font-sans text-base font-semibold text-white',
                active ? 'bg-primary' : 'bg-surface-2',
              )}
              style={{ minHeight: 44 }}
            >
              {c === 'all' ? 'All' : c}
            </button>
          )
        })}
      </div>

      <div className="flex-1 px-6 pb-6">
        {campaignsQuery.isPending && (
          <div className="grid grid-cols-2 grid-rows-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-full min-h-[180px] w-full rounded-[20px]" />
            ))}
          </div>
        )}

        {campaignsQuery.isError && (
          <EmptyState title="Couldn't load campaigns" description="Please try again." />
        )}

        {!campaignsQuery.isPending && pageCampaigns.length === 0 && (
          <EmptyState title="No campaigns in this category" />
        )}

        {pageCampaigns.length > 0 && (
          <div className="grid grid-cols-2 grid-rows-2 gap-4">
            {pageCampaigns.map((c) => {
              const pct = Math.min(100, Math.round((c.raised / c.goal) * 100))
              return (
                <Link
                  key={c.id}
                  to={`/kiosk/campaign/${c.slug}`}
                  className="flex flex-col overflow-hidden rounded-[20px] border border-border bg-surface-2 no-underline"
                >
                  <img src={coverImage(c.slug)} alt="" className="h-24 w-full object-cover" />
                  <div className="flex flex-1 flex-col gap-1.5 p-3.5">
                    <div className="font-sans text-sm font-semibold leading-tight text-text">{c.title}</div>
                    <div className="mt-auto h-[5px] overflow-hidden rounded-full bg-surface">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#6366F1] to-[#A78BFA]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      <div className="flex justify-center gap-5 px-6 pb-7">
        <button
          type="button"
          aria-label="Previous page"
          disabled={clampedPage <= 0}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-2 text-text disabled:opacity-40"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          type="button"
          aria-label="Next page"
          disabled={clampedPage >= totalPages - 1}
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-2 text-text disabled:opacity-40"
        >
          <ChevronRight size={22} />
        </button>
      </div>
    </div>
  )
}
