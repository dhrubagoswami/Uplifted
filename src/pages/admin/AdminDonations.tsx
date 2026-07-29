import { useState } from 'react'
import { useAdminDonationsList, useRefundDonation } from '../../hooks/useAdminDonations'
import { useCurrency } from '../../hooks/useCurrency'
import { DataTable } from '../../components/ui/DataTable'
import type { DataTableColumn } from '../../components/ui/DataTable'
import { Badge } from '../../components/ui/Badge'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'
import { Drawer } from '../../components/ui/Drawer'
import type { Donation, DonationStatus, PaymentMethod } from '../../types'

const STATUS_VARIANT: Record<DonationStatus, 'success' | 'soft' | 'danger'> = {
  Completed: 'success',
  Pending: 'soft',
  Refunded: 'danger',
}

const METHODS: PaymentMethod[] = ['UPI', 'Card', 'Net Banking', 'Wallet', 'PayPal']

export default function AdminDonations() {
  const { format } = useCurrency()
  const [statusFilter, setStatusFilter] = useState<'all' | DonationStatus>('all')
  const [methodFilter, setMethodFilter] = useState<'all' | PaymentMethod>('all')
  const donationsQuery = useAdminDonationsList({
    status: statusFilter === 'all' ? undefined : statusFilter,
  })
  const refundMutation = useRefundDonation()
  const [selected, setSelected] = useState<Donation | null>(null)

  const rows = (donationsQuery.data?.data ?? []).filter(
    (d) => methodFilter === 'all' || d.method === methodFilter,
  )

  const columns: DataTableColumn<Donation>[] = [
    {
      key: 'date',
      header: 'Date',
      render: (d) => new Date(d.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    },
    { key: 'campaign', header: 'Campaign', width: '1.6fr', render: (d) => d.campaignTitle },
    { key: 'donor', header: 'Donor', render: (d) => d.donorName ?? 'Anonymous' },
    { key: 'amount', header: 'Amount', render: (d) => format(d.amount) },
    { key: 'method', header: 'Method', render: (d) => d.method },
    {
      key: 'status',
      header: 'Status',
      render: (d) => <Badge variant={STATUS_VARIANT[d.status]}>{d.status}</Badge>,
    },
  ]

  function handleRefund() {
    if (!selected) return
    refundMutation.mutate(selected.id, {
      onSuccess: (updated) => setSelected(updated),
    })
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | DonationStatus)}
            className="w-auto"
          >
            <option value="all">All statuses</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Refunded">Refunded</option>
          </Select>
          <Select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value as 'all' | PaymentMethod)}
            className="w-auto"
          >
            <option value="all">All methods</option>
            {METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </Select>
        </div>
        <Button variant="secondary" size="sm">
          Export CSV
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={{ data: rows, page: 1, limit: rows.length || 1, total: rows.length, totalPages: 1 }}
        getRowId={(d) => d.id}
        isPending={donationsQuery.isPending}
        isError={donationsQuery.isError}
        onRetry={() => donationsQuery.refetch()}
        onRowClick={setSelected}
        emptyTitle="No donations"
        emptyDescription="Transactions will show up here."
      />

      <Drawer open={!!selected} onClose={() => setSelected(null)} title="Transaction details">
        {selected && (
          <>
            <div className="font-mono text-[12.5px] text-text-2">{selected.id}</div>
            <div className="flex flex-col gap-2.5 rounded-xl border border-border p-4">
              <div className="flex justify-between">
                <span className="font-sans text-[13px] text-text-2">Donor</span>
                <span className="font-sans text-[13.5px] text-text">{selected.donorName ?? 'Anonymous'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans text-[13px] text-text-2">Amount</span>
                <span className="font-sans text-[13.5px] font-semibold text-text">{format(selected.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans text-[13px] text-text-2">Method</span>
                <span className="font-sans text-[13.5px] text-text">{selected.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans text-[13px] text-text-2">Status</span>
                <span className="font-sans text-[13.5px] text-text">{selected.status}</span>
              </div>
            </div>
            {selected.status !== 'Refunded' && (
              <Button
                variant="secondary"
                className="justify-center border-danger text-danger"
                disabled={refundMutation.isPending}
                onClick={handleRefund}
              >
                {refundMutation.isPending ? 'Refunding…' : 'Issue refund'}
              </Button>
            )}
            <Button variant="secondary" className="justify-center" onClick={() => setSelected(null)}>
              Close
            </Button>
          </>
        )}
      </Drawer>
    </div>
  )
}
