import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { UseMutateAsyncFunction } from '@tanstack/react-query'

import { Box, Button, HStack, Icon, Stack, useToast } from '@chakra-ui/react'
import { MdPublishedWithChanges } from 'react-icons/md'

import { BehaviorPolicy, DataPolicy, Schema, Script } from '@/api/__generated__'

import { usePolicyChecksStore } from '@datahub/hooks/usePolicyChecksStore.ts'
import { DataHubNodeType, DesignerStatus, DryRunResults } from '@datahub/types.ts'
import { useCreateSchema } from '@datahub/api/hooks/DataHubSchemasService/useCreateSchema.tsx'
import { useCreateScript } from '@datahub/api/hooks/DataHubScriptsService/useCreateScript.tsx'
import { useCreateDataPolicy } from '@datahub/api/hooks/DataHubDataPoliciesService/useCreateDataPolicy.tsx'
import { useCreateBehaviorPolicy } from '@datahub/api/hooks/DataHubBehaviorPoliciesService/useCreateBehaviorPolicy.tsx'
import { dataHubToastOption } from '@datahub/utils/toast.utils.ts'
import useDataHubDraftStore from '@datahub/hooks/useDataHubDraftStore.ts'

interface Mutate<T> {
  type: DataHubNodeType
  payload: T
  mutation: UseMutateAsyncFunction<T, unknown, T>
}
type ValidMutate = Mutate<Schema> | Mutate<Script> | Mutate<DataPolicy> | Mutate<BehaviorPolicy>

const resourceReducer =
  <T extends { id: string }>(type: DataHubNodeType) =>
  (accumulator: T[], result: DryRunResults<T, never>) => {
    if (result.node.type !== type) return accumulator
    if (!result.data) return accumulator
    const { id } = result.data
    if (!id) return accumulator

    const allIds = accumulator.map((resource) => resource.id)
    if (allIds.includes(id)) return accumulator

    accumulator.push(result.data)
    return accumulator
  }

export const ToolboxPublish: FC = () => {
  const { t } = useTranslation('datahub')
  const { report } = usePolicyChecksStore()
  const { status: statusDraft } = useDataHubDraftStore()
  const createSchema = useCreateSchema()
  const createScript = useCreateScript()
  const createDataPolicy = useCreateDataPolicy()
  const createBehaviorPolicy = useCreateBehaviorPolicy()
  const toast = useToast()

  const isEditEnabled =
    import.meta.env.VITE_FLAG_DATAHUB_EDIT_POLICY_ENABLED === 'true' || statusDraft === DesignerStatus.DRAFT
  const isValid = !!report && report.length >= 1 && report?.every((e) => !e.error)

  const handleMutation = async (promise: Promise<ValidMutate>, type: DataHubNodeType) => {
    try {
      const data = await promise
      toast({
        ...dataHubToastOption,
        title: t('error.publish.title', { source: type }),
        description: t('error.publish.description', { source: type }),
        status: 'success',
      })
      return Promise.resolve(data)
    } catch (error) {
      let message
      if (error instanceof Error) message = error.message
      else message = String(error)
      toast({
        ...dataHubToastOption,
        title: t('error.publish.error', { source: type }),
        description: message,
        status: 'error',
      })
      return Promise.reject(error)
    }
  }

  const handlePublish = () => {
    if (!report) return

    const payload = [...report].pop()
    if (!payload) return

    const { data, resources } = payload

    const allSchemas =
      resources?.reduce(resourceReducer<Schema>(DataHubNodeType.SCHEMA), []).map<Mutate<Schema>>((e) => ({
        type: DataHubNodeType.SCHEMA,
        payload: e,
        mutation: createSchema.mutateAsync,
      })) || []

    const allScripts =
      resources?.reduce(resourceReducer<Script>(DataHubNodeType.FUNCTION), []).map<Mutate<Script>>((e) => ({
        type: DataHubNodeType.FUNCTION,
        payload: e,
        mutation: createScript.mutateAsync,
      })) || []

    const promises = [...allSchemas, ...allScripts].map((request) => {
      return handleMutation(
        // @ts-ignore TODO[NVL] Weird! Check the type mismatch
        request.mutation(request.payload),
        request.type
      )
    })

    Promise.all(promises)
      .then(() => {
        if (payload.node.type === DataHubNodeType.DATA_POLICY) {
          const policy: Mutate<DataPolicy> = {
            type: DataHubNodeType.DATA_POLICY,
            payload: data as DataPolicy,
            mutation: createDataPolicy.mutateAsync,
          }
          handleMutation(
            // @ts-ignore TODO[NVL] Weird! Check the type mismatch
            policy.mutation(policy.payload),
            DataHubNodeType.DATA_POLICY
          )
        } else if (payload.node.type === DataHubNodeType.BEHAVIOR_POLICY) {
          const policy: Mutate<BehaviorPolicy> = {
            type: DataHubNodeType.BEHAVIOR_POLICY,
            payload: data as BehaviorPolicy,
            mutation: createBehaviorPolicy.mutateAsync,
          }
          handleMutation(
            // @ts-ignore TODO[NVL] Weird! Check the type mismatch
            policy.mutation(policy.payload),
            DataHubNodeType.BEHAVIOR_POLICY
          )
        }
      })
      .catch((e) => {
        return toast({
          ...dataHubToastOption,
          title: t('error.publish.error', { source: DataHubNodeType.DATA_POLICY }),
          description: e.toString(),
          status: 'error',
        })
      })
  }

  return (
    <Stack maxW={500}>
      <HStack>
        <Box>
          <Button
            leftIcon={<Icon as={MdPublishedWithChanges} boxSize="24px" />}
            onClick={handlePublish}
            isDisabled={!isValid || !isEditEnabled}
            isLoading={createSchema.isLoading}
          >
            {t('workspace.toolbar.policy.publish')}
          </Button>
        </Box>
      </HStack>
    </Stack>
  )
}
