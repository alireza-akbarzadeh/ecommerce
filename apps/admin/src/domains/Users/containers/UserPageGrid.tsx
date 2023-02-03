import { HBChangeRecordHistory } from '@hasty-bazar/admin-shared/containers/HBChangeRecordHistory'
import {
  GridFilterFieldType,
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { BusinessTypeEnums } from '@hasty-bazar/admin-shared/core/enums'
import { useAppSelector } from '@hasty-bazar/admin-shared/core/redux/hooks'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { useGetAdminGeneralDataBusinessTypeValueGetAllValuesByBusinessTypeIdQuery } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { usePostAdminIdrPartiesByIdActivationMutation } from '@hasty-bazar/admin-shared/services/idrApi.generated'
import {
  HBAgGridClasses,
  HBAutoComplete,
  HBDataGrigToolbar,
  HBDialog,
  HBTextField,
  MenuItemProps,
  openToast,
} from '@hasty-bazar/core'
import { inputLabelClasses, outlinedInputClasses } from '@mui/material'
import { ColDef, ICellRendererParams } from 'ag-grid-community'
import HBGrigToolbarItem from 'libs/core/src/components/HBGrigToolbar/components/HBGrigToolbarItem'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import { UserRoleDataGrid } from '../containers'
import userPageMessages from '../UserPage.messages'
import useUserGrid from './hooks/useUserGrid'
import UserGridActionColumn from './UserGridActionColumn'

const classes: HBAgGridClasses = {
  wrapper: {
    height: `calc(100vh - 240px)`,
  },
}

export default function UserPageGrid() {
  const gridRef = useRef<HBDataGridClientRef>(null)
  const baseUrl = useAppSelector((state) => state.app.baseUrl)
  const {
    handleRemoveUser,
    checkboxSelection,
    headerCheckboxSelection,
    userGridColumns,
    userGridToolbarMenu,
  } = useUserGrid(gridRef)
  const router = useRouter()
  const { formatMessage } = useIntl()

  const [deleteDialogState, setDeleteDialogState] = useState<{ show: boolean; id?: string }>({
    show: false,
  })
  const [openActive, setOpenActive] = useState(false)
  const [status, setStatus] = useState<boolean>()

  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const [selectedRoles, setSelectedRoles] = useState(-1)
  const [recordChangeHistory, setRecordChangeHistory] = useState({
    show: false,
    entityId: '',
  })

  const actionUrl = useMemo(() => `${baseUrl}/Admin/IDR/parties`, [])
  const toolbarStatus = useMemo(() => {
    const disabledOnSelected = selectedRows.length > 0
    const disabledOnNoSelected = selectedRows.length === 0

    return { disabledOnSelected, disabledOnNoSelected }
  }, [selectedRows])

  const breadcrumbs = [
    {
      url: '/',
      title: formatMessage(phrasesMessages.dashboard),
    },
    {
      url: '#',
      title: formatMessage(userPageMessages.usersTitle),
    },
  ]

  const { data: { data: { items: roleAccountPartyData = [] } = {} } = {} } =
    useGetAdminGeneralDataBusinessTypeValueGetAllValuesByBusinessTypeIdQuery({
      'client-name': 'generalData',
      'client-version': '0',
      businessTypeCode: BusinessTypeEnums.RoleAccountParty,
      pageSize: 1000,
    })

  const gridLoading = (show: boolean) => {
    if (show) {
      gridRef.current!.api.showLoadingOverlay()
    } else {
      gridRef.current!.api.hideOverlay()
    }
  }

  const handleEditUser = (id?: string) => {
    id = typeof id === 'string' ? id : selectedRows[0]?.id
    router.push(`/users/edit/${id}`)
  }

  const navigateToDetails = (id: string) => {
    router.push(`/users/detail/${id}`)
  }

  const handleDeleteUser = useCallback(async () => {
    try {
      const ids = deleteDialogState?.id
        ? [deleteDialogState?.id]
        : selectedRows.map((row) => row.id)
      handleRemoveUser(ids, gridLoading, () => {
        setDeleteDialogState({ show: false, id: undefined })
        refreshGridData()
      })
    } catch (e) {}
  }, [selectedRows, deleteDialogState])

  const GridActions = useCallback((props: ICellRendererParams) => {
    return (
      <UserGridActionColumn
        editUser={handleEditUser}
        navigateToDetails={navigateToDetails}
        showDeleteModal={setDeleteDialogState}
        showHistoryModal={setRecordChangeHistory}
        {...props}
      />
    )
  }, [])

  const columnDefs = useMemo(
    () => [
      {
        field: '_actions',
        headerName: '',
        maxWidth: 110,
        minWidth: 110,
        resizable: false,
        sortable: false,
        filter: false,
        suppressAutoSize: true,
        suppressMenu: true,
        checkboxSelection,
        headerCheckboxSelection,
        showRowGroup: true,
        cellRenderer: 'agGroupCellRenderer',
        pinned: 'right',
        lockPinned: true,
        cellRendererParams: {
          suppressCount: true,
          suppressDoubleClickExpand: true,
          innerRenderer: GridActions,
        },
      },
      ...userGridColumns(),
    ],
    [],
  )

  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    setSelectedRoles(-1)
    gridRef.current?.refreshGridData(isClearSearch)
    gridRef.current!.api.deselectAll()
  }, [])

  const handleChangeStatus = (status: boolean) => {
    setStatus(status)
    setOpenActive(true)
  }

  const [updateStatus] = usePostAdminIdrPartiesByIdActivationMutation()

  const handleChangeActive = useCallback(async () => {
    try {
      const selectedRows = gridRef.current!.api.getSelectedRows()
      const ids = selectedRows.map((row) => row.id)
      let success = 0
      for (const id of ids) {
        const res: any = await updateStatus({
          'client-name': 'hasty-bazar-admin',
          'client-version': '1.0.0',
          id,
          activePartyRoleModel: {
            isActive: !!status,
          },
        })
        if (res?.data?.success) {
          success++
        }
      }
      if (success > 0) {
        openToast({
          message: formatMessage(userPageMessages.successChangeActive, { count: success }),
          type: 'success',
        })
      }
      refreshGridData()
      setStatus(undefined)
      setOpenActive(false)
    } catch (e) {}
  }, [status])

  const handleDownloadGrid = () => {
    gridRef.current!.api.exportDataAsExcel()
  }

  const toolbarMoreItems = useMemo<MenuItemProps[]>(() => {
    const activeCount = selectedRows.filter((row) => row.isActive).length
    const unActiveCount = selectedRows.filter((row) => !row.isActive).length
    const disabledActive = unActiveCount === 0
    const disabledUnActive = activeCount === 0
    const disabledOnNoSelected = selectedRows.length === 0
    return userGridToolbarMenu({
      disabledActive,
      disabledUnActive,
      disabledOnNoSelected,
      handleChangeStatus,
      handleDownloadGrid,
    })
  }, [selectedRows])

  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerCheckboxSelection: true,
      cellRenderer: 'agGroupCellRenderer',
    }
  }, [])

  const handleChangedSelectedRows = (selectedRows: any[]) => {
    setSelectedRows(selectedRows)
  }

  const handleAddUser = () => {
    router.push('/users/add')
  }

  const handleChangedGridActions = (value: number | string, type: 'search' | 'status' | 'role') => {
    if (type === 'status') {
      const filterComponent = gridRef.current!.api.getFilterInstance('isActive')
      filterComponent &&
        filterComponent.setModel({
          type: 'equals',
          filter: value !== -1 ? (value == 1 ? 'true' : 'false') : null,
        })
      gridRef.current!.api.onFilterChanged()
    } else if (type === 'search') {
      if (value) {
        const searchFields: GridFilterFieldType[] = [
          { field: 'FirstName', value: String(value), operator: 'contains' },
          { field: 'LastName', value: String(value), operator: 'contains' },
          { field: 'Mobile', value: String(value), operator: 'contains' },
          { field: 'Email', value: String(value), operator: 'contains' },
          { field: 'NationalCode', value: String(value), operator: 'contains' },
        ]
        gridRef.current!.addFilter({
          id: 'search',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef.current!.removeFilter('search')
      }
    } else if (type === 'role') {
      if (value) {
        gridRef.current!.addFilter({
          id: 'PartyRoles',
          fields: [
            {
              field: 'PartyRoles',
              operator: 'equal',
              value: String(value),
            },
          ],
          type: 'filter',
          addToFilter: false,
        })
      } else {
        gridRef.current!.removeFilter('PartyRoles')
      }
    }
  }

  const roleFilter = useMemo(() => {
    if (selectedRoles !== -1) {
      return selectedRoles
    }
    const roleId = gridRef?.current?.getFilters()?.find((f) => f.id === 'PartyRoles')
      ?.fields[0]?.value
    if (roleId) {
      const role = roleAccountPartyData?.find((r) => r.id == roleId)
      if (role) {
        return {
          id: role.id,
          title: role.title,
        }
      }
    }
    return -1
  }, [gridRef?.current?.getFilters(), selectedRoles])

  return (
    <>
      <HBDataGridClient
        id="parties-grid"
        actionUrl={actionUrl}
        editUrl={'/users/edit/'}
        columnDefs={columnDefs}
        pagination
        paginationPageSize={25}
        rowSelection="multiple"
        enableRtl
        sideBar
        rightHeader={
          <BreadCrumbSection
            title={formatMessage(userPageMessages.usersTitle)}
            breadItems={breadcrumbs}
          />
        }
        classes={classes}
        autoGroupColumnDef={autoGroupColumnDef}
        onSelectedChanged={handleChangedSelectedRows}
        masterDetail
        detailCellRenderer={UserRoleDataGrid}
        detailCellRendererParams={{ title: formatMessage(userPageMessages.usersShowMore) }}
        detailRowAutoHeight
        ref={gridRef}
        GridToolbar={(props) => (
          <HBDataGrigToolbar
            onChange={handleChangedGridActions}
            addProps={{ show: false }}
            deleteProps={{
              disabled: toolbarStatus.disabledOnNoSelected,
              onClick: () => setDeleteDialogState({ show: true }),
            }}
            editProps={{ disabled: selectedRows.length !== 1, onClick: handleEditUser }}
            refreshProps={{ onClick: () => refreshGridData(true) }}
            items={toolbarMoreItems}
            {...props}
          >
            <HBGrigToolbarItem
              icon="plus"
              sx={{ color: (theme) => theme.palette.primary.main }}
              tooltip={formatMessage(phrasesMessages.create)}
              disabled={toolbarStatus.disabledOnSelected}
              onClick={handleAddUser}
            />
            <HBAutoComplete
              value={roleFilter}
              onChange={(event, newValue) => {
                setSelectedRoles(newValue)
                handleChangedGridActions(newValue?.value || '', 'role')
              }}
              options={
                roleAccountPartyData?.map((item) => ({
                  title: String(item.title),
                  value: item.id || 0,
                })) || []
              }
              getOptionLabel={(option: any) => option.title || ''}
              renderInput={(params) => (
                <HBTextField
                  {...params}
                  placeholder={formatMessage(userPageMessages.usersRole)}
                  label={formatMessage(userPageMessages.usersRole)}
                  sx={{
                    height: 33,
                    minWidth: 150,
                    [`& .${inputLabelClasses.root}`]: {
                      top: -4,
                    },
                    [`& .${outlinedInputClasses.root}`]: {
                      height: 33,
                    },
                    [`& .${outlinedInputClasses.input}`]: {
                      position: 'relative',
                      top: -4,
                    },
                  }}
                />
              )}
              size="small"
              disabled={false}
            />
          </HBDataGrigToolbar>
        )}
      />
      <HBDialog
        content={formatMessage(userPageMessages.usersDeleteUserConfirm, {
          userCount: deleteDialogState?.id ? 1 : selectedRows.length,
        })}
        title={formatMessage(userPageMessages.usersDeleteUser)}
        onAccept={handleDeleteUser}
        onReject={() => setDeleteDialogState({ show: false, id: undefined })}
        open={deleteDialogState.show}
        onClose={() => setDeleteDialogState({ show: false, id: undefined })}
        acceptBtn={formatMessage(phrasesMessages.delete)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
      <HBDialog
        content={formatMessage(userPageMessages.usersChangeStatusConfirm, {
          userCount: selectedRows.length,
        })}
        title={formatMessage(userPageMessages.usersChangeStatus)}
        onAccept={handleChangeActive}
        onReject={() => setOpenActive(false)}
        open={openActive}
        onClose={() => setOpenActive(false)}
        acceptBtn={formatMessage(phrasesMessages.confirm)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
      <HBChangeRecordHistory
        open={recordChangeHistory.show}
        entityId={recordChangeHistory.entityId!}
        onClose={() => setRecordChangeHistory({ show: false, entityId: '' })}
        tableName="Party"
      />
    </>
  )
}
