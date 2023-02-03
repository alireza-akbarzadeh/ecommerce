import { HBDataGridClient } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { HBIcon } from '@hasty-bazar/core'
import { Box, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import { HeaderPaymentInfo } from '../../components'
import { usePaymentInfoGridController } from '../../hooks'
import paymentInfoMessage from '../../paymentInfo.message'
const PaymentInformationPage = () => {
  const [paymentInfo, setPaymentInfo] = useState<any>([])
  const {
    columnDefs,
    formatMessage,
    classes,
    handleChangedSelectedRows,
    gridRef,
    toolBar,
    handleOnGrigReady,
    formRef,
    autoGroupColumnDef,
  } = usePaymentInfoGridController({ setPaymentInfo })
  return (
    <>
      <HeaderPaymentInfo {...{ formRef }} {...{ setPaymentInfo }} />
      <Box
        bgcolor="common.white"
        px={8}
        pt={6}
        pb={10}
        sx={{
          borderRadius: (theme) => theme.spacing(4),
          border: (theme) => `1px solid ${theme.palette.grey[200]}`,
        }}
      >
        <Box display={'inline-flex'} alignItems="center" gap={2}>
          <HBIcon type="moneyInsert" />
          <Typography variant="h6">{formatMessage(paymentInfoMessage.mangeInfos)}</Typography>
        </Box>
        <Box height={600}>
          <HBDataGridClient
            actionUrl={''}
            pagination
            paginationPageSize={10}
            ref={gridRef}
            columnDefs={columnDefs}
            onGridReady={handleOnGrigReady}
            autoGroupColumnDef={autoGroupColumnDef}
            totalRows={paymentInfo?.totalItems}
            rowData={paymentInfo?.items || []}
            rowSelection="multiple"
            editUrl="PaymentInformation/details/"
            rowGroupPanelShow={'always'}
            sideBar
            enableRtl
            serverSideSortingAlwaysResets
            serverSideFilteringAlwaysResets
            classes={classes}
            onSelectedChanged={handleChangedSelectedRows}
            detailCellRendererParams={{ title: formatMessage(phrasesMessages.details) }}
            GridToolbar={toolBar}
            pinnedBottomRowData={useMemo(
              () => [
                {
                  refNo: formatMessage(paymentInfoMessage.perPageSum),
                  amount: paymentInfo?.pageTotalDeposit ?? 0,
                  withdrawAmount: paymentInfo?.pageTotalWithdraw ?? 0,
                },
                {
                  refNo: formatMessage(paymentInfoMessage.totalSum),
                  amount: paymentInfo?.totalDeposit ?? 0,
                  withdrawAmount: paymentInfo?.totalWithdraw ?? 0,
                },
              ],
              [paymentInfo],
            )}
          />
        </Box>
      </Box>
    </>
  )
}

export default PaymentInformationPage
