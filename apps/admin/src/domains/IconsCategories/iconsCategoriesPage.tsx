import { GridActionColumn } from '@hasty-bazar/admin-shared/components'
import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import {
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import sideBarMessages from '@hasty-bazar-admin/core/translations/sidebar.messages'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  GetIconCategoryTypeResult,
  GetIconCategoryTypeResultApiResult,
  useDeleteAdminGeneralDataIconCategoryTypesByIdMutation,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBAgGridClasses, HBDataGrigToolbar, HBDialog, openToast } from '@hasty-bazar/core'
import { ICellRendererParams } from 'ag-grid-community'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { IconCategoriesAddEditForm } from './containers/icon-categories'
import { IconCategoriesValuesGrid } from './containers/icon-category-values'
import useIconCategoriesGrid from './hooks/useIconCategoriesGrid'
import iconsCategoriesMessages from './iconsCategories.messages'

export const classes: HBAgGridClasses = {
  wrapper: {
    height: `calc(100vh - 240px)`,
  },
}

const IconsCategoriesPage = () => {
  const { formatMessage } = useIntl()
  const breadcrumbs = [
    { url: '/', title: formatMessage(sideBarMessages.dashboard) },
    { url: '#', title: formatMessage(sideBarMessages.iconsCategories) },
  ]

  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/GeneralData/IconCategoryTypes/GetAll`
  const gridRef = useRef<HBDataGridClientRef>(null)
  const {
    checkboxSelection,
    headerCheckboxSelection,
    handleChangedGridActions,
    iconCategoriesGridColumns,
    refreshGridData,
    gridLoading,
  } = useIconCategoriesGrid(gridRef)

  const [deleteIconCategories] = useDeleteAdminGeneralDataIconCategoryTypesByIdMutation()

  const [selectedRows, setSelectedRows] = useState<GetIconCategoryTypeResult[]>([])
  const [isOpenAddEditDialog, setIsOpenAddEditDialog] = useState<{
    show: boolean
    data?: GetIconCategoryTypeResult
  }>({
    show: false,
  })
  const [deleteDialogState, setDeleteDialogState] = useState<{ show: boolean; id?: string }>({
    show: false,
  })

  const handleAdd = () => {
    setIsOpenAddEditDialog({ show: true })
  }
  const handleEdit = (props: GetIconCategoryTypeResult) => {
    setIsOpenAddEditDialog({ show: true, data: props })
  }

  const handleDelete = useCallback(async () => {
    const ids = selectedRows.map((item) => item.id)
    for (const [index, id] of ids.entries()) {
      gridLoading(true)
      await deleteIconCategories({
        'client-name': 'admin',
        'client-version': '1.0.0',
        id: String(id),
      })
        .unwrap()
        .then((res: GetIconCategoryTypeResultApiResult) => {
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
      ...iconCategoriesGridColumns(),
    ],
    [gridRef.current?.api?.getSelectedRows()],
  )

  return (
    <>
      <HBDataGridClient
        id="iconCategory-grid"
        actionUrl={actionUrl}
        onDoubleClick={(props) => handleEdit(props?.data)}
        columnDefs={columnDefs}
        ref={gridRef}
        pagination
        paginationPageSize={25}
        rowSelection={'multiple'}
        enableRtl
        sideBar
        rightHeader={
          <BreadCrumbSection
            title={formatMessage(iconsCategoriesMessages.iconsCategories)}
            breadItems={breadcrumbs}
          />
        }
        classes={classes}
        onSelectedChanged={(chosenRows) => setSelectedRows(chosenRows)}
        masterDetail
        detailCellRenderer={IconCategoriesValuesGrid}
        detailRowAutoHeight
        GridToolbar={(props) => (
          <HBDataGrigToolbar
            onChange={handleChangedGridActions}
            addProps={{ onClick: handleAdd }}
            statusProps={{ show: true }}
            moreProps={{ show: false }}
            editProps={{
              disabled: selectedRows.length !== 1,
              onClick: () => handleEdit(selectedRows[0]),
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
      <HBDialog
        content={
          <IconCategoriesAddEditForm
            iconCategoriesData={isOpenAddEditDialog?.data}
            setIsOpenAddEditDialog={setIsOpenAddEditDialog}
            refreshGridData={refreshGridData}
          />
        }
        fullWidth
        maxWidth={'sm'}
        open={isOpenAddEditDialog.show}
        onClose={() => setIsOpenAddEditDialog({ show: false })}
        title={formatMessage(iconsCategoriesMessages.iconCategories)}
      />
      <HBDialog
        content={formatMessage(iconsCategoriesMessages.confirmationMessageDeleting, {
          msg: deleteDialogState?.id ? 1 : selectedRows.length,
        })}
        title={formatMessage(iconsCategoriesMessages.confirmationTitleDeleting)}
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

export default IconsCategoriesPage
