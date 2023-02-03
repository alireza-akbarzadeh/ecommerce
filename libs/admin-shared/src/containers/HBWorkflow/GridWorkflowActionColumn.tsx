import { HBWorkflowConfirm, MenuType } from '@hasty-bazar/admin-shared/containers'
import workflowMessages from '@hasty-bazar/admin-shared/containers/HBWorkflow/HBWorkflow.messages'
import {
  PostAdminCatalogBrandsChangeStateApiArg,
  TransitionResultApiResult,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { ApiResult } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { GetAdminIdrRolesGetTransitionByEntityIdAndStateMachineCodeFactorApiArg } from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { HBIcon, HBIconButton, HBIconType, openToast } from '@hasty-bazar/core'
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListSubheader,
  Popover,
  Typography,
} from '@mui/material'
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  MutationDefinition,
  QueryDefinition,
} from '@reduxjs/toolkit/dist/query'
import { UseLazyQuery, UseMutation } from '@reduxjs/toolkit/dist/query/react/buildHooks'
import { ICellRendererParams } from 'ag-grid-community'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { GridActionMenuItemProps } from '../../components/HBDataGridActionColumn/GridActionColumn'
import { HBWorkflowHistory } from './containers/HBWorkflowHistory'

export type GridWorkflowActionMenuItemProps = {
  label: string
  icon?: HBIconType
  onClick?: () => void
  disabled?: boolean
}

export type GridWorkflowActionMenuProps = {
  label: string
  children: GridWorkflowActionMenuItemProps[]
  id?: string
}

export interface GridWorkflowActionColumnProps extends ICellRendererParams {
  menuItems: GridWorkflowActionMenuProps[]
  entityId: string
  factor: string
  stateMachineCode: string
  body?: object
  isAddOrEdit?: boolean
  onChangesState?: () => void
  useChangeState: UseMutation<
    MutationDefinition<
      PostAdminCatalogBrandsChangeStateApiArg,
      BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, {}>,
      never,
      ApiResult,
      'api'
    >
  >
  useLazyGetStateList: UseLazyQuery<
    QueryDefinition<
      GetAdminIdrRolesGetTransitionByEntityIdAndStateMachineCodeFactorApiArg,
      BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, {}>,
      never,
      TransitionResultApiResult,
      'api'
    >
  >
}

export default function GridWorkflowActionColumn({
  menuItems,
  entityId,
  factor,
  stateMachineCode,
  useLazyGetStateList,
  useChangeState,
  onChangesState,
  body,
  isAddOrEdit = false,
}: GridWorkflowActionColumnProps) {
  const { formatMessage } = useIntl()
  const [showHistory, setShowHistory] = useState(false)
  const [menuItemList, setMenuItemList] = useState(menuItems || [])
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

  const [getWorkflowList] = useLazyGetStateList()
  const [updateState] = useChangeState()
  const [showModal, setShowModal] = useState<{
    open: boolean
    item?: MenuType
  }>()

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
        stateMachineCode,
        factor,
        reason,
        comment,
      },
    }).then((res: any) => {
      if (res?.data?.success) {
        onChangesState?.()
        openToast({
          message: formatMessage(workflowMessages.successChange),
          type: 'success',
        })
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
  }

  const handleConfirm = (reason: string, comment?: string) => {
    handleWorkflowClick({ item: showModal?.item!, reason, comment })
    setShowModal({ open: false, item: undefined })
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    getWorkflowList({
      'client-name': 'vendor',
      'client-version': '1.0.0',
      entityId,
      factor,
      stateMachineCode,
    }).then((res) => {
      const { data: { data: { transitions = [] } = {} } = {} } = res
      const menuItemsWorkflow: GridActionMenuItemProps[] = []
      transitions?.forEach((item) => {
        menuItemsWorkflow.push({
          icon: (item?.icon || 'paragraph') as HBIconType,
          label: item.actionTitle!,
          disabled: false,
          onClick: () => onPopupWorkflowClick(item),
        })
      })
      menuItemsWorkflow.push({
        icon: 'historyAlt' as HBIconType,
        label: formatMessage(workflowMessages.workflowHistoryTitle),
        disabled: false,
        onClick: () => {
          setAnchorEl(null)
          setShowHistory(true)
        },
      })

      setMenuItemList([
        ...menuItems,
        {
          label: formatMessage(workflowMessages.workflow),
          children: menuItemsWorkflow || [],
          id: 'workflow',
        },
      ])
    })
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const open = Boolean(anchorEl)

  if (isAddOrEdit) {
    return null
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        alignContent: 'center',
        gap: 0.5,
        color: 'grey.900',
      }}
      onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation()
      }}
    >
      <HBIconButton
        icon="ellipsisV"
        variant="text"
        sx={{ minWidth: 10, mt: 1.5 }}
        onClick={handleClick}
      />

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box sx={{ minWidth: 150, minHeight: 160 }}>
          {menuItemList?.map((item, index) => (
            <List
              key={index}
              sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
              component="nav"
              aria-labelledby="nested-list-subheader"
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  {item.label}
                </ListSubheader>
              }
            >
              {item.children?.map(({ label, icon, onClick, disabled }, index2) => (
                <ListItemButton
                  onClick={() => {
                    handleClose()
                    onClick?.()
                  }}
                  disabled={disabled}
                  key={index2}
                >
                  {icon && (
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      <HBIcon type={icon} size="small" />
                    </ListItemIcon>
                  )}
                  <Typography variant="subtitle2">{label}</Typography>
                </ListItemButton>
              ))}
              {menuItemList.length === 0 && (
                <ListItemButton disabled>
                  <Typography variant="subtitle2">
                    {formatMessage(workflowMessages.workflowNoStatus)}
                  </Typography>
                </ListItemButton>
              )}
            </List>
          ))}
        </Box>
      </Popover>
      {showModal?.open && (
        <HBWorkflowConfirm
          open={showModal.open}
          onClose={() => setShowModal({ open: false, item: undefined })}
          onConfirm={handleConfirm}
          reasons={showModal.item?.reasons}
        />
      )}
      <HBWorkflowHistory
        open={showHistory}
        onClose={() => setShowHistory(false)}
        entityId={entityId}
      />
    </Box>
  )
}
