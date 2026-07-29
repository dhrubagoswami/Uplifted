import { useQuery } from '@tanstack/react-query'
import * as analyticsApi from '../api/analytics'
import type { RevenueRange } from '../types'

export function useDashboardKpis() {
  return useQuery({
    queryKey: ['analytics', 'kpis'],
    queryFn: () => analyticsApi.getDashboardKpis(),
  })
}

export function useRevenueSeries(range: RevenueRange) {
  return useQuery({
    queryKey: ['analytics', 'revenue', range],
    queryFn: () => analyticsApi.getRevenueSeries(range),
  })
}

export function useChannelSplit() {
  return useQuery({
    queryKey: ['analytics', 'channelSplit'],
    queryFn: () => analyticsApi.getChannelSplit(),
  })
}

export function useFunnel() {
  return useQuery({
    queryKey: ['analytics', 'funnel'],
    queryFn: () => analyticsApi.getFunnel(),
  })
}

export function useTopCampaigns(n = 5) {
  return useQuery({
    queryKey: ['analytics', 'topCampaigns', n],
    queryFn: () => analyticsApi.getTopCampaigns(n),
  })
}

export function useRetention() {
  return useQuery({
    queryKey: ['analytics', 'retention'],
    queryFn: () => analyticsApi.getRetention(),
  })
}
