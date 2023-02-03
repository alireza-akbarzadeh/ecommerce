import { GridWorkflowActionColumn, HBWorkflowState } from '@hasty-bazar/admin-shared/containers'
import HBGrid, {
  GridFilterFieldType,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid/HBDataGridClient'
import { DownloadMethodType } from '@hasty-bazar/admin-shared/containers/HBDataGrid/useDataGrid'
import { BusinessTypeEnums, StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  useDeleteAdminGeneralDataCollectionByIdMutation,
  useGetAdminGeneralDataBusinessTypeValueGetAllQuery,
  useGetAdminGeneralDataCollectionGetStateInfoByStateCodeAndStateMachineCodeFactorQuery as useGetStateInfo,
  useLazyGetAdminGeneralDataCollectionGetTransitionByEntityIdAndStateMachineCodeFactorQuery as useLazyGetStateInfo,
  usePostAdminGeneralDataCollectionChangeStateMutation,
  usePostAdminGeneralDataCollectionDownloadExcelFileMutation,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBAgGridClasses, HBDataGrigToolbar, HBDialog, openToast } from '@hasty-bazar/core'
import {
  CheckboxSelectionCallbackParams,
  ColDef,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import collectionPageMessages from './CollectionPage.messages'

const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
  return params.columnApi.getRowGroupColumns().length === 0
}

const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
  return params.columnApi.getRowGroupColumns().length === 0
}

const classes: HBAgGridClasses = {
  wrapper: {
    height: `calc(100vh - 240px)`,
  },
}

export default function CollectionPage() {
  const router = useRouter()
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const { formatMessage } = useIntl()
  const [deleteDialogState, setDeleteDialogState] = useState<{ show: boolean; id?: number }>({
    show: false,
  })
  const gridRef = useRef<HBDataGridClientRef>(null)
  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/GeneralData/Collection`
  const handleEditCollection = (id?: string) => {
    id = typeof id === 'string' ? id : selectedRows[0]?.id
    router.push(`/collection/edit/${id}`)
  }

  const [deleteCollection, { error: deleteError, data: deleteCollectionData }] =
    useDeleteAdminGeneralDataCollectionByIdMutation()

  const gridLoading = (show: boolean) => {
    if (show) {
      gridRef.current!.api.showLoadingOverlay()
    } else {
      gridRef.current!.api.hideOverlay()
    }
  }

  const handleDeleteCollection = useCallback(async () => {
    try {
      const ids = deleteDialogState?.id
        ? [deleteDialogState?.id]
        : selectedRows.map((row) => row.id)

      ids.map((id) => {
        deleteCollection({
          'client-name': 'hasty-bazar-admin',
          'client-version': '1.0.0',
          id,
        }).then((res: any) => {
          if (res && res?.data?.success) {
            gridLoading(true)
            setDeleteDialogState({ show: false, id: undefined })
            openToast({
              message: formatMessage(collectionPageMessages.successDelete),
              type: 'success',
            })
            refreshGridData()
            gridLoading(false)
          }
        })
      })
    } catch (e) {
      gridLoading(false)
      openToast({ message: formatMessage(collectionPageMessages.errorOnDelete), type: 'error' })
    }
  }, [selectedRows, deleteDialogState])

  const { data: businessTypeData } = useGetAdminGeneralDataBusinessTypeValueGetAllQuery({
    'client-name': 'generalData',
    'client-version': '0',
    pageSize: 1000,
  })

  const breadcrumbs = [
    {
      url: '/',
      title: formatMessage(collectionPageMessages.dashbord),
    },
    {
      url: '#',
      title: formatMessage(collectionPageMessages.collection),
    },
  ]

  const GridActions = useCallback(
    (props: ICellRendererParams) => {
      return (
        <GridWorkflowActionColumn
          entityId={props?.data?.id}
          factor="1"
          stateMachineCode={StateMachineCode.Collection.toString()}
          useChangeState={usePostAdminGeneralDataCollectionChangeStateMutation}
          useLazyGetStateList={useLazyGetStateInfo}
          {...props}
          menuItems={[
            {
              label: formatMessage(phrasesMessages.public),
              children: [
                {
                  icon: 'pen',
                  label: formatMessage(phrasesMessages.edit),
                  onClick: () => handleEditCollection(props.data.id),
                },
                {
                  icon: 'trashAlt',
                  label: formatMessage(phrasesMessages.delete),
                  onClick: () => setDeleteDialogState({ show: true, id: props.data.id }),
                },
              ],
            },
          ]}
          onChangesState={refreshGridData}
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
        field: 'id',
        headerName: formatMessage(collectionPageMessages.id),
        filter: 'agNumberColumnFilter',
        minWidth: 100,
        hide: true,
      },
      {
        field: 'code',
        headerName: formatMessage(collectionPageMessages.code),
        filter: 'agTextColumnFilter',
        minWidth: 130,
      },
      {
        field: 'name',
        headerName: formatMessage(collectionPageMessages.collectionName),
        filter: 'agTextColumnFilter',
        minWidth: 130,
      },
      {
        field: 'collectionType',
        headerName: formatMessage(collectionPageMessages.collectionType),
        minWidth: 110,
        filter: 'agTextColumnFilter',
        filterParams: {
          enums: businessTypeData?.data?.items?.filter(
            (item) => item.businessTypeId === BusinessTypeEnums.CollectionType + '',
          ),
        },
        cellRenderer: ({ data }: ICellRendererParams) =>
          businessTypeData?.data?.items?.find((item) => item.id == data.collectionType)?.title,
      },
      {
        field: 'maxDisplayResult',
        headerName: formatMessage(collectionPageMessages.maxDisplayResult),
        minWidth: 130,
      },
      {
        field: 'statusCode',
        headerName: formatMessage(collectionPageMessages.state),
        filter: 'agNumberColumnFilter',
        minWidth: 100,
        maxWidth: 200,
        hide: false,
        cellRenderer: ({ data }: ICellRendererParams) => (
          <HBWorkflowState
            factor="1"
            machineCode={StateMachineCode.Collection}
            stateCode={data?.stateCode}
            useGetStateInfo={useGetStateInfo}
          />
        ),
      },
    ],
    [gridRef.current?.api?.getSelectedRows()],
  )

  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerCheckboxSelection: true,
      cellRenderer: 'agGroupCellRenderer',
    }
  }, [])

  const handleChangedSelectedRows = (selectedRows: any[]) => {
    setSelectedRows(selectedRows)
  }

  const handleAddCollection = () => {
    router.push('/collection/add')
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
          { field: 'Code', operator: 'contains', value: String(value) },
          { field: 'Name', operator: 'contains', value: String(value) },
        ]
        gridRef.current!.addFilter({
          id: 'searchCollection',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef.current!.removeFilter('searchCollection')
      }
    }
  }

  const toolbarStatus = useMemo(() => {
    const disabledOnSelected = selectedRows.length > 0
    const disabledOnNoSelected = selectedRows.length === 0

    return { disabledOnSelected, disabledOnNoSelected }
  }, [selectedRows])

  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    gridRef.current?.refreshGridData(isClearSearch)
    gridRef.current!.api?.deselectAll()
  }, [])

  const [downloadFile] = usePostAdminGeneralDataCollectionDownloadExcelFileMutation()

  const handleDownload = async (props: DownloadMethodType) => {
    const { filterFields, ...res } = props
    return await downloadFile({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      getCollectionExcelQueryFilter: {
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
        editUrl="/collection/edit/"
        actionUrl={actionUrl}
        columnDefs={columnDefs}
        pagination
        paginationPageSize={25}
        rowSelection="multiple"
        enableRtl
        sideBar
        rightHeader={
          <BreadCrumbSection
            title={formatMessage(collectionPageMessages.collection)}
            breadItems={breadcrumbs}
          />
        }
        classes={classes}
        autoGroupColumnDef={autoGroupColumnDef}
        onSelectedChanged={handleChangedSelectedRows}
        detailRowAutoHeight
        ref={gridRef}
        GridToolbar={(props) => (
          <HBDataGrigToolbar
            statusProps={{ show: false }}
            onChange={handleChangedGridActions}
            addProps={{ disabled: toolbarStatus.disabledOnSelected, onClick: handleAddCollection }}
            deleteProps={{
              disabled: toolbarStatus.disabledOnNoSelected,
              onClick: () => {
                setDeleteDialogState({ show: true })
              },
            }}
            editProps={{
              disabled: selectedRows.length !== 1,
              onClick: handleEditCollection,
            }}
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
            refreshProps={{ onClick: () => refreshGridData(true) }}
            {...props}
          />
        )}
      />
      <HBDialog
        content={formatMessage(collectionPageMessages.areYouSure).replace(
          'count',
          String(deleteDialogState?.id ? 1 : selectedRows.length),
        )}
        title={formatMessage(collectionPageMessages.deleteCollection)}
        onAccept={handleDeleteCollection}
        onReject={() => setDeleteDialogState({ show: false, id: undefined })}
        open={deleteDialogState.show}
        onClose={() => setDeleteDialogState({ show: false, id: undefined })}
        acceptBtn={formatMessage(phrasesMessages.delete)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
    </>
  )
}
