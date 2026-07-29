import { useQuery } from '@tanstack/react-query'
import { listDonors, getDonor } from '../api/donors'
import type { ListDonorsParams } from '../api/donors'

export function useDonors(params: ListDonorsParams = {}) {
  return useQuery({
    queryKey: ['donors', 'list', params],
    queryFn: () => listDonors(params),
  })
}

export function useDonor(id: string | undefined) {
  return useQuery({
    queryKey: ['donors', 'detail', id],
    queryFn: () => getDonor(id!),
    enabled: !!id,
  })
}
