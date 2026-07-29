import { Link } from 'react-router-dom'
import { useCampaigns } from '../../hooks/useCampaigns'
import { useDonationTicker } from '../../hooks/useDonationTicker'
import { useCurrency } from '../../hooks/useCurrency'
import { DonationTicker } from '../../components/campaign/DonationTicker'
import { Skeleton } from '../../components/ui/Skeleton'

export default function KioskAttract() {
  const { format } = useCurrency()
  const campaignsQuery = useCampaigns({ limit: 1000 })
  const tickerQuery = useDonationTicker(4)

  const totalRaised = (campaignsQuery.data?.data ?? []).reduce((a, c) => a + c.raised, 0)

  return (
    <div
      className="motion-safe:animate-[gradient-drift_14s_ease-in-out_infinite] flex min-h-screen flex-col items-center justify-center gap-10 px-8 py-16 text-white"
      style={{
        background: 'linear-gradient(135deg,#0A120B,#12241A,#1C3628,#0A120B)',
        backgroundSize: '300% 300%',
      }}
    >
      <div className="flex items-center gap-2.5">
        <span className="h-8 w-8 rounded-[9px] bg-gradient-to-br from-[#3F7A5C] via-[#5B9E77] to-[#8FCBA0]" />
        <span className="font-display text-[22px] font-bold">Uplifted</span>
      </div>

      <div className="text-center">
        <div className="mb-3.5 font-sans text-base uppercase tracking-[0.1em] text-white/60">
          Raised so far today
        </div>
        {campaignsQuery.isPending ? (
          <Skeleton className="mx-auto h-20 w-80" />
        ) : (
          <div className="font-display text-[64px] font-bold tracking-[-0.02em] sm:text-[80px]">
            {format(totalRaised)}
          </div>
        )}
      </div>

      <div className="w-full max-w-[420px] [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]">
        <DonationTicker
          title=""
          donations={tickerQuery.data}
          isPending={tickerQuery.isPending}
          rowCount={4}
          maxHeight={220}
        />
      </div>

      <Link
        to="/kiosk/browse"
        className="motion-safe:animate-[pulse-touch_2s_ease-in-out_infinite] rounded-full bg-gradient-to-br from-[#3F7A5C] via-[#5B9E77] to-[#8FCBA0] px-11 py-5 text-center font-sans text-xl font-semibold text-white no-underline shadow-[0_8px_40px_rgba(143,203,160,.4)]"
        style={{ minHeight: 72 }}
      >
        Touch anywhere to begin
      </Link>
    </div>
  )
}
