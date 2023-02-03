import { HBLink } from '@hasty-bazar/admin-shared/components'
import { HBWorkflowState } from '@hasty-bazar/admin-shared/containers'
import { StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import { useAppSelector } from '@hasty-bazar/admin-shared/core/redux/hooks'
import {
  BulkUpdateProductListItem,
  useGetAdminCatalogApiUnitOfMeasurementGetAllQuery,
  useGetAdminCatalogProductsGetStateInfoByStateCodeAndStateMachineCodeFactorQuery as useGetStateInfo,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { commafy, HBIconButton } from '@hasty-bazar/core'
import { Box, Typography } from '@mui/material'
import {
  CheckboxSelectionCallbackParams,
  ColDef,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { format } from 'date-fns-jalali'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { useIntl } from 'react-intl'
import ProductBulkEditMessages from '../../ProductBulkEdit.messages'

import { HBInventoryTextFieldEditor, HBPriceTextFieldEditor } from './customCellEditors'
import Status, { PossibilityOfEditingProductEnum } from './status'

type ProductType = BulkUpdateProductListItem
const PAGE_SIZE = 1000
const SIMPLE_PRODUCT_TYPE_CODE = 1034001
const JALALI_DATE_FORMAT = 'yyyy-MM-dd - HH:mm:ss'

function useBulkEditGridData() {
  const { formatMessage } = useIntl()
  const defaultCurrency = useAppSelector((state) => state.app.defaultCurrencyTitle)
  const router = useRouter()
  const unitMeasurement = useGetAdminCatalogApiUnitOfMeasurementGetAllQuery({
    'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
    'client-version': '1.0.1.100',

    pageSize: PAGE_SIZE,
  })

  const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }
  const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }
  const columns: ColDef[] = useMemo(
    () => [
      {
        field: '_actions',
        headerName: '',
        maxWidth: 110,
        minWidth: 110,
        resizable: false,
        sortable: false,
        editable: false,
        filter: false,
        suppressAutoSize: true,
        suppressMenu: true,
        // cellRenderer: GridActions,
        checkboxSelection,
        headerCheckboxSelection,
      },
      {
        field: 'hsin',
        headerName: formatMessage(ProductBulkEditMessages.HSIN),
        filter: 'agTextColumnFilter',
        editable: false,
      },

      {
        field: 'parentHSIN',
        headerName: formatMessage(ProductBulkEditMessages.parentHSIN),
        filter: 'agTextColumnFilter',
        rowGroup: false,
        editable: false,
        enableRowGroup: true,
        hide: true,
      },

      {
        field: 'releaseDate',
        headerName: formatMessage(ProductBulkEditMessages.releaseDate),
        filter: 'agTextColumnFilter',
        editable: false,
        cellRenderer: (params: ICellRendererParams) => {
          return format(new Date(params?.value), JALALI_DATE_FORMAT)
        },
        hide: true,
      },
      {
        field: 'firstReleaseDate',
        editable: false,
        headerName: formatMessage(ProductBulkEditMessages.firstReleaseDate),
        filter: 'agTextColumnFilter',
        cellRenderer: (params: ICellRendererParams) => {
          return format(new Date(params?.value), JALALI_DATE_FORMAT)
        },
        hide: true,
      },

      {
        field: 'name',
        editable: false,
        headerName: formatMessage(ProductBulkEditMessages.productName),
        filter: 'agTextColumnFilter',
        cellRenderer: (params: ICellRendererParams) => {
          const productType =
            params?.data?.type === SIMPLE_PRODUCT_TYPE_CODE ? 'simple' : 'configurable'
          return (
            <HBLink
              sx={{
                color: 'info.main',
              }}
              href={`/products/${productType}-product/edit/product-details/${params?.data?.id}/`}
            >
              {params.value}
            </HBLink>
          )
        },
      },
      {
        field: 'typeTitle',

        editable: false,
        headerName: formatMessage(ProductBulkEditMessages.productType),
        filter: 'agTextColumnFilter',
        rowGroup: false,
        enableRowGroup: true,
      },
      {
        headerName: formatMessage(ProductBulkEditMessages.originalPrice, {
          currency: defaultCurrency,
        }),
        field: 'originalPrice' as keyof ProductType,
        cellEditor: HBPriceTextFieldEditor,
        minWidth: 140,
        cellRenderer: (params: ICellRendererParams) => {
          return (
            <Typography
              variant="body2"
              sx={{
                bgcolor: params.data.changedOriginalPrice ? 'warning.light' : undefined,
                textAlign: 'center',
              }}
            >
              {commafy(params.value)}
            </Typography>
          )
        },
      },
      {
        headerName: formatMessage(ProductBulkEditMessages.finalPrice, {
          currency: defaultCurrency,
        }),
        field: 'finalPrice' as keyof ProductType,

        minWidth: 140,
        cellEditor: HBPriceTextFieldEditor,
        cellRenderer: (params: ICellRendererParams) => {
          return (
            <Typography
              variant="body2"
              minWidth={'max-content'}
              sx={{
                bgcolor: params.data.changedFinalPrice ? 'warning.light' : undefined,
                textAlign: 'center',
              }}
            >
              {commafy(params.value)}
            </Typography>
          )
        },
      },

      {
        headerName: formatMessage(ProductBulkEditMessages.inventory),
        field: 'inventory' as keyof ProductType,

        cellEditor: HBInventoryTextFieldEditor,
        cellRenderer: (params: ICellRendererParams) => {
          return (
            <Typography
              variant="body2"
              sx={{
                bgcolor: params.data.changedInventory ? 'warning.light' : undefined,
                textAlign: 'center',
              }}
            >
              {commafy(params.value)}
            </Typography>
          )
        },
      },

      {
        field: 'possibilityOfEditingTitle',
        headerName: formatMessage(ProductBulkEditMessages.possibilityOfEditingTitle),
        filter: 'agTextColumnFilter',
        minWidth: 150,
        editable: false,
        cellRenderer: (params: ICellRendererParams) => {
          const { possibilityOfEditingTitle, possibilityOfEditing } = params.data
          return (
            <Status
              systemMessage={possibilityOfEditingTitle}
              status={possibilityOfEditing as unknown as PossibilityOfEditingProductEnum}
            />
          )
        },
      },
      {
        field: 'category',
        editable: false,
        rowGroup: false,
        enableRowGroup: true,
        headerName: formatMessage(ProductBulkEditMessages.mainGroup),
        filter: 'agTextColumnFilter',
        hide: true,
      },
      {
        field: 'acceptableConditionTypeTitle',
        headerName: formatMessage(ProductBulkEditMessages.productCondition),
        rowGroup: false,
        editable: false,
        enableRowGroup: true,
        filter: 'agNumberColumnFilter',
        cellRendererParams: {
          1: 'Active',
          0: 'Inactive',
        },
        hide: true,
      },

      {
        field: 'vendor',
        headerName: formatMessage(ProductBulkEditMessages.seller),
        filter: 'agTextColumnFilter',
        rowGroup: false,
        editable: false,
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
        hide: true,
      },
      {
        field: 'state',
        rowGroup: false,
        editable: false,
        enableRowGroup: true,
        headerName: formatMessage(ProductBulkEditMessages.state),
        filter: 'agTextColumnFilter',
        minWidth: 200,
        cellRenderer: (params: ICellRendererParams) => {
          return (
            <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
              <HBWorkflowState
                factor="1"
                machineCode={StateMachineCode.Products}
                stateCode={params?.data?.stateCode}
                useGetStateInfo={useGetStateInfo}
              />
            </Box>
          )
        },
        hide: true,
      },
      {
        field: 'dna',
        rowGroup: false,
        editable: false,
        enableRowGroup: true,
        headerName: formatMessage(ProductBulkEditMessages.DNA),
        filter: 'agTextColumnFilter',
        hide: true,
      },
      {
        field: 'brandName',
        rowGroup: false,
        editable: false,
        enableRowGroup: true,
        headerName: formatMessage(ProductBulkEditMessages.brand),
        filter: 'agTextColumnFilter',
        hide: true,
      },
      {
        field: 'sku',
        editable: false,
        headerName: formatMessage(ProductBulkEditMessages.SKU),
        filter: 'agTextColumnFilter',
        hide: true,
      },
      {
        field: 'acceptableConditionTypeTitle',
        headerName: formatMessage(ProductBulkEditMessages.originalityTypeCode),
        filter: 'agTextColumnFilter',
        hide: true,
        editable: false,
      },
      {
        field: 'systemName',
        headerName: formatMessage(ProductBulkEditMessages.productSystemTitle),
        filter: 'agTextColumnFilter',
        hide: true,
        editable: false,
      },
      {
        field: 'maximalSellWithoutInventory',
        headerName: formatMessage(ProductBulkEditMessages.maximalSellWithoutInventory),
        filter: 'agTextColumnFilter',
        hide: true,
        editable: false,
      },
      {
        field: 'onHandQty',
        headerName: formatMessage(ProductBulkEditMessages.onHandQty),
        filter: 'agTextColumnFilter',
        hide: true,
        editable: false,
      },
      {
        field: 'shippingObligationTypeTitle',
        headerName: formatMessage(ProductBulkEditMessages.shippingObligationTypeTitle),
        filter: 'agTextColumnFilter',
        hide: true,
        editable: false,
      },
      {
        editable: false,
        field: 'unitOfMeasureId',
        headerName: formatMessage(ProductBulkEditMessages.unitOfMeasureId),
        filter: 'agTextColumnFilter',
        hide: true,
        cellRenderer: (params: ICellRendererParams) => {
          const unit = unitMeasurement.data?.data?.items?.find((item) => item.id === params.value)
          return unit?.name
        },
      },
      {
        headerName: '',
        field: 'actionButton',
        maxWidth: 100,
        editable: true,
        cellEditor: (params: ICellRendererParams) => {
          return (
            <HBIconButton
              onClick={() => {
                params?.api?.stopEditing()
              }}
              icon={'check'}
            />
          )
        },
      },
    ],
    [unitMeasurement.data?.data?.items],
  )

  return {
    columns,
    checkboxSelection,
    headerCheckboxSelection,
  }
}
export default useBulkEditGridData
