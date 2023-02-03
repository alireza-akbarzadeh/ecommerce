import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { Dispatch, MutableRefObject, RefObject, SetStateAction } from 'react'
import {
  GetAdminPaymentWalletTransactionsApiArg,
  GetTransactionResponseDto,
} from '@hasty-bazar/admin-shared/services/paymentApi.generated'

export type FiltersForm = Omit<
  GetAdminPaymentWalletTransactionsApiArg,
  'client-name' | 'client-version'
>

export interface FiltersProps {
  onFilter: (value: FiltersForm) => void
  onResetFilter: () => void
}

export type MenuItem = {
  title: React.ReactNode
  value: string | number
  iconPath?: React.ReactNode
}

export type LayoutProps = {
  breadcrumbs: React.ReactNode
  dataGridAndFilters: React.ReactNode
}

export type ToolbarProps = {
  selectedRows: GetTransactionResponseDto[]
  setIsDownloadExcel: Dispatch<SetStateAction<boolean>>
  gridRef: RefObject<HBDataGridClientRef>
  oldFilters: MutableRefObject<object>
}
