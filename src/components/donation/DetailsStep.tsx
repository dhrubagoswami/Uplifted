import { useDonationFlow } from '../../hooks/useDonationFlow'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { Checkbox } from '../ui/Checkbox'

interface DetailsStepProps {
  errors: Partial<Record<'donorEmail' | 'donorPhone' | 'donorPan', string>>
}

export function DetailsStep({ errors }: DetailsStepProps) {
  const { state, update } = useDonationFlow()

  return (
    <div>
      <h2 className="mb-6 font-display text-2xl font-semibold text-text">Your details</h2>
      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="donorName" className="mb-1.5 block font-sans text-[13px] text-text-2">
            Full name
          </label>
          <Input
            id="donorName"
            value={state.donorName}
            onChange={(e) => update({ donorName: e.target.value })}
            disabled={state.anonymous}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="donorEmail" className="mb-1.5 block font-sans text-[13px] text-text-2">
              Email
            </label>
            <Input
              id="donorEmail"
              type="email"
              value={state.donorEmail}
              onChange={(e) => update({ donorEmail: e.target.value })}
              error={!!errors.donorEmail}
            />
            {errors.donorEmail && (
              <div className="mt-1 font-sans text-xs text-danger">{errors.donorEmail}</div>
            )}
          </div>
          <div>
            <label htmlFor="donorPhone" className="mb-1.5 block font-sans text-[13px] text-text-2">
              Phone
            </label>
            <Input
              id="donorPhone"
              value={state.donorPhone}
              onChange={(e) => update({ donorPhone: e.target.value.replace(/[^0-9]/g, '') })}
              error={!!errors.donorPhone}
              inputMode="numeric"
            />
            {errors.donorPhone && (
              <div className="mt-1 font-sans text-xs text-danger">{errors.donorPhone}</div>
            )}
          </div>
        </div>
        <div>
          <label htmlFor="donorPan" className="mb-1.5 block font-sans text-[13px] text-text-2">
            PAN (optional, for 80G receipt)
          </label>
          <Input
            id="donorPan"
            value={state.donorPan}
            onChange={(e) => update({ donorPan: e.target.value.toUpperCase() })}
            error={!!errors.donorPan}
            className="font-mono"
            maxLength={10}
          />
          {errors.donorPan && (
            <div className="mt-1 font-sans text-xs text-danger">{errors.donorPan}</div>
          )}
        </div>

        <label className="flex cursor-pointer items-center gap-2.5 rounded-xl bg-surface-2 p-3.5 font-sans text-sm font-medium text-text">
          <Checkbox
            checked={state.anonymous}
            onChange={(e) => update({ anonymous: e.target.checked })}
          />
          Give anonymously
        </label>
        {state.anonymous && (
          <div className="-mt-2 font-sans text-xs text-text-2">
            You'll appear as Anonymous. Your receipt still comes to you.
          </div>
        )}

        <Textarea
          value={state.message}
          onChange={(e) => update({ message: e.target.value })}
          placeholder="Optional message to the organizer"
          rows={3}
        />
      </div>
    </div>
  )
}
