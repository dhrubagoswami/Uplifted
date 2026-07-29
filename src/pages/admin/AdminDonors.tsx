import { useState } from 'react'
import { useDonors } from '../../hooks/useDonors'
import { useDonationsByDonor } from '../../hooks/useAccount'
import { useCurrency } from '../../hooks/useCurrency'
import { DataTable } from '../../components/ui/DataTable'
import type { DataTableColumn } from '../../components/ui/DataTable'
import { Avatar } from '../../components/ui/Avatar'
import { Button } from '../../components/ui/Button'
import { Drawer } from '../../components/ui/Drawer'
import { Skeleton } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'
import { EmptyState } from '../../components/ui/EmptyState'
import type { Donor } from '../../types'

export default function AdminDonors() {
  const { format } = useCurrency()
  const donorsQuery = useDonors({ limit: 1000 })
  const [selected, setSelected] = useState<Donor | null>(null)
  const activityQuery = useDonationsByDonor(selected?.id)

  const rows = donorsQuery.data?.data ?? []

  const columns: DataTableColumn<Donor>[] = [
    {
      key: 'name',
      header: 'Donor',
      width: '1.6fr',
      render: (d) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={d.name} size="sm" />
          <span className="font-sans text-[13.5px] text-text">{d.name}</span>
        </div>
      ),
    },
    { key: 'ltv', header: 'Lifetime value', render: (d) => format(d.lifetimeValue) },
    { key: 'gifts', header: 'Gifts', render: (d) => d.giftCount },
    {
      key: 'first',
      header: 'First gift',
      render: (d) => new Date(d.firstGift).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
    },
    { key: 'last', header: 'Last gift', render: (d) => new Date(d.lastGift).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) },
    {
      key: 'recurring',
      header: 'Recurring',
      render: (d) => (
        <span className={d.recurring ? 'font-semibold text-success' : 'text-text-2'}>
          {d.recurring ? 'Yes' : 'No'}
        </span>
      ),
    },
  ]

  return (
    <div>
      <DataTable
        columns={columns}
        data={{ data: rows, page: 1, limit: rows.length || 1, total: rows.length, totalPages: 1 }}
        getRowId={(d) => d.id}
        isPending={donorsQuery.isPending}
        isError={donorsQuery.isError}
        onRetry={() => donorsQuery.refetch()}
        onRowClick={setSelected}
        emptyTitle="No donors"
        emptyDescription="Donors will appear here once gifts come in."
      />

      <Drawer open={!!selected} onClose={() => setSelected(null)} title="">
        {selected && (
          <>
            <div className="flex items-center gap-3">
              <Avatar name={selected.name} size="lg" />
              <div>
                <div className="font-sans text-base font-semibold text-text">{selected.name}</div>
                <div className="font-sans text-xs text-text-2">{selected.email}</div>
              </div>
            </div>
            <div className="flex gap-4">
              <div>
                <div className="font-sans text-[11.5px] text-text-2">Lifetime</div>
                <div className="font-display text-[17px] font-semibold text-text">
                  {format(selected.lifetimeValue)}
                </div>
              </div>
              <div>
                <div className="font-sans text-[11.5px] text-text-2">Gifts</div>
                <div className="font-display text-[17px] font-semibold text-text">{selected.giftCount}</div>
              </div>
            </div>
            <div className="mt-2 font-sans text-xs font-semibold uppercase tracking-[0.06em] text-text-2">
              Recent activity
            </div>
            {activityQuery.isPending && (
              <div className="flex flex-col gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            )}
            {activityQuery.isError && <ErrorState onRetry={() => activityQuery.refetch()} />}
            {!activityQuery.isPending && (activityQuery.data ?? []).length === 0 && (
              <EmptyState title="No activity yet" />
            )}
            {(activityQuery.data ?? []).slice(0, 6).map((d) => (
              <div key={d.id} className="flex justify-between border-b border-border py-2 last:border-b-0">
                <span className="font-sans text-[13px] text-text">{d.campaignTitle}</span>
                <span className="font-sans text-[12.5px] text-text-2">{format(d.amount)}</span>
              </div>
            ))}
            <Button variant="secondary" className="mt-auto justify-center" onClick={() => setSelected(null)}>
              Close
            </Button>
          </>
        )}
      </Drawer>
    </div>
  )
}
