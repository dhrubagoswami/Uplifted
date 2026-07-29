import { useQuery } from '@tanstack/react-query'
import { getCampaignById } from '../api/campaigns'

export function useCampaignById(id: string | undefined) {
  return useQuery({
    queryKey: ['campaigns', 'detailById', id],
    queryFn: () => getCampaignById(id!),
    enabled: !!id,
  })
}
