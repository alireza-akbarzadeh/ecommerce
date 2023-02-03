import { GridWorkflowActionColumn, HBWorkflowState } from '@hasty-bazar/admin-shared/containers'
import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { DownloadMethodType } from '@hasty-bazar/admin-shared/containers/HBDataGrid/useDataGrid'
import { StateMachineCode, VoucherWorkFlow } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  saleApi,
  useGetAdminSaleVoucherGetStateInfoByStateCodeAndStateMachineCodeFactorQuery as useGetStateInfo,
  usePostAdminSaleVoucherChangeStateMutation,
  usePostAdminSaleVoucherDownloadExcelFileMutation,
} from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { MenuItemProps } from '@hasty-bazar/core'
import {
  CheckboxSelectionCallbackParams,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { RefObject, useCallback, useMemo } from 'react'
import { useIntl } from 'react-intl'
import VoucherManagementPage from '../VoucherManagementPage.messages'
import { IdRefundable } from '../components'
import { Report } from '../containers'

type UseVoucherManagementGridTypes = {
  gridRef: RefObject<HBDataGridClientRef>
  handleDeleteDialog: () => void
  handleEditVoucher: (id: string) => void
  selectedRows: unknown[]
  refreshGridData: () => void
}

const useVoucherManagementGrid = ({
  gridRef,
  handleDeleteDialog,
  handleEditVoucher,
  selectedRows,
  refreshGridData,
}: UseVoucherManagementGridTypes) => {
  const { formatMessage } = useIntl()

  const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const GridActions = useCallback(
    (props: ICellRendererParams) => {
      return (
        <GridWorkflowActionColumn
          entityId={props?.data?.id}
          factor={String(VoucherWorkFlow.Factor)}
          stateMachineCode={String(StateMachineCode.Voucher)}
          useChangeState={usePostAdminSaleVoucherChangeStateMutation}
          useLazyGetStateList={
            saleApi.useLazyGetAdminSaleVoucherGetTransitionByEntityIdAndStateMachineCodeFactorQuery
          }
          onChangesState={refreshGridData}
          {...props}
          menuItems={[
            {
              label: formatMessage(phrasesMessages.public),
              children: [
                {
                  icon: 'pen',
                  label: formatMessage(phrasesMessages.edit),
                  onClick: () => {
                    handleEditVoucher(props.data?.id)
                  },
                },
                {
                  icon: 'trashAlt',
                  label: formatMessage(phrasesMessages.delete),
                  onClick: handleDeleteDialog,
                },
              ],
            },
          ]}
        />
      )
    },
    [selectedRows],
  )
  const columnDefs = useMemo(() => {
    return [
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
      {
        field: 'stateName',
        headerName: formatMessage(VoucherManagementPage.status),
        minWidth: 150,
        filter: 'agTextColumnFilter',
        cellRenderer: ({ data }: ICellRendererParams) => (
          <HBWorkflowState
            machineCode={StateMachineCode.Voucher}
            useGetStateInfo={useGetStateInfo}
            stateCode={data?.stateCode}
            factor={String(VoucherWorkFlow.Factor)}
          />
        ),
      },
      {
        field: 'code',
        headerName: formatMessage(VoucherManagementPage.discountCode),
        filter: 'agTextColumnFilter',
        minWidth: 130,
      },
      {
        field: 'title',
        headerName: formatMessage(VoucherManagementPage.titleDiscount),
        filter: 'agTextColumnFilter',
        minWidth: 130,
      },
      {
        field: 'providerTypeTitle',
        headerName: formatMessage(VoucherManagementPage.provider),
        filter: 'agTextColumnFilter',
        minWidth: 130,
      },
      {
        field: 'isRefundable',
        headerName: formatMessage(VoucherManagementPage.returnFeature),
        filter: 'agTextColumnFilter',
        minWidth: 155,
        cellRenderer: IdRefundable,
        cellRendererParams: {
          typeComponent: 'Refundable',
        },
      },
      {
        field: 'startDate',
        headerName: formatMessage(VoucherManagementPage.creditStartTime),
        filter: 'agDateColumnFilter',
        minWidth: 135,
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
        headerName: formatMessage(VoucherManagementPage.creditExpirationTime),
        filter: 'agDateColumnFilter',
        minWidth: 135,
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
        field: 'vendorFirstName',
        headerName: formatMessage(VoucherManagementPage.sellerFirstName),
        filter: 'agTextColumnFilter',
        minWidth: 120,
      },
      {
        field: 'vendorLastName',
        headerName: formatMessage(VoucherManagementPage.sellerLastname),
        filter: 'agTextColumnFilter',
        minWidth: 170,
      },
      {
        field: 'priceValueTypeTitle',
        headerName: formatMessage(VoucherManagementPage.discountAmountType),
        filter: 'agTextColumnFilter',
        minWidth: 140,
      },
      {
        field: 'usageTypeTitle',
        headerName: formatMessage(VoucherManagementPage.typeOfUse),
        filter: 'agTextColumnFilter',
        minWidth: 140,
      },
      {
        field: 'voucherValue',
        headerName: formatMessage(VoucherManagementPage.discountAmount),
        filter: 'agNumberColumnFilter',
        minWidth: 150,
        cellRenderer: (params: ICellRendererParams) => {
          return params.value ? params?.value?.toLocaleString() : '-'
        },
      },
      {
        field: 'maxPriceValue',
        headerName: formatMessage(VoucherManagementPage.maxPurchaseAmount),
        filter: 'agNumberColumnFilter',
        minWidth: 170,
        cellRenderer: (params: ICellRendererParams) => {
          return params.value ? params?.value?.toLocaleString() : '-'
        },
      },
      {
        field: 'minPurchaseValue',
        headerName: formatMessage(VoucherManagementPage.minDiscountAmount),
        filter: 'agNumberColumnFilter',
        minWidth: 180,
        cellRenderer: (params: ICellRendererParams) => {
          return params.value ? params?.value?.toLocaleString() : '-'
        },
      },
      {
        field: 'maxTotalPrice',
        headerName: formatMessage(VoucherManagementPage.maximumCumulativeDiscountAmount),
        filter: 'agNumberColumnFilter',
        minWidth: 200,
        cellRenderer: (params: ICellRendererParams) => {
          return params.value ? params?.value?.toLocaleString() : '-'
        },
      },

      {
        field: 'report',
        headerName: formatMessage(VoucherManagementPage.reportUsageCode),
        minWidth: 170,
        cellRenderer: Report,
      },
    ]
  }, [])

  const [postAdminSaleVoucherDownloadExcelFile] = usePostAdminSaleVoucherDownloadExcelFileMutation()

  const handleDownload = async (props: DownloadMethodType) => {
    const { filterFields, ...res } = props
    return await postAdminSaleVoucherDownloadExcelFile({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      downloadAllVoucherExcel: {
        ...res,
        ...filterFields,
      },
    })
  }

  const handleDownloadPage = (isDownloadAll?: boolean) => {
    gridRef?.current?.downloadGridData({
      downloadFileMethod: handleDownload,
      downloadAll: isDownloadAll,
    })
  }

  const voucherGridToolbarMenu = (): MenuItemProps[] => {
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
    checkboxSelection,
    headerCheckboxSelection,
    columnDefs,
    voucherGridToolbarMenu,
  }
}

export default useVoucherManagementGrid
