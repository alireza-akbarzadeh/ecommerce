import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import {
  BankAccountType,
  TransactionReasonType,
  TransactionStatusEnum,
  TransactionType,
} from '@hasty-bazar-commerce/core/enums'
import { useGetWebIdrCustomersByIdBankAccountsQuery } from '@hasty-bazar-commerce/services/idrApi.generated'
import {
  TransactionStatus,
  useGetWebPaymentWalletBalanceQuery,
  useGetWebPaymentWalletOptionsQuery,
  useGetWebPaymentWalletTransactionsQuery,
} from '@hasty-bazar-commerce/services/paymentApi.generated'
import {
  commafy,
  HBAgGrid,
  HBAgGridClasses,
  HBButton,
  HBIcon,
  HBIconButton,
  HBToast,
} from '@hasty-bazar/core'
import { Box, paginationClasses, Stack, Typography } from '@mui/material'
import { ColDef, FilterChangedEvent } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { default as dayjs } from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { useSession } from 'next-auth/react'
import { FC, useEffect, useMemo, useRef, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { ShowTostType } from '../addressManagment/AddressManagment'
import CustomDatePickerFilter from './components/CustomDatePickerFilter'
import DepositDialog from './containers/DepositDialog'
import WalletRulesDialog from './containers/WalletRulesDialog'
import WithdrawDialog from './containers/withdrawDialog'
import WalletMessages from './wallet.messages'
import { BankCardStyle, InventoryContainerStyle, TitleStyle } from './wallet.styles'

dayjs.extend(utc)

const numberFilterOptions = [
  'equals',
  'notEqual',
  'lessThan',
  'lessThanOrEqual',
  'greaterThan',
  'greaterThanOrEqual',
  'inRange',
]

const classes: HBAgGridClasses = {
  wrapper: {
    height: 550,
  },
}

interface IFilter {
  cashinAmount: string
  cashoutAmount: string
  description: string
  fromDateTime: string
  reason: string
  toDateTime: string
  transactionType: string
  filter: string
}

const filterInitialValue: IFilter = {
  cashinAmount: '',
  cashoutAmount: '',
  description: '',
  fromDateTime: '',
  reason: '',
  toDateTime: '',
  transactionType: '',
  filter: '',
}

const Wallet: FC = () => {
  const { data: userData } = useSession()
  const { formatMessage, formatDate } = useIntl()
  const [openWithdrawDialog, setOpenWithdrawDialog] = useState(false)
  const [openWalletRulesDialog, setOpenWalletRulesDialog] = useState(false)
  const gridRef = useRef<AgGridReact | null>(null)
  const [openDepositDialog, setOpenDepositDialog] = useState(false)
  const [showTost, setShowToast] = useState<ShowTostType>({ open: false, message: '' })
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [filterObject, setFilterObject] = useState<IFilter | null>(null)

  const { data: walletSetting } = useGetWebPaymentWalletOptionsQuery({
    ...ApiConstants,
  })

  const { data: walletData, refetch: walletRefetch } = useGetWebPaymentWalletBalanceQuery(
    {
      ...ApiConstants,
    },
    { skip: !userData },
  )

  const { data: bankAccountsData } = useGetWebIdrCustomersByIdBankAccountsQuery({
    ...ApiConstants,
    id: userData?.user?.partyRoleId!,
  })

  const defaultCardNumber = bankAccountsData?.data?.items?.find(
    (item) => item.isDefault && item.cardNumberStateCode === BankAccountType.verified,
  )?.cardNumber

  const defaultShabaNumber = bankAccountsData?.data?.items?.find(
    (item) => item.isDefault && item.ibanStateCode === BankAccountType.verified,
  )?.iban

  const { withdrawingWalletAllowed } = walletSetting?.data || {}

  const selectTransactionReasonType: Record<TransactionReasonType, { title: string }> = {
    [TransactionReasonType.Deposit]: {
      title: formatMessage(WalletMessages.depositTitle),
    },
    [TransactionReasonType.Payment]: {
      title: formatMessage(WalletMessages.paymentTitle),
    },
    [TransactionReasonType.Refund]: {
      title: formatMessage(WalletMessages.refundTitle),
    },
    [TransactionReasonType.Transfer]: {
      title: formatMessage(WalletMessages.transferTitle),
    },
    [TransactionReasonType.Withdraw]: {
      title: formatMessage(WalletMessages.withdrawTitle),
    },
    [TransactionReasonType.Undefined]: {
      title: formatMessage(WalletMessages.undefinedTitle),
    },
  }

  const selectTransactionType: Record<TransactionType, { title: string; color: string }> = {
    [TransactionType.Deposit]: {
      title: formatMessage(WalletMessages.depositTypeTitle),
      color: 'success.main',
    },
    [TransactionType.Withdraw]: {
      title: formatMessage(WalletMessages.withdrawTypeTitle),
      color: 'error.main',
    },
  }

  const getTransactionStatus = (status: TransactionStatus): { title: string; color: string } => {
    switch (status) {
      case TransactionStatusEnum.NotCleared:
        return {
          title: formatMessage(WalletMessages.transactionWaitingStatus),
          color: 'primary.main',
        }
      case TransactionStatusEnum.Cleared:
      case TransactionStatusEnum.SuccessFull:
        return {
          title: formatMessage(WalletMessages.transactionVerifiedStatus),
          color: 'success.main',
        }
      default:
        return {
          title: formatMessage(WalletMessages.transactionFailedStatus),
          color: 'error.main',
        }
    }
  }

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: 'insertDateTime',
        headerName: formatMessage(WalletMessages.date),
        // filter: 'agDateColumnFilter',
        width: 150,
        cellRenderer: ({ value }: { value: string }) => {
          return (
            <Stack
              sx={{
                direction: 'rtl',
                color: 'text.secondary',
              }}
            >
              {value
                ? formatDate(value, {
                    timeStyle: 'short',
                    dateStyle: 'short',
                  })
                : ''}
            </Stack>
          )
        },
      },
      {
        field: 'transactionType',
        headerName: formatMessage(WalletMessages.transactionType),
        // filter: CustomTransitionTypeFilter,
        width: 140,
        cellRenderer: ({ value }: { value: TransactionType }) => {
          return (
            <Typography
              height="100%"
              display="flex"
              alignItems="center"
              variant="subtitle2"
              color={selectTransactionType[value]?.color}
            >
              {selectTransactionType[value]?.title}
            </Typography>
          )
        },
      },
      {
        field: 'type',
        headerName: formatMessage(WalletMessages.reason),
        //  filter: 'agTextColumnFilter',
        width: 250,
        cellRenderer: ({ value }: { value: TransactionReasonType }) => {
          return (
            <Typography
              height="100%"
              display="flex"
              alignItems="center"
              variant="subtitle2"
              color="text.secondary"
            >
              {selectTransactionReasonType[value]?.title}
            </Typography>
          )
        },
      },
      {
        field: 'depositAmount',
        headerName: formatMessage(WalletMessages.depositAmount),
        // filter: 'agNumberColumnFilter',
        width: 140,
        aggFunc: 'sum',
        cellRenderer: ({ value }: { value: number }) => {
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
                  {commafy(value)} {currency}
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
        headerName: formatMessage(WalletMessages.withdrawAmount),
        // filter: 'agNumberColumnFilter',
        width: 140,
        aggFunc: 'sum',
        cellRenderer: ({ value }: { value: number }) => {
          return (
            <Box height="100%" display="flex" alignItems="center">
              {value ? (
                <>
                  <Typography variant="subtitle2" color={value ? 'error.main' : 'grey.300'} pr={1}>
                    {commafy(value)} {currency}
                  </Typography>
                  <HBIcon type="arrowDown" size="small" sx={{ color: 'error.main' }} />
                </>
              ) : (
                <Typography color="grey.300">-------</Typography>
              )}
            </Box>
          )
        },
        filterParams: {
          filterOptions: numberFilterOptions,
        },
      },
      {
        field: 'transactionStatus',
        headerName: formatMessage(WalletMessages.status),
        width: 160,
        cellRenderer: ({ value }: { value: TransactionStatus }) => {
          return (
            <Typography
              height="100%"
              display="flex"
              alignItems="center"
              variant="subtitle2"
              color={getTransactionStatus(value)?.color}
            >
              {value === null ? '' : getTransactionStatus(value)?.title}
            </Typography>
          )
        },
      },
      // TODO get from api , commented for current state of app
      // {
      //   field: 'userDescription',
      //   headerName: formatMessage(WalletMessages.note),
      //   width: 250,
      //   cellRenderer: (params: ICellRendererParams) => {
      //     return (
      //       <Box height="100%" display="flex" alignItems="center">
      //         {params.value ? (
      //           <Typography variant="subtitle2" color="info.main" pr={1}>
      //             {params.value}
      //           </Typography>
      //         ) : (
      //           <Typography color="grey.300">-------</Typography>
      //         )}
      //       </Box>
      //     )
      //   },
      //   sortable: false,
      // },
    ],
    [],
  )

  const {
    isFetching: gettingHistoryLoading,
    data: historyData,
    refetch: historyRefetch,
  } = useGetWebPaymentWalletTransactionsQuery(
    {
      ...ApiConstants,
      pageSize,
      pageNumber,
      ...(!!filterObject && {
        cashinAmount: +(filterObject?.cashinAmount || 0),
        cashoutAmount: +(filterObject?.cashinAmount || 0),
        description: filterObject.description || '',
        reason: filterObject.reason || '',
        toDateTime: filterObject.toDateTime || '',
        transactionType: filterObject.transactionType || '',
        fromDateTime: filterObject.fromDateTime || '',
        filter: filterObject.filter || '',
      }),
      // ordering: 'DateTime Desc',
    },
    { skip: !userData },
  )
  const currency = historyData?.data?.currencyTitle

  useEffect(() => {
    if (userData?.user.partyId) {
      historyRefetch()
      walletRefetch()
    }
  }, [userData?.user?.partyId])

  const handleSuccess = () => {
    walletRefetch()
    historyRefetch()
    setOpenDepositDialog(false)
    setOpenWithdrawDialog(false)
  }

  const filterStringNeedAnd = (filterString: string) => {
    if (filterString) {
      return (filterString += 'And')
    }
    return filterString
  }
  const renderFilterString = (filters: any) => {
    const currentFilter: IFilter = filterInitialValue
    let filterString = ''
    if (filters.dateTime) {
      const dateFrom = dayjs
        .utc(dayjs(filters.dateTime.dateFrom), 'YYYY-MM-DD HH:mm:ss')
        .format('YYYY-MM-DD')
      const dateTo = dayjs
        .utc(dayjs(filters.dateTime.dateTo), 'YYYY-MM-DD HH:mm:ss')
        .format('YYYY-MM-DD')
      filterString = filterStringNeedAnd(filterString)
      switch (filters.dateTime.type) {
        case 'inRange':
          currentFilter.fromDateTime = dateFrom
          currentFilter.toDateTime = dateTo
          filterString += `dateTime >= @fromDateTime && dateTime <= @toDateTime `
          break
        case 'equals':
          currentFilter.fromDateTime = dateFrom
          filterString += `DateTime == @fromDateTime `
          break
        case 'greaterThan':
          currentFilter.fromDateTime = dateFrom
          filterString += `dateTime > @fromDateTime `
          break
        case 'lessThan':
          currentFilter.fromDateTime = dateFrom

          filterString += `dateTime < @fromDateTime `
          break
        case 'notEqual':
          currentFilter.fromDateTime = dateFrom

          filterString += `dateTime != @fromDateTime `
          break
        default:
          break
      }
    }

    if (filters.transactionType) {
      currentFilter.transactionType = filters.transactionType.value

      filterString = filterStringNeedAnd(filterString)
      filterString += ` TransactionType=@transactionType `
    }
    if (filters.cashinAmount) {
      filterString = filterStringNeedAnd(filterString)
      filterString += ' cashinAmount '
      switch (filters.cashinAmount.type) {
        case 'equals':
          currentFilter.cashinAmount = filters.cashinAmount.filter
          filterString += ` == @cashinAmount `
          break
        case 'notEqual':
          currentFilter.cashinAmount = filters.cashinAmount.filter
          filterString += ` != @cashinAmount `
          break
        case 'lessThan':
          currentFilter.cashinAmount = filters.cashinAmount.filter
          filterString += ` < @cashinAmount `
          break
        case 'lessThanOrEqual':
          currentFilter.cashinAmount = filters.cashinAmount.filter

          filterString += ` <= @cashinAmount `
          break
        case 'greaterThan':
          currentFilter.cashinAmount = filters.cashinAmount.filter
          filterString += ` > @cashinAmount `
          break
        case 'greaterThanOrEqual':
          currentFilter.cashinAmount = filters.cashinAmount.filter
          filterString += ` >= @cashinAmount `
          break
        // case 'inRange':
        //   filterString += ` >= ${filters.cashinAmount.filter} And cashinAmount <= ${filters.cashinAmount.filterTo} `
        //   break
        default:
          break
      }
    }
    if (filters.cashoutAmount) {
      filterString = filterStringNeedAnd(filterString)
      filterString += ' cashoutAmount '
      switch (filters.cashoutAmount.type) {
        case 'equals':
          currentFilter.cashoutAmount = filters.cashoutAmount.filter

          filterString += ` == @cashoutAmount `
          break
        case 'notEqual':
          currentFilter.cashoutAmount = filters.cashoutAmount.filter

          filterString += ` != @cashoutAmount `
          break
        case 'lessThan':
          currentFilter.cashoutAmount = filters.cashoutAmount.filter

          filterString += ` < @cashoutAmount `
          break
        case 'lessThanOrEqual':
          currentFilter.cashoutAmount = filters.cashoutAmount.filter

          filterString += ` <= @cashoutAmount `
          break
        case 'greaterThan':
          currentFilter.cashoutAmount = filters.cashoutAmount.filter

          filterString += ` > @cashoutAmount `
          break
        case 'greaterThanOrEqual':
          currentFilter.cashoutAmount = filters.cashoutAmount.filter

          filterString += ` >= @cashoutAmount `
          break
        // case 'inRange':
        //   filterString += ` >= ${filters.cashoutAmount.filter} And cashoutAmount <= ${filters.cashinAmount.filterTo} `
        //   break
        default:
          break
      }
    }
    setPageNumber(1)
    currentFilter.filter = filterString
    setFilterObject({ ...filterObject, ...currentFilter })
    // setFilterString(filterString)
  }

  useEffect(() => {
    historyRefetch()
  }, [pageNumber, pageSize, filterObject])

  const onFilterChanged = (event: FilterChangedEvent) => {
    const filters = event.api.getFilterModel()
    renderFilterString(filters)
  }

  useEffect(() => {
    if (!gridRef.current?.api?.setRowData || !historyData?.data?.items) return
    gridRef.current.api.setRowData(historyData.data.items)
  }, [historyData])

  useEffect(() => {
    if (gridRef.current?.api?.showLoadingOverlay) {
      if (gettingHistoryLoading) {
        gridRef.current?.api.showLoadingOverlay()
      } else {
        gridRef.current?.api.hideOverlay()
      }
    }
  }, [gettingHistoryLoading])

  return (
    <Box bgcolor="common.white" width="100%" p={2} pb={10}>
      <TitleStyle color="grey.900">
        <FormattedMessage {...WalletMessages.accountBallance} />
      </TitleStyle>
      <InventoryContainerStyle>
        <BankCardStyle>
          <Stack alignItems="flex-end">
            {walletData?.data?.value !== undefined && walletData?.data?.value >= 0 && (
              <Typography variant="h6" color="info.dark" mb={4} mr={1}>
                {commafy(walletData?.data?.value)} {currency}
              </Typography>
            )}

            <Box display="flex" justifyContent="flex-end" alignItems="center">
              <Typography variant="button" color="info.light">
                <FormattedMessage {...WalletMessages.inventory} />
              </Typography>
              <HBIconButton
                onClick={() => walletRefetch()}
                variant="text"
                icon="redo"
                iconSize="medium"
                sx={{ color: 'info.light' }}
              />
            </Box>
          </Stack>
        </BankCardStyle>
        <Box
          width={{ xs: 300, sm: 320 }}
          gap={2}
          mt={6}
          display="flex"
          justifyContent="space-between"
        >
          {!!withdrawingWalletAllowed && (
            <HBButton
              size="small"
              onClick={() => setOpenWithdrawDialog(true)}
              sx={{ width: '50%', whiteSpace: 'nowrap' }}
              variant="outlined"
            >
              <FormattedMessage {...WalletMessages.requestWithdraw} />
            </HBButton>
          )}
          <HBButton
            size="small"
            sx={{
              width: withdrawingWalletAllowed ? '50%' : '100%',
              boxShadow: 'none',
            }}
            variant="contained"
            onClick={() => setOpenDepositDialog(true)}
          >
            <FormattedMessage {...WalletMessages.increaseInevtory} />
          </HBButton>
        </Box>
      </InventoryContainerStyle>
      <TitleStyle color="info.main" mt={{ md: 6, sm: 0, xs: 0 }} alignItems="center">
        <Box
          component="span"
          mr={4}
          py={2}
          sx={{ cursor: 'pointer' }}
          onClick={() => setOpenWalletRulesDialog(true)}
        >
          <FormattedMessage {...WalletMessages.walletRules} />
        </Box>
        <HBIcon type="arrowLeft" />
      </TitleStyle>
      <TitleStyle mt={{ md: 8, sm: 4, xs: 4 }} mb={6} color="grey.900">
        <FormattedMessage {...WalletMessages.transactionsHistory} />
      </TitleStyle>
      <Box
        height={600}
        sx={{
          [`& .${paginationClasses.ul}`]: {
            flexDirection: 'row !important',
          },
        }}
      >
        <HBAgGrid
          ref={gridRef}
          animateRows={false}
          className="wallet-data-grid"
          columnDefs={columnDefs}
          enableRangeSelection
          suppressRowClickSelection
          rowDragManaged
          pagination
          totalRows={historyData?.data?.totalItems || 0}
          noToolbar
          masterDetail
          detailCellRenderer={detailCellRenderer}
          detailRowHeight={150}
          paginationOptions={{ hideGoto: true }}
          components={{ agDateInput: CustomDatePickerFilter }}
          onFilterChanged={onFilterChanged}
          paginationPageSize={pageSize}
          onPageChange={setPageNumber}
          onPageSizeChange={setPageSize}
          pinnedBottomRowData={[
            {
              transactionStatus: null,
              depositAmount: historyData?.data?.depositTotal ?? 0,
              withdrawAmount: historyData?.data?.withdrawTotal ?? 0,
              partyNotes: null,
            },
          ]}
          classes={classes}
        />
      </Box>
      {openDepositDialog && <DepositDialog onClose={() => setOpenDepositDialog(false)} />}
      <WalletRulesDialog
        open={openWalletRulesDialog}
        onClose={() => setOpenWalletRulesDialog(false)}
      />
      {/* removed note option for current state of product */}
      {/* {openNoteModal.open && (
        <NoteDialog
          open
          note={openNoteModal.note}
          onClose={(needToRefetch) => {
            if (needToRefetch) historyRefetch()
            setOpenNoteModal({ open: false, note: '', partyWalletId: '' })
          }}
          partyWalletId={openNoteModal.partyWalletId}
        />
      )} */}
      <HBToast
        open={showTost.open}
        message={showTost.message}
        type={showTost?.type || 'error'}
        autoHideDuration={6000}
        onClose={() => setShowToast({ open: false, message: '', type: showTost?.type })}
      />
      {openWithdrawDialog && (
        <WithdrawDialog
          onClose={() => setOpenWithdrawDialog(false)}
          handleSuccess={handleSuccess}
          data={{
            walletValue: walletData?.data?.value ?? 0,
            walletSetting,
            cardNumber: defaultCardNumber ?? '',
            shabaNumber: defaultShabaNumber ?? '',
          }}
        />
      )}
    </Box>
  )
}

export default Wallet

const detailCellRenderer = (params: any) => {
  const {
    data: { description },
  } = params
  return (
    <Box
      bgcolor="common.white"
      px={6}
      py={4}
      sx={{
        border: (theme) => `5px solid ${theme.palette.grey[100]}`,
        height: '100%',
        borderRadius: 2,
      }}
    >
      <Typography variant="body1" color="text.primary">
        {description ?? '-------'}
      </Typography>
    </Box>
  )
}
