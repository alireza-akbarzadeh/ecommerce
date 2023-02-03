import { HBWorkflowState } from '@hasty-bazar/admin-shared/containers'
import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { useGetAdminSaleApiShippingProvidersGetStateInfoByStateCodeAndStateMachineCodeFactorQuery as useGetStateInfo } from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { Box, Typography } from '@mui/material'
import {
  CheckboxSelectionCallbackParams,
  ColDef,
  ColGroupDef,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { RefObject, useMemo } from 'react'
import { useIntl } from 'react-intl'
import { MainReferenceEntity, ShowOneOfReferenceCode } from '../../containers'
import FinancialTransactionMessage from '../../financialTransaction.message'
import { useAppSelector } from '@hasty-bazar/admin-shared/core/redux/hooks'

const useFinancialTransaction = (gridRef: RefObject<HBDataGridClientRef>) => {
  const { formatMessage } = useIntl()
  const defaultCurrencyTitle = useAppSelector((state) => state.app.defaultCurrencyTitle)
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
            innerRenderer: () => {},
          },
        },
        {
          field: 'id',
          headerName: formatMessage(phrasesMessages.id),
          hide: true,
          filter: 'agTextColumnFilter',
        },
        {
          field: 'stateTitle',
          headerName: formatMessage(FinancialTransactionMessage.stateTitle)?.replace(':', ''),
          filter: 'agNumberColumnFilter',
          minWidth: 150,
          cellRenderer: ({ data }: ICellRendererParams) =>
            data?.stateCode && (
              <HBWorkflowState
                machineCode={StateMachineCode.FinancialTransaction}
                {...{ useGetStateInfo }}
                stateCode={data?.stateCode}
                factor={'1'}
              />
            ),
          rowGroup: false,
          enableRowGroup: true,
        },
        {
          field: 'mainReferenceDescription',
          headerName: formatMessage(FinancialTransactionMessage.mainReferenceEntity)?.replace(
            ':',
            '',
          ),
          filter: 'agTextColumnFilter',
          minWidth: 260,
          rowGroup: false,
          enableRowGroup: true,
          cellRenderer: ({ data }: ICellRendererParams) => <MainReferenceEntity {...{ data }} />,
        },
        {
          field: 'transactionTypeName',
          headerName: formatMessage(FinancialTransactionMessage.transactionTypeName),
          filter: 'agTextColumnFilter',
          minWidth: 210,
          rowGroup: false,
          enableRowGroup: true,
        },
        {
          field: 'referenceTitle',
          headerName: formatMessage(FinancialTransactionMessage.referenceEntity)?.replace(':', ''),
          filter: 'agTextColumnFilter',
          minWidth: 210,
          rowGroup: false,
          enableRowGroup: true,
        },
        {
          field: 'referenceNumber ',
          headerName: formatMessage(FinancialTransactionMessage.referenceCode)?.replace(':', ''),
          filter: 'agTextColumnFilter',
          minWidth: 180,
          rowGroup: false,
          enableRowGroup: true,
          cellRenderer: ShowOneOfReferenceCode,
        },
        {
          field: 'referenceDescription',
          headerName: formatMessage(FinancialTransactionMessage.mainReferenceDescription)?.replace(
            ':',
            '',
          ),
          filter: 'agTextColumnFilter',
          minWidth: 380,
          rowGroup: false,
          enableRowGroup: true,
        },
        {
          field: 'roleAccountPartyTitle',
          headerName: formatMessage(FinancialTransactionMessage.partyRoleTypeTitle)?.replace(
            ':',
            '',
          ),
          filter: 'agTextColumnFilter',
          minWidth: 150,
          rowGroup: false,
          enableRowGroup: true,
        },
        {
          field: 'partyName',
          headerName: formatMessage(FinancialTransactionMessage.partyFullName)?.replace(':', ''),
          filter: 'agTextColumnFilter',
          minWidth: 150,
          rowGroup: false,
          enableRowGroup: true,
        },
        {
          field: 'isReceivable',
          headerName: formatMessage(FinancialTransactionMessage.partyPaymentTypeTitle)?.replace(
            ':',
            '',
          ),
          filter: 'agTextColumnFilter',
          minWidth: 190,
          rowGroup: false,
          enableRowGroup: true,
          cellRenderer: ({ value }: ICellRendererParams) => (
            <Box display="flex" alignItems="center" height={'100%'}>
              <Typography>
                {value
                  ? formatMessage(FinancialTransactionMessage.receiver)
                  : formatMessage(FinancialTransactionMessage.payer)}
              </Typography>
            </Box>
          ),
        },
        {
          field: 'price',
          headerName: `${formatMessage(
            FinancialTransactionMessage.price,
          )}(${defaultCurrencyTitle})`,
          filter: 'agNumberColumnFilter',
          minWidth: 150,
          rowGroup: false,
          enableRowGroup: true,
          cellRenderer: (params: ICellRendererParams) => params?.value?.toLocaleString(),
        },
        {
          field: 'transactionDate',
          headerName: formatMessage(FinancialTransactionMessage.transactionDate)?.replace(':', ''),
          filter: 'agNumberColumnFilter',
          minWidth: 150,
          cellRenderer: (params: ICellRendererParams) => {
            return params.value
              ? new Date(params.value).toLocaleDateString('fa-IR', {
                  month: '2-digit',
                  day: '2-digit',
                  year: 'numeric',
                })
              : '-'
          },
          rowGroup: false,
          enableRowGroup: true,
        },
        {
          field: 'effectiveDate',
          headerName: formatMessage(FinancialTransactionMessage.effectiveDate)?.replace(':', ''),
          filter: 'agNumberColumnFilter',
          minWidth: 150,
          cellRenderer: (params: ICellRendererParams) => {
            return params.value
              ? new Date(params.value).toLocaleDateString('fa-IR', {
                  month: '2-digit',
                  day: '2-digit',
                  year: 'numeric',
                })
              : '-'
          },
          rowGroup: false,
          enableRowGroup: true,
        },
      ] as (ColDef | ColGroupDef)[],
    [gridRef.current?.api?.getSelectedRows()],
  )

  return {
    columnDefs,
    autoGroupColumnDef,
  }
}

export default useFinancialTransaction
