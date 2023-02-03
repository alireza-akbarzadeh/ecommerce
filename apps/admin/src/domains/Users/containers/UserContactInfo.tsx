import { GridActionColumn } from '@hasty-bazar/admin-shared/components'
import {
  GridFilterFieldType,
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { useDeleteAdminIdrRolesByIdAddressAndAddressIdMutation } from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { HBAgGridClasses, HBDataGrigToolbar, HBDialog, openToast } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { ColDef, ICellRendererParams } from 'ag-grid-community'
import HBGrigToolbarItem from 'libs/core/src/components/HBGrigToolbar/components/HBGrigToolbarItem'
import { useRouter } from 'next/router'
import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import userPageMessages from '../UserPage.messages'
import { userAddressGridColumns } from '../utils/userGridColumns'
import { UserAddressType } from './details/UserContacts'
import useUserGrid from './hooks/useUserGrid'

const classes: HBAgGridClasses = {
  wrapper: {
    height: 350,
  },
}

export type UserContactInfoProps = {
  onAdd?: () => void
  onCancel?: () => void
  onEdit?: (address: UserAddressType) => void
  onCopy?: (address: UserAddressType) => void | {}
}

const UserContactInfo = forwardRef(
  ({ onAdd, onCancel, onEdit, onCopy }: UserContactInfoProps, ref) => {
    const {
      formState: { isDirty, isValid },
    } = useFormContext<UserAddressType>()
    const confirmBtnRef = useRef<HTMLButtonElement>(null)

    const { formatMessage } = useIntl()
    const gridRef = useRef<HBDataGridClientRef>(null)
    const [selectedRows, setSelectedRows] = useState<any[]>([])
    const [deleteDialogState, setDeleteDialogState] = useState<{
      show: boolean
      address?: UserAddressType
    }>({
      show: false,
    })

    const [copyDialogState, setCopyDialogState] = useState<{
      show: boolean
      item?: UserAddressType
    }>({
      show: false,
    })

    const [isAddOrEdit, setIsAddOrEdit] = useState(false)

    const { checkboxSelection, headerCheckboxSelection } = useUserGrid(gridRef)

    const router = useRouter()
    const partyId = router.query?.id?.[0]
    const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/IDR/parties/${partyId}/addresses`

    const [deleteAddress] = useDeleteAdminIdrRolesByIdAddressAndAddressIdMutation()
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
            { field: 'District', operator: 'contains', value: String(value) },
            { field: 'Title', operator: 'contains', value: String(value) },
            { field: 'StreetLine', operator: 'contains', value: String(value) },
          ]
          gridRef.current!.addFilter({
            id: 'searchUserContactInfo',
            fields: searchFields,
            type: 'search',
            addToFilter: true,
          })
        } else {
          gridRef.current!.removeFilter('searchUserContactInfo')
        }
      }
    }

    const refreshGridData = useCallback((isClearSearch?: boolean) => {
      gridRef.current?.refreshGridData(isClearSearch)
      gridRef.current!.api.deselectAll()
    }, [])

    const handleEditAddress = (item: UserAddressType) => {
      item = item ?? selectedRows[0]
      setIsAddOrEdit(true)
      onEdit?.(item)
    }

    const autoGroupColumnDef = useMemo<ColDef>(() => {
      return {
        headerCheckboxSelection: true,
        cellRenderer: 'agGroupCellRenderer',
      }
    }, [])

    const handleCopyAddress = (item: UserAddressType) => {
      setCopyDialogState({
        show: true,
        item,
      })
    }

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
                    icon: 'pen',
                    label: formatMessage(phrasesMessages.edit),
                    onClick: () => {
                      handleEditAddress(props.data)
                    },
                    disabled: isAddOrEdit,
                  },
                  {
                    icon: 'trashAlt',
                    label: formatMessage(phrasesMessages.delete),
                    onClick: () => {
                      setDeleteDialogState({ show: true, address: props?.data })
                    },
                    disabled: isAddOrEdit,
                  },
                  {
                    icon: 'copyAlt',
                    label: formatMessage(phrasesMessages.copy),
                    onClick: () => {
                      handleCopyAddress(props.data)
                    },
                    disabled: isAddOrEdit,
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
        },
        ...userAddressGridColumns(),
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

    const handleDeleteAddress = async () => {
      const ids = deleteDialogState?.address
        ? [
            {
              id: deleteDialogState?.address.id,
              partyRoleId: deleteDialogState?.address.partyRoleId,
            },
          ]
        : selectedRows.map((row) => ({ id: row.id, partyRoleId: row.partyRoleId }))
      gridLoading(true)
      const requests = ids.map((item) =>
        deleteAddress({
          'client-name': 'delete-user-address',
          'client-version': '1.0.0',
          addressId: item.id,
          id: item.partyRoleId,
        }),
      )
      const responses = await Promise.all(requests)
      const success = responses.filter((res: any) => res?.data?.success)

      refreshGridData(true)
      gridLoading(false)
      setDeleteDialogState({ show: false, address: undefined })
      if (success.length) {
        openToast({
          message: formatMessage(userPageMessages.usersAddressDeleteSuccess, {
            userCount: success.length,
          }),
          type: 'success',
        })
      }
    }

    const handleConfirmCopyAddress = () => {
      const item = copyDialogState.item ?? {}
      onCopy?.(item)
      setIsAddOrEdit(true)
      setCopyDialogState({ show: false, item: undefined })
    }

    useImperativeHandle(ref, () => ({
      afterSubmit() {
        setIsAddOrEdit(false)
        refreshGridData(true)
      },
    }))

    return (
      <Box sx={{ width: '100%' }}>
        <HBDataGridClient
          actionUrl={actionUrl}
          onDoubleClick={(props) => {
            setIsAddOrEdit(true)
            onEdit?.(props.data)
          }}
          columnDefs={columnDefs}
          pagination
          paginationPageSize={4}
          rowModelType={'serverSide'}
          serverSideStoreType={'partial'}
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
                disabled: selectedRows.length !== 1 || isAddOrEdit,
                onClick: () => {
                  setIsAddOrEdit(true)
                  onEdit?.(gridRef.current?.api.getSelectedRows()[0])
                },
              }}
              refreshProps={{ onClick: () => refreshGridData(true), disabled: isAddOrEdit }}
              searchProps={{ show: true, disabled: isAddOrEdit }}
              statusProps={{ show: false }}
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
                type="submit"
                ref={confirmBtnRef}
                onClick={() => {
                  confirmBtnRef.current?.click()
                }}
              />
            </HBDataGrigToolbar>
          )}
        />
        <HBDialog
          content={formatMessage(userPageMessages.usersAddressDeleteConfirm, {
            userCount: selectedRows.length,
          })}
          title={formatMessage(phrasesMessages.delete)}
          onAccept={handleDeleteAddress}
          onReject={() => setDeleteDialogState({ show: false, address: undefined })}
          onClose={() => setDeleteDialogState({ show: false, address: undefined })}
          open={deleteDialogState.show}
          acceptBtn={formatMessage(phrasesMessages.delete)}
          rejectBtn={formatMessage(phrasesMessages.cancel)}
        />
        <HBDialog
          content={formatMessage(userPageMessages.sureCopyAddress)}
          title={formatMessage(phrasesMessages.copy)}
          onAccept={handleConfirmCopyAddress}
          onReject={() => setCopyDialogState({ show: false, item: undefined })}
          onClose={() => setCopyDialogState({ show: false, item: undefined })}
          open={copyDialogState.show}
          acceptBtn={formatMessage(phrasesMessages.confirm)}
          rejectBtn={formatMessage(phrasesMessages.cancel)}
        />
      </Box>
    )
  },
)

export default UserContactInfo
