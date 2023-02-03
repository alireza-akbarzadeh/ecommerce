import { GridWorkflowActionColumn } from '@hasty-bazar/admin-shared/containers'
import {
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  GetRolesResult,
  idrApi,
  useGetAdminIdrRolesQuery,
  usePostAdminIdrRolesChangeStateMutation,
} from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { HBAgGridClasses, HBDataGrigToolbar, HBSelect } from '@hasty-bazar/core'
import { Box, styled, Typography, useTheme } from '@mui/material'
import {
  CheckboxSelectionCallbackParams,
  ColDef,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import HBGrigToolbarItem from 'libs/core/src/components/HBGrigToolbar/components/HBGrigToolbarItem'
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import userPageMessages from '../UserPage.messages'
import GridActionAccessControl from './AccessControlGridAction'
import useRoleGrid from './hooks/useRoleGrid'

export enum RoleStateEnum {
  Draft = 0,
  Sent = 1,
  Publish = 2,
  Block = 3,
}

const RoleStateEnumValue = {
  Admin: 40,
  Customer: 41,
  Vendor: 42,
}

export type RolesDataGridProps = {
  createdBy?: string
  createdOn?: string
  id: string
  modifiedBy?: string
  modifiedOn?: string
  platform?: string
  type?: string
  state?: string
  typeTitle?: string
}
interface UserRoleDataGridProps extends Partial<ICellRendererParams> {
  id?: string
  title?: string
  changeRoles?: () => void
}
type RoleProps = {
  type?: string
  typeTitle?: string
}
const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
  return params.columnApi.getRowGroupColumns().length === 0
}
const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
  return params.columnApi.getRowGroupColumns().length === 0
}
const CellBoxStyle = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  height: '100%',
}))
const UserRoleDataGrid: FC<UserRoleDataGridProps> = ({ id, title, changeRoles, ...props }) => {
  id = id || props?.data?.id
  const { formatMessage } = useIntl()

  const theme = useTheme()
  const [selectedRows, setSelectedRows] = useState<RolesDataGridProps[]>([])
  const gridRef = useRef<HBDataGridClientRef>(null)
  const [totalRows, setTotalRows] = useState<number>()
  const [isAddOrEdit, setIsAddOrEdit] = useState(false)
  const [roles, setRoles] = useState<{ title: string; value: string | number }[]>([])

  const {
    gridLoading,
    removeUserRole,
    gridMenuItems,
    addUsersRole,
    cancelSubmitRole,
    submitUsersRole,
  } = useRoleGrid(id!, gridRef)

  const { data: rolesData } = useGetAdminIdrRolesQuery({
    'client-name': 'hasty-bazar-admin',
    'client-version': '1.0.0',
  })

  useEffect(() => {
    const items =
      rolesData?.data?.items?.map((item: GetRolesResult) => ({
        value: item.type!,
        title: item.typeTitle!,
      })) || []

    setRoles(items)
  }, [rolesData?.data?.items])

  const getMenuItems = useCallback((props: ICellRendererParams) => {
    return gridMenuItems({
      props,
      handleRemoveRole,
    })
  }, [])

  const GridActions = useCallback(
    (props: ICellRendererParams) => {
      return (
        <GridWorkflowActionColumn
          entityId={props?.data?.id}
          factor={props?.data?.type == '1001001' ? '1' : props?.data?.type == '1001003' ? '2' : '3'}
          stateMachineCode={
            props?.data?.type == '1001001' ? '40' : props?.data?.type == '1001003' ? '41' : '42'
          }
          useChangeState={usePostAdminIdrRolesChangeStateMutation}
          useLazyGetStateList={
            idrApi.useLazyGetAdminIdrRolesGetTransitionByEntityIdAndStateMachineCodeFactorQuery
          }
          {...props}
          menuItems={getMenuItems(props)}
          onChangesState={refreshGridData}
          isAddOrEdit={isAddOrEdit}
        />
      )
    },
    [selectedRows, isAddOrEdit],
  )

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: '_actions',
        headerName: '',
        maxWidth: 90,
        minWidth: 90,
        resizable: false,
        sortable: false,
        filter: false,
        suppressAutoSize: true,
        suppressMenu: true,
        cellRenderer: GridActions,
        checkboxSelection: isAddOrEdit ? false : checkboxSelection,
        headerCheckboxSelection: isAddOrEdit ? false : headerCheckboxSelection,
      },
      {
        field: 'typeTitle',
        headerName: formatMessage(userPageMessages.usersRole),
        minWidth: 100,
        filter: 'agTextColumnFilter',
        cellRenderer: ({ setValue, data }: ICellRendererParams) =>
          data?.isAdd ? (
            <CellBoxStyle>
              <HBSelect
                sx={{ width: '100%', height: 30, '& > label': { lineHeight: 1 } }}
                menuItem={roles}
                label=""
                onChange={(e) => setValue!(e.target.value)}
              />
            </CellBoxStyle>
          ) : (
            data.typeTitle
          ),
      },
      {
        field: 'stateName',
        headerName: formatMessage(userPageMessages.usersState),
        filter: false,
      },
      {
        field: 'createdByFullName',
        headerName: formatMessage(userPageMessages.usersCreatedBy),
        filter: false,
        cellRenderer: ({ value }: ICellRendererParams) => (
          <CellBoxStyle>
            <Typography variant="subtitle2" color="info.main">
              {value ?? ''}
            </Typography>
          </CellBoxStyle>
        ),
      },
      {
        field: 'createdOn',
        headerName: formatMessage(userPageMessages.usersCreatedOn),
        filter: false,
        cellRenderer: ({ value }: ICellRendererParams) => (
          <CellBoxStyle sx={{ direction: 'rtl', justifyContent: 'flex-end' }}>
            <Typography variant="subtitle2">
              {value
                ? new Date(value).toLocaleDateString('fa-IR', {
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric',
                  })
                : '-'}
            </Typography>
          </CellBoxStyle>
        ),
      },
      {
        field: 'platform',
        headerName: formatMessage(userPageMessages.usersPort),
        filter: 'agTextColumnFilter',
      },
      {
        field: '',
        headerName: formatMessage(userPageMessages.accessControl),
        filter: 'agTextColumnFilter',
        cellRenderer: ({ data }: ICellRendererParams) => (
          <CellBoxStyle sx={{ direction: 'rtl' }}>
            <GridActionAccessControl selectedValue={data} partyId={id!} />
          </CellBoxStyle>
        ),
      },
    ],
    [roles, isAddOrEdit],
  )
  const classes: HBAgGridClasses = {
    wrapper: {
      backgroundColor: `${theme.palette.common.white} !important`,
      height: 300,
      '& .ag-layout-normal .ag-header': {
        backgroundColor: `${theme.palette.grey[100]} !important`,
        border: 'unset',
      },
      '&>div:last-child': {
        padding: theme.spacing(3),
        borderRadius: 2,
        backgroundColor: theme.palette.grey[100],
      },
      '& div.ag-root-wrapper': {
        border: 'unset',
      },
    },
  }

  const handleAddRole = () => {
    addUsersRole(() => {
      setIsAddOrEdit(true)
    })
  }

  const handleRemoveRole = (roleId?: string) => {
    if (typeof roleId !== 'string' && typeof roleId !== 'number') {
      roleId = undefined
    }
    const row = isAddOrEdit ? gridRef.current!.api.getModel().getRow(0)?.data : selectedRows[0]
    roleId = roleId || row?.type
    removeUserRole({
      roleId,
      callback: () => {
        refreshGridData()
        gridRef.current!.api.deselectAll()
        setSelectedRows([])
        changeRoles?.()
      },
    })
  }
  const handleCancelSubmitRole = () => {
    cancelSubmitRole(() => {
      setIsAddOrEdit(false)
    })
  }
  const handleSubmitRole = async () => {
    submitUsersRole(() => {
      refreshGridData()
      setIsAddOrEdit(false)
      changeRoles?.()
    })
  }

  const handleChangedSelectedRows = (selectedRows: RolesDataGridProps[]) => {
    setSelectedRows(selectedRows)
  }

  const isRowSelectable = useCallback((rowNode: any) => {
    return rowNode.data ? !rowNode.data.isAdd : true
  }, [])
  const toolbarStatus = useMemo(() => {
    const disabledOnSelected = selectedRows.length > 0
    const disabledOnNoSelected = selectedRows.length === 0

    return { disabledOnSelected, disabledOnNoSelected }
  }, [selectedRows])

  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    gridRef.current?.refreshGridData(isClearSearch)
    gridRef.current!.api.deselectAll()
  }, [])

  return (
    <Box mt={props?.data?.id ? 0 : 9} sx={{ height: 362 }}>
      <HBDataGridClient
        actionUrl={id ? `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/IDR/Roles/${id}` : ''}
        rightHeader={
          <Typography variant="h6" color="text.primary">
            {title}
          </Typography>
        }
        columnDefs={columnDefs}
        isRowSelectable={isRowSelectable}
        rowSelection="single"
        ref={gridRef}
        enableRtl
        classes={classes}
        totalRows={totalRows}
        onSelectedChanged={handleChangedSelectedRows}
        suppressLoadingOverlay={!id}
        suppressRowClickSelection={isAddOrEdit}
        GridToolbar={(props) => (
          <HBDataGrigToolbar
            addProps={{
              disabled: toolbarStatus.disabledOnSelected || isAddOrEdit || !id,
              onClick: handleAddRole,
            }}
            deleteProps={{
              disabled: true, // toolbarStatus.disabledOnNoSelected || isAddOrEdit,
              onClick: handleRemoveRole,
            }}
            editProps={{ show: false }}
            moreProps={{
              disabled: isAddOrEdit,
              show: false,
            }}
            refreshProps={{
              show: true,
              onClick: () => refreshGridData(true),
              disabled: isAddOrEdit,
            }}
            statusProps={{ show: false }}
            searchProps={{ inputWidth: 114 }}
            {...props}
          >
            <HBGrigToolbarItem
              icon="times"
              tooltip={formatMessage(phrasesMessages.cancel)}
              disabled={!isAddOrEdit}
              show={isAddOrEdit}
              onClick={handleCancelSubmitRole}
            />
            <HBGrigToolbarItem
              icon="check"
              tooltip={formatMessage(phrasesMessages.confirm)}
              disabled={!isAddOrEdit}
              onClick={handleSubmitRole}
              show={isAddOrEdit}
            />
          </HBDataGrigToolbar>
        )}
      />
    </Box>
  )
}

export default UserRoleDataGrid
