import { GridActionColumn } from '@hasty-bazar/admin-shared/components'
import {
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  GetIconCategoryTypeValueQueryResult,
  GetIconCategoryTypeValueQueryResultApiResult,
  useDeleteAdminGeneralDataApiIconCategoryTypeValueByIdMutation,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBAgGridClasses, HBDataGrigToolbar, HBDialog, openToast } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { ICellRendererParams } from 'ag-grid-community'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import useIconCategoriesValuesGrid from '../../hooks/useIconCategoriesValuesGrid'
import iconsCategoriesMessages from '../../iconsCategories.messages'
import IconCategoriesValuesAddEditForm from './icon-categories-values-form'

const classes: HBAgGridClasses = {
  wrapper: {
    height: 230,
  },
}

const IconCategoriesValuesGrid = ({ data }: ICellRendererParams) => {
  const { formatMessage } = useIntl()

  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/GeneralData/api/IconCategoryTypeValue/${data.id}/GetAll`
  const gridRef = useRef<HBDataGridClientRef>(null)
  const {
    checkboxSelection,
    headerCheckboxSelection,
    handleChangedGridActions,
    valuesGridColumns,
    refreshGridData,
    gridLoading,
  } = useIconCategoriesValuesGrid(gridRef)

  const [deleteIconCategoriesValue] =
    useDeleteAdminGeneralDataApiIconCategoryTypeValueByIdMutation()

  const [selectedRows, setSelectedRows] = useState<GetIconCategoryTypeValueQueryResult[]>([])
  const [isOpenAddEditDialog, setIsOpenAddEditDialog] = useState<{
    show: boolean
    data?: GetIconCategoryTypeValueQueryResult
  }>({
    show: false,
  })
  const [deleteDialogState, setDeleteDialogState] = useState<{ show: boolean; id?: string }>({
    show: false,
  })

  const handleAdd = () => {
    setIsOpenAddEditDialog({ show: true })
  }
  const handleEdit = (props: GetIconCategoryTypeValueQueryResult) => {
    setIsOpenAddEditDialog({ show: true, data: props })
  }

  const handleDelete = useCallback(async () => {
    const ids = selectedRows.map((item) => item.id)
    for (const [index, id] of ids.entries()) {
      gridLoading(true)
      await deleteIconCategoriesValue({
        'client-name': 'admin',
        'client-version': '1.0.0',
        id: data.id,
        valueId: String(id),
      })
        .unwrap()
        .then((res: GetIconCategoryTypeValueQueryResultApiResult) => {
          if (res?.success) {
            openToast({
              message: formatMessage(iconsCategoriesMessages.successfullyDeleted),
              type: 'success',
            })
          }
        })
        .finally(() => {
          setDeleteDialogState({ show: false })
          if (index === ids.length - 1) {
            gridLoading(false)
            refreshGridData(true)
          }
        })
    }
  }, [selectedRows, deleteDialogState])

  const GridActions = useCallback(
    (props: ICellRendererParams) => {
      return (
        <GridActionColumn
          {...props}
          menuItems={[
            {
              label: formatMessage(phrasesMessages.public),
              children: [
                {
                  icon: 'pen',
                  label: formatMessage(phrasesMessages.edit),
                  onClick: () => handleEdit(props.data),
                },
                {
                  icon: 'trashAlt',
                  label: formatMessage(phrasesMessages.delete),
                  onClick: () => {
                    setDeleteDialogState({ show: true })
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
        cellRendererParams: {
          suppressCount: true,
          suppressDoubleClickExpand: true,
          innerRenderer: GridActions,
        },
      },
      ...valuesGridColumns(),
    ],
    [gridRef.current?.api?.getSelectedRows()],
  )

  return (
    <>
      <Box height={350}>
        <HBDataGridClient
          actionUrl={actionUrl}
          onDoubleClick={(props) => handleEdit(props?.data)}
          columnDefs={columnDefs}
          ref={gridRef}
          pagination
          paginationPageSize={5}
          classes={classes}
          rowSelection={'multiple'}
          enableRtl
          sideBar
          onSelectedChanged={(chosenRows) => setSelectedRows(chosenRows)}
          GridToolbar={(props) => (
            <HBDataGrigToolbar
              onChange={handleChangedGridActions}
              addProps={{ onClick: handleAdd }}
              statusProps={{ show: false }}
              moreProps={{ show: false }}
              editProps={{
                disabled: selectedRows.length !== 1,
                onClick: (props) => handleEdit(props?.data),
              }}
              deleteProps={{
                disabled: selectedRows.length === 0,
                onClick: () => {
                  setDeleteDialogState({ show: true })
                },
              }}
              refreshProps={{ onClick: () => refreshGridData(true) }}
              {...props}
            />
          )}
        />
      </Box>
      <HBDialog
        content={
          <IconCategoriesValuesAddEditForm
            iconCategoriesData={data}
            valuesData={isOpenAddEditDialog?.data}
            setIsOpenAddEditDialog={setIsOpenAddEditDialog}
            refreshGridData={refreshGridData}
          />
        }
        open={isOpenAddEditDialog.show}
        onClose={() => setIsOpenAddEditDialog({ show: false })}
        title={formatMessage(iconsCategoriesMessages.iconCategoriesValues)}
      />
      <HBDialog
        content={formatMessage(iconsCategoriesMessages.confirmationMessageDeleting, {
          msg: deleteDialogState?.id ? 1 : selectedRows.length,
        })}
        title={formatMessage(iconsCategoriesMessages.confirmationTitleDeletingValues)}
        onAccept={handleDelete}
        onReject={() => setDeleteDialogState({ show: false, id: undefined })}
        onClose={() => setDeleteDialogState({ show: false, id: undefined })}
        open={deleteDialogState.show}
        acceptBtn={formatMessage(phrasesMessages.delete)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
    </>
  )
}
export default IconCategoriesValuesGrid
