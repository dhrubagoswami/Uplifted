import { useQuery } from '@tanstack/react-query'
import { listCampaigns, type ListCampaignsParams } from '../api/campaigns'

export function useCampaigns(params: ListCampaignsParams = {}) {
  return useQuery({
    queryKey: ['campaigns', 'list', params],
    queryFn: () => listCampaigns(params),
  })
}
