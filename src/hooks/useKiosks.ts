import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { listKiosks, pairKiosk } from '../api/kiosks'

export function useKiosks() {
  return useQuery({
    queryKey: ['kiosks', 'list'],
    queryFn: () => listKiosks(),
  })
}

export function usePairKiosk() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (code: string) => pairKiosk(code),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['kiosks', 'list'] }),
  })
}
