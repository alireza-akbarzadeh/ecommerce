import {
  GridFilterFieldType,
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { BusinessTypeEnums } from '@hasty-bazar/admin-shared/core/enums'
import { useAppSelector } from '@hasty-bazar/admin-shared/core/redux/hooks'
import transactionReportMessages from '@hasty-bazar-admin/domains/transaction-report/transactionReportMessages.messages'
import userPageMessages from '@hasty-bazar-admin/domains/Users/UserPage.messages'
import {
  GetBusinessTypeValuesQueryResult,
  useGetAdminGeneralDataBusinessTypeValueGetAllQuery,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { GetPartyDetailsQueryResult } from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { dotfy } from '@hasty-bazar/admin-shared/utils/dotfy'
import { HBDataGrigToolbar, HBIcon } from '@hasty-bazar/core'
import { Box, Typography } from '@mui/material'
import { ICellRendererParams } from 'ag-grid-community'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'

type WalletHistoryTableType = {
  details: GetPartyDetailsQueryResult
}

const numberFilterOptions = [
  'equals',
  'notEqual',
  'lessThan',
  'lessThanOrEqual',
  'greaterThan',
  'greaterThanOrEqual',
  'inRange',
]

const pageSize = 10

const WalletHistoryTable = ({ details }: WalletHistoryTableType) => {
  const { formatMessage } = useIntl()
  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/Payment/wallet/user-transactions/${details.mobile}`

  const defaultCurrency = useAppSelector((state) => String(String(state.app.defaultCurrencyTitle)))

  const [{ panelTypeCodes, paymentProviderTypeCodes }, setBusinessTypes] = useState<
    Record<string, GetBusinessTypeValuesQueryResult[]>
  >({
    panelTypeCodes: [],
    paymentProviderTypeCodes: [],
  })

  const { data } = useGetAdminGeneralDataBusinessTypeValueGetAllQuery({
    'client-name': 'generalData',
    'client-version': '0',
    pageSize: 1000,
  })

  const getBusinessTypes = (businessTypes: GetBusinessTypeValuesQueryResult[]) => {
    const panelTypeCodes = businessTypes.filter(
      (item) => item.businessTypeId === BusinessTypeEnums.PanelType + '',
    )

    const paymentProviderTypeCodes = businessTypes.filter(
      (item) => item.businessTypeId === BusinessTypeEnums.paymentProviderType + '',
    )

    setBusinessTypes({
      panelTypeCodes,
      paymentProviderTypeCodes,
    })
  }

  useEffect(() => {
    if (data?.data?.items) {
      getBusinessTypes(data.data.items)
    }
  }, [data])

  const gridRef = useRef<HBDataGridClientRef>(null)
  const [dataGrid, setDataGrid] = useState<any>(null)

  const columnDefs = useMemo(
    () => [
      {
        field: 'insertDateTime',
        headerName: formatMessage(userPageMessages.insertDate),
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
        headerName: formatMessage(userPageMessages.transactionTypeTitle),
        filter: 'agTextColumnFilter',
        minWidth: 180,
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
        field: 'paymentReferenceCode',
        headerName: formatMessage(userPageMessages.reference),
        filter: 'agTextColumnFilter',
        minWidth: 130,
        hide: false,
      },
      {
        field: 'depositAmount',
        headerName: formatMessage(userPageMessages.cashinAmount),
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
                  {dotfy(value)} {defaultCurrency}
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
        headerName: formatMessage(userPageMessages.cashoutAmount),
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
        headerName: formatMessage(userPageMessages.reason),
        filter: 'agTextColumnFilter',
        minWidth: 170,
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
        field: 'depositeOrWithdrawProviderName',
        headerName: formatMessage(userPageMessages.paymentGatewayInfo),
        filter: 'agTextColumnFilter',
        minWidth: 170,
        hide: false,
      },
      {
        field: 'transactionStatus',
        headerName: formatMessage(userPageMessages.paymentStatus),
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
          return panelTypeCodes.length
            ? panelTypeCodes?.find(
                (item) =>
                  item.name?.toLowerCase() === data.additionalDataCModel?.panelType?.toLowerCase(),
              )?.title
            : ''
        },
      },
      {
        field: 'paymentMethod',
        headerName: formatMessage(transactionReportMessages.paymentMethod),
        filter: 'agTextColumnFilter',
        minWidth: 140,
        hide: false,
        cellRenderer: ({ data }: ICellRendererParams) => {
          return paymentProviderTypeCodes.length
            ? paymentProviderTypeCodes?.find(
                (item) => item.id === data.additionalDataCModel?.paymentMethod,
              )?.title
            : ''
        },
      },
      {
        field: 'systemicDescription',
        headerName: formatMessage(userPageMessages.systematicDescription),
        filter: 'agTextColumnFilter',
        minWidth: 200,
        hide: false,
        tooltipField: 'systemicDescription',
      },
      {
        field: 'userDescription',
        headerName: formatMessage(userPageMessages.partyNotes),
        filter: 'agTextColumnFilter',
        minWidth: 200,
        hide: false,
        tooltipField: 'userDescription',
      },
    ],
    [panelTypeCodes, paymentProviderTypeCodes, defaultCurrency],
  )

  const handleChangedGridActions = (value: number | string, type: 'search') => {
    if (type === 'search') {
      if (value) {
        const searchFields: GridFilterFieldType[] = [
          { field: 'SystematicDescription', operator: 'contains', value: String(value) },
        ]
        gridRef.current!.addFilter({
          id: 'searchWalletHistory',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef.current!.removeFilter('searchWalletHistory')
      }
    }
  }

  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    gridRef.current?.refreshGridData(isClearSearch)
    gridRef.current!.api.deselectAll()
  }, [])

  return (
    <>
      <Box sx={({ palette }) => ({ background: palette.grey[100], borderRadius: 2 })} py={3} px={2}>
        <Typography variant="subtitle1">
          {formatMessage(userPageMessages.paymentHistory)}
        </Typography>
      </Box>
      <Box height={650}>
        <HBDataGridClient
          ref={gridRef}
          actionUrl={actionUrl}
          columnDefs={columnDefs}
          pagination
          paginationPageSize={pageSize}
          cacheBlockSize={pageSize}
          maxBlocksInCache={1}
          pinnedBottomRowData={useMemo(
            () => [
              {
                paymentReferenceCode: formatMessage(userPageMessages.perPageSum),
                depositAmount: dataGrid?.pageDepositTotal ?? 0,
                withdrawAmount: dataGrid?.pageWithdrawTotal ?? 0,
              },
              {
                paymentReferenceCode: formatMessage(userPageMessages.totalSum),
                depositAmount: dataGrid?.depositTotal ?? 0,
                withdrawAmount: dataGrid?.withdrawTotal ?? 0,
              },
            ],
            [dataGrid],
          )}
          onDataChange={(data) => setDataGrid(data)}
          GridToolbar={(props) => (
            <HBDataGrigToolbar
              onChange={handleChangedGridActions}
              addProps={{ show: false }}
              deleteProps={{ show: false }}
              editProps={{ show: false }}
              statusProps={{ show: false }}
              searchProps={{ openPosition: 'right', show: true }}
              refreshProps={{ onClick: () => refreshGridData(true) }}
              {...props}
            />
          )}
        />
      </Box>
    </>
  )
}
export default WalletHistoryTable
