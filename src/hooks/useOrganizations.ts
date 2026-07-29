import { useQuery } from '@tanstack/react-query'
import { getOrganization, getOrganizationCampaigns, listOrganizations } from '../api/organizations'
import type { ListOrganizationsParams } from '../api/organizations'

export function useOrganizations(params: ListOrganizationsParams = {}) {
  return useQuery({
    queryKey: ['organizations', 'list', params],
    queryFn: () => listOrganizations(params),
  })
}

export function useOrganization(slug: string) {
  return useQuery({
    queryKey: ['organizations', 'detail', slug],
    queryFn: () => getOrganization(slug),
    enabled: !!slug,
  })
}

export function useOrganizationCampaigns(orgId: string | undefined) {
  return useQuery({
    queryKey: ['organizations', 'campaigns', orgId],
    queryFn: () => getOrganizationCampaigns(orgId!),
    enabled: !!orgId,
  })
}
