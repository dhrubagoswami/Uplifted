import { CreditCard } from 'lucide-react'
import { useCurrency } from '../../hooks/useCurrency'
import { Button } from '../ui/Button'
import { Spinner } from '../ui/Spinner'

interface SummaryRailProps {
  amount: number
  fee: number
  coverFee: boolean
  step: number
  isFinalStep: boolean
  processing: boolean
  errorMessage?: string | null
  disabled?: boolean
  onNext: () => void
  onBack: () => void
}

export function SummaryRail({
  amount,
  fee,
  coverFee,
  step,
  isFinalStep,
  processing,
  errorMessage,
  disabled,
  onNext,
  onBack,
}: SummaryRailProps) {
  const { format } = useCurrency()
  const total = coverFee ? amount + fee : amount

  return (
    <div className="flex flex-col gap-4 rounded-[18px] border border-border bg-surface p-5.5">
      <div className="font-sans text-xs font-semibold uppercase tracking-[0.06em] text-text-2">
        Order summary
      </div>
      <div className="flex justify-between font-sans text-sm text-text">
        <span>Donation</span>
        <span className="tabular-nums">{format(amount)}</span>
      </div>
      {coverFee && (
        <div className="flex justify-between font-sans text-sm text-text-2">
          <span>Transaction fee</span>
          <span className="tabular-nums">{format(fee)}</span>
        </div>
      )}
      <div className="flex justify-between border-t border-border pt-3.5 font-sans text-base font-bold text-text">
        <span>Total</span>
        <span className="font-display tabular-nums">{format(total)}</span>
      </div>

      {errorMessage && (
        <div className="rounded-lg bg-danger/10 px-3 py-2 font-sans text-xs text-danger">
          {errorMessage}
        </div>
      )}

      <Button onClick={onNext} disabled={processing || disabled} className="mt-1 w-full">
        {processing ? (
          <>
            <Spinner size={15} />
            Processing…
          </>
        ) : (
          <>
            {isFinalStep && <CreditCard size={15} />}
            {isFinalStep ? `Give ${format(total)}` : 'Continue'}
          </>
        )}
      </Button>

      {step > 1 && !processing && (
        <button
          type="button"
          onClick={onBack}
          className="cursor-pointer border-none bg-transparent p-1 font-sans text-sm font-medium text-text-2"
        >
          ← Back
        </button>
      )}
    </div>
  )
}
