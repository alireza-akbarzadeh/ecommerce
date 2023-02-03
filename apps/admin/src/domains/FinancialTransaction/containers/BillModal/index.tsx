import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { DownloadMethodType } from '@hasty-bazar/admin-shared/containers/HBDataGrid/useDataGrid'
import {
  GetAllInvoicesQueryFilter,
  GetShippingProviderInvoicesQueryFilter,
  GetVendorInvoicesQueryFilter,
  usePostAdminAccountingApiFinancialTransactionGetAllInvoicesMutation,
  usePostAdminAccountingApiFinancialTransactionGetShippingProviderInvoicesMutation,
  usePostAdminAccountingApiFinancialTransactionGetVendorInvoicesMutation,
} from '@hasty-bazar/admin-shared/services/accountingApi.generated'
import { downloadExcelUrl } from '@hasty-bazar/admin-shared/utils/downloadUrl'
import { HBForm } from '@hasty-bazar/core'
import { Box, Stack } from '@mui/material'
import { FC, RefObject } from 'react'
import BillForm from './BillForm'

interface BillModalProps {
  gridRef: RefObject<HBDataGridClientRef>
  setShowDialog: (value: boolean) => void
  excelType: 'generalExcel' | 'vendorsExcel' | 'shippingCompaniesExcel'
}

interface DropdownModel {
  fullName?: string
  id: string
  mobile?: string
}

const BillModal: FC<BillModalProps> = ({ gridRef, setShowDialog, excelType }) => {
  const [getAllDownloadFile] = usePostAdminAccountingApiFinancialTransactionGetAllInvoicesMutation()
  const [vendorDownloadFile] =
    usePostAdminAccountingApiFinancialTransactionGetVendorInvoicesMutation()
  const [shippingProviderDownloadFile] =
    usePostAdminAccountingApiFinancialTransactionGetShippingProviderInvoicesMutation()

  const getAllDownload = async (props: DownloadMethodType, formData: GetAllInvoicesQueryFilter) => {
    const { filterFields, ...res } = props
    return await getAllDownloadFile({
      'client-name': 'Swagger on HIT.Hastim.Accounting.Endpoints.AdminApi',
      'client-version': '1.0.0.0',
      getAllInvoicesQueryFilter: {
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

  const vendorDownload = async (
    props: DownloadMethodType,
    formData: GetVendorInvoicesQueryFilter,
  ) => {
    const { filterFields, ...res } = props
    return await vendorDownloadFile({
      'client-name': 'Swagger on HIT.Hastim.Accounting.Endpoints.AdminApi',
      'client-version': '1.0.0.0',
      getVendorInvoicesQueryFilter: {
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

  const shippingProviderDownload = async (
    props: DownloadMethodType,
    formData: GetShippingProviderInvoicesQueryFilter,
  ) => {
    const { filterFields, ...res } = props
    return await shippingProviderDownloadFile({
      'client-name': 'Swagger on HIT.Hastim.Accounting.Endpoints.AdminApi',
      'client-version': '1.0.0.0',
      getShippingProviderInvoicesQueryFilter: {
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

  const choiseDownloadMethod = (
    props: DownloadMethodType,
    formData:
      | GetVendorInvoicesQueryFilter
      | GetAllInvoicesQueryFilter
      | GetShippingProviderInvoicesQueryFilter,
  ) => {
    if (excelType === 'generalExcel') {
      return getAllDownload(props, formData)
    } else if (excelType === 'vendorsExcel') {
      return vendorDownload(props, formData)
    } else {
      return shippingProviderDownload(props, formData)
    }
  }

  const handleDownloadPage = (
    formData:
      | GetVendorInvoicesQueryFilter
      | GetAllInvoicesQueryFilter
      | GetShippingProviderInvoicesQueryFilter,
    isDownloadAll?: boolean,
  ) => {
    gridRef.current?.downloadGridData({
      downloadFileMethod: (props) => choiseDownloadMethod(props, formData),
      downloadAll: isDownloadAll,
    })
  }

  const handleSubmit = (
    values:
      | GetVendorInvoicesQueryFilter
      | GetAllInvoicesQueryFilter
      | GetShippingProviderInvoicesQueryFilter,
  ) => {
    const formData = {
      ...values,
      customerId: values?.customerId
        ? (values?.customerId as any)?.map((customer: DropdownModel) => customer?.id)
        : [],
      vendorId: values?.vendorId
        ? (values?.vendorId as any)?.map((vendor: DropdownModel) => vendor?.id)
        : [],
      providerId: values?.providerId ? (values?.providerId as any)?.id : null,
    }
    handleDownloadPage(formData, false)
  }

  return (
    <HBForm<
      | GetVendorInvoicesQueryFilter
      | GetAllInvoicesQueryFilter
      | GetShippingProviderInvoicesQueryFilter
    >
      onSubmit={handleSubmit}
      mode="all"
    >
      <Box sx={{ marginTop: 8 }}>
        <Stack spacing={8} alignItems="flex-start">
          <BillForm />
        </Stack>
      </Box>
    </HBForm>
  )
}

export default BillModal
