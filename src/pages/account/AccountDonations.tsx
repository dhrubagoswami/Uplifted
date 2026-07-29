import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useCurrency } from '../../hooks/useCurrency'
import { useDonationsByDonor } from '../../hooks/useAccount'
import { DataTable } from '../../components/ui/DataTable'
import type { DataTableColumn } from '../../components/ui/DataTable'
import { Badge } from '../../components/ui/Badge'
import type { Donation, DonationStatus } from '../../types'

const PAGE_SIZE = 10

const STATUS_VARIANT: Record<DonationStatus, 'success' | 'soft' | 'danger'> = {
  Completed: 'success',
  Pending: 'soft',
  Refunded: 'danger',
}

export default function AccountDonations() {
  const { user } = useAuth()
  const { format } = useCurrency()
  const donationsQuery = useDonationsByDonor(user?.id)
  const [page, setPage] = useState(1)

  const sorted = (donationsQuery.data ?? [])
    .slice()
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
  const total = sorted.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const pageRows = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const columns: DataTableColumn<Donation>[] = [
    { key: 'campaign', header: 'Campaign', width: '1.6fr', render: (d) => d.campaignTitle },
    {
      key: 'date',
      header: 'Date',
      render: (d) =>
        new Date(d.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    },
    { key: 'amount', header: 'Amount', render: (d) => format(d.amount) },
    { key: 'method', header: 'Method', render: (d) => d.method },
    {
      key: 'status',
      header: 'Status',
      render: (d) => (
        <div className="flex items-center gap-2.5">
          <Badge variant={STATUS_VARIANT[d.status]}>{d.status}</Badge>
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="cursor-pointer border-none bg-transparent p-0 font-sans text-xs text-primary"
          >
            Receipt
          </button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <h1 className="mb-6 font-display text-[28px] font-semibold text-text">Donation history</h1>
      <DataTable
        columns={columns}
        data={{ data: pageRows, page, limit: PAGE_SIZE, total, totalPages }}
        getRowId={(d) => d.id}
        isPending={donationsQuery.isPending}
        isError={donationsQuery.isError}
        onRetry={() => donationsQuery.refetch()}
        onPageChange={setPage}
        emptyTitle="No donations yet"
        emptyDescription="Gifts you make will show up here."
      />
    </div>
  )
}
