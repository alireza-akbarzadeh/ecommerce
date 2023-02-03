import {
  PostAdminCatalogBrandsChangeStateApiArg,
  StateResultApiResult,
  TransitionResultApiResult,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { ApiResult } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBButton, HBIcon, HBIconType, openToast } from '@hasty-bazar/core'
import {
  Box,
  buttonClasses,
  ListItemText,
  MenuItem,
  MenuList,
  Popover,
  Stack,
  Typography,
} from '@mui/material'
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  MutationDefinition,
  QueryDefinition,
} from '@reduxjs/toolkit/dist/query'
import { UseMutation, UseQuery } from '@reduxjs/toolkit/dist/query/react/buildHooks'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { MenuType } from './HBWorkflow'
import workflowMessages from './HBWorkflow.messages'
import HBWorkflowConfirm from './HBWorkflowConfirm'

export type StateListMachineModelArg = {
  entityId: string
  stateMachineCode: string
  factor: string
  'client-name': any
  'client-version': any
}

export type StateMachineModelArg = {
  stateCode: string
  stateMachineCode: string
  factor: string
  'client-name': any
  'client-version': any
}

export type HBWorkflowProps = {
  entityId: string
  machineCode: number
  stateCode?: string
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
  useGetState: UseQuery<
    QueryDefinition<
      StateMachineModelArg,
      BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, {}>,
      never,
      StateResultApiResult,
      'api'
    >
  >
  setLoading?: Dispatch<SetStateAction<boolean>>
}

export type TransitionModel = {
  entityId: string
  stateMachineCode: number
}

export default function HBWorkflowInput({
  entityId,
  machineCode,
  stateCode,
  factor,
  onChangeState,
  useGetStateList,
  useGetState,
  useChangeState,
  body,
  setLoading,
}: HBWorkflowProps) {
  const { formatMessage } = useIntl()
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const openStatePopover = Boolean(anchorEl)
  const [showModal, setShowModal] = useState<{
    open: boolean
    item?: MenuType
  }>()

  //@ts-ignore
  const { data: { data: { transitions = [] } = {} } = {}, refetch: refetchList } =
    useGetStateList?.(
      {
        'client-name': 'vendor',
        'client-version': '1.0.0',
        entityId,
        stateMachineCode: String(machineCode),
        factor,
      },
      { skip: !entityId },
    )

  //@ts-ignore
  const { data: { data: state } = {}, refetch: refetchState } = useGetState?.(
    {
      'client-name': 'vendor',
      'client-version': '1.0.0',
      stateCode: stateCode!,
      stateMachineCode: String(machineCode),
      factor,
    },
    { skip: !stateCode },
  )

  //@ts-ignore
  const [updateState, { isLoading: isLoadingChangeState }] = useChangeState()

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
      'client-name': 'vendor',
      'client-version': '1.0.0',
      // @ts-ignore
      ...(body ? { ...body } : {}),
      stateMachineModel: {
        entityId,
        nextStateId: item.nextStateId,
        stateMachineCode: String(machineCode),
        factor,
        reason,
        comment,
      },
    })
      .unwrap()
      .then((res: any) => {
        if (res?.success) {
          refetchList()
          refetchState()
          onChangeState?.(+item.nextStateId!)
          if (res?.data?.match !== undefined) {
            openToast({
              message: res?.data?.messsage,
              type: res?.data?.match === false ? 'warning' : 'success',
            })
          } else {
            openToast({
              message: formatMessage(workflowMessages.successChange),
              type: 'success',
            })
          }
        }
      })
  }

  const onPopupWorkflowClick = (item: any) => {
    if (item?.useReasons) {
      setAnchorEl(null)
      setShowModal({ open: true, item })
      return
    }

    handleWorkflowClick({ item })
    setAnchorEl(null)
  }

  const handleConfirm = (reason: string, comment?: string) => {
    handleWorkflowClick({ item: showModal?.item!, reason, comment })
    setShowModal({ open: false, item: undefined })
  }

  useEffect(() => {
    setLoading?.(isLoadingChangeState)
  }, [isLoadingChangeState])

  return (
    <Stack justifyContent="space-between" direction="row" alignItems="center">
      <Stack direction="row" alignItems="center" spacing={2}>
        {state?.icon ? <HBIcon type={state?.icon as HBIconType} /> : <Box />}
        <Typography variant="caption" sx={{ color: state?.color ?? 'common.black' }}>
          {state?.title}
        </Typography>
      </Stack>

      <Box>
        <HBButton
          variant="text"
          size="small"
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            setAnchorEl(event.currentTarget)
          }}
          disabled={!entityId}
          loading={isLoadingChangeState}
          sx={{
            minWidth: 80,
            [`&.${buttonClasses.text}`]: {
              color: 'info.main',
            },
          }}
        >
          {formatMessage(workflowMessages.changeStatus)}
        </HBButton>
        <Popover
          open={openStatePopover}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
        >
          <MenuList component="nav">
            {transitions?.map((item: any, index: number) => {
              return (
                <MenuItem onClick={() => onPopupWorkflowClick(item)} key={index}>
                  <ListItemText sx={{ minWidth: 150 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <HBIcon
                        type={item?.icon ? (item.icon as HBIconType) : 'angleLeft'}
                        size="small"
                      />
                      <Typography variant="subtitle2" sx={{ color: item?.color ?? 'common.black' }}>
                        {item.actionTitle}
                      </Typography>
                    </Stack>
                  </ListItemText>
                </MenuItem>
              )
            })}
            {transitions?.length === 0 && (
              <MenuItem onClick={() => setAnchorEl(null)}>
                <ListItemText>
                  <Typography variant="subtitle2" sx={{ color: 'common.black' }}>
                    {formatMessage(workflowMessages.workflowNoStatus)}
                  </Typography>
                </ListItemText>
              </MenuItem>
            )}
          </MenuList>
        </Popover>
      </Box>
      {showModal?.open && (
        <HBWorkflowConfirm
          open={showModal.open}
          onClose={() => setShowModal({ open: false, item: undefined })}
          onConfirm={handleConfirm}
          reasons={showModal.item?.reasons}
        />
      )}
    </Stack>
  )
}
