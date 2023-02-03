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
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { HBWorkflowHistory } from './containers/HBWorkflowHistory'
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

export type MenuType = {
  actionTitle: string
  color?: string
  icon?: HBIconType
  nextStateId?: string
  reasons?: string
  useComment?: boolean
  useReasons?: boolean
}

export type HBWorkflowProps = {
  entityId: string
  machineCode: number
  stateCode?: string
  factor: string
  body?: object
  disabled?: boolean
  onChangeState?: (stateCode: number) => void
  useChangeState?: UseMutation<
    MutationDefinition<
      PostAdminCatalogBrandsChangeStateApiArg,
      BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, {}>,
      never,
      ApiResult,
      'api'
    >
  >
  useGetStateList?: UseQuery<
    QueryDefinition<
      StateListMachineModelArg,
      BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, {}>,
      never,
      TransitionResultApiResult,
      'api'
    >
  >
  useGetState?: UseQuery<
    QueryDefinition<
      StateMachineModelArg,
      BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, {}>,
      never,
      StateResultApiResult,
      'api'
    >
  >
}

export type TransitionModel = {
  entityId: string
  stateMachineCode: number
}

export default function HBWorkflow({
  entityId,
  machineCode,
  stateCode,
  factor,
  onChangeState,
  useGetStateList,
  useGetState,
  useChangeState,
  body,
  disabled,
}: HBWorkflowProps) {
  const { formatMessage } = useIntl()
  const [showHistory, setShowHistory] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [showModal, setShowModal] = useState<{
    open: boolean
    item?: MenuType
  }>()
  const openStatePopover = Boolean(anchorEl)
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
  const [updateState, { isLoadingChange }] = useChangeState?.()

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
        refetchState()
        onChangeState?.(+item.nextStateId!)
        openToast({
          message: formatMessage(workflowMessages.successChange),
          type: 'success',
        })
      }
    })
  }

  const onPopupWorkflowClick = (item: MenuType) => {
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

  return (
    <>
      <Stack spacing={6} direction="row" alignItems="center" py={2}>
        <Typography variant="body1">{formatMessage(workflowMessages.statusLabel)}</Typography>
        <Box
          py={2}
          px={4}
          sx={{
            borderRadius: ({ spacing }) => spacing(2),
            backgroundColor: state?.color ? `${state?.color}73` : 'grey.100',
          }}
        >
          <Typography variant="caption" sx={{ color: state?.color ?? 'common.black' }}>
            {state?.title}
          </Typography>
        </Box>
        <Box>
          <HBButton
            variant="text"
            size="small"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              setAnchorEl(event.currentTarget)
            }}
            disabled={!entityId || disabled}
            loading={isLoadingChange}
            sx={{
              minWidth: 80,
              [`&.${buttonClasses.text}`]: {
                color: 'info.main',
              },
              [`&.${buttonClasses.disabled}`]: {
                bgcolor: 'background.paper',
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
              {transitions?.map((item: MenuType, index: number) => {
                return (
                  <MenuItem onClick={() => onPopupWorkflowClick(item)} key={index}>
                    <ListItemText sx={{ minWidth: 150 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <HBIcon
                          type={item?.icon ? (item.icon as HBIconType) : 'angleLeft'}
                          size="small"
                        />
                        <Typography
                          variant="subtitle2"
                          sx={{ color: item?.color ?? 'common.black' }}
                        >
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

              <MenuItem
                onClick={() => {
                  setShowHistory(true)
                  setAnchorEl(null)
                }}
              >
                <ListItemText>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <HBIcon type="historyAlt" size="small" />
                    <Typography variant="subtitle2">
                      {formatMessage(workflowMessages.workflowHistoryTitle)}
                    </Typography>
                  </Stack>
                </ListItemText>
              </MenuItem>
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
      <HBWorkflowHistory
        open={showHistory}
        onClose={() => setShowHistory(false)}
        entityId={entityId}
      />
    </>
  )
}
