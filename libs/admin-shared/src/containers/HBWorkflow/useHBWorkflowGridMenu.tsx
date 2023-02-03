import { GridActionMenuItemProps } from '@hasty-bazar/admin-shared/components'
import {
  PostAdminCatalogBrandsChangeStateApiArg,
  TransitionResultApiResult,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { ApiResult } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBIconType, openToast } from '@hasty-bazar/core'
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  MutationDefinition,
  QueryDefinition,
} from '@reduxjs/toolkit/dist/query'
import { UseMutation, UseQuery } from '@reduxjs/toolkit/dist/query/react/buildHooks'
import { useState } from 'react'
import { useIntl } from 'react-intl'
import { MenuType, StateListMachineModelArg } from './HBWorkflow'
import workflowMessages from './HBWorkflow.messages'

export type HBWorkflowMenuProps = {
  entityId: string
  machineCode: number
  factor: string
  body?: object
  onChangeState?: (stateCode: number) => void
  useChangeState: UseMutation<
    MutationDefinition<
      PostAdminCatalogBrandsChangeStateApiArg,
      BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, {}>,
      never,
      ApiResult,
      'api'
    >
  >
  useGetStateList: UseQuery<
    QueryDefinition<
      StateListMachineModelArg,
      BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, {}>,
      never,
      TransitionResultApiResult,
      'api'
    >
  >
}

export type TransitionModelMenu = {
  entityId: string
  stateMachineCode: number
}

export default function useHBWorkflowGridMenu({
  entityId,
  machineCode,
  factor,
  onChangeState,
  useGetStateList,
  useChangeState,
  body,
}: HBWorkflowMenuProps) {
  const { formatMessage } = useIntl()
  const [showModal, setShowModal] = useState<{
    open: boolean
    item?: MenuType
  }>()

  //@ts-ignore
  const { data: { data: { transitions = [] } = {} } = {}, refetch: refetchList } =
    useGetStateList?.(
      {
        'client-name': 'admin',
        'client-version': '1.0.0',
        entityId,
        stateMachineCode: String(machineCode),
        factor,
      },
      { skip: !entityId },
    )

  //@ts-ignore
  const [updateState] = useChangeState?.()

  const handleWorkflowClick = ({
    item,
    reason,
    comment,
  }: {
    item: MenuType
    reason?: string
    comment?: string
  }) => {
    updateState({
      'client-name': 'admin',
      'client-version': '1.0.0',
      //@ts-ignore
      ...(body ? { ...body } : {}),
      stateMachineModel: {
        entityId,
        nextStateId: item.nextStateId,
        stateMachineCode: String(machineCode),
        factor,
        reason,
        comment,
      },
    }).then((res: any) => {
      if (res?.data?.success) {
        refetchList()
        onChangeState?.(+item.nextStateId!)
        openToast({
          message: formatMessage(workflowMessages.successChange),
          type: 'success',
        })
      }
    })
  }

  const onWorkflowMenuClick = (item: MenuType) => {
    if (item?.useReasons) {
      setShowModal({ open: true, item })
      return
    }

    handleWorkflowClick({ item })
  }

  const handleConfirm = (reason: string, comment?: string) => {
    handleWorkflowClick({ item: showModal?.item!, reason, comment })
    setShowModal({ open: false, item: undefined })
  }

  const workflowMenuItems = () => {
    const menuItems: GridActionMenuItemProps[] = []
    transitions?.forEach((item: any) => {
      menuItems.push({
        icon: (item?.icon || 'paragraph') as HBIconType,
        label: item?.actionTitle!,
        disabled: false,
        onClick: () => onWorkflowMenuClick(item),
      })
    })

    return menuItems
  }

  return {
    workflowMenuItems,
    showModal,
    confirmModal: handleConfirm,
  }
}
