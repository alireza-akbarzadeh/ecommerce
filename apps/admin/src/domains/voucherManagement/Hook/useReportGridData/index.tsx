import { HBLink } from '@hasty-bazar/admin-shared/components'
import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { DownloadMethodType } from '@hasty-bazar/admin-shared/containers/HBDataGrid/useDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { usePostAdminSaleVoucherByIdGetVoucherCustomerInfoDownloadExcelFileMutation } from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { convertDateToPersian } from '@hasty-bazar/admin-shared/utils'
import { MenuItemProps } from '@hasty-bazar/core'
import {
  CheckboxSelectionCallbackParams,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { RefObject, useCallback, useMemo } from 'react'
import { useIntl } from 'react-intl'
import VoucherManagementPageMessages from '../../VoucherManagementPage.messages'
import ReportGridActionColumn from '../../components/reportUsageCodeModal/reportGrid/ReportGridActionColumn'
interface IUseReportGridData {
  gridRef: RefObject<HBDataGridClientRef>
  id: string
  selectedRows: unknown[]
}
function useReportGridData({ gridRef, id, selectedRows }: IUseReportGridData) {
  const { formatMessage } = useIntl()
  const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }
  const GridActions = useCallback(
    (props: ICellRendererParams) => {
      return <ReportGridActionColumn {...props} />
    },
    [selectedRows],
  )

  const columnDefs = useMemo(
    () => [
      {
        field: 'id',
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
      {
        field: 'customerFirstName',
        headerName: formatMessage(VoucherManagementPageMessages.customerFirstName),
        minWidth: 120,
        filter: 'agTextColumnFilter',
        cellRenderer: ({ value, data }: ICellRendererParams) =>
          value ? (
            <HBLink href={`/users/detail/${data?.customerId}/`} target="_blank" underline="none">
              {value?.toLocaleString()}
            </HBLink>
          ) : (
            '-'
          ),
      },
      {
        field: 'customerLastName',
        headerName: formatMessage(VoucherManagementPageMessages.customerLastName),
        minWidth: 150,
        filter: 'agTextColumnFilter',
        cellRenderer: ({ value, data }: ICellRendererParams) =>
          value ? (
            <HBLink href={`/users/detail/${data?.customerId}/`} target="_blank" underline="none">
              {value?.toLocaleString()}
            </HBLink>
          ) : (
            '-'
          ),
      },
      {
        field: 'shoppingCartCode',
        headerName: formatMessage(VoucherManagementPageMessages.purchaseOrder),
        filter: 'agTextColumnFilter',
        minWidth: 150,
        cellRenderer: ({ value, data }: ICellRendererParams) =>
          value ? (
            <HBLink
              href={`/ordersManagement/orderDetails/${data?.shoppingCartCode}/`}
              target="_blank"
              underline="none"
              color={'info.main'}
            >
              {value?.toLocaleString()}
            </HBLink>
          ) : (
            '-'
          ),
      },
      {
        field: 'orderNumber',
        headerName: formatMessage(VoucherManagementPageMessages.orderNumber),
        filter: 'agNumberColumnFilter',
        minWidth: 200,
      },
      {
        field: 'shoppingCartFinalPrice',
        headerName: formatMessage(VoucherManagementPageMessages.totalAmountPurchaseOrder),
        filter: 'agNumberColumnFilter',
        minWidth: 180,
        cellRenderer: ({ value }: ICellRendererParams) => (value ? value?.toLocaleString() : '-'),
      },
      {
        field: 'shoppingCartCreatedOn',
        headerName: formatMessage(VoucherManagementPageMessages.datePurchaseOrder),
        filter: 'agDateColumnFilter',
        minWidth: 150,
        cellRenderer: ({ value }: ICellRendererParams) => convertDateToPersian(value),
      },
      {
        field: 'voucherUsedPriceValue',
        headerName: formatMessage(VoucherManagementPageMessages.amountUsedDiscountCode),
        filter: 'agNumberColumnFilter',
        minWidth: 200,
        cellRenderer: ({ value }: ICellRendererParams) => (value ? value?.toLocaleString() : '-'),
      },
      {
        field: 'voucherRemainedPriceValue',
        headerName: formatMessage(VoucherManagementPageMessages.remainingAmountDiscountCode),
        filter: 'agNumberColumnFilter',
        minWidth: 180,
        cellRenderer: ({ value }: ICellRendererParams) => (value ? value?.toLocaleString() : '-'),
      },
    ],
    [selectedRows],
  )

  const [PostAdminSaleVoucherByIdGetVoucherCustomerInfoDownloadExcelFile] =
    usePostAdminSaleVoucherByIdGetVoucherCustomerInfoDownloadExcelFileMutation()

  const handleDownload = async (props: DownloadMethodType) => {
    const { filterFields, ...res } = props
    return await PostAdminSaleVoucherByIdGetVoucherCustomerInfoDownloadExcelFile({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      downloadVoucherUsageCustomerInfoExcel: {
        ...res,
        ...filterFields,
      },
      id,
    })
  }

  const handleDownloadPage = (isDownloadAll?: boolean) => {
    gridRef?.current?.downloadGridData({
      downloadFileMethod: handleDownload,
      downloadAll: isDownloadAll,
    })
  }
  const userGridToolbarMenu = (): MenuItemProps[] => {
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
  }

  return {
    columnDefs,
    userGridToolbarMenu,
  }
}

export default useReportGridData
