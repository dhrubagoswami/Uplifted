import { Link } from 'react-router-dom'
import type { Campaign, Category } from '../../types'
import { ProgressMeter } from '../ui/ProgressMeter'
import { Badge } from '../ui/Badge'
import { cn } from '../../lib/cn'

const CATEGORY_COLORS: Record<Category, string> = {
  Education: '#3B82F6',
  Health: '#10B981',
  Water: '#06B6D4',
  Hunger: '#F59E0B',
  Disaster: '#EF4444',
  Animals: '#8B5CF6',
  Environment: '#22C55E',
  'Women & Child': '#EC4899',
}

export interface CampaignCardProps {
  campaign: Campaign
  orgName: string
  variant?: 'grid' | 'featured'
  className?: string
}

function coverImage(slug: string): string {
  return `https://picsum.photos/seed/${slug}/800/450`
}

export function CampaignCard({ campaign, orgName, variant = 'grid', className }: CampaignCardProps) {
  const isFeatured = variant === 'featured'

  return (
    <Link
      to={`/campaigns/${campaign.slug}`}
      className={cn(
        'block h-full overflow-hidden rounded-2xl border border-border bg-surface no-underline transition-all duration-200 hover:-translate-y-[3px] hover:shadow-[0_20px_48px_rgba(20,17,31,.10)] dark:hover:shadow-[0_12px_40px_rgba(0,0,0,.6)]',
        isFeatured ? 'flex' : 'flex flex-col',
        className,
      )}
    >
      <div
        className={cn(
          'relative flex-shrink-0 overflow-hidden bg-surface-2',
          isFeatured ? 'w-[42%] aspect-auto' : 'aspect-video w-full',
        )}
      >
        <img
          src={coverImage(campaign.slug)}
          alt=""
          className="block h-full w-full object-cover"
        />
        <div className="absolute left-4 top-4 flex gap-1.5">
          <Badge color={CATEGORY_COLORS[campaign.category]}>{campaign.category}</Badge>
          {campaign.urgent && <Badge variant="danger">Urgent</Badge>}
        </div>
        {campaign.verified && (
          <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-[rgba(20,17,31,0.55)] px-2.5 py-1.5 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#34D399]" />
            <span className="font-sans text-[11px] font-semibold text-white">Verified</span>
          </div>
        )}
      </div>

      <div className={cn('flex min-w-0 flex-1 flex-col gap-2', isFeatured ? 'p-5' : 'p-4')}>
        <div className="font-sans text-xs text-text-2">{orgName}</div>
        <div
          className={cn(
            'font-display font-semibold leading-tight tracking-[-0.01em] text-text',
            isFeatured ? 'text-[22px]' : 'text-[17px]',
          )}
        >
          {campaign.title}
        </div>
        <div className="mt-auto pt-2">
          <ProgressMeter
            goal={campaign.goal}
            raised={campaign.raised}
            unitCost={campaign.unitCost}
            unitLabel={campaign.impactUnit}
            daysLeft={campaign.daysLeft}
            completed={campaign.completed}
            thin
          />
        </div>
      </div>
    </Link>
  )
}
