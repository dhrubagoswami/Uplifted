import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { listDonations, refundDonation } from '../api/donations'
import type { ListDonationsParams } from '../api/donations'

export function useAdminDonationsList(params: ListDonationsParams = {}) {
  return useQuery({
    queryKey: ['donations', 'admin-list', params],
    queryFn: () => listDonations({ ...params, limit: 1000 }),
  })
}

export function useRefundDonation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => refundDonation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donations'] })
    },
  })
}
