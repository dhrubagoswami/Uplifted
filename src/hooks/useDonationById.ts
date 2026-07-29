import { useQuery } from '@tanstack/react-query'
import { getDonation } from '../api/donations'

export function useDonationById(id: string) {
  return useQuery({
    queryKey: ['donations', 'detail', id],
    queryFn: () => getDonation(id),
    enabled: !!id,
  })
}
