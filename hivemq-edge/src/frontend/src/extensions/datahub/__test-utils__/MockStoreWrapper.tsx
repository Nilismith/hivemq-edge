import { FC, useEffect } from 'react'

import useDataHubDraftStore from '../hooks/useDataHubDraftStore.ts'
import { PolicyCheckState, WorkspaceState } from '../types.ts'
import { usePolicyChecksStore } from '@datahub/hooks/usePolicyChecksStore.ts'
import { ReactFlowProvider } from 'reactflow'

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>
interface MockStoreWrapperConfig {
  initialState?: Optional<WorkspaceState, 'nodes' | 'edges' | 'functions'>
}

interface MockStoreWrapperProps {
  children: React.ReactNode
  config: MockStoreWrapperConfig
}

export const MockStoreWrapper: FC<MockStoreWrapperProps> = ({ config, children }) => {
  const { onAddNodes, onAddEdges } = useDataHubDraftStore()

  useEffect(() => {
    const { initialState } = config
    if (initialState?.nodes)
      onAddNodes(
        initialState.nodes.map((n) => ({
          item: n,
          type: 'add',
        }))
      )
    if (initialState?.edges)
      onAddEdges(
        initialState.edges.map((e) => ({
          item: e,
          type: 'add',
        }))
      )
  }, [config, onAddEdges, onAddNodes])

  return <>{children}</>
}

interface MockChecksStoreWrapperProps {
  children: React.ReactNode
  config: Optional<PolicyCheckState, 'node' | 'status' | 'report'>
}

export const MockChecksStoreWrapper: FC<MockChecksStoreWrapperProps> = ({ config, children }) => {
  const { setNode, setReport } = usePolicyChecksStore()

  useEffect(() => {
    const { node, report } = config
    if (node) setNode(node)

    if (report) setReport(report)
  }, [config, setNode, setReport])

  return (
    <>
      <ReactFlowProvider>{children}</ReactFlowProvider>
    </>
  )
}
