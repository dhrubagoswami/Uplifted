import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { useCampaign } from '../../hooks/useCampaign'
import { useCreateDonation } from '../../hooks/useDonation'
import * as paymentsApi from '../../api/payments'
import { Skeleton } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'
import { cn } from '../../lib/cn'

type Step = 'amount' | 'pay' | 'email'

const TILE_AMOUNTS = [500_00, 1_000_00, 2_000_00, 5_000_00]
const NUMPAD_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', '00']
const KEYBOARD_KEYS = 'abcdefghijklmnopqrstuvwxyz'.split('').concat(['@', '.', '⌫'])

export default function KioskGive() {
  const { slug = '' } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const campaignQuery = useCampaign(slug)
  const campaign = campaignQuery.data
  const createDonation = useCreateDonation(slug)

  const [step, setStep] = useState<Step>('amount')
  const [selectedTile, setSelectedTile] = useState(0)
  const [customDigits, setCustomDigits] = useState('')
  const [email, setEmail] = useState('')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (campaignQuery.isPending) {
    return (
      <div className="flex min-h-screen flex-col gap-5 p-6">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (campaignQuery.isError || !campaign) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <ErrorState title="Campaign not found" onRetry={() => campaignQuery.refetch()} />
      </div>
    )
  }

  const amount = customDigits ? parseInt(customDigits, 10) * 100 : TILE_AMOUNTS[selectedTile]
  const displayRupees = Math.round(amount / 100)

  function pressNumpad(key: string) {
    setCustomDigits((d) => (key === '⌫' ? d.slice(0, -1) : (d + key).slice(0, 7)))
  }

  function pressKeyboard(key: string) {
    setEmail((e) => (key === '⌫' ? e.slice(0, -1) : e + key))
  }

  async function handleSimulatedPayment() {
    setError(null)
    setProcessing(true)
    try {
      const intent = await paymentsApi.createIntent(amount, 'Card')
      await paymentsApi.confirmPayment(intent.id)
      setStep('email')
    } catch {
      setError('Payment declined. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  async function finish() {
    setError(null)
    setProcessing(true)
    try {
      const donation = await createDonation.mutateAsync({
        amount,
        feeAmount: 0,
        frequency: 'once',
        method: 'Card',
        anonymous: false,
        donorName: null,
        message: null,
      })
      navigate(`/kiosk/thanks/${donation.id}`)
    } catch {
      setError('Something went wrong. Please ask a staff member for help.')
      setProcessing(false)
    }
  }

  const backHref = step === 'amount' ? `/kiosk/campaign/${campaign.slug}` : undefined

  return (
    <div className="flex min-h-screen flex-col p-6">
      <div className="mb-5 flex items-center gap-4">
        {backHref ? (
          <Link
            to={backHref}
            aria-label="Back"
            className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-surface-2 text-text no-underline"
          >
            <ChevronLeft size={22} />
          </Link>
        ) : (
          <div className="h-14 w-14 flex-shrink-0" />
        )}
        <div className="truncate font-display text-xl font-semibold text-text">{campaign.title}</div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-danger/10 px-4 py-3 font-sans text-sm text-danger">{error}</div>
      )}

      {step === 'amount' && (
        <div className="flex flex-1 flex-col">
          <div className="mb-4 font-sans text-xl font-semibold text-text">Choose an amount</div>
          <div className="mb-5 grid grid-cols-2 gap-3.5">
            {TILE_AMOUNTS.map((a, i) => {
              const active = selectedTile === i && !customDigits
              const units = Math.max(1, Math.round(a / campaign.unitCost))
              return (
                <button
                  key={a}
                  type="button"
                  onClick={() => {
                    setSelectedTile(i)
                    setCustomDigits('')
                  }}
                  className={cn(
                    'flex flex-col items-center justify-center gap-1 rounded-[20px] border-2',
                    active ? 'border-primary bg-surface-2' : 'border-border bg-surface',
                  )}
                  style={{ minHeight: 96 }}
                >
                  <span className="font-display text-2xl font-bold text-text">
                    ₹{Math.round(a / 100).toLocaleString('en-IN')}
                  </span>
                  <span className="font-sans text-[13px] text-text-2">
                    {units} {campaign.impactUnit}
                    {units > 1 ? 's' : ''}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="mb-3 text-center font-display text-4xl font-bold text-text">
            ₹{displayRupees.toLocaleString('en-IN')}
          </div>

          <div className="mb-4 grid grid-cols-3 gap-2.5">
            {NUMPAD_KEYS.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => pressNumpad(key)}
                className="rounded-2xl bg-surface-2 font-sans text-2xl font-semibold text-text"
                style={{ minHeight: 72 }}
              >
                {key}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setStep('pay')}
            disabled={amount <= 0}
            className="mt-auto rounded-[20px] bg-gradient-to-br from-[#6366F1] via-[#A78BFA] to-[#E879F9] font-sans text-xl font-bold text-white disabled:opacity-50"
            style={{ minHeight: 80 }}
          >
            Continue
          </button>
        </div>
      )}

      {step === 'pay' && (
        <div className="flex flex-1 flex-col items-center justify-center gap-6">
          <div className="font-sans text-xl font-semibold text-text">
            Tap card, or scan to pay via UPI
          </div>
          <div className="font-display text-4xl font-bold text-text">
            ₹{displayRupees.toLocaleString('en-IN')}
          </div>
          <div className="relative flex h-[220px] w-[220px] items-center justify-center overflow-hidden rounded-[20px] bg-surface-2">
            <div
              className="h-[70%] w-[70%]"
              style={{
                background: 'repeating-conic-gradient(#fff 0% 25%, transparent 0% 50%) 0 0/14px 14px',
              }}
            />
            <div
              className="motion-safe:animate-[scan-line_1.8s_ease-in-out_infinite_alternate] absolute left-[4%] right-[4%] h-[3px] bg-primary shadow-[0_0_12px_var(--primary)]"
              style={{ top: '4%' }}
            />
          </div>
          <div
            className="flex items-center justify-center rounded-2xl border-[3px] border-dashed border-text-2/30 font-sans text-[13px] text-text-2"
            style={{ width: 140, height: 90 }}
          >
            Tap card here
          </div>
          <button
            type="button"
            onClick={() => void handleSimulatedPayment()}
            disabled={processing}
            className="rounded-[20px] bg-gradient-to-br from-[#6366F1] via-[#A78BFA] to-[#E879F9] px-10 font-sans text-lg font-bold text-white disabled:opacity-60"
            style={{ minHeight: 72 }}
          >
            {processing ? 'Processing…' : 'Simulate payment'}
          </button>
        </div>
      )}

      {step === 'email' && (
        <div className="flex flex-1 flex-col">
          <div className="mb-1.5 font-sans text-xl font-semibold text-text">Email your receipt?</div>
          <div className="mb-4 font-sans text-sm text-text-2">Optional — for an 80G tax receipt.</div>
          <div
            className="mb-4 flex items-center rounded-2xl bg-surface-2 px-4 font-mono text-lg text-text"
            style={{ minHeight: 56 }}
          >
            {email}
            <span className="opacity-40">|</span>
          </div>
          <div className="mb-5 grid grid-cols-10 gap-1.5">
            {KEYBOARD_KEYS.map((key, i) => (
              <button
                key={key + i}
                type="button"
                onClick={() => pressKeyboard(key)}
                className="rounded-lg bg-surface-2 font-sans text-sm font-semibold text-text"
                style={{ minHeight: 44 }}
              >
                {key}
              </button>
            ))}
          </div>
          <div className="mt-auto flex gap-3">
            <button
              type="button"
              onClick={() => void finish()}
              disabled={processing}
              className="flex-1 rounded-[20px] border border-white/20 bg-transparent font-sans text-lg font-semibold text-text disabled:opacity-60"
              style={{ minHeight: 72 }}
            >
              Skip
            </button>
            <button
              type="button"
              onClick={() => void finish()}
              disabled={processing}
              className="flex-1 rounded-[20px] bg-gradient-to-br from-[#6366F1] via-[#A78BFA] to-[#E879F9] font-sans text-lg font-bold text-white disabled:opacity-60"
              style={{ minHeight: 72 }}
            >
              {processing ? 'Sending…' : 'Send receipt'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
