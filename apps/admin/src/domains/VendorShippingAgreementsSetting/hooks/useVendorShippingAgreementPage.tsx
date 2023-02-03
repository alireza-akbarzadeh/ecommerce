import { HBWorkflowState } from '@hasty-bazar/admin-shared/containers'
import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  GetAdminSaleApiVendorShippingContractGetAllApiArg,
  useGetAdminSaleApiVendorShippingContractGetStateInfoByStateCodeAndStateMachineCodeFactorQuery as useGetStateInfo,
} from '@hasty-bazar/admin-shared/services/saleApi.generated'
import {
  CheckboxSelectionCallbackParams,
  ColDef,
  ColGroupDef,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { useRouter } from 'next/router'
import { RefObject, useMemo } from 'react'
import { useIntl } from 'react-intl'
import GridAction from '../components/GridAction'
import VendorShippingAgrrementsMessages from '../VendorShippingAgreements.message'
interface ProductModel {
  productId: string
  productTitle: string
}
interface CategoryModel {
  categoryId: string
  categoryTitle: string
}
const useVendorShippingAgreementPage = (
  gridRef: RefObject<HBDataGridClientRef>,
  selectedRows: GetAdminSaleApiVendorShippingContractGetAllApiArg[],
  onDelete: (show: boolean, id: number) => void,
) => {
  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/Sale/api/VendorShippingContract/GetAll`
  const { formatMessage } = useIntl()
  const router = useRouter()
  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerCheckboxSelection: true,
      cellRenderer: 'agGroupCellRenderer',
    }
  }, [])

  const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const vendorShippingEdit = (id?: string | number) => {
    id = typeof id === 'string' ? id : selectedRows[0]?.id
    router.push(`/vendorShippingAgreementSetting/edit/${id}`)
  }

  const onEdit = (id: string | number) => {
    vendorShippingEdit(id)
  }

  const columnDefs = useMemo(
    () =>
      [
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
            innerRenderer: (params: ICellRendererParams) => (
              <GridAction {...params} {...{ onEdit, onDelete, gridRef }} />
            ),
          },
        },
        {
          field: 'id',
          headerName: formatMessage(phrasesMessages.id),
          hide: true,
          filter: 'agTextColumnFilter',
        },
        {
          field: 'contractStateTitle',
          headerName: formatMessage(VendorShippingAgrrementsMessages.contractStateTitle),
          minWidth: 150,
          filter: 'agTextColumnFilter',
          cellRenderer: ({ data }: ICellRendererParams) =>
            data?.contractState && (
              <HBWorkflowState
                machineCode={StateMachineCode.VendorShippingAgreementsSetting}
                {...{ useGetStateInfo }}
                stateCode={data?.contractState}
                factor={'1'}
              />
            ),
        },
        {
          field: 'code',
          headerName: formatMessage(VendorShippingAgrrementsMessages.code),
          filter: 'agTextColumnFilter',
          minWidth: 140,
        },
        {
          field: 'vendorTitle',
          headerName: formatMessage(VendorShippingAgrrementsMessages.vendorTitle),
          filter: 'agTextColumnFilter',
          minWidth: 120,
        },
        {
          field: 'startDate',
          headerName: formatMessage(VendorShippingAgrrementsMessages.startDate),
          minWidth: 150,
          filter: 'agTextColumnFilter',
          cellRenderer: (params: ICellRendererParams) => {
            return params.value
              ? new Date(params.value).toLocaleDateString('fa-IR', {
                  month: '2-digit',
                  day: '2-digit',
                  year: 'numeric',
                })
              : '-'
          },
        },
        {
          field: 'endDate',
          headerName: formatMessage(VendorShippingAgrrementsMessages.endDate),
          minWidth: 150,
          filter: 'agTextColumnFilter',
          cellRenderer: (params: ICellRendererParams) => {
            return params.value
              ? new Date(params.value).toLocaleDateString('fa-IR', {
                  month: '2-digit',
                  day: '2-digit',
                  year: 'numeric',
                })
              : '-'
          },
        },
        {
          field: 'shippingObligationTypeTitle',
          headerName: formatMessage(VendorShippingAgrrementsMessages.shippingObligationTypeTitle),
          filter: 'agTextColumnFilter',
          minWidth: 160,
        },
        {
          field: 'contractTypeTitle',
          headerName: formatMessage(VendorShippingAgrrementsMessages.contractTypeTitle),
          filter: 'agTextColumnFilter',
          minWidth: 180,
        },
        {
          field: 'products',
          headerName: formatMessage(VendorShippingAgrrementsMessages.productTitle),
          filter: false,
          minWidth: 200,
          cellRenderer: ({ data }: ICellRendererParams) =>
            data?.products?.map((product: ProductModel) => product.productTitle).join(','),
          tooltipField: 'productTitle',
          sortable: false,
        },
        {
          field: 'categories',
          headerName: formatMessage(VendorShippingAgrrementsMessages.categoryTitle),
          filter: false,
          minWidth: 200,
          cellRenderer: ({ data }: ICellRendererParams) =>
            data?.categories?.map((category: CategoryModel) => category.categoryTitle).join(','),
          tooltipField: 'categoryTitle',
          sortable: false,
        },
        {
          field: 'minPurchaseAmount',
          headerName: formatMessage(VendorShippingAgrrementsMessages.minPurchaseAmount),
          filter: 'agTextColumnFilter',
          minWidth: 140,
          cellRenderer: (params: ICellRendererParams) => params?.value?.toLocaleString(),
        },
        {
          field: 'costCoverageTitle',
          headerName: formatMessage(VendorShippingAgrrementsMessages.costCoverageTitle),
          filter: 'agTextColumnFilter',
          minWidth: 140,
        },
        {
          field: 'coverageAmount',
          headerName: formatMessage(VendorShippingAgrrementsMessages.coverageAmount),
          filter: 'agTextColumnFilter',
          minWidth: 120,
          cellRenderer: (params: ICellRendererParams) => params?.value?.toLocaleString(),
        },
        {
          field: 'shippingCostInOrigin',
          headerName: formatMessage(VendorShippingAgrrementsMessages.shippingCostInOrigin),
          filter: 'agTextColumnFilter',
          minWidth: 180,
          cellRenderer: (params: ICellRendererParams) => params?.value?.toLocaleString(),
        },
        {
          field: 'shippingCostInElseWhere',
          headerName: formatMessage(VendorShippingAgrrementsMessages.shippingCostInElseWhere),
          filter: 'agTextColumnFilter',
          minWidth: 190,
          cellRenderer: (params: ICellRendererParams) => params?.value?.toLocaleString(),
        },
        {
          field: 'paidAmountByVendor',
          headerName: formatMessage(VendorShippingAgrrementsMessages.paidAmountByVendor),
          filter: 'agTextColumnFilter',
          minWidth: 170,
          cellRenderer: (params: ICellRendererParams) => params?.value?.toLocaleString(),
        },
      ] as (ColDef | ColGroupDef)[],
    [gridRef.current?.api?.getSelectedRows()],
  )

  return {
    actionUrl,
    columnDefs,
    autoGroupColumnDef,
  }
}

export default useVendorShippingAgreementPage
