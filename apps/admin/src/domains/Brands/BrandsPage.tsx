import { GridWorkflowActionColumn, HBWorkflowState } from '@hasty-bazar/admin-shared/containers'
import { HBChangeRecordHistory } from '@hasty-bazar/admin-shared/containers/HBChangeRecordHistory'
import {
  GridFilterFieldType,
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { DownloadMethodType } from '@hasty-bazar/admin-shared/containers/HBDataGrid/useDataGrid'
import { BusinessTypeEnums, StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  catalogApi,
  useGetAdminCatalogBrandsGetStateInfoByStateCodeAndStateMachineCodeFactorQuery as useGetStateInfo,
  usePostAdminCatalogBrandsChangeStateMutation,
  usePostAdminCatalogBrandsDownloadExcelFileMutation,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { useGetAdminGeneralDataBusinessTypeValueGetAllQuery } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { useGetAdminLocalityGeosQuery } from '@hasty-bazar/admin-shared/services/localityApi.generated'
import {
  HBAgGridClasses,
  HBDataGrigToolbar,
  HBDialog,
  MenuItemProps,
  openToast,
} from '@hasty-bazar/core'
import { Avatar } from '@mui/material'
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
import brandsPageMessages from './BrandsPage.messages'
import { stateType } from './containers/BrandsWorkflowState'

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

export default function Brand() {
  const router = useRouter()
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const { formatMessage } = useIntl()
  const [deleteDialogState, setDeleteDialogState] = useState<{ show: boolean; id?: number }>({
    show: false,
  })

  const [recordChangeHistory, setRecordChangeHistory] = useState({
    show: false,
    entityId: '',
  })

  const gridRef = useRef<HBDataGridClientRef>(null)
  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/Catalog/brands`
  const handleEditBrand = (id?: string) => {
    id = typeof id === 'string' ? id : selectedRows[0]?.id
    router.push(`/brands/edit/${id}`)
  }
  const gridLoading = (show: boolean) => {
    if (show) {
      gridRef.current!.api.showLoadingOverlay()
    } else {
      gridRef.current!.api.hideOverlay()
    }
  }

  const handleDeleteBrand = useCallback(async () => {
    try {
      const ids = deleteDialogState?.id
        ? [deleteDialogState?.id]
        : selectedRows.map((row) => row.id)
      let responses: any[] = []

      const requests = ids.map((id) => {
        return fetch(`${process.env.NEXT_PUBLIC_GATEWAY}/Admin/Catalog/brands/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        }).then((res) => res.json())
      })

      gridLoading(true)
      responses = await Promise.all(requests)
      const error = responses.filter((res) => !res.success).length

      setDeleteDialogState({ show: false, id: undefined })
      refreshGridData()
      gridLoading(false)

      if (error > 0) {
        openToast({
          message: `${error}${formatMessage(brandsPageMessages.unsuccessDelete)}`,
          type: 'error',
        })
      }
    } catch (e) {
      gridLoading(false)
      openToast({
        message: formatMessage(brandsPageMessages.errorOnDelete),
        type: 'error',
      })
    }
  }, [selectedRows, deleteDialogState])

  const { data: businessTypeData } = useGetAdminGeneralDataBusinessTypeValueGetAllQuery({
    'client-name': 'generalData',
    'client-version': '0',
    pageSize: 1000,
  })

  const { data: geoData } = useGetAdminLocalityGeosQuery({
    'client-name': 'Swagger on HIT.Hastim.Locality.Endpoints.WebApi',
    'client-version': '1.0.1.101',
    pageSize: 1000,
    geoTypeTypeCode: '1000005',
    geoTypeValueCode: '1',
  })

  const breadcrumbs = [
    {
      url: '/',
      title: formatMessage(brandsPageMessages.dashboard),
    },
    {
      url: '#',
      title: formatMessage(brandsPageMessages.brand),
    },
  ]

  const GridActions = useCallback(
    (props: ICellRendererParams) => {
      return (
        <GridWorkflowActionColumn
          entityId={props?.data?.id}
          factor="1"
          stateMachineCode={String(StateMachineCode.Brand)}
          useChangeState={usePostAdminCatalogBrandsChangeStateMutation}
          useLazyGetStateList={
            catalogApi.useLazyGetAdminCatalogBrandsGetTransitionByEntityIdAndStateMachineCodeFactorQuery
          }
          {...props}
          menuItems={[
            {
              label: formatMessage(brandsPageMessages.general),
              children: [
                {
                  icon: 'pen',
                  label: formatMessage(phrasesMessages.edit),
                  onClick: () => handleEditBrand(props.data.id),
                },
                {
                  icon: 'trashAlt',
                  label: formatMessage(phrasesMessages.delete),
                  onClick: () => setDeleteDialogState({ show: true, id: props.data.id }),
                },
                {
                  icon: 'historyAlt',
                  label: formatMessage(phrasesMessages.recordHistory),
                  onClick: () => setRecordChangeHistory({ show: true, entityId: props.data.id }),
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
        pinned: 'right',
        lockPinned: true,
        cellRendererParams: {
          suppressCount: true,
          suppressDoubleClickExpand: true,
          innerRenderer: GridActions,
        },
      },
      {
        field: 'id',
        headerName: formatMessage(brandsPageMessages.id),
        filter: 'agNumberColumnFilter',
        minWidth: 100,
        hide: true,
      },
      {
        field: 'name',
        headerName: formatMessage(brandsPageMessages.brandName),
        filter: 'agTextColumnFilter',
        minWidth: 130,
      },
      {
        field: 'latinName',
        headerName: formatMessage(brandsPageMessages.brandLatinName),
        filter: 'agTextColumnFilter',
        minWidth: 130,
      },
      {
        field: 'code',
        headerName: formatMessage(brandsPageMessages.code),
        filter: 'agTextColumnFilter',
        minWidth: 130,
      },
      {
        field: 'madeType',
        headerName: formatMessage(brandsPageMessages.madeType),
        minWidth: 110,
        filter: 'agTextColumnFilter',
        filterParams: {
          enums: businessTypeData?.data?.items?.filter(
            (item) => item.businessTypeId === BusinessTypeEnums.MadeType + '',
          ),
        },
        cellRenderer: ({ data }: ICellRendererParams) =>
          businessTypeData?.data?.items?.find((item) => item.id == data.madeType)?.title,
      },
      {
        field: 'countryOfOriginId',
        headerName: formatMessage(brandsPageMessages.countryOfOrigin),
        filter: 'agTextColumnFilter',
        minWidth: 130,
        cellRenderer: ({ data }: ICellRendererParams) =>
          geoData?.data?.items?.find((item) => item.id == data.countryOfOriginId)?.title,
      },
      {
        field: 'icon',
        headerName: formatMessage(brandsPageMessages.brandIcon),
        minWidth: 130,
        cellRenderer: ({ data }: ICellRendererParams) => (
          <>
            {data.icon && (
              <Avatar
                variant="rounded"
                alt={data.latinName.toUpperCase()}
                src={process.env.NEXT_PUBLIC_CDN + String(data.icon)}
                imgProps={{ sx: { objectFit: 'contain' } }}
              />
            )}
          </>
        ),
      },
      {
        field: 'foundedYear',
        headerName: formatMessage(brandsPageMessages.foundedYear),
        filter: 'agTextColumnFilter',
        minWidth: 130,
      },
      {
        field: 'isLuxBrand',
        headerName: formatMessage(brandsPageMessages.isLuxBrand),
        filter: 'agTextColumnFilter',
        minWidth: 130,
        cellRenderer: ({ data }: ICellRendererParams) =>
          data.isLuxBrand
            ? formatMessage(brandsPageMessages.yes)
            : formatMessage(brandsPageMessages.no),
      },
      {
        field: 'site',
        headerName: formatMessage(brandsPageMessages.site),
        filter: 'agTextColumnFilter',
        minWidth: 130,
        tooltipField: 'site',
      },
      {
        field: 'slogon',
        headerName: formatMessage(brandsPageMessages.slogon),
        filter: 'agTextColumnFilter',
        minWidth: 130,
        tooltipField: 'slogon',
      },
      {
        field: 'restrictionsOnUse',
        headerName: formatMessage(brandsPageMessages.restrictionsOnUse),
        filter: 'agTextColumnFilter',
        minWidth: 150,
        cellRenderer: ({ data }: ICellRendererParams) =>
          businessTypeData?.data?.items?.find((item) => item.id == data.restrictionsOnUse)?.title,
      },
      {
        field: 'stateCode',
        headerName: formatMessage(brandsPageMessages.state),
        filter: 'agTextColumnFilter',
        minWidth: 130,
        cellRenderer: ({ data }: ICellRendererParams) => (
          <HBWorkflowState
            machineCode={StateMachineCode.Brand}
            useGetStateInfo={useGetStateInfo}
            stateCode={data?.stateCode}
            factor={'1'}
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

  const handleAddAttribute = () => {
    router.push('/brands/add')
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
          { field: 'Code', value: String(value), operator: 'contains' },
          { field: 'Name', value: String(value), operator: 'contains' },
          { field: 'LatinName', value: String(value), operator: 'contains' },
        ]
        gridRef.current!.addFilter({
          id: 'searchBrand',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef.current!.removeFilter('searchBrand')
      }
    }
  }

  const toolbarStatus = useMemo(() => {
    const disabledOnSelected = selectedRows.length > 0
    const disabledOnNoSelected = selectedRows.length === 0

    return { disabledOnSelected, disabledOnNoSelected }
  }, [selectedRows])

  const handleEditAttribute = (id?: string) => {
    id = typeof id === 'string' ? id : selectedRows[0]?.id
    router.push(`/brands/edit/${id}`)
  }

  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    gridRef.current?.refreshGridData(isClearSearch)
    gridRef.current!.api?.deselectAll()
  }, [])

  const [downloadFile] = usePostAdminCatalogBrandsDownloadExcelFileMutation()

  const handleDownload = async (props: DownloadMethodType) => {
    const { filterFields, ...res } = props
    return await downloadFile({
      'client-name': 'admin',
      'client-version': '1.0.0',
      getBrandsExcelFileQueryFilter: {
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

  const toolbarMoreItems = useMemo<MenuItemProps[]>(
    //@ts-ignore
    () => {
      return [
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
      ]
    },
    [selectedRows],
  )

  return (
    <>
      <HBDataGridClient
        id="brands-grid"
        actionUrl={actionUrl}
        editUrl="/brands/edit/"
        columnDefs={columnDefs}
        pagination
        paginationPageSize={25}
        rowSelection="multiple"
        enableRtl
        sideBar
        detailRowAutoHeight
        rightHeader={
          <BreadCrumbSection
            title={formatMessage(brandsPageMessages.brand)}
            breadItems={breadcrumbs}
          />
        }
        classes={classes}
        autoGroupColumnDef={autoGroupColumnDef}
        onSelectedChanged={handleChangedSelectedRows}
        ref={gridRef}
        GridToolbar={(props) => (
          <HBDataGrigToolbar
            statusProps={{ show: false }}
            onChange={handleChangedGridActions}
            addProps={{ disabled: toolbarStatus.disabledOnSelected, onClick: handleAddAttribute }}
            deleteProps={{
              disabled: toolbarStatus.disabledOnNoSelected,
              onClick: () => {
                if (selectedRows.filter((row) => row.stateCode !== stateType.draft).length > 0) {
                  openToast({
                    message: formatMessage(
                      brandsPageMessages.someSelectedRecordsCannotBeDeletedAccordingToTheState,
                    ),
                    type: 'error',
                  })
                  return
                }
                setDeleteDialogState({ show: true })
              },
            }}
            editProps={{
              disabled: selectedRows.length !== 1,
              onClick: handleEditAttribute,
            }}
            refreshProps={{ onClick: () => refreshGridData(true) }}
            items={toolbarMoreItems!}
            {...props}
          />
        )}
      />
      <HBDialog
        content={formatMessage(brandsPageMessages.areYouSure).replace(
          'count',
          String(deleteDialogState?.id ? 1 : selectedRows.length),
        )}
        title={formatMessage(brandsPageMessages.deleteBernd)}
        onAccept={handleDeleteBrand}
        onReject={() => setDeleteDialogState({ show: false, id: undefined })}
        open={deleteDialogState.show}
        onClose={() => setDeleteDialogState({ show: false, id: undefined })}
        acceptBtn={formatMessage(phrasesMessages.delete)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
      <HBChangeRecordHistory
        open={recordChangeHistory.show}
        entityId={recordChangeHistory.entityId!}
        onClose={() => setRecordChangeHistory({ show: false, entityId: '' })}
        tableName="brand"
      />
    </>
  )
}
