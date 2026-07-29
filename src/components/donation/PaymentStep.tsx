import { useDonationFlow } from '../../hooks/useDonationFlow'
import { Input } from '../ui/Input'
import { Checkbox } from '../ui/Checkbox'
import { cn } from '../../lib/cn'
import type { PaymentMethod } from '../../types'

const METHODS: PaymentMethod[] = ['UPI', 'Card', 'Net Banking', 'Wallet', 'PayPal']

interface PaymentStepProps {
  cardNumberError?: string
}

export function PaymentStep({ cardNumberError }: PaymentStepProps) {
  const { state, update } = useDonationFlow()

  return (
    <div>
      <h2 className="mb-6 font-display text-2xl font-semibold text-text">Payment method</h2>
      <div className="mb-6 grid grid-cols-2 gap-2.5 sm:grid-cols-5">
        {METHODS.map((m) => {
          const active = state.method === m
          return (
            <button
              key={m}
              type="button"
              onClick={() => update({ method: m })}
              className={cn(
                'flex flex-col items-center gap-2 rounded-xl border px-2 py-4',
                active ? 'border-primary bg-surface-2' : 'border-border bg-transparent',
              )}
            >
              <span className="font-sans text-[13px] font-semibold text-text">{m}</span>
            </button>
          )
        })}
      </div>

      {state.method === 'Card' && (
        <div className="flex flex-col gap-3.5">
          <div>
            <Input
              value={state.cardNumber}
              onChange={(e) => update({ cardNumber: e.target.value.replace(/[^0-9]/g, '') })}
              placeholder="Card number"
              className="font-mono"
              error={!!cardNumberError}
              maxLength={19}
            />
            {cardNumberError && (
              <div className="mt-1 font-sans text-xs text-danger">{cardNumberError}</div>
            )}
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Input placeholder="MM/YY" />
            <Input placeholder="CVC" />
            <Input placeholder="Name on card" />
          </div>
          <label className="flex items-center gap-2 font-sans text-[13px] text-text-2">
            <Checkbox />
            Save this card for future gifts
          </label>
        </div>
      )}

      {state.method === 'UPI' && (
        <div className="grid grid-cols-1 items-center gap-5 sm:grid-cols-[1fr_200px]">
          <Input placeholder="yourname@upi" className="font-mono" />
          <div className="flex aspect-square items-center justify-center rounded-[14px] border border-border bg-surface-2">
            <div
              className="h-[64%] w-[64%]"
              style={{
                background:
                  'repeating-conic-gradient(#14111F 0% 25%, transparent 0% 50%) 0 0/16px 16px',
              }}
            />
          </div>
        </div>
      )}

      {(state.method === 'Net Banking' || state.method === 'Wallet' || state.method === 'PayPal') && (
        <div className="rounded-xl border border-border bg-surface-2 p-4 font-sans text-sm text-text-2">
          You'll be redirected to complete payment via {state.method} in the next step.
        </div>
      )}
    </div>
  )
}
