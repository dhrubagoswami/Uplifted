import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminCampaignsList } from '../../hooks/useAdminCampaigns'
import { useCurrency } from '../../hooks/useCurrency'
import { DataTable } from '../../components/ui/DataTable'
import type { DataTableColumn } from '../../components/ui/DataTable'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { cn } from '../../lib/cn'
import type { Campaign, CampaignStatus } from '../../types'

const STATUS_LABEL: Record<CampaignStatus, string> = {
  active: 'Live',
  completed: 'Completed',
  draft: 'Draft',
}

const STATUS_VARIANT: Record<CampaignStatus, 'success' | 'soft'> = {
  active: 'success',
  completed: 'soft',
  draft: 'soft',
}

const STATUS_FILTERS: ('all' | CampaignStatus)[] = ['all', 'active', 'completed', 'draft']

function coverImage(slug: string): string {
  return `https://picsum.photos/seed/${slug}/88/64`
}

export default function AdminCampaigns() {
  const navigate = useNavigate()
  const { format } = useCurrency()
  const campaignsQuery = useAdminCampaignsList()
  const [statusFilter, setStatusFilter] = useState<'all' | CampaignStatus>('all')
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const all = campaignsQuery.data?.data ?? []
  const filtered = statusFilter === 'all' ? all : all.filter((c) => c.status === statusFilter)

  const columns: DataTableColumn<Campaign>[] = [
    {
      key: 'title',
      header: 'Campaign',
      width: '2fr',
      render: (c) => (
        <div className="flex min-w-0 items-center gap-2.5">
          <img src={coverImage(c.slug)} alt="" className="h-8 w-11 flex-shrink-0 rounded-md object-cover" />
          <span className="truncate font-sans text-[13.5px] font-medium text-text">{c.title}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (c) => <Badge variant={STATUS_VARIANT[c.status]}>{STATUS_LABEL[c.status]}</Badge>,
    },
    {
      key: 'raised',
      header: 'Raised vs goal',
      width: '1.4fr',
      render: (c) => {
        const pct = Math.min(100, Math.round((c.raised / c.goal) * 100))
        return (
          <div className="flex flex-col gap-1">
            <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
              <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
            </div>
            <span className="font-sans text-[11.5px] text-text-2">
              {format(c.raised)} of {format(c.goal)}
            </span>
          </div>
        )
      },
    },
    { key: 'donors', header: 'Donors', render: (c) => c.donorCount },
    { key: 'ends', header: 'Ends', render: (c) => (c.daysLeft <= 0 ? 'Ended' : `${c.daysLeft}d`) },
  ]

  return (
    <div>
      <div className="mb-4.5 flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((s) => {
            const active = statusFilter === s
            return (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={cn(
                  'rounded-full border px-3.5 py-1.5 font-sans text-[12.5px] font-medium',
                  active ? 'border-primary bg-surface-2 text-primary' : 'border-border bg-transparent text-text-2',
                )}
              >
                {s === 'all' ? 'All' : STATUS_LABEL[s]}
              </button>
            )
          })}
        </div>
        <Button size="sm" onClick={() => navigate('/admin/campaigns/new')}>
          + New campaign
        </Button>
      </div>

      {selected.size > 0 && (
        <div className="mb-3 flex items-center gap-3.5 rounded-lg bg-surface-2 px-4 py-2.5">
          <span className="font-sans text-[13px] font-semibold text-primary">{selected.size} selected</span>
          <button type="button" className="cursor-pointer border-none bg-transparent p-0 font-sans text-[12.5px] text-text">
            Pause
          </button>
          <button type="button" className="cursor-pointer border-none bg-transparent p-0 font-sans text-[12.5px] text-text">
            Export
          </button>
        </div>
      )}

      <DataTable
        columns={columns}
        data={{ data: filtered, page: 1, limit: filtered.length || 1, total: filtered.length, totalPages: 1 }}
        getRowId={(c) => c.id}
        isPending={campaignsQuery.isPending}
        isError={campaignsQuery.isError}
        onRetry={() => campaignsQuery.refetch()}
        onRowClick={(c) => navigate(`/admin/campaigns/${c.id}`)}
        selectable
        selectedIds={selected}
        onSelectionChange={setSelected}
        emptyTitle="No campaigns"
        emptyDescription="Create your first campaign to get started."
      />
    </div>
  )
}
