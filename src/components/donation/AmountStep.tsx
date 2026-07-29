import type { Campaign } from '../../types'
import { useDonationFlow } from '../../hooks/useDonationFlow'
import { useCurrency } from '../../hooks/useCurrency'
import { Checkbox } from '../ui/Checkbox'
import { cn } from '../../lib/cn'
import { CHIP_AMOUNTS, FEE_RATE, computeAmount } from '../../lib/donationFlow'

interface AmountStepProps {
  campaign: Campaign
}

export function AmountStep({ campaign }: AmountStepProps) {
  const { state, update } = useDonationFlow()
  const { format } = useCurrency()
  const amount = computeAmount(state.selectedChip, state.customAmount)
  const customUnits = state.customAmount ? Math.round(amount / campaign.unitCost) : 0
  const fee = Math.round(amount * FEE_RATE)

  return (
    <div>
      <h2 className="mb-6 font-display text-2xl font-semibold text-text">Choose an amount</h2>

      <div className="mb-6 flex w-fit rounded-[10px] bg-surface-2 p-1">
        <button
          type="button"
          onClick={() => update({ frequency: 'once' })}
          className={cn(
            'rounded-[7px] px-4.5 py-2.5 font-sans text-[13.5px] font-semibold',
            state.frequency === 'once' ? 'bg-surface text-text' : 'bg-transparent text-text-2',
          )}
        >
          One-time
        </button>
        <button
          type="button"
          onClick={() => update({ frequency: 'monthly' })}
          className={cn(
            'rounded-[7px] px-4.5 py-2.5 font-sans text-[13.5px] font-semibold',
            state.frequency === 'monthly' ? 'bg-surface text-text' : 'bg-transparent text-text-2',
          )}
        >
          Monthly
        </button>
      </div>

      {state.frequency === 'monthly' && (
        <div className="-mt-3.5 mb-5 font-sans text-[13px] text-text-2">
          {format(amount)}/month, cancel anytime
        </div>
      )}

      <div className="mb-5 grid grid-cols-2 gap-3">
        {CHIP_AMOUNTS.map((a, i) => {
          const active = state.selectedChip === i && !state.customAmount
          const u = Math.max(1, Math.round(a / campaign.unitCost))
          return (
            <button
              key={a}
              type="button"
              onClick={() => update({ selectedChip: i, customAmount: '' })}
              className={cn(
                'flex flex-col items-start gap-0.5 rounded-[14px] border p-4 text-left',
                active ? 'border-primary bg-surface-2' : 'border-border bg-transparent',
              )}
            >
              <span className="font-display text-xl font-semibold text-text">{format(a)}</span>
              <span className="font-sans text-xs text-text-2">
                {u} {campaign.impactUnit}
                {u > 1 ? 's' : ''}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mb-5">
        <div className="mb-2 font-sans text-[13px] text-text-2">Or enter a custom amount</div>
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-display text-lg text-text-2">
            ₹
          </span>
          <input
            value={state.customAmount}
            onChange={(e) => update({ customAmount: e.target.value.replace(/[^0-9]/g, '') })}
            placeholder="0"
            inputMode="numeric"
            className="w-full rounded-xl border border-border bg-surface py-3.5 pl-[34px] pr-4 font-display text-lg font-semibold text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        {!!state.customAmount && customUnits > 0 && (
          <div className="mt-1.5 font-sans text-xs text-primary">
            Funds {Math.max(1, customUnits)} {campaign.impactUnit}
            {customUnits > 1 ? 's' : ''}
          </div>
        )}
      </div>

      <label
        htmlFor="cover-fee"
        className="flex cursor-pointer items-center gap-2.5 rounded-xl bg-surface-2 p-3.5 font-sans text-[13.5px] text-text"
      >
        <Checkbox
          id="cover-fee"
          checked={state.coverFee}
          onChange={(e) => update({ coverFee: e.target.checked })}
        />
        Cover the {format(fee)} transaction fee so 100% reaches the cause
      </label>
    </div>
  )
}
