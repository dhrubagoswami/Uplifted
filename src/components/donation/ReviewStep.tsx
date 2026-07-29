import type { Campaign } from '../../types'
import { useDonationFlow } from '../../hooks/useDonationFlow'
import { useCurrency } from '../../hooks/useCurrency'
import { Checkbox } from '../ui/Checkbox'
import { computeAmount } from '../../lib/donationFlow'

interface ReviewStepProps {
  campaign: Campaign
}

export function ReviewStep({ campaign }: ReviewStepProps) {
  const { state, update } = useDonationFlow()
  const { format } = useCurrency()
  const amount = computeAmount(state.selectedChip, state.customAmount)

  const rows: { label: string; value: string; step: number }[] = [
    { label: 'Campaign', value: campaign.title, step: 1 },
    { label: 'Frequency', value: state.frequency === 'once' ? 'One-time' : 'Monthly', step: 1 },
    { label: 'Amount', value: format(amount), step: 1 },
    { label: 'Donor', value: state.anonymous ? 'Anonymous' : state.donorName || 'Not set', step: 2 },
    { label: 'Payment method', value: state.method, step: 3 },
  ]

  return (
    <div>
      <h2 className="mb-6 font-display text-2xl font-semibold text-text">Review your gift</h2>
      <div className="mb-5 flex flex-col overflow-hidden rounded-[14px] border border-border">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between border-b border-border bg-surface px-4 py-3.5 last:border-b-0"
          >
            <span className="font-sans text-[13.5px] text-text-2">{row.label}</span>
            <div className="flex items-center gap-2.5">
              <span className="font-sans text-sm font-semibold text-text">{row.value}</span>
              <button
                type="button"
                onClick={() => update({ step: row.step })}
                className="cursor-pointer border-none bg-transparent p-0 font-sans text-xs text-primary"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
      <label className="mb-5 flex cursor-pointer items-center gap-2.5 font-sans text-[13px] text-text-2">
        <Checkbox checked={state.agreed} onChange={(e) => update({ agreed: e.target.checked })} />
        I agree to the terms of giving
      </label>
    </div>
  )
}
