import { useQuery } from '@tanstack/react-query'
import { getRecentDonations } from '../api/donations'

export function useDonationTicker(n = 10) {
  return useQuery({
    queryKey: ['donations', 'recent', n],
    queryFn: () => getRecentDonations(n),
    refetchInterval: 5000,
  })
}
