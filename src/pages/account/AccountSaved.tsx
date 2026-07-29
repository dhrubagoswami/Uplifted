import { Link } from 'react-router-dom'
import { useSavedCampaigns } from '../../hooks/useAccount'
import { useOrganizations } from '../../hooks/useOrganizations'
import { CampaignCard } from '../../components/campaign/CampaignCard'
import { Skeleton } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'
import { EmptyState } from '../../components/ui/EmptyState'
import { Button } from '../../components/ui/Button'

export default function AccountSaved() {
  const savedQuery = useSavedCampaigns()
  const orgsQuery = useOrganizations({ limit: 20 })

  const orgNameById = new Map((orgsQuery.data?.data ?? []).map((o) => [o.id, o.name]))
  const saved = savedQuery.data ?? []

  return (
    <div>
      <h1 className="mb-6 font-display text-[28px] font-semibold text-text">Saved campaigns</h1>

      {savedQuery.isPending && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[380px] w-full rounded-2xl" />
          ))}
        </div>
      )}

      {savedQuery.isError && (
        <ErrorState title="Couldn't load saved campaigns" onRetry={() => savedQuery.refetch()} />
      )}

      {!savedQuery.isPending && !savedQuery.isError && saved.length === 0 && (
        <EmptyState
          title="No saved campaigns yet"
          description="Tap the save icon on a campaign to keep it here."
          action={
            <Link to="/campaigns" className="no-underline">
              <Button size="sm" className="mt-1.5">
                Browse campaigns
              </Button>
            </Link>
          }
        />
      )}

      {!savedQuery.isPending && !savedQuery.isError && saved.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((c) => (
            <CampaignCard key={c.id} campaign={c} orgName={orgNameById.get(c.orgId) ?? ''} />
          ))}
        </div>
      )}
    </div>
  )
}
