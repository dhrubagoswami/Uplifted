import { useQuery } from '@tanstack/react-query'
import { listDonationsByCampaign } from '../api/donations'

export function useDonationsByCampaign(campaignId: string | undefined) {
  return useQuery({
    queryKey: ['donations', 'byCampaign', campaignId],
    queryFn: () => listDonationsByCampaign(campaignId!),
    enabled: !!campaignId,
  })
}
