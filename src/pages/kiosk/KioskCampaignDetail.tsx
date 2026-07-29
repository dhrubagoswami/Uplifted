import { Link, useParams } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { useCampaign } from '../../hooks/useCampaign'
import { ProgressMeter } from '../../components/ui/ProgressMeter'
import { Skeleton } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'

function coverImage(slug: string): string {
  return `https://picsum.photos/seed/${slug}/540/280`
}

export default function KioskCampaignDetail() {
  const { slug = '' } = useParams<{ slug: string }>()
  const campaignQuery = useCampaign(slug)
  const campaign = campaignQuery.data

  if (campaignQuery.isPending) {
    return (
      <div className="flex min-h-screen flex-col gap-5 p-6">
        <Skeleton className="h-[280px] w-full rounded-[20px]" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (campaignQuery.isError || !campaign) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <ErrorState
          title="Campaign not found"
          description="This campaign may no longer be available."
          onRetry={() => campaignQuery.refetch()}
        />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="relative h-[280px] flex-shrink-0">
        <img src={coverImage(campaign.slug)} alt="" className="h-full w-full object-cover" />
        <Link
          to="/kiosk/browse"
          aria-label="Back to browse"
          className="absolute left-5 top-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(8,6,15,0.6)] text-white no-underline"
        >
          <ChevronLeft size={24} />
        </Link>
      </div>

      <div className="flex flex-1 flex-col gap-5 p-6">
        <div className="font-display text-[26px] font-semibold leading-tight text-text">
          {campaign.title}
        </div>
        <ProgressMeter
          goal={campaign.goal}
          raised={campaign.raised}
          unitCost={campaign.unitCost}
          unitLabel={campaign.impactUnit}
          daysLeft={campaign.daysLeft}
          completed={campaign.completed}
        />
        <p className="font-sans text-base leading-relaxed text-text-2">{campaign.story[0]}</p>
      </div>

      <Link
        to={`/kiosk/give/${campaign.slug}`}
        className="mx-6 mb-7 flex items-center justify-center rounded-[20px] bg-gradient-to-br from-[#3F7A5C] via-[#5B9E77] to-[#8FCBA0] text-center font-sans text-xl font-bold text-white no-underline"
        style={{ minHeight: 72, padding: 22 }}
      >
        Give now
      </Link>
    </div>
  )
}
