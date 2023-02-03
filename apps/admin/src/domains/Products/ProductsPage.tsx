import { HBLink } from '@hasty-bazar/admin-shared/components'
import { GridWorkflowActionColumn, HBWorkflowState } from '@hasty-bazar/admin-shared/containers'
import { EnumFormHeaderStatus } from '@hasty-bazar/admin-shared/containers/formContainer/formHeader'
import {
  GridFilterFieldType,
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { DownloadMethodType } from '@hasty-bazar/admin-shared/containers/HBDataGrid/useDataGrid'
import RecordChangeHistory from '@hasty-bazar/admin-shared/containers/recordChangeHistory'
import { StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import { useAppSelector } from '@hasty-bazar/admin-shared/core/redux/hooks'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  useGetAdminCatalogApiUnitOfMeasurementGetAllQuery,
  usePutAdminCatalogProductsDeleteProductsMutation,
} from '@hasty-bazar-admin/domains/Products/catalogApi.enhanced'
import {
  GetAllProductsQueryResult,
  useGetAdminCatalogProductRulesGetStateInfoByStateCodeAndStateMachineCodeFactorQuery as useGetStateInfo,
  useLazyGetAdminCatalogProductsGetTransitionByEntityIdAndStateMachineCodeFactorQuery,
  usePostAdminCatalogProductsChangeStateMutation,
  usePostAdminCatalogProductsDownloadExcelFileMutation,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { useGetWorkflowStateMachineByStateMachineIdStateQuery } from '@hasty-bazar/admin-shared/services/workflowApi.generated'
import { commafy } from '@hasty-bazar/admin-shared/utils'
import {
  HBAgGridClasses,
  HBAutoComplete,
  HBDataGridToolbarProps,
  HBDataGrigToolbar,
  HBDialog,
  HBIconButton,
  HBMenu,
  HBTextField,
  MenuItemProps,
  openToast,
} from '@hasty-bazar/core'
import { Avatar, Box, inputLabelClasses, outlinedInputClasses } from '@mui/material'
import {
  CheckboxSelectionCallbackParams,
  ColDef,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { format } from 'date-fns-jalali'
import { useRouter } from 'next/router'
import { FC, useCallback, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import ChangeVendorDialogDialog from './containers/changeVendors'
import CopyProduct from './containers/copyProduct'
import ProductPageMessages from './ProductPage.messages'

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
const SIMPLE_PRODUCT_TYPE_CODE = 1034001
const JALALI_DATE_FORMAT = 'yyyy-MM-dd - HH:mm:ss'

enum StatusEnum {
  Draft = 1,
  ContentConfirmation = 2,
  Published = 3,
  Disabled = 4,
}
const PAGE_SIZE = 10000

export default function Products() {
  const { formatMessage } = useIntl()

  const defaultCurrency = useAppSelector((state) => String(state.app.defaultCurrencyTitle))
  const [status, setStatus] = useState<Array<{ title: string; value: StatusEnum }>>()
  const [deleteProduct] = usePutAdminCatalogProductsDeleteProductsMutation()
  const gridRef = useRef<HBDataGridClientRef>(null)
  const router = useRouter()
  const unitMeasurement = useGetAdminCatalogApiUnitOfMeasurementGetAllQuery({
    'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
    'client-version': '1.0.1.100',

    pageSize: PAGE_SIZE,
  })
  const breadcrumbs = [
    {
      url: '/',
      title: formatMessage(phrasesMessages.home),
    },
    {
      url: '#',
      title: formatMessage(ProductPageMessages.products),
    },
  ]
  const [deleteDialogState, setDeleteDialogState] = useState<{ show: boolean; id?: number }>({
    show: false,
  })
  const [changeVendorDialog, setChangeVendorDialog] = useState<{ show: boolean }>({
    show: false,
  })
  const [copyModalState, setCopyModalState] = useState<{ show: boolean; id?: string }>({
    show: false,
  })
  const [recordChangeHistoryModalState, setRecordChangeHistoryModalState] = useState<{
    show: boolean
    id?: string
    type: string
  }>({
    show: false,
    type: '',
  })
  const [selectedRows, setSelectedRows] = useState<GetAllProductsQueryResult[]>([])
  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/Catalog/products`
  const { data: { data: { items: workflowStates = [] } = {} } = {} } =
    useGetWorkflowStateMachineByStateMachineIdStateQuery({
      'client-name': 'Swagger on HIT.Hastim.StateMachine.Endpoints.WebApi',
      'client-version': '1.0.1.100',
      stateMachineId: StateMachineCode.Products as unknown as string,
    })

  const toolbarStatus = useMemo(() => {
    const disabledOnSelected = selectedRows.length > 0
    const disabledOnNoSelected = selectedRows.length === 0

    return { disabledOnSelected, disabledOnNoSelected }
  }, [selectedRows])

  const handleEditProduct = (
    id: string = selectedRows?.[0]?.id!,
    type: number = selectedRows?.[0]?.type!,
  ) => {
    const productType = type === SIMPLE_PRODUCT_TYPE_CODE ? 'simple' : 'configurable'
    router.push(`/products/${productType}-product/edit/product-details/${id}`)
  }

  const handleDelete = useCallback(async () => {
    try {
      setDeleteDialogState({ show: false, id: undefined })
      await deleteProduct({
        'client-name': 'hasty-bazar-admin',
        'client-version': '1.0.0',
        deleteProductModel: {
          productIds: selectedRows.map((x) => x.id!),
        },
      }).unwrap()
      refreshGridData()
      openToast({ message: formatMessage(ProductPageMessages.deleteSuccessfully), type: 'success' })
    } catch (e) {}
  }, [selectedRows, deleteDialogState])

  const GridActions = useCallback(
    (props: ICellRendererParams) => {
      const status = props.data?.productStatus
      const id = props.data?.id
      return (
        <GridWorkflowActionColumn
          useLazyGetStateList={
            useLazyGetAdminCatalogProductsGetTransitionByEntityIdAndStateMachineCodeFactorQuery
          }
          entityId={id}
          factor={'1'}
          stateMachineCode={String(StateMachineCode.Products)}
          useChangeState={usePostAdminCatalogProductsChangeStateMutation}
          onChangesState={refreshGridData}
          {...props}
          menuItems={[
            {
              label: formatMessage(ProductPageMessages.public),
              children: [
                {
                  icon: 'pen',
                  label: formatMessage(phrasesMessages.edit),
                  onClick: () => {
                    handleEditProduct(id, props.data.type)
                  },
                },
                {
                  icon: 'trashAlt',
                  disabled: status !== EnumFormHeaderStatus.draft,
                  label: formatMessage(phrasesMessages.delete),
                  onClick: () => setDeleteDialogState({ show: true, id }),
                },
                {
                  icon: 'copy',
                  label: formatMessage(ProductPageMessages.copy),
                  onClick: () => setCopyModalState({ show: true, id }),
                },
                {
                  icon: 'history',
                  label: formatMessage(ProductPageMessages.recordChangeHistory),
                  onClick: () =>
                    setRecordChangeHistoryModalState({ show: true, id, type: 'PRODUCT' }),
                },
              ],
            },
          ]}
        />
      )
    },
    [selectedRows],
  )

  const columnDefs = useMemo<ColDef[]>(
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
        cellRenderer: GridActions,
        checkboxSelection,
        headerCheckboxSelection,
      },

      {
        field: 'defaultImage',
        headerName: formatMessage(ProductPageMessages.picture),
        filter: 'agNumberColumnFilter',
        minWidth: 100,
        cellRenderer: (params: ICellRendererParams) => {
          return (
            <Avatar
              sizes="small"
              src={`${process.env.NEXT_PUBLIC_CDN}/${params.value}`}
              alt={params?.data?.name}
              variant="rounded"
            />
          )
        },
      },
      {
        field: 'hsin',
        headerName: formatMessage(ProductPageMessages.HSIN),
        filter: 'agTextColumnFilter',
      },

      {
        field: 'parentHSIN',
        headerName: formatMessage(ProductPageMessages.parentHSIN),
        filter: 'agTextColumnFilter',
        rowGroup: false,
        enableRowGroup: true,
      },

      {
        field: 'releaseDate',
        headerName: formatMessage(ProductPageMessages.releaseDate),
        filter: 'agTextColumnFilter',
        cellRenderer: (params: ICellRendererParams) => {
          return format(new Date(params?.value), JALALI_DATE_FORMAT)
        },
        hide: true,
      },

      {
        field: 'firstReleaseDate',
        headerName: formatMessage(ProductPageMessages.firstReleaseDate),
        filter: 'agTextColumnFilter',
        cellRenderer: (params: ICellRendererParams) => {
          return format(new Date(params?.value), JALALI_DATE_FORMAT)
        },
        hide: true,
      },

      {
        field: 'name',
        headerName: formatMessage(ProductPageMessages.productName),
        filter: 'agTextColumnFilter',
        cellRenderer: (params: ICellRendererParams) => {
          return (
            <HBLink
              sx={{
                color: 'info.main',
              }}
              onClick={(event) => {
                event.preventDefault()
                handleEditProduct(params?.data?.id, params.data.type)
              }}
            >
              {params.value}
            </HBLink>
          )
        },
      },
      {
        field: 'typeTitle' as keyof GetAllProductsQueryResult,
        headerName: formatMessage(ProductPageMessages.productType),
        filter: 'agTextColumnFilter',
        rowGroup: false,
        enableRowGroup: true,
      },

      {
        field: 'category',
        rowGroup: false,
        enableRowGroup: true,
        headerName: formatMessage(ProductPageMessages.mainGroup),
        filter: 'agTextColumnFilter',
      },
      {
        field: 'acceptableConditionTypeTitle',
        headerName: formatMessage(ProductPageMessages.productCondition),
        rowGroup: false,
        enableRowGroup: true,
        filter: 'agNumberColumnFilter',
        cellRendererParams: {
          1: 'Active',
          0: 'Inactive',
        },
      },

      {
        field: 'vendor',
        headerName: formatMessage(ProductPageMessages.seller),
        filter: 'agTextColumnFilter',
        rowGroup: false,
        enableRowGroup: true,
        cellRenderer: (params: ICellRendererParams) => {
          return (
            <HBLink
              sx={{
                color: 'info.main',
              }}
              onClick={(event) => {
                event.preventDefault()
                router.push(`/users/detail/${params?.data?.partyId}`)
              }}
            >
              {params.value}
            </HBLink>
          )
        },
      },
      {
        field: 'productStatus' as keyof GetAllProductsQueryResult,
        rowGroup: false,
        enableRowGroup: true,
        headerName: formatMessage(ProductPageMessages.level),
        filter: 'agTextColumnFilter',
        minWidth: 200,
        cellRenderer: (params: ICellRendererParams) => {
          return (
            <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
              <HBWorkflowState
                factor="1"
                machineCode={StateMachineCode.Products}
                stateCode={params?.value}
                useGetStateInfo={useGetStateInfo}
              />
            </Box>
          )
        },
      },
      {
        field: 'dna' as keyof GetAllProductsQueryResult,
        rowGroup: false,
        enableRowGroup: true,
        headerName: formatMessage(ProductPageMessages.DNA),
        filter: 'agTextColumnFilter',
        hide: true,
      },
      {
        field: 'brandName' as keyof GetAllProductsQueryResult,
        rowGroup: false,
        enableRowGroup: true,
        headerName: formatMessage(ProductPageMessages.brand),
        filter: 'agTextColumnFilter',
        hide: true,
      },
      {
        field: 'sku' as keyof GetAllProductsQueryResult,
        headerName: formatMessage(ProductPageMessages.sku),
        filter: 'agTextColumnFilter',
        hide: true,
      },
      {
        field: 'acceptableConditionTypeTitle' as keyof GetAllProductsQueryResult,
        headerName: formatMessage(ProductPageMessages.originalityTypeCode),
        filter: 'agTextColumnFilter',
        hide: true,
      },
      {
        field: 'systemName' as keyof GetAllProductsQueryResult,
        headerName: formatMessage(ProductPageMessages.productSystemTitle),
        filter: 'agTextColumnFilter',
        hide: true,
      },
      {
        field: 'originalPrice' as keyof GetAllProductsQueryResult,
        headerName: formatMessage(ProductPageMessages.originalPrice, {
          currency: defaultCurrency,
        }),
        filter: 'agTextColumnFilter',
        hide: true,
        cellRenderer: (params: ICellRendererParams) => {
          return <>{commafy(params.value)}</>
        },
      },
      {
        field: 'finalPrice' as keyof GetAllProductsQueryResult,
        headerName: formatMessage(ProductPageMessages.finalPrice, {
          currency: defaultCurrency,
        }),
        filter: 'agTextColumnFilter',
        cellRenderer: (params: ICellRendererParams) => {
          return <>{commafy(params.value)}</>
        },
        hide: true,
      },
      {
        field: 'maximalSellWithoutInventory' as keyof GetAllProductsQueryResult,
        headerName: formatMessage(ProductPageMessages.maximalSellWithoutInventory),
        filter: 'agTextColumnFilter',
        hide: true,
      },
      {
        field: 'onHandQty' as keyof GetAllProductsQueryResult,
        headerName: formatMessage(ProductPageMessages.onHandQty),
        filter: 'agTextColumnFilter',
        hide: true,
      },
      {
        field: 'shippingObligationTypeTitle' as keyof GetAllProductsQueryResult,
        headerName: formatMessage(ProductPageMessages.shippingObligationTypeTitle),
        filter: 'agTextColumnFilter',
        hide: true,
      },
      {
        field: 'unitOfMeasureId' as keyof GetAllProductsQueryResult,
        headerName: formatMessage(ProductPageMessages.unitOfMeasureId),
        filter: 'agTextColumnFilter',
        hide: true,
        cellRenderer: (params: ICellRendererParams) => {
          const unit = unitMeasurement.data?.data?.items?.find((item) => item.id === params.value)
          return unit?.name
        },
      },
    ],
    [defaultCurrency, unitMeasurement.data?.data?.items],
  )

  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    gridRef?.current?.refreshGridData(isClearSearch)
    gridRef?.current!.api?.deselectAll()
  }, [])

  const handleChangedSelectedRows = (selectedRows: any[]) => {
    setSelectedRows(selectedRows)
  }

  const handleAddProduct = (productType: 'simple' | 'configurable') => {
    router.push(`/products/${productType}-product/add/product-details`)
  }

  const handleChangedGridActions = (value: number | string, type: 'search' | 'status') => {
    if (type === 'status') {
      let filterComponent = gridRef.current!.api.getFilterInstance('productStatus')
      filterComponent &&
        filterComponent.setModel({
          type: 'equals',
          //@ts-ignore
          filter: value?.value,
        })
      gridRef.current!.api.onFilterChanged()
    } else if (type === 'search') {
      if (value) {
        const searchFields: GridFilterFieldType[] = [
          { field: 'Dna', operator: 'contains', value: String(value) },
          { field: 'HSIN', operator: 'contains', value: String(value) },
          { field: 'SystemName', operator: 'contains', value: String(value) },
          { field: 'Name', operator: 'contains', value: String(value) },
          { field: 'Category', operator: 'contains', value: String(value) },
          { field: 'Vendor', operator: 'contains', value: String(value) },
        ]
        gridRef.current!.addFilter({
          id: 'searchProduct',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef.current!.removeFilter('searchProduct')
      }
    }
  }

  const [downloadFile] = usePostAdminCatalogProductsDownloadExcelFileMutation()

  const handleDownload = async (props: DownloadMethodType) => {
    const { filterFields, ...res } = props
    return await downloadFile({
      'client-name': 'admin',
      'client-version': '1.0.0',
      getExcelProductsQueryFilter: {
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

  const toolbarMoreItems = useMemo<MenuItemProps[]>(() => {
    return [
      {
        label: formatMessage(ProductPageMessages.download),
        icon: 'fileDownload',
        onClick: handleDownloadPage,
      },
      {
        label: formatMessage(ProductPageMessages.downloadAll),
        icon: 'fileDownloadAlt',
        onClick: () => handleDownloadPage(true),
      },
      {
        label: formatMessage(ProductPageMessages.bulkEdit),
        icon: 'edit',
        onClick: () => router.push('/product-bulk-edit'),
      },
      {
        label: formatMessage(ProductPageMessages.changeVendor),
        icon: 'edit',
        onClick: () => setChangeVendorDialog({ show: true }),
        sx: { display: selectedRows?.length ? 'block' : 'none' },
      },
    ]
  }, [selectedRows])

  const toolBar = useCallback<FC<HBDataGridToolbarProps>>(
    (props) => {
      return (
        <HBDataGrigToolbar
          onChange={handleChangedGridActions}
          addProps={{
            disabled: toolbarStatus.disabledOnSelected,
            show: false,
          }}
          deleteProps={{
            disabled: toolbarStatus.disabledOnNoSelected,
            onClick: () => setDeleteDialogState({ show: true }),
          }}
          editProps={{
            disabled: selectedRows.length !== 1,
            onClick: () => handleEditProduct(selectedRows[0].id, selectedRows[0].type),
          }}
          refreshProps={{ onClick: () => refreshGridData() }}
          statusProps={{ show: false }}
          items={toolbarMoreItems!}
          {...props}
        >
          <HBMenu
            contentComponentType="div"
            content={<HBIconButton type="button" icon="plus" name="plus" />}
            menus={[
              {
                content: formatMessage(ProductPageMessages.simple),
                onClick: () => handleAddProduct('simple'),
                disabled: toolbarStatus.disabledOnSelected,
              },
              {
                content: formatMessage(ProductPageMessages.settingAble),
                disabled: toolbarStatus.disabledOnSelected,
                onClick: () => handleAddProduct('configurable'),
              },
            ]}
          />

          <HBAutoComplete
            value={status}
            onChange={(event, newValue) => {
              setStatus(newValue)
              handleChangedGridActions(newValue, 'status')
            }}
            noOptionsText={formatMessage(ProductPageMessages.noOptionsText)}
            options={
              workflowStates?.map((item) => ({
                title: String(item.title),
                value: item.code || 0,
              })) || []
            }
            getOptionLabel={(option: any) => option.title || ''}
            renderInput={(params) => (
              <HBTextField
                {...params}
                label={formatMessage(ProductPageMessages.level)}
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
      )
    },
    [selectedRows, toolbarStatus, workflowStates],
  )
  return (
    <>
      <HBDataGridClient
        onDoubleClick={(event) => {
          if (event?.data?.type === SIMPLE_PRODUCT_TYPE_CODE) {
            router.push(`/products/simple-product/edit/product-details/${event?.data?.id}`)
          } else {
            router.push(`/products/configurable-product/edit/product-details/${event?.data?.id}`)
          }
        }}
        actionUrl={actionUrl}
        columnDefs={columnDefs}
        pagination
        id="product-grid"
        rowGroupPanelShow={'always'}
        rowSelection="multiple"
        enableRtl
        sideBar
        rightHeader={
          <BreadCrumbSection
            title={formatMessage(ProductPageMessages.product)}
            breadItems={breadcrumbs}
          />
        }
        classes={classes}
        onSelectedChanged={handleChangedSelectedRows}
        detailCellRendererParams={{ title: formatMessage(ProductPageMessages.showDetail) }}
        ref={gridRef}
        GridToolbar={toolBar}
      />
      <HBDialog
        content={formatMessage(ProductPageMessages.deleteConfirmation, {
          count: selectedRows.length,
        })}
        title={formatMessage(ProductPageMessages.deleteProduct)}
        acceptBtn={formatMessage(ProductPageMessages.confirm)}
        rejectBtn={formatMessage(ProductPageMessages.cancel)}
        onReject={() => setDeleteDialogState({ show: false, id: undefined })}
        open={deleteDialogState.show}
        onAccept={handleDelete}
        onClose={() => setDeleteDialogState({ show: false, id: undefined })}
      />
      <CopyProduct
        id={copyModalState.id || ''}
        open={copyModalState.show}
        onClose={() => setCopyModalState({ show: false, id: undefined })}
      />
      <RecordChangeHistory
        id={recordChangeHistoryModalState.id!}
        open={recordChangeHistoryModalState.show}
        onClose={() => setRecordChangeHistoryModalState({ show: false, id: undefined, type: '' })}
        type={recordChangeHistoryModalState.type}
      />
      <ChangeVendorDialogDialog
        selectedRows={selectedRows}
        open={changeVendorDialog.show}
        onClose={() => setChangeVendorDialog({ show: false })}
        refetch={refreshGridData}
      />
    </>
  )
}
