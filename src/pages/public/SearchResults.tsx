import { Search } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { useCampaigns } from '../../hooks/useCampaigns'
import { useOrganizations } from '../../hooks/useOrganizations'
import { useDebounce } from '../../hooks/useDebounce'
import { Skeleton } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'

function coverImage(slug: string): string {
  return `https://picsum.photos/seed/${slug}/128/96`
}

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const debouncedQuery = useDebounce(query, 300)

  const campaignsQuery = useCampaigns({ q: debouncedQuery || undefined, limit: 20 })
  const orgsQuery = useOrganizations({ limit: 50 })

  const campaignResults = campaignsQuery.data?.data ?? []
  const orgNameById = new Map((orgsQuery.data?.data ?? []).map((o) => [o.id, o.name]))
  const needle = debouncedQuery.toLowerCase()
  const orgResults = debouncedQuery
    ? (orgsQuery.data?.data ?? []).filter(
        (o) => o.name.toLowerCase().includes(needle) || o.location.toLowerCase().includes(needle),
      )
    : []

  const isPending = campaignsQuery.isPending || orgsQuery.isPending
  const isError = campaignsQuery.isError || orgsQuery.isError
  const total = campaignResults.length + orgResults.length

  return (
    <div>
      <div className="mx-auto max-w-[820px] px-12 pt-14">
        <div className="relative mb-2">
          <Search size={18} className="absolute left-[15px] top-1/2 -translate-y-1/2 text-text-2" />
          <input
            value={query}
            onChange={(e) => setSearchParams(e.target.value ? { q: e.target.value } : {})}
            placeholder="Search campaigns, organizations..."
            autoFocus
            className="w-full rounded-[14px] border border-border bg-surface py-4 pl-11 pr-4 font-sans text-base text-text placeholder:text-text-3 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <div className="mb-9 font-sans text-[13.5px] text-text-2">
          {debouncedQuery ? (isPending ? 'Searching…' : `${total} results for "${debouncedQuery}"`) : ''}
        </div>
      </div>

      <div className="mx-auto max-w-[820px] px-12 pb-24">
        {isError && <ErrorState onRetry={() => campaignsQuery.refetch()} />}

        {!isError && isPending && debouncedQuery && (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        )}

        {!isError && !isPending && debouncedQuery && campaignResults.length > 0 && (
          <>
            <div className="mb-3.5 font-sans text-xs font-semibold uppercase tracking-[0.06em] text-text-2">
              Campaigns
            </div>
            <div className="mb-9 flex flex-col gap-px">
              {campaignResults.map((c) => (
                <Link
                  key={c.id}
                  to={`/campaigns/${c.slug}`}
                  className="flex items-center gap-3.5 border-b border-border py-3.5 no-underline"
                >
                  <img
                    src={coverImage(c.slug)}
                    alt=""
                    className="h-12 w-16 flex-shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0">
                    <div className="font-sans text-[14.5px] font-semibold text-text">{c.title}</div>
                    <div className="font-sans text-xs text-text-2">
                      {orgNameById.get(c.orgId) ?? ''} · {c.category}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {!isError && !isPending && debouncedQuery && orgResults.length > 0 && (
          <>
            <div className="mb-3.5 font-sans text-xs font-semibold uppercase tracking-[0.06em] text-text-2">
              Organizations
            </div>
            <div className="flex flex-col gap-px">
              {orgResults.map((o) => (
                <Link
                  key={o.id}
                  to={`/organizations/${o.slug}`}
                  className="flex items-center gap-3.5 border-b border-border py-3.5 no-underline"
                >
                  <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-surface-2 font-sans text-base font-semibold text-primary">
                    {o.name.charAt(0)}
                  </span>
                  <div>
                    <div className="font-sans text-[14.5px] font-semibold text-text">{o.name}</div>
                    <div className="font-sans text-xs text-text-2">{o.location}</div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {!isError && !isPending && debouncedQuery && total === 0 && (
          <div className="py-16 text-center font-sans text-text-2">
            No results for &ldquo;{debouncedQuery}&rdquo;
          </div>
        )}
      </div>
    </div>
  )
}
