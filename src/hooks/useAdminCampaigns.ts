import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as campaignsApi from '../api/campaigns'
import type { CreateCampaignParams } from '../api/campaigns'
import type { Campaign, CampaignStatus } from '../types'

export function useAdminCampaignsList() {
  return useQuery({
    queryKey: ['campaigns', 'admin-list'],
    queryFn: () => campaignsApi.listCampaigns({ limit: 1000 }),
  })
}

export function useCreateCampaign() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: CreateCampaignParams) => campaignsApi.createCampaign(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
    },
  })
}

export function useUpdateCampaign(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (patch: Partial<Campaign>) => campaignsApi.updateCampaign(id, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
    },
  })
}

export function useUpdateCampaignStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: CampaignStatus }) =>
      campaignsApi.updateCampaignStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
    },
  })
}
