import { useState } from 'react'
import { useCurrency } from '../../hooks/useCurrency'
import { useRecurringGifts, usePauseRecurring, useCancelRecurring } from '../../hooks/useAccount'
import { Skeleton } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'
import { EmptyState } from '../../components/ui/EmptyState'
import { Badge } from '../../components/ui/Badge'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { cn } from '../../lib/cn'
import type { RecurringGift } from '../../types'

export default function AccountRecurring() {
  const { format } = useCurrency()
  const recurringQuery = useRecurringGifts()
  const pauseMutation = usePauseRecurring()
  const cancelMutation = useCancelRecurring()
  const [cancelTarget, setCancelTarget] = useState<RecurringGift | null>(null)

  const gifts = recurringQuery.data ?? []

  function handleConfirmCancel() {
    if (!cancelTarget) return
    cancelMutation.mutate(cancelTarget.id, { onSuccess: () => setCancelTarget(null) })
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-[28px] font-semibold text-text">Recurring gifts</h1>

      {recurringQuery.isPending && (
        <div className="flex max-w-[640px] flex-col gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
      )}

      {recurringQuery.isError && (
        <ErrorState title="Couldn't load your recurring gifts" onRetry={() => recurringQuery.refetch()} />
      )}

      {!recurringQuery.isPending && !recurringQuery.isError && gifts.length === 0 && (
        <EmptyState title="No recurring gifts" description="Set up a monthly gift from any campaign to see it here." />
      )}

      <div className="flex max-w-[640px] flex-col gap-4">
        {gifts.map((g) => {
          const isPausing = pauseMutation.isPending && pauseMutation.variables === g.id
          return (
            <div key={g.id} className="rounded-2xl border border-border bg-surface p-5">
              <div className="mb-3.5 flex items-start justify-between">
                <div>
                  <div className="font-sans text-[15px] font-semibold text-text">{g.campaignTitle}</div>
                  <div className="mt-1 font-sans text-[13px] text-text-2">
                    {format(g.amount)}/month · next charge {g.nextChargeDate}
                  </div>
                </div>
                <Badge
                  variant={g.status === 'active' ? 'success' : g.status === 'paused' ? 'soft' : 'danger'}
                  className={cn('capitalize')}
                >
                  {g.status}
                </Badge>
              </div>
              {g.status === 'active' && (
                <div className="flex gap-2.5">
                  <Button variant="secondary" size="sm">
                    Edit amount
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={isPausing}
                    onClick={() => pauseMutation.mutate(g.id)}
                  >
                    {isPausing ? 'Pausing…' : 'Pause'}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-danger" onClick={() => setCancelTarget(g)}>
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <Modal open={!!cancelTarget} onClose={() => setCancelTarget(null)} title="Cancel this recurring gift?">
        <p className="mb-5 text-left font-sans text-sm leading-relaxed text-text-2">
          Your monthly gift keeps this campaign funded steadily — even a small amount closes the gap faster
          than one large gift. You can pause instead, if you'd rather.
        </p>
        <div className="flex gap-2.5">
          <Button variant="secondary" className="flex-1 justify-center" onClick={() => setCancelTarget(null)}>
            Keep my gift
          </Button>
          <Button
            variant="danger"
            className="flex-1 justify-center"
            disabled={cancelMutation.isPending}
            onClick={handleConfirmCancel}
          >
            {cancelMutation.isPending ? 'Cancelling…' : 'Cancel gift'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
