import WithdrawalRequestsMessages from '../messages/index.messages'
import { HBLink } from '@hasty-bazar/admin-shared/components'
import { JALALI_DATE_FORMAT } from '../variables'
import { commafy } from '@hasty-bazar/core'
import Status from '../components/status'
import { format } from 'date-fns-jalali'
import { useIntl } from 'react-intl'
import { Box } from '@mui/material'
import {
  CheckboxSelectionCallbackParams,
  ColDef,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'

function useColumns() {
  const { formatMessage } = useIntl()

  const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const columns: ColDef[] = [
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
      checkboxSelection,
      headerCheckboxSelection,
    },
    {
      field: 'insertDateTime',
      headerName: formatMessage(WithdrawalRequestsMessages.insertDateTime),
      filter: 'agTextColumnFilter',
      editable: false,
      minWidth: 160,
      cellRenderer: (params: ICellRendererParams) => {
        return (
          <Box component="bdi">
            {params?.value ? format(new Date(params?.value), JALALI_DATE_FORMAT) : ''}
          </Box>
        )
      },
    },

    {
      field: 'displayName',
      headerName: formatMessage(WithdrawalRequestsMessages.displayName),
      filter: 'agTextColumnFilter',
      minWidth: 150,
      editable: false,
    },
    {
      field: 'cellPhoneNumber',
      minWidth: 120,
      editable: false,
      headerName: formatMessage(WithdrawalRequestsMessages.cellPhoneNumber),
      filter: 'agTextColumnFilter',
      cellRenderer: (params: ICellRendererParams) => {
        return (
          <HBLink
            sx={{
              color: 'info.main',
            }}
            href={`/users/detail/${params.data.userId}`}
          >
            {params.value}
          </HBLink>
        )
      },
    },
    {
      field: 'withdrawAmount',
      minWidth: 150,
      editable: false,
      headerName: formatMessage(WithdrawalRequestsMessages.withdrawAmount),
      cellRenderer: (params: ICellRendererParams) => {
        return <Box>{commafy(params.value)}</Box>
      },
    },
    {
      field: 'cardNo',
      minWidth: 300,
      editable: false,
      headerName: formatMessage(WithdrawalRequestsMessages.cardNo),
    },
    {
      field: 'iban',
      minWidth: 300,
      editable: false,
      headerName: formatMessage(WithdrawalRequestsMessages.iban),
    },
    {
      field: 'systemicDescription',
      minWidth: 200,
      editable: false,
      headerName: formatMessage(WithdrawalRequestsMessages.systemicDescription),
    },

    {
      field: 'withdrawDate',
      headerName: formatMessage(WithdrawalRequestsMessages.withdrawDate),
      filter: 'agTextColumnFilter',
      editable: false,
      minWidth: 160,
      cellRenderer: (params: ICellRendererParams) => {
        return (
          <Box component="bdi">
            {params?.value ? format(new Date(params?.value), JALALI_DATE_FORMAT) : ''}
          </Box>
        )
      },
    },
    {
      field: 'paymentReferenceCode',
      minWidth: 200,
      editable: false,
      headerName: formatMessage(WithdrawalRequestsMessages.paymentReferenceCode),
    },
    {
      field: 'panelType',
      minWidth: 120,
      editable: false,
      headerName: formatMessage(WithdrawalRequestsMessages.panelType),
    },
    {
      field: 'withdrawStatus',
      headerName: formatMessage(WithdrawalRequestsMessages.withdrawStatus),
      minWidth: 130,
      editable: false,
      filter: 'agTextColumnFilter',
      cellRenderer: (params: ICellRendererParams) => {
        return <Status status={params.data.isCleared}>{params?.value}</Status>
      },
    },
  ]

  return {
    columns,
  }
}
export default useColumns
