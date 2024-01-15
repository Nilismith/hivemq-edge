import { useMutation } from '@tanstack/react-query'
import type { DataPolicy } from '../../__generated__'
import { useHttpClient } from '../useHttpClient/useHttpClient.ts'

export const useCreateDataPolicy = () => {
  const appClient = useHttpClient()

  return useMutation({
    mutationFn: (requestBody: DataPolicy) => {
      return appClient.dataHubDataPolicies.createDataPolicy(requestBody)
    },
  })
}