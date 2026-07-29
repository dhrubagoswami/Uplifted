import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as accountApi from '../api/account'
import { getDonorStats } from '../api/donors'
import { listDonationsByDonor } from '../api/donations'

export function useDonorStats(donorId: string | undefined) {
  return useQuery({
    queryKey: ['donors', 'stats', donorId],
    queryFn: () => getDonorStats(donorId!),
    enabled: !!donorId,
  })
}

export function useDonationsByDonor(donorId: string | undefined) {
  return useQuery({
    queryKey: ['donations', 'byDonor', donorId],
    queryFn: () => listDonationsByDonor(donorId!),
    enabled: !!donorId,
  })
}

export function useRecurringGifts() {
  return useQuery({
    queryKey: ['account', 'recurring'],
    queryFn: () => accountApi.listRecurring(),
  })
}

export function usePauseRecurring() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => accountApi.pauseRecurring(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['account', 'recurring'] }),
  })
}

export function useCancelRecurring() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => accountApi.cancelRecurring(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['account', 'recurring'] }),
  })
}

export function useSavedCampaigns() {
  return useQuery({
    queryKey: ['account', 'saved'],
    queryFn: () => accountApi.listSaved(),
  })
}

export function useToggleSaved() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (campaignId: string) => accountApi.toggleSaved(campaignId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['account', 'saved'] }),
  })
}

export function useProfile() {
  return useQuery({
    queryKey: ['account', 'profile'],
    queryFn: () => accountApi.getProfile(),
  })
}
