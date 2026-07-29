import { useState } from 'react'
import { useKiosks, usePairKiosk } from '../../hooks/useKiosks'
import { useCurrency } from '../../hooks/useCurrency'
import { Skeleton } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'

export default function AdminKiosks() {
  const { format } = useCurrency()
  const kiosksQuery = useKiosks()
  const pairMutation = usePairKiosk()
  const [modalOpen, setModalOpen] = useState(false)

  const offlineDevice = (kiosksQuery.data ?? []).find((k) => !k.online)
  const newCode = offlineDevice
    ? `${offlineDevice.pairingCode.slice(0, 2)}-${offlineDevice.pairingCode.slice(2)}`
    : '00-0000'

  function handlePair() {
    if (offlineDevice) pairMutation.mutate(offlineDevice.pairingCode)
  }

  return (
    <div>
      <div className="mb-4.5 flex justify-end">
        <Button size="sm" onClick={() => setModalOpen(true)}>
          + Pair new device
        </Button>
      </div>

      {kiosksQuery.isPending && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-2xl" />
          ))}
        </div>
      )}

      {kiosksQuery.isError && (
        <ErrorState title="Couldn't load kiosks" onRetry={() => kiosksQuery.refetch()} />
      )}

      {kiosksQuery.data && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {kiosksQuery.data.map((k) => (
            <div key={k.id} className="rounded-2xl border border-border bg-surface p-5">
              <div className="mb-3.5 flex items-start justify-between">
                <div className="font-sans text-[14.5px] font-semibold text-text">{k.name}</div>
                <span
                  className={`flex items-center gap-1.5 font-sans text-[11.5px] font-semibold ${k.online ? 'text-success' : 'text-danger'}`}
                >
                  <span
                    className={`h-[7px] w-[7px] rounded-full ${k.online ? 'bg-success' : 'bg-danger'}`}
                  />
                  {k.online ? 'Online' : 'Offline'}
                </span>
              </div>
              <div className="mb-3.5 font-sans text-[12.5px] text-text-2">
                Last heartbeat: {k.lastHeartbeat}
              </div>
              <div className="flex justify-between border-t border-border pt-3.5">
                <div>
                  <div className="font-sans text-[11px] text-text-2">Today's total</div>
                  <div className="font-display text-base font-semibold text-text">{format(k.todayTotal)}</div>
                </div>
                <div>
                  <div className="font-sans text-[11px] text-text-2">Pairing code</div>
                  <div className="font-mono text-sm text-text">{k.pairingCode}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Pair new device">
        <div className="mb-4 font-mono text-[32px] font-semibold tracking-[0.1em] text-primary">
          {newCode}
        </div>
        <p className="mb-5 font-sans text-[13px] text-text-2">
          Enter this code on the kiosk device to pair it with this organization.
        </p>
        {offlineDevice && (
          <Button
            className="mb-2.5 w-full justify-center"
            disabled={pairMutation.isPending}
            onClick={handlePair}
          >
            {pairMutation.isPending ? 'Pairing…' : 'Simulate pairing'}
          </Button>
        )}
        <Button
          variant="secondary"
          className="w-full justify-center"
          onClick={() => setModalOpen(false)}
        >
          Done
        </Button>
      </Modal>
    </div>
  )
}
