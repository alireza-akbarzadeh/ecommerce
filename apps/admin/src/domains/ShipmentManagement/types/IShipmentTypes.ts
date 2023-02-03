import { OnGridReadyParams } from '@hasty-bazar/admin-shared/core/types'
import { GetAllProductsQueryResult } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { GetBusinessTypeValuesByBusinessTypeQueryResult } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { GetCustomersLookupQueryResult } from '@hasty-bazar/admin-shared/services/idrApi.generated'
import {
  GetAllFlatShipmentOrderBundlesQueryFilter,
  GetAllShippingProvidersQueryResult,
} from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { GetStatesQueryResult } from '@hasty-bazar/admin-shared/services/workflowApi.generated'
import { RefObject } from 'react'

interface IShipmentModelForm
  extends Omit<
    GetAllFlatShipmentOrderBundlesQueryFilter,
    'dateFilterTypeCode' | 'status' | 'providerId' | 'agentId' | 'customerId'
  > {
  dateFilterTypeCode: GetBusinessTypeValuesByBusinessTypeQueryResult
  providerId: GetAllShippingProvidersQueryResult[]
  agentId: GetAllShippingProvidersQueryResult[]
  status: GetStatesQueryResult[]
  customerId: GetCustomersLookupQueryResult[]
  isProduct?: boolean
}

interface IShipmentFilterFiled {
  handleRemoveFilter: () => void
  formRef: RefObject<HTMLButtonElement>
  isValid: boolean
}

interface IShipmentData extends IShipmentModelForm {
  totalVatPrice: number
  totalCommission: number
  totalFinalPrice: number
  totalDiscountPrice: number
  totalOriginalPrice: number
  totalPackagingAmount: number
  totalVendorShare: number
  totalCustomerShare: number
  totalPlatformShare: number
  totalVendorDemand: number
  totalDiscountAmount: number
  totalShipmentAmount: number
  pagedTotalCommission: number
  pagedFinalPrice: number
  pagedOriginalPrice: number
  PagedVendorShare: number
  pagedPackagingAmount: number
  pagedVendorShare: number
  pagedCustomerShare: number
  pagedPlatformShare: number
  pagedVendorDemand: number
  pagedDiscountPrice: number
  pagedTotalQuantity: number
  pagedShipmentAmount: number
  totalItems: number
  totalQuantity: number
  items: GetAllProductsQueryResult[]
}
interface IShipmentGrid {
  shippingData: IShipmentData | undefined
  isProduct: boolean
  handleOnGridReady: (val: OnGridReadyParams) => void
}

interface IUseGridActions {
  selectedRows: any[]
  navigateToDetails: (id: string) => void
  refreshGridData: () => void
}

export type {
  IShipmentGrid,
  IShipmentModelForm,
  IShipmentFilterFiled,
  IShipmentData,
  IUseGridActions,
}
