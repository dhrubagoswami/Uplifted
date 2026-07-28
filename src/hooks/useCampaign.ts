import { useQuery } from '@tanstack/react-query'
import { getCampaign } from '../api/campaigns'

export function useCampaign(slug: string) {
  return useQuery({
    queryKey: ['campaigns', 'detail', slug],
    queryFn: () => getCampaign(slug),
    enabled: !!slug,
  })
}
