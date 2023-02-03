export type ProductIdType = {
  name?: string
  vendor?: string
  hsin?: string
  id: string
}
export type VendorIdType = {
  fullName?: string
  mobile?: string
  id: string
}
export type brandIdType = {
  name?: string
  id: string
}
export type CommissionAddEditFormType = {
  id: string
  number: string
  startDate: string
  endDate: string
  commissionType: number
  categoryId: string
  vendorId: VendorIdType
  brandId: string
  productId: ProductIdType
  calculationType: number
  targetValue: number
  minCommissionPrice?: number
  maxCommissionPrice?: number
  settlementDays: number
  description: string
  stateCode: string
  stateName: string
  isVatDeductedFromCommission: boolean
  isOriginalPriceUsedForCommission: boolean
}
