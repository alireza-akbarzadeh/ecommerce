import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { DownloadMethodType } from '@hasty-bazar/admin-shared/containers/HBDataGrid/useDataGrid'
import {
  GetWalletInvoicesQueryFilter,
  TransactionType,
  usePostAdminAccountingApiFinancialTransactionGetWalletInvoicesMutation,
} from '@hasty-bazar/admin-shared/services/accountingApi.generated'
import { downloadExcelUrl } from '@hasty-bazar/admin-shared/utils/downloadUrl'
import { HBForm } from '@hasty-bazar/core'
import { Box, Stack } from '@mui/material'
import { FC, RefObject } from 'react'
import WalletForm from './WalletForm'
interface WalletModalProps {
  gridRef: RefObject<HBDataGridClientRef>
  setShowDialog: (value: boolean) => void
}

interface DropdownModel {
  fullName?: string
  id?: string
  partyId?: string
  mobile?: string
}

const WalletModal: FC<WalletModalProps> = ({ gridRef, setShowDialog }) => {
  const [walletDownloadFile] =
    usePostAdminAccountingApiFinancialTransactionGetWalletInvoicesMutation()

  const handleDownload = async (
    props: DownloadMethodType,
    formData: GetWalletInvoicesQueryFilter,
  ) => {
    const { filterFields, ...res } = props
    return await walletDownloadFile({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      getWalletInvoicesQueryFilter: {
        ...formData,
      },
    }).then((res: any) => {
      if (res?.data?.success) {
        setShowDialog(false)
        const url = res?.data?.data?.excelFile
        downloadExcelUrl(url)
      }
    })
  }

  const handleDownloadPage = (formData: GetWalletInvoicesQueryFilter, isDownloadAll?: boolean) => {
    gridRef.current?.downloadGridData({
      downloadFileMethod: (props) => handleDownload(props, formData),
      downloadAll: isDownloadAll,
    })
  }

  const handleSubmit = (values: GetWalletInvoicesQueryFilter) => {
    const formData = {
      ...values,
      customerId: values?.customerId
        ? (values?.customerId as any)?.map((customer: DropdownModel) => customer?.partyId)
        : [],
      transactionType: values?.transactionType
        ? (Number((values?.transactionType as any)?.id) as TransactionType)
        : undefined,
    }
    handleDownloadPage(formData, false)
  }

  return (
    <HBForm<GetWalletInvoicesQueryFilter> onSubmit={handleSubmit} mode="all">
      <Box sx={{ marginTop: 8 }}>
        <Stack spacing={8} alignItems="flex-start">
          <WalletForm />
        </Stack>
      </Box>
    </HBForm>
  )
}

export default WalletModal
