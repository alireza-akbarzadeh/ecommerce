import {
  GetTransactionResponseDto,
  useLazyGetAdminPaymentWalletTransactionsQuery,
} from '@hasty-bazar/admin-shared/services/paymentApi.generated'
import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { isServer, removeEmptyFields } from '@hasty-bazar/admin-shared/utils'
import instance from '@hasty-bazar/admin-shared/core/handler'
import { useEffect, useRef, useState } from 'react'
import messages from '../messages/index.messages'
import { useStyles } from '../hooks/useStyles'
import { toast } from '@hasty-bazar/core'
import { EXCEL_URL } from '../variables'
import { FiltersForm } from '../types'
import useToolbar from './useToolbar'
import { useIntl } from 'react-intl'

function useDataGrid() {
  const { classes } = useStyles()
  const { formatMessage } = useIntl()
  const oldFilters = useRef<object>({})
  const gridRef = useRef<HBDataGridClientRef>(null)
  const [isDownloadExcel, setIsDownloadExcel] = useState(false)
  const [walletList, setWalletList] = useState<GetTransactionResponseDto[]>([])
  const [selectedRows, setSelectedRows] = useState<GetTransactionResponseDto[]>([])
  const [getWalletList, walletListResult] = useLazyGetAdminPaymentWalletTransactionsQuery()
  const { gridToolbar } = useToolbar({ selectedRows, setIsDownloadExcel, gridRef, oldFilters })

  const handleDownloadExcel = async (data: FiltersForm) => {
    try {
      const res = await instance.post(EXCEL_URL, {
        ...data,
        headers: [
          {
            nativeName: 'insertDateTime',
            faName: formatMessage(messages.insertDateTime),
          },
          {
            nativeName: 'displayName',
            faName: formatMessage(messages.displayName),
          },
          {
            nativeName: 'cellPhoneNumber',
            faName: formatMessage(messages.cellPhoneNumber),
          },
          {
            nativeName: 'withdrawAmount',
            faName: formatMessage(messages.withdrawAmount),
          },
          {
            nativeName: 'cardNo',
            faName: formatMessage(messages.cardNo),
          },
          {
            nativeName: 'iban',
            faName: formatMessage(messages.iban),
          },
          {
            nativeName: 'systemicDescription',
            faName: formatMessage(messages.systemicDescription),
          },
          {
            nativeName: 'withdrawDate',
            faName: formatMessage(messages.withdrawDate),
          },
          {
            nativeName: 'paymentReferenceCode',
            faName: formatMessage(messages.paymentReferenceCode),
          },
          {
            nativeName: 'panelType',
            faName: formatMessage(messages.panelType),
          },
          {
            nativeName: 'withdrawStatus',
            faName: formatMessage(messages.withdrawStatus),
          },
        ],
      })

      if (!isServer()) {
        window.open(res?.data?.data?.excelFile, '_blank')
      }
    } catch (error) {
      toast.error(formatMessage(error.message))
    }
  }

  const handleChangedSelectedRows = (_selectedRows: GetTransactionResponseDto[]) => {
    setSelectedRows(_selectedRows)
  }

  const handleFilters = (data: FiltersForm) => {
    const _isCleared: any = data?.isCleared
    const isCleared: any = {
      '0': false,
      '1': true,
    }
    const filterData = removeEmptyFields<FiltersForm>({
      ...data,
      fromDate: data.fromDate ? new Date(data.fromDate).toISOString() : undefined,
      toDate: data.toDate ? new Date(data.toDate).toISOString() : undefined,
      withdrawDateFrom: data.withdrawDateFrom
        ? new Date(data.withdrawDateFrom).toISOString()
        : undefined,
      withdrawDateTo: data.withdrawDateTo ? new Date(data.withdrawDateTo).toISOString() : undefined,
      type: 4,
      isCleared: isCleared[_isCleared?.value] ?? undefined,
    })

    if (isDownloadExcel) {
      setIsDownloadExcel(false)
      handleDownloadExcel(filterData)

      return
    }

    oldFilters.current = filterData

    getWalletList({
      'client-name': 'get-wallet-list',
      'client-version': '1.0.0',
      ...filterData,
    })
  }

  const handleResetFilters = () => {
    setWalletList([])
    setSelectedRows([])
  }

  useEffect(() => {
    if (walletListResult.isFetching) {
      gridRef?.current?.api?.showLoadingOverlay()
    } else {
      gridRef?.current?.api?.hideOverlay()
    }
  }, [walletListResult.isFetching])

  useEffect(() => {
    if (walletListResult.data?.data?.items?.length) {
      setWalletList(walletListResult.data?.data.items)
    } else {
      setWalletList([])
    }
  }, [walletListResult.data?.data?.items?.length])

  return {
    gridRef,
    classes,
    walletList,
    gridToolbar,
    handleFilters,
    handleResetFilters,
    handleChangedSelectedRows,
  }
}

export default useDataGrid
