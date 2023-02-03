import {
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { GetBusinessTypeValuesQueryResult } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBAgGridClasses, HBDataGrigToolbar } from '@hasty-bazar/core'
import { Box } from '@mui/system'
import { FC, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import useTransactionReportColumn from '../hooks/useTransactionReportColumn'
import useTransactionReportGrid from '../hooks/useTransactionReportGrid'
import transactionReportMessages from '../transactionReportMessages.messages'

type TransactionGridProps = {
  actionUrl?: string
  paymentProviderTypeCodes: GetBusinessTypeValuesQueryResult[]
  panelTypeCodes: GetBusinessTypeValuesQueryResult[]
}

export const classes: HBAgGridClasses = {
  wrapper: {
    height: 580,
  },
}

const TransactionGrid: FC<TransactionGridProps> = ({
  actionUrl = '',
  paymentProviderTypeCodes,
  panelTypeCodes,
}) => {
  const { formatMessage } = useIntl()
  const gridRef = useRef<HBDataGridClientRef>(null)

  const { columnDefs } = useTransactionReportColumn(
    gridRef,
    paymentProviderTypeCodes,
    panelTypeCodes,
  )
  const { handleChangedGridActions, refreshGridData } = useTransactionReportGrid(gridRef)

  const [dataGrid, setDataGrid] = useState<any>(null)

  //TODO: For ChipData
  // useEffect(() => {
  //   const chipArray: ChipData[] = []
  //   Object.keys(filters).map(function (key: string) {
  //     switch (key) {
  //       case 'fromDateTime':
  //         filters[key] &&
  //           chipArray.push({
  //             key: 'fromDateTime',
  //             label: formatMessage(transactionReportMessages.fromDateTime),
  //             value: new Date(filters[key]).toLocaleDateString('fa-IR', {
  //               month: '2-digit',
  //               day: '2-digit',
  //               year: 'numeric',
  //             }),
  //           })
  //         break
  //       case 'toDateTime':
  //         filters[key] &&
  //           chipArray.push({
  //             key: 'toDateTime',
  //             label: formatMessage(transactionReportMessages.toDateTime),
  //             value: new Date(filters[key]).toLocaleDateString('fa-IR', {
  //               month: '2-digit',
  //               day: '2-digit',
  //               year: 'numeric',
  //             }),
  //           })
  //         break
  //       case 'transactionType':
  //         filters[key] &&
  //           chipArray.push({
  //             key: 'transactionType',
  //             label: formatMessage(transactionReportMessages.transactionTypeTitle),
  //             value: filters[key]?.title,
  //           })
  //         break
  //       case 'referenceReason':
  //         filters[key] &&
  //           chipArray.push({
  //             key: 'referenceReason',
  //             label: formatMessage(transactionReportMessages.reason),
  //             value: filters[key]?.title,
  //           })
  //         break
  //       case 'paymentMethod':
  //         filters[key] &&
  //           chipArray.push({
  //             key: 'paymentMethod',
  //             label: formatMessage(transactionReportMessages.paymentMethod),
  //             value: filters[key]?.title,
  //           })
  //         break
  //       case 'transactionStatus':
  //         filters[key] &&
  //           chipArray.push({
  //             key: 'transactionStatus',
  //             label: formatMessage(transactionReportMessages.transactionStatus),
  //             value: filters[key]?.title,
  //           })
  //         break
  //       case 'panelType':
  //         filters[key] &&
  //           chipArray.push({
  //             key: 'panelType',
  //             label: formatMessage(transactionReportMessages.panelType),
  //             value: filters[key]?.title,
  //           })
  //         break
  //       case 'roleAccountParty':
  //         filters[key] &&
  //           chipArray.push({
  //             key: 'roleAccountParty',
  //             label: formatMessage(transactionReportMessages.role),
  //             value: filters[key]?.title,
  //           })
  //         break
  //       case 'fromDepositAmount':
  //         filters[key] &&
  //           chipArray.push({
  //             key: 'fromDepositAmount',
  //             label: formatMessage(transactionReportMessages.fromDepositAmount),
  //             value: persianNumber(commafy(filters[key])),
  //           })
  //         break
  //       case 'toDepositAmount':
  //         filters[key] &&
  //           chipArray.push({
  //             key: 'toDepositAmount',
  //             label: formatMessage(transactionReportMessages.toDepositAmount),
  //             value: persianNumber(commafy(filters[key])),
  //           })
  //         break
  //       case 'fromWithdrawAmount':
  //         filters[key] &&
  //           chipArray.push({
  //             key: 'fromWithdrawAmount',
  //             label: formatMessage(transactionReportMessages.fromWithdrawAmount),
  //             value: persianNumber(commafy(filters[key])),
  //           })
  //         break
  //       case 'toWithdrawAmount':
  //         filters[key] &&
  //           chipArray.push({
  //             key: 'toWithdrawAmount',
  //             label: formatMessage(transactionReportMessages.toWithdrawAmount),
  //             value: persianNumber(commafy(filters[key])),
  //           })
  //         break
  //       default:
  //         break
  //     }
  //   })
  //   setChipData?.(chipArray)
  // }, [filters])

  // const handleDelete = (chipToDelete: ChipData) => () => {
  //   // setChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key))
  //   if (chipToDelete.key === 'toDateTime' || chipToDelete.key === 'fromDateTime') {
  //     setValue(chipToDelete.key, null)
  //   } else {
  //     setValue(chipToDelete.key, '')
  //   }
  // }

  return (
    <Box sx={{ height: 700 }}>
      {/* <List component={Stack} direction="row" sx={{ flexWrap: 'wrap' }}>
        {chipData?.map((data) => {
          return (
            <ListItem key={data.key} sx={{ width: 'fit-content', paddingLeft: 0 }}>
              <Chip
                label={data.label + ':' + data.value}
                 onDelete={handleDelete(data)}
              />
            </ListItem>
          )
        })}
      </List> */}
      <HBDataGridClient
        actionUrl={actionUrl}
        pagination
        classes={classes}
        paginationPageSize={10}
        serverSideSortingAlwaysResets
        serverSideFilteringAlwaysResets
        ref={gridRef}
        columnDefs={columnDefs}
        maxBlocksInCache={1}
        pinnedBottomRowData={useMemo(
          () => [
            {
              cellPhoneNumber: formatMessage(transactionReportMessages.perPageSum),
              depositAmount: dataGrid?.pageDepositTotal ?? 0,
              withdrawAmount: dataGrid?.pageWithdrawTotal ?? 0,
            },
            {
              cellPhoneNumber: formatMessage(transactionReportMessages.totalSum),
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
            moreProps={{ show: false }}
            searchProps={{ openPosition: 'right', show: false }}
            refreshProps={{ onClick: () => refreshGridData(true) }}
            {...props}
          />
        )}
      />
    </Box>
  )
}
export default TransactionGrid
