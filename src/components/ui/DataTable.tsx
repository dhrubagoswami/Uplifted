import type { ReactNode } from 'react'
import type { Paginated } from '../../types'
import { Checkbox } from './Checkbox'
import { Pagination } from './Pagination'
import { Skeleton } from './Skeleton'
import { EmptyState } from './EmptyState'
import { ErrorState } from './ErrorState'
import { cn } from '../../lib/cn'

export interface DataTableColumn<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
  /** CSS grid column width/fraction, e.g. "1fr" or "1.6fr". Defaults to "1fr". */
  width?: string
  sortable?: boolean
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  data?: Paginated<T>
  getRowId: (row: T) => string
  isPending?: boolean
  isError?: boolean
  onRetry?: () => void
  onRowClick?: (row: T) => void
  onPageChange?: (page: number) => void
  selectable?: boolean
  selectedIds?: Set<string>
  onSelectionChange?: (ids: Set<string>) => void
  sortKey?: string
  sortDirection?: 'asc' | 'desc'
  onSortChange?: (key: string) => void
  emptyTitle?: string
  emptyDescription?: string
  className?: string
}

export function DataTable<T>({
  columns,
  data,
  getRowId,
  isPending,
  isError,
  onRetry,
  onRowClick,
  onPageChange,
  selectable,
  selectedIds,
  onSelectionChange,
  sortKey,
  sortDirection,
  onSortChange,
  emptyTitle = 'Nothing here yet',
  emptyDescription,
  className,
}: DataTableProps<T>) {
  const gridTemplate = [selectable ? '32px' : null, ...columns.map((c) => c.width ?? '1fr')]
    .filter(Boolean)
    .join(' ')

  function toggleAll() {
    if (!data || !onSelectionChange) return
    const allIds = data.data.map(getRowId)
    const allSelected = allIds.every((id) => selectedIds?.has(id))
    onSelectionChange(allSelected ? new Set() : new Set(allIds))
  }

  function toggleOne(id: string) {
    if (!onSelectionChange) return
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    onSelectionChange(next)
  }

  if (isError) {
    return <ErrorState onRetry={onRetry} className={className} />
  }

  return (
    <div className={cn('overflow-hidden rounded-2xl border border-border', className)}>
      <div className="overflow-x-auto">
        <div
          className="grid min-w-full items-center bg-surface-2 px-4 py-3 font-sans text-[11.5px] font-semibold uppercase tracking-[0.04em] text-text-2"
          style={{ gridTemplateColumns: gridTemplate }}
        >
          {selectable && (
            <Checkbox
              checked={!!data && data.data.length > 0 && data.data.every((r) => selectedIds?.has(getRowId(r)))}
              onChange={toggleAll}
              aria-label="Select all rows"
            />
          )}
          {columns.map((col) => (
            <button
              key={col.key}
              type="button"
              disabled={!col.sortable}
              onClick={() => col.sortable && onSortChange?.(col.key)}
              className={cn(
                'flex items-center gap-1 text-left',
                col.sortable ? 'cursor-pointer hover:text-text' : 'cursor-default',
              )}
            >
              {col.header}
              {col.sortable && sortKey === col.key && (sortDirection === 'asc' ? '↑' : '↓')}
            </button>
          ))}
        </div>

        {isPending && (
          <div className="flex flex-col gap-px">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border-t border-border px-4 py-3.5">
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        )}

        {!isPending && data && data.data.length === 0 && (
          <div className="p-2">
            <EmptyState title={emptyTitle} description={emptyDescription} />
          </div>
        )}

        {!isPending &&
          data?.data.map((row) => {
            const id = getRowId(row)
            return (
              <div
                key={id}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  'grid min-w-full items-center border-t border-border bg-surface px-4 py-3.5 font-sans text-[13px] text-text',
                  onRowClick && 'cursor-pointer hover:bg-surface-2',
                )}
                style={{ gridTemplateColumns: gridTemplate }}
              >
                {selectable && (
                  <Checkbox
                    checked={!!selectedIds?.has(id)}
                    onChange={(e) => {
                      e.stopPropagation()
                      toggleOne(id)
                    }}
                    onClick={(e) => e.stopPropagation()}
                    aria-label="Select row"
                  />
                )}
                {columns.map((col) => (
                  <div key={col.key} className="min-w-0 truncate pr-2">
                    {col.render(row)}
                  </div>
                ))}
              </div>
            )
          })}
      </div>

      {data && onPageChange && (
        <div className="border-t border-border px-4">
          <Pagination page={data.page} totalPages={data.totalPages} onPageChange={onPageChange} />
        </div>
      )}
    </div>
  )
}
