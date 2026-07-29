import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useCampaign } from '../../hooks/useCampaign'
import { useDonationFlow } from '../../hooks/useDonationFlow'
import { useCreateDonation } from '../../hooks/useDonation'
import { Skeleton } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'
import { StepIndicator } from '../../components/ui/StepIndicator'
import { AmountStep } from '../../components/donation/AmountStep'
import { FEE_RATE, computeAmount } from '../../lib/donationFlow'
import { DetailsStep } from '../../components/donation/DetailsStep'
import { PaymentStep } from '../../components/donation/PaymentStep'
import { ReviewStep } from '../../components/donation/ReviewStep'
import { SummaryRail } from '../../components/donation/SummaryRail'
import * as paymentsApi from '../../api/payments'
import { donorDetailsSchema, cardPaymentSchema } from '../../lib/validators'
import { ApiError } from '../../api/client'

const STEP_LABELS = ['Amount', 'Details', 'Payment', 'Review']

export default function DonationFlow() {
  const { slug = '' } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const campaignQuery = useCampaign(slug)
  const campaign = campaignQuery.data
  const { state, next, back } = useDonationFlow()
  const createDonation = useCreateDonation(slug)

  const [detailsErrors, setDetailsErrors] = useState<Record<string, string>>({})
  const [cardError, setCardError] = useState<string | undefined>()
  const [processing, setProcessing] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  if (campaignQuery.isPending) {
    return (
      <div className="mx-auto max-w-[920px] px-5 sm:px-8 lg:px-12 py-10">
        <Skeleton className="mb-10 h-8 w-full" />
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.5fr_1fr]">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  if (campaignQuery.isError || !campaign) {
    return (
      <div className="mx-auto max-w-[680px] px-5 sm:px-8 lg:px-12 py-24">
        <ErrorState
          title="Campaign not found"
          description="This campaign may have been removed or the link is incorrect."
        />
      </div>
    )
  }

  const amount = computeAmount(state.selectedChip, state.customAmount)
  const fee = Math.round(amount * FEE_RATE)
  const total = state.coverFee ? amount + fee : amount

  function validateDetails(): boolean {
    const result = donorDetailsSchema.safeParse({
      donorName: state.donorName,
      donorEmail: state.donorEmail,
      donorPhone: state.donorPhone,
      donorPan: state.donorPan,
      anonymous: state.anonymous,
    })
    if (result.success) {
      setDetailsErrors({})
      return true
    }
    const errs: Record<string, string> = {}
    for (const issue of result.error.issues) {
      errs[String(issue.path[0])] = issue.message
    }
    setDetailsErrors(errs)
    return false
  }

  function validatePayment(): boolean {
    if (state.method !== 'Card') {
      setCardError(undefined)
      return true
    }
    const result = cardPaymentSchema.safeParse({ cardNumber: state.cardNumber })
    if (result.success) {
      setCardError(undefined)
      return true
    }
    setCardError(result.error.issues[0]?.message)
    return false
  }

  async function handleSubmit() {
    setSubmitError(null)
    if (!state.agreed) {
      setSubmitError('Please agree to the terms of giving to continue.')
      return
    }
    setProcessing(true)
    try {
      const intent = await paymentsApi.createIntent(total, state.method)
      await paymentsApi.confirmPayment(intent.id)
      const donation = await createDonation.mutateAsync({
        amount,
        feeAmount: state.coverFee ? fee : 0,
        frequency: state.frequency,
        method: state.method,
        anonymous: state.anonymous,
        donorName: state.anonymous ? null : state.donorName || null,
        message: state.message || null,
      })
      navigate(`/donation/success/${donation.id}`)
    } catch (err) {
      setSubmitError(
        err instanceof ApiError ? err.message : 'Something went wrong. Please try again.',
      )
    } finally {
      setProcessing(false)
    }
  }

  function handleNext() {
    if (state.step === 2 && !validateDetails()) return
    if (state.step === 3 && !validatePayment()) return
    if (state.step === 4) {
      void handleSubmit()
      return
    }
    next()
  }

  return (
    <div className="mx-auto max-w-[920px] px-5 sm:px-8 lg:px-12 pb-24 pt-10">
      <div className="mb-5 font-sans text-[13.5px] text-text-2">
        Giving to{' '}
        <Link to={`/campaigns/${campaign.slug}`} className="font-semibold text-text no-underline">
          {campaign.title}
        </Link>
      </div>

      <StepIndicator labels={STEP_LABELS} currentStep={state.step} />

      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.5fr_1fr]">
        <div className="min-h-[420px] rounded-[20px] border border-border bg-surface p-8">
          {state.step === 1 && <AmountStep campaign={campaign} />}
          {state.step === 2 && <DetailsStep errors={detailsErrors} />}
          {state.step === 3 && <PaymentStep cardNumberError={cardError} />}
          {state.step === 4 && <ReviewStep campaign={campaign} />}
        </div>

        <div className="lg:sticky lg:top-24">
          <SummaryRail
            amount={amount}
            fee={fee}
            coverFee={state.coverFee}
            step={state.step}
            isFinalStep={state.step === 4}
            processing={processing}
            errorMessage={submitError}
            disabled={state.step === 4 && !state.agreed}
            onNext={handleNext}
            onBack={back}
          />
        </div>
      </div>
    </div>
  )
}
