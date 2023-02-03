import { GridActionColumn } from '@hasty-bazar/admin-shared/components'
import HBDataGridActionHeader from '@hasty-bazar/admin-shared/components/HBDataGridActionHeader'
import {
  GridFilterFieldType,
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  GetPartySocialMediaQueryResult,
  useDeleteAdminIdrRolesByIdAddressAndAddressIdMutation,
  usePutAdminIdrRolesByIdSocialMediaMutation,
} from '@hasty-bazar/admin-shared/services/idrApi.generated'
import {
  HBAgGridClasses,
  HBDataGrigToolbar,
  HBDialog,
  MenuItemProps,
  openToast,
} from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { ColDef, ICellRendererParams } from 'ag-grid-community'
import HBGrigToolbarItem from 'libs/core/src/components/HBGrigToolbar/components/HBGrigToolbarItem'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import userPageMessages from '../../../UserPage.messages'
import { userSocialGridColumns } from '../../../utils/userGridColumns'
import { UserAddressType } from '../../details/UserContacts'
import useUserGrid from '../../hooks/useUserGrid'
import { UserSocialType } from './SocialMedia'

const classes: HBAgGridClasses = {
  wrapper: {
    height: 350,
  },
}

export type UserContactInfoProps = {
  onAdd?: () => void
  onSave?: (callback: () => void) => void
  onCancel?: () => void
  onEdit?: (social: GetPartySocialMediaQueryResult) => void
  onCopy?: (social: UserSocialType) => void
}

const SocialMediaGrid = ({ onAdd, onSave, onCancel, onEdit, onCopy }: UserContactInfoProps) => {
  const {
    formState: { isValid, isDirty },
    reset,
  } = useFormContext<UserAddressType>()

  const { formatMessage } = useIntl()
  const gridRef = useRef<HBDataGridClientRef>(null)
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const [deleteDialogState, setDeleteDialogState] = useState<{ show: boolean; id?: number }>({
    show: false,
  })

  const [copyDialogState, setCopyDialogState] = useState<{ show: boolean; item?: UserSocialType }>({
    show: false,
  })

  const [updateSocialMedia] = usePutAdminIdrRolesByIdSocialMediaMutation()

  const [isAddOrEdit, setIsAddOrEdit] = useState(false)

  const { userGridToolbarMenu, checkboxSelection, headerCheckboxSelection } = useUserGrid(gridRef)

  const router = useRouter()
  const partyId = router.query?.id?.[0]
  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/IDR/parties/${partyId}/social-media`

  const toolbarStatus = useMemo(() => {
    const disabledOnSelected = selectedRows.length > 0
    const disabledOnNoSelected = selectedRows.length === 0

    return { disabledOnSelected, disabledOnNoSelected }
  }, [selectedRows])

  const handleChangedSelectedRows = (selectedRows: any[]) => {
    setSelectedRows(selectedRows)
  }

  const handleChangedGridActions = (value: number | string, type: 'search' | 'status') => {
    if (type === 'status') {
      let filterComponent = gridRef.current!.api.getFilterInstance('isActive')
      filterComponent &&
        filterComponent.setModel({
          type: 'equals',
          filter: value !== -1 ? value : null,
        })
      gridRef.current!.api.onFilterChanged()
    } else if (type === 'search') {
      if (value) {
        const searchFields: GridFilterFieldType[] = [
          { field: 'SearchValue', operator: 'contains', value: String(value) },
        ]
        gridRef.current!.addFilter({
          id: 'searchSocialMedia',
          fields: searchFields,
          type: 'search',
          addToFilter: false,
        })
      } else {
        gridRef.current!.removeFilter('searchSocialMedia')
      }
    }
  }

  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    gridRef.current!.refreshGridData(isClearSearch)
    gridRef.current!.api.deselectAll()
  }, [])

  const handleEditAddress = (id?: string) => {
    id = typeof id === 'string' ? id : selectedRows[0]?.id
  }

  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerCheckboxSelection: true,
      cellRenderer: 'agGroupCellRenderer',
    }
  }, [])

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
    })
  }, [selectedRows])

  const GridActions = useCallback(
    (props: ICellRendererParams) => {
      return (
        <GridActionColumn
          {...props}
          menuItems={[
            {
              label: formatMessage(phrasesMessages.edit),
              children: [
                {
                  icon: 'trashAlt',
                  label: formatMessage(phrasesMessages.delete),
                  onClick: () => {
                    handleDeleteAddress(props.data?.id, props.data?.partyRoleId)
                  },
                },
                {
                  icon: 'copyAlt',
                  label: formatMessage(phrasesMessages.copy),
                  onClick: () => {
                    setCopyDialogState({
                      show: true,
                      item: props.data,
                    })
                  },
                },
              ],
            },
          ]}
        />
      )
    },
    [selectedRows],
  )

  const columnDefs = useMemo(
    () => [
      {
        field: '_actions',
        headerName: '',
        maxWidth: 120,
        minWidth: 120,
        resizable: false,
        sortable: false,
        filter: false,
        suppressAutoSize: true,
        suppressMenu: true,
        checkboxSelection,
        headerCheckboxSelection,
        showRowGroup: true,
        cellRenderer: 'agGroupCellRenderer',
        cellRendererParams: {
          suppressCount: true,
          suppressDoubleClickExpand: true,
          innerRenderer: GridActions,
        },
        headerComponent: HBDataGridActionHeader,
      },
      ...userSocialGridColumns(),
    ],
    [gridRef.current?.api?.getSelectedRows()],
  )

  const gridLoading = (show: boolean) => {
    if (show) {
      gridRef.current!.api.showLoadingOverlay()
    } else {
      gridRef.current!.api.hideOverlay()
    }
  }

  const handleDeleteAddress = async (id?: string, partyRoleId?: string) => {
    const ids =
      id && typeof id === 'string'
        ? [
            {
              id,
              partyRoleId,
            },
          ]
        : selectedRows.map((row) => ({ id: row.id, partyRoleId: row.partyRoleId }))
    gridLoading(true)
    const requests = ids.map((item) =>
      updateSocialMedia({
        'client-name': 'hasty-bazar-admin',
        'client-version': '1.0.0',
        id: item.partyRoleId,
        updatePartySocialMediaModel: {
          instagram: '',
          linkedIn: '',
          whatsApp: '',
        },
      }),
    )
    const responses = await Promise.all(requests)
    const errors = responses.filter((res: any) => !res?.data?.success)
    const success = responses.filter((res: any) => res?.data?.success)

    refreshGridData(true)
    gridLoading(false)
    setDeleteDialogState({ show: false, id: undefined })
    if (errors.length) {
      openToast({
        message: formatMessage(userPageMessages.usersAddressDeleteFailed, {
          userCount: errors.length,
        }),
        type: 'error',
      })
    }
    if (success.length) {
      openToast({
        message: formatMessage(userPageMessages.usersAddressDeleteSuccess, {
          userCount: success.length,
        }),
        type: 'success',
      })
    }
  }

  const handleCopySocial = () => {
    const item = copyDialogState.item ?? {}
    onCopy?.(item as UserSocialType)
    setIsAddOrEdit(true)
    setCopyDialogState({ show: false, item: undefined })
  }

  return (
    <Box sx={{ width: '100%' }}>
      <HBDataGridClient
        actionUrl={actionUrl}
        columnDefs={columnDefs}
        pagination
        paginationPageSize={4}
        rowSelection="multiple"
        enableRtl
        sideBar
        classes={classes}
        autoGroupColumnDef={autoGroupColumnDef}
        onSelectedChanged={handleChangedSelectedRows}
        detailRowAutoHeight
        ref={gridRef}
        sx={{ height: '220px !important' }}
        GridToolbar={(props) => (
          <HBDataGrigToolbar
            onChange={handleChangedGridActions}
            addProps={{
              disabled: toolbarStatus.disabledOnSelected || isAddOrEdit,
              onClick: () => {
                setIsAddOrEdit(true)
                onAdd?.()
              },
            }}
            deleteProps={{
              disabled: toolbarStatus.disabledOnNoSelected || isAddOrEdit,
              onClick: () => setDeleteDialogState({ show: true }),
            }}
            editProps={{
              show: true,
              disabled:
                toolbarStatus.disabledOnNoSelected || selectedRows.length !== 1 || isAddOrEdit,
              onClick: () => {
                setIsAddOrEdit(true)
                onEdit?.(selectedRows[0])
              },
            }}
            refreshProps={{ onClick: () => refreshGridData(true), disabled: isAddOrEdit }}
            searchProps={{ show: true, disabled: isAddOrEdit }}
            statusProps={{ show: false }}
            items={toolbarMoreItems}
            {...props}
          >
            <HBGrigToolbarItem
              icon="times"
              tooltip={formatMessage(phrasesMessages.cancel)}
              disabled={!isAddOrEdit}
              show={isAddOrEdit}
              onClick={() => {
                setIsAddOrEdit(false)
                gridRef.current?.api.deselectAll()
                onCancel?.()
              }}
            />
            <HBGrigToolbarItem
              icon="check"
              tooltip={formatMessage(phrasesMessages.confirm)}
              disabled={!isAddOrEdit || !isDirty || !isValid}
              show={isAddOrEdit}
              onClick={() => {
                onSave?.(() => {
                  setIsAddOrEdit(false)
                  refreshGridData(true)
                })
              }}
            />
          </HBDataGrigToolbar>
        )}
      />
      <HBDialog
        content={formatMessage(userPageMessages.usersSocialDeleteConfirm, {
          userCount: selectedRows.length,
        })}
        title={formatMessage(phrasesMessages.delete)}
        onAccept={handleDeleteAddress}
        onReject={() => setDeleteDialogState({ show: false, id: undefined })}
        onClose={() => setDeleteDialogState({ show: false, id: undefined })}
        open={deleteDialogState.show}
        acceptBtn={formatMessage(phrasesMessages.delete)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
      <HBDialog
        content={formatMessage(userPageMessages.sureCopySocial)}
        title={formatMessage(userPageMessages.copy)}
        onAccept={handleCopySocial}
        onReject={() => setCopyDialogState({ show: false, item: undefined })}
        onClose={() => setCopyDialogState({ show: false, item: undefined })}
        open={copyDialogState.show}
        acceptBtn={formatMessage(phrasesMessages.confirm)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
    </Box>
  )
}

export default SocialMediaGrid
