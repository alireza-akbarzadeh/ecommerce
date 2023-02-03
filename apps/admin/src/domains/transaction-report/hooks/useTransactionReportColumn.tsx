import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { useAppSelector } from '@hasty-bazar/admin-shared/core/redux/hooks'
import { GetBusinessTypeValuesQueryResult } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { persianNumber } from '@hasty-bazar/admin-shared/utils/convertToPersianNumber'
import { dotfy } from '@hasty-bazar/admin-shared/utils/dotfy'
import { HBIcon } from '@hasty-bazar/core'
import { Box, Typography } from '@mui/material'
import { ICellRendererParams } from 'ag-grid-community'
import { RefObject, useMemo } from 'react'
import { useIntl } from 'react-intl'
import transactionReportMessages from '../transactionReportMessages.messages'

const numberFilterOptions = [
  'equals',
  'notEqual',
  'lessThan',
  'lessThanOrEqual',
  'greaterThan',
  'greaterThanOrEqual',
  'inRange',
]

const useTransactionReportColumn = (
  gridRef: RefObject<HBDataGridClientRef>,
  paymentProviderTypeCodes: GetBusinessTypeValuesQueryResult[],
  panelTypeCodes: GetBusinessTypeValuesQueryResult[],
) => {
  const { formatMessage } = useIntl()
  const defaultCurrency = useAppSelector((state) => String(String(state.app.defaultCurrencyTitle)))

  const columnDefs = useMemo(
    () => [
      {
        field: 'insertDateTime',
        headerName: formatMessage(transactionReportMessages.createdOn),
        filter: 'agTextColumnFilter',
        minWidth: 160,
        hide: false,
        cellRenderer: (params: ICellRendererParams) =>
          params.value &&
          new Date(params.value).toLocaleDateString('fa-IR', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          }),
      },
      {
        field: 'transactionType',
        headerName: formatMessage(transactionReportMessages.transactionTypeTitle),
        filter: 'agTextColumnFilter',
        minWidth: 130,
        hide: false,
        cellRenderer: ({ value }: ICellRendererParams) => {
          return (
            <Typography height="100%" display="flex" alignItems="center" variant="caption">
              {value === 0 && formatMessage(transactionReportMessages.withdrawAmount)}
              {value === 1 && formatMessage(transactionReportMessages.depositAmount)}
            </Typography>
          )
        },
      },
      {
        field: 'displayName',
        headerName: formatMessage(transactionReportMessages.user),
        filter: 'agTextColumnFilter',
        minWidth: 200,
        hide: false,
      },
      {
        field: 'cellPhoneNumber',
        headerName: formatMessage(transactionReportMessages.phone),
        filter: 'agTextColumnFilter',
        minWidth: 130,
        hide: false,
      },
      {
        field: 'depositAmount',
        headerName: formatMessage(transactionReportMessages.cashinAmount),
        filter: 'agTextColumnFilter',
        minWidth: 150,
        hide: false,
        cellRenderer: ({ value }: ICellRendererParams) => {
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
                  {persianNumber(dotfy(value))} {defaultCurrency}
                  <HBIcon type="arrowUp" size="small" sx={{ color: 'success.main' }} />
                </>
              ) : (
                '-------'
              )}
            </Typography>
          )
        },
        filterParams: {
          filterOptions: numberFilterOptions,
        },
      },
      {
        field: 'withdrawAmount',
        headerName: formatMessage(transactionReportMessages.cashoutAmount),
        filter: 'agTextColumnFilter',
        minWidth: 150,
        hide: false,
        cellRenderer: ({ value }: ICellRendererParams) => {
          return (
            <Box height="100%" display="flex" alignItems="center">
              {value ? (
                <>
                  <Typography variant="subtitle2" color={value ? 'error.main' : 'grey.300'} pr={1}>
                    <Box component={'span'} dir="ltr">
                      {dotfy(value)}
                    </Box>
                    {defaultCurrency}
                  </Typography>
                  <HBIcon type="arrowDown" size="small" sx={{ color: 'error.main' }} />
                </>
              ) : (
                '-------'
              )}
            </Box>
          )
        },
      },
      {
        field: 'type',
        headerName: formatMessage(transactionReportMessages.reasonTitle),
        filter: 'agTextColumnFilter',
        minWidth: 200,
        hide: false,
        cellRenderer: ({ value }: ICellRendererParams) => {
          return (
            <Typography height="100%" display="flex" alignItems="center" variant="caption">
              {value === 0 && formatMessage(transactionReportMessages.type0)}
              {value === 1 && formatMessage(transactionReportMessages.type1)}
              {value === 2 && formatMessage(transactionReportMessages.type2)}
              {value === 3 && formatMessage(transactionReportMessages.type3)}
              {value === 4 && formatMessage(transactionReportMessages.type4)}
              {value === 5 && formatMessage(transactionReportMessages.type5)}
            </Typography>
          )
        },
      },
      {
        field: 'paymentReferenceCode',
        headerName: formatMessage(transactionReportMessages.referenceTitle),
        filter: 'agTextColumnFilter',
        minWidth: 170,
        hide: false,
      },
      {
        field: 'depositeOrWithdrawProviderName',
        headerName: formatMessage(transactionReportMessages.paymentGatewayInfo),
        filter: 'agTextColumnFilter',
        minWidth: 160,
        hide: false,
      },
      {
        field: 'transactionStatus',
        headerName: formatMessage(transactionReportMessages.transactionStatus),
        filter: 'agTextColumnFilter',
        minWidth: 140,
        hide: false,
      },
      {
        field: 'panelType',
        headerName: formatMessage(transactionReportMessages.panelType),
        filter: 'agTextColumnFilter',
        minWidth: 140,
        hide: false,
        cellRenderer: ({ data }: ICellRendererParams) => {
          return panelTypeCodes?.find(
            (item) =>
              item.name?.toLowerCase() === data.additionalDataCModel?.panelType?.toLowerCase(),
          )?.title
        },
      },
      {
        field: 'paymentMethod',
        headerName: formatMessage(transactionReportMessages.paymentMethod),
        filter: 'agTextColumnFilter',
        minWidth: 140,
        hide: false,
        cellRenderer: ({ data }: ICellRendererParams) => {
          return paymentProviderTypeCodes?.find(
            (item) => item.id === data.additionalDataCModel?.paymentMethod,
          )?.title
        },
      },
      {
        field: 'systemicDescription',
        headerName: formatMessage(transactionReportMessages.systematicDescription),
        filter: 'agTextColumnFilter',
        minWidth: 200,
        hide: false,
        tooltipField: 'systemicDescription',
      },
      {
        field: 'userDescription',
        headerName: formatMessage(transactionReportMessages.partyNotes),
        filter: 'agTextColumnFilter',
        minWidth: 200,
        hide: false,
        tooltipField: 'userDescription',
      },
    ],
    [defaultCurrency],
  )

  return { columnDefs }
}
export default useTransactionReportColumn
