import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Check } from 'lucide-react'
import { useDonationById } from '../../hooks/useDonationById'
import { Skeleton } from '../../components/ui/Skeleton'

const TOTAL_SECONDS = 15
const RADIUS = 28
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function KioskThanks() {
  const { id = '' } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const donationQuery = useDonationById(id)
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS)

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (secondsLeft > 0) return
    navigate('/kiosk', { replace: true })
  }, [secondsLeft, navigate])

  const donation = donationQuery.data
  const dashOffset = CIRCUMFERENCE * (1 - secondsLeft / TOTAL_SECONDS)

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-8 px-10 py-16 text-center text-white"
      style={{ background: 'linear-gradient(135deg,#08060F,#1a1040,#3b1550)' }}
    >
      <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[rgba(52,211,153,0.15)] text-[#34D399]">
        <Check size={34} strokeWidth={2.5} />
      </div>

      {donationQuery.isPending ? (
        <Skeleton className="h-16 w-72 bg-white/10" />
      ) : (
        <div className="font-display text-[36px] font-bold leading-[1.15] sm:text-[44px]">
          {donation ? `You just funded ${donation.unitLabel}` : 'Thank you for your gift'}
        </div>
      )}

      <div className="flex h-[140px] w-[140px] items-center justify-center rounded-2xl bg-white p-3">
        <div
          className="h-full w-full rounded-lg"
          style={{
            background: 'repeating-conic-gradient(#14111F 0% 25%, transparent 0% 50%) 0 0/12px 12px',
          }}
        />
      </div>
      <div className="font-sans text-[15px] text-white/60">Scan for your receipt</div>

      <div className="relative mt-3 h-16 w-16">
        <svg width="64" height="64" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="5" />
          <circle
            cx="32"
            cy="32"
            r={RADIUS}
            fill="none"
            stroke="#818CF8"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 32 32)"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-sans text-base font-semibold">
          {secondsLeft}
        </div>
      </div>
      <div className="font-sans text-[13px] text-white/50">Returning to start</div>
    </div>
  )
}
