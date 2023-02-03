import { HBLink } from '@hasty-bazar/admin-shared/components'
import { useAppSelector } from '@hasty-bazar/admin-shared/core/redux/hooks'
import { convertDateTimeToPersian } from '@hasty-bazar/admin-shared/utils/convertDateToPersian'
import { persianNumber } from '@hasty-bazar/admin-shared/utils/convertToPersianNumber'
import { dotfy } from '@hasty-bazar/admin-shared/utils/dotfy'
import { HBIcon } from '@hasty-bazar/core'
import { Typography } from '@mui/material'
import {
  CheckboxSelectionCallbackParams,
  ColDef,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { useMemo } from 'react'
import { useIntl } from 'react-intl'
import { StateTransaction } from '../../components'
import paymentInfoMessage from '../../paymentInfo.message'
import { IUsePaymentInfoGridColumns } from '../../types/IUsePaymentInfoGridColumns'
import useGridActions from '../useGridActions'
const usePaymentInfoGridColumns = ({ selectedRows }: IUsePaymentInfoGridColumns) => {
  const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const defaultCurrencyTitle = useAppSelector((state) => state.app.defaultCurrencyTitle)

  const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }
  const { formatMessage } = useIntl()

  const { GridActions } = useGridActions({
    selectedRows,
  })

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: '_actions',
        headerName: '',
        maxWidth: 70,
        minWidth: 70,
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
        field: 'paymentStatusTitle',
        minWidth: 150,
        headerName: formatMessage(paymentInfoMessage.transactionStatus)?.replace(':', ''),
        filter: 'agTextColumnFilter',
        cellRenderer: 'agGroupCellRenderer',
        cellRendererParams: {
          innerRenderer: StateTransaction,
        },
        rowGroup: false,
        enableRowGroup: true,
      },
      {
        field: 'id',
        headerName: formatMessage(paymentInfoMessage.transactionCode)?.replace(':', ''),
        filter: 'agTextColumnFilter',
        minWidth: 190,
      },
      {
        field: 'date',
        minWidth: 150,
        maxWidth: 200,
        hide: false,
        headerName: formatMessage(paymentInfoMessage.transactionTime)?.replace(':', ''),
        filter: 'agTextColumnFilter',
        cellRenderer: (params: ICellRendererParams) =>
          params.value && convertDateTimeToPersian(params.value),
      },
      {
        field: 'paymentBusinessTitle',
        minWidth: 180,
        headerName: formatMessage(paymentInfoMessage.for)?.replace(':', ''),
        filter: 'agTextColumnFilter',
        rowGroup: false,
        enableRowGroup: true,
      },
      {
        field: 'businessId',
        minWidth: 240,
        headerName: formatMessage(paymentInfoMessage.transactionReference)?.replace(':', ''),
        filter: 'agTextColumnFilter',
        rowGroup: false,
        enableRowGroup: true,
        cellRenderer: ({ value, data }: ICellRendererParams) => (
          <HBLink
            color={'info.main'}
            underline="none"
            href={`/ordersManagement/orderDetails/${data?.businessId}`}
          >
            {value}
          </HBLink>
        ),
      },

      {
        field: 'partyName',
        minWidth: 150,
        headerName: formatMessage(paymentInfoMessage.theAccountSide)?.replace(':', ''),
        filter: 'agTextColumnFilter',
        rowGroup: false,
        enableRowGroup: true,
      },
      {
        field: 'refNo',
        minWidth: 170,
        headerName: formatMessage(paymentInfoMessage.paymentId)?.replace(':', ''),
        filter: 'agTextColumnFilter',
      },
      {
        field: 'amount',
        minWidth: 200,
        headerName: formatMessage(paymentInfoMessage.receivedPlatform)?.replace(':', ''),
        cellRenderer: ({ value }: { value: any }) => {
          return (
            <Typography
              height="100%"
              display="flex"
              alignItems="center"
              variant="subtitle2"
              color={value ? 'success.main' : 'grey.300'}
            >
              {value ? (
                <>
                  {persianNumber(dotfy(value))} {defaultCurrencyTitle}
                  <HBIcon type="arrowUp" size="small" sx={{ color: 'success.main' }} />
                </>
              ) : (
                '-------'
              )}
            </Typography>
          )
        },
        filter: 'agNumberColumnFilter',
      },
      {
        field: 'paymentMethodName',
        headerName: formatMessage(paymentInfoMessage.paymentMethod)?.replace(':', ''),
        minWidth: 160,
        filter: 'agTextColumnFilter',
        rowGroup: false,
        enableRowGroup: true,
      },
      {
        field: 'paymentProviderName',
        minWidth: 150,
        rowGroup: false,
        enableRowGroup: true,
        headerName: formatMessage(paymentInfoMessage.paymentGetWay)?.replace(':', ''),
        filter: 'agTextColumnFilter',
      },

      {
        field: 'description',
        minWidth: 150,
        headerName: formatMessage(paymentInfoMessage.transactionDescription)?.replace(':', ''),
        filter: 'agTextColumnFilter',
      },
    ],
    [],
  )

  return { columnDefs }
}

export default usePaymentInfoGridColumns
