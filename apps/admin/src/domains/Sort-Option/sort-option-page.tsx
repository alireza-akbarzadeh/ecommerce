import { GridActionColumn } from '@hasty-bazar/admin-shared/components'
import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import HBGrid, {
  GridFilterFieldType,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid/HBDataGridClient'
import { DownloadMethodType } from '@hasty-bazar/admin-shared/containers/HBDataGrid/useDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import sidebarMessages from '@hasty-bazar-admin/core/translations/sidebar.messages'
import validationsMessages from '@hasty-bazar-admin/core/translations/validations.messages'
import {
  useDeleteAdminGeneralDataCollectionSortOptionsByIdMutation,
  usePostAdminGeneralDataCollectionSortOptionsDownloadExcelFileMutation,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBAgGridClasses, HBDataGrigToolbar, HBDialog, openToast } from '@hasty-bazar/core'
import {
  CheckboxSelectionCallbackParams,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import sortOptionMessages from './sort-option.messages'

const classes: HBAgGridClasses = {
  wrapper: {
    height: `calc(100vh - 240px)`,
  },
}

const SortOptionPage = () => {
  const { formatMessage } = useIntl()
  const breadcrumbs = [
    { url: '/', title: formatMessage(sidebarMessages.dashboard) },
    { url: '#', title: formatMessage(sidebarMessages.sortOption) },
  ]
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const [deleteDialogState, setDeleteDialogState] = useState<{ show: boolean; id?: number }>({
    show: false,
  })
  const router = useRouter()
  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/GeneralData/CollectionSortOptions`
  const gridRef = useRef<HBDataGridClientRef>(null)

  const [deleteSortOption] = useDeleteAdminGeneralDataCollectionSortOptionsByIdMutation()

  const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const GridActions = useCallback(
    (props: ICellRendererParams) => {
      return (
        <GridActionColumn
          {...props}
          menuItems={[
            {
              label: '',
              children: [
                {
                  icon: 'pen',
                  label: formatMessage(sortOptionMessages.menuItemEdit),
                  onClick: () => {
                    handleEditSortOption(props.data?.id)
                  },
                },
                {
                  icon: 'trashAlt',
                  label: formatMessage(sortOptionMessages.menuItemDelete),
                  onClick: () => {
                    handleDeleteSortOption(props.data?.id)
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
      {
        field: 'collectionTypeTitle',
        headerName: formatMessage(sortOptionMessages.collectionTypeTitle),
        filter: 'agTextColumnFilter',
        minWidth: 100,
        maxWidth: 200,
        hide: false,
      },
      {
        field: 'name',
        headerName: formatMessage(sortOptionMessages.name),
        filter: 'agTextColumnFilter',
        minWidth: 100,
        maxWidth: 200,
        hide: false,
      },
      {
        field: 'description',
        headerName: formatMessage(sortOptionMessages.description),
        filter: 'agTextColumnFilter',
        minWidth: 100,
        hide: false,
      },
    ],
    [gridRef.current?.api?.getSelectedRows()],
  )

  const handleChangedSelectedRows = (chosenRows: any[]): void => {
    setSelectedRows(chosenRows)
  }

  const handleChangedGridActions = (value: number | string, type: 'search' | 'status') => {
    if (type === 'status') {
      let filterComponent = gridRef.current!.api.getFilterInstance('status')
      filterComponent &&
        filterComponent.setModel({
          type: 'equals',
          filter: value !== -1 ? value : null,
        })
      gridRef.current!.api.onFilterChanged()
    } else if (type === 'search') {
      if (value) {
        const searchFields: GridFilterFieldType[] = [
          { field: 'Name', operator: 'contains', value: String(value) },
          { field: 'Description', operator: 'contains', value: String(value) },
        ]
        gridRef.current!.addFilter({
          id: 'searchSortOption',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef.current!.removeFilter('searchSortOption')
      }
    }
  }

  const handleAddSortOption = (): void => {
    router.push({
      pathname: '/sort-option/add/',
    })
  }

  const gridLoading = (show: boolean) => {
    if (show) {
      gridRef.current!.api.showLoadingOverlay()
    } else {
      gridRef.current!.api.hideOverlay()
    }
  }

  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    gridRef?.current?.refreshGridData(isClearSearch)
    gridRef?.current!.api?.deselectAll()
  }, [])

  const handleDeleteSortOption = async (id?: string) => {
    const ids = id && typeof id === 'string' ? [id] : selectedRows.map((row) => row.id)
    gridLoading(true)
    const requests = ids.map((id) =>
      deleteSortOption({
        'client-name': 'delete-sort-option',
        'client-version': '1.0.0',
        id,
      }),
    )
    const responses = await Promise.all(requests)
    // @ts-ignore
    const errors = responses.filter((res) => res?.error?.data?.success === false)
    refreshGridData()
    gridLoading(false)
    setDeleteDialogState({ show: false, id: undefined })
    if (errors.length) {
      openToast({
        message: formatMessage(validationsMessages.errorMessageDeleting, {
          msg: errors.length,
        }),
        type: 'error',
      })
    }
  }

  const handleEditSortOption = (id?: string) => {
    router.push({
      pathname: '/sort-option/edit/',
      query: {
        sortOptionId: selectedRows[0].id,
        collectionType: selectedRows[0].collectionType,
      },
    })
  }

  const [downloadFile] = usePostAdminGeneralDataCollectionSortOptionsDownloadExcelFileMutation()

  const handleDownload = async (props: DownloadMethodType) => {
    const { filterFields, ...res } = props
    return await downloadFile({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      getCollectionSortOptionsExcelQueryFilter: {
        ...res,
        ...filterFields,
      },
    })
  }

  const handleDownloadPage = (isDownloadAll?: boolean) => {
    gridRef.current?.downloadGridData({
      downloadFileMethod: handleDownload,
      downloadAll: isDownloadAll,
    })
  }

  return (
    <>
      <HBGrid
        actionUrl={actionUrl}
        onDoubleClick={(data) => {
          router.push({
            pathname: '/sort-option/edit/',
            query: {
              sortOptionId: data.data.id,
              collectionType: data.data.collectionType,
            },
          })
        }}
        columnDefs={columnDefs}
        pagination
        paginationPageSize={25}
        rowSelection="multiple"
        enableRtl
        sideBar
        rightHeader={
          <BreadCrumbSection
            title={formatMessage(sortOptionMessages.breadcrumbTitle)}
            breadItems={breadcrumbs}
          />
        }
        classes={classes}
        onSelectedChanged={handleChangedSelectedRows}
        ref={gridRef}
        GridToolbar={(props) => (
          <HBDataGrigToolbar
            onChange={handleChangedGridActions}
            addProps={{ onClick: handleAddSortOption }}
            deleteProps={{
              disabled: selectedRows.length === 0,
              onClick: () => setDeleteDialogState({ show: true }),
            }}
            statusProps={{
              label: formatMessage(sortOptionMessages.status),
              show: true,
              menuItem: [
                { title: formatMessage(phrasesMessages.all), value: -1 },
                { title: formatMessage(phrasesMessages.draft), value: 1 },
                { title: formatMessage(phrasesMessages.release), value: 2 },
              ],
            }}
            refreshProps={{ onClick: () => refreshGridData(true) }}
            searchProps={{ show: true, openPosition: 'right' }}
            editProps={{ disabled: selectedRows.length !== 1, onClick: handleEditSortOption }}
            items={[
              {
                label: formatMessage(phrasesMessages.download),
                icon: 'fileDownload',
                onClick: handleDownloadPage,
              },
              {
                label: formatMessage(phrasesMessages.downloadAll),
                icon: 'fileDownloadAlt',
                onClick: () => handleDownloadPage(true),
              },
            ]}
            {...props}
          />
        )}
      />
      <HBDialog
        content={formatMessage(sortOptionMessages.confirmationMessageDeleting, {
          msg: deleteDialogState?.id ? 1 : selectedRows.length,
        })}
        title={formatMessage(sortOptionMessages.confirmationTitleDeleting)}
        onAccept={handleDeleteSortOption}
        onReject={() => setDeleteDialogState({ show: false, id: undefined })}
        onClose={() => setDeleteDialogState({ show: false, id: undefined })}
        open={deleteDialogState.show}
        acceptBtn={formatMessage(phrasesMessages.delete)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
    </>
  )
}
export default SortOptionPage
