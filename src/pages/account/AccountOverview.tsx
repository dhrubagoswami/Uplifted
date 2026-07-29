import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useCurrency } from '../../hooks/useCurrency'
import { useDonorStats, useDonationsByDonor, useRecurringGifts } from '../../hooks/useAccount'
import { Skeleton } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'
import { EmptyState } from '../../components/ui/EmptyState'
import { timeAgo } from '../../lib/format'

export default function AccountOverview() {
  const { user } = useAuth()
  const { format } = useCurrency()
  const statsQuery = useDonorStats(user?.id)
  const donationsQuery = useDonationsByDonor(user?.id)
  const recurringQuery = useRecurringGifts()

  const recentDonations = (donationsQuery.data ?? [])
    .slice()
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, 4)
  const activeRecurring = (recurringQuery.data ?? []).filter((r) => r.status === 'active')

  return (
    <div>
      <h1 className="mb-7 font-display text-[28px] font-semibold text-text">
        Welcome back, {user?.name.split(' ')[0]}
      </h1>

      {statsQuery.isPending && (
        <div className="mb-7 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      )}

      {statsQuery.isError && (
        <ErrorState
          className="mb-7"
          title="Couldn't load your stats"
          onRetry={() => statsQuery.refetch()}
        />
      )}

      {statsQuery.data && (
        <div className="mb-7 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="font-sans text-[12.5px] text-text-2">Lifetime given</div>
            <div className="mt-1.5 font-display text-[26px] font-semibold text-text">
              {format(statsQuery.data.lifetimeValue)}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="font-sans text-[12.5px] text-text-2">Gifts given</div>
            <div className="mt-1.5 font-display text-[26px] font-semibold text-text">
              {statsQuery.data.giftCount}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="font-sans text-[12.5px] text-text-2">Active recurring</div>
            <div className="mt-1.5 font-display text-[26px] font-semibold text-text">
              {statsQuery.data.recurringCount}
            </div>
          </div>
        </div>
      )}

      <div className="mb-7 flex items-center justify-between rounded-2xl bg-gradient-to-br from-[#3F7A5C] via-[#5B9E77] to-[#7FBF8C] p-6">
        <div>
          <div className="font-sans text-[13px] text-white/85">Your impact so far</div>
          <div className="mt-1 font-display text-[22px] font-semibold text-white">
            {activeRecurring.length} recurring gift{activeRecurring.length === 1 ? '' : 's'}{' '}
            keeping campaigns funded steadily
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-border bg-surface p-5.5">
          <div className="mb-4 flex items-center justify-between">
            <div className="font-sans text-[15px] font-semibold text-text">Recent donations</div>
            <Link to="/account/donations" className="font-sans text-[13px] font-semibold text-primary no-underline">
              View all
            </Link>
          </div>
          {donationsQuery.isPending && (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          )}
          {donationsQuery.isError && <ErrorState onRetry={() => donationsQuery.refetch()} />}
          {!donationsQuery.isPending && !donationsQuery.isError && recentDonations.length === 0 && (
            <EmptyState title="No donations yet" description="Your gifts will show up here." />
          )}
          {recentDonations.map((d) => (
            <div key={d.id} className="flex justify-between border-b border-border py-3 last:border-b-0">
              <div>
                <div className="font-sans text-[13.5px] font-medium text-text">{d.campaignTitle}</div>
                <div className="font-sans text-xs text-text-2">{timeAgo(d.timestamp)}</div>
              </div>
              <div className="font-sans text-[13.5px] font-semibold text-text">{format(d.amount)}</div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5.5">
          <div className="mb-4 flex items-center justify-between">
            <div className="font-sans text-[15px] font-semibold text-text">Active recurring</div>
            <Link to="/account/recurring" className="font-sans text-[13px] font-semibold text-primary no-underline">
              Manage
            </Link>
          </div>
          {recurringQuery.isPending && (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          )}
          {recurringQuery.isError && <ErrorState onRetry={() => recurringQuery.refetch()} />}
          {!recurringQuery.isPending && !recurringQuery.isError && activeRecurring.length === 0 && (
            <EmptyState title="No recurring gifts" description="Set up a monthly gift from any campaign." />
          )}
          {activeRecurring.map((r) => (
            <div key={r.id} className="border-b border-border py-3 last:border-b-0">
              <div className="font-sans text-[13.5px] font-medium text-text">{r.campaignTitle}</div>
              <div className="mt-0.5 font-sans text-xs text-text-2">
                {format(r.amount)}/month · next {r.nextChargeDate}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
