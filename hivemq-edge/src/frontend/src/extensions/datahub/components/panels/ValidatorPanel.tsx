import { FC, useMemo } from 'react'
import { Node } from 'reactflow'
import { useTranslation } from 'react-i18next'
import { Card, CardBody } from '@chakra-ui/react'

import ErrorMessage from '@/components/ErrorMessage.tsx'

import { MOCK_VALIDATOR_SCHEMA } from '../../api/specs/'
import useDataHubDraftStore from '../../hooks/useDataHubDraftStore.ts'
import { DataHubNodeType, PanelProps, ValidatorData } from '../../types.ts'
import { ReactFlowSchemaForm } from '../helpers/ReactFlowSchemaForm.tsx'

export const ValidatorPanel: FC<PanelProps> = ({ selectedNode, onFormSubmit }) => {
  const { t } = useTranslation('datahub')
  const { nodes } = useDataHubDraftStore()

  const data = useMemo(() => {
    const adapterNode = nodes.find((e) => e.id === selectedNode) as Node<ValidatorData> | undefined
    return adapterNode ? adapterNode.data : null
  }, [selectedNode, nodes])

  if (!data)
    return (
      <ErrorMessage
        type={t('error.elementNotDefined.title') as string}
        message={t('error.elementNotDefined.description', { nodeType: DataHubNodeType.VALIDATOR }) as string}
      />
    )

  return (
    <Card>
      <CardBody>
        <ReactFlowSchemaForm
          schema={MOCK_VALIDATOR_SCHEMA.schema}
          // uiSchema={MOCK_TOPIC_FILTER_SCHEMA.uiSchema}
          formData={data}
          onSubmit={onFormSubmit}
        />
      </CardBody>
    </Card>
  )
}
