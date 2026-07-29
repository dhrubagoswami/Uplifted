import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createDonation, type CreateDonationParams } from '../api/donations'
import { getCampaign } from '../api/campaigns'

type CreateDonationInput = Omit<CreateDonationParams, 'campaignId'>

export function useCreateDonation(campaignSlug: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: CreateDonationInput) => {
      // campaigns.create takes an id; look up the slug's id via the cached/served campaign
      const campaign = await getCampaign(campaignSlug)
      return createDonation({ ...params, campaignId: campaign.id })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', 'detail', campaignSlug] })
      queryClient.invalidateQueries({ queryKey: ['donations'] })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
    },
  })
}
