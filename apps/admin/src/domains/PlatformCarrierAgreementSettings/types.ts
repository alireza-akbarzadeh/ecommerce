export interface PlatformShippingContractDetailsModel {
  vendorId: string
  vendorTitle: string
  productCategoryId: string
  productCategoryTitle: string
  vendorMobileNo: string
  vendorAddress: string
  vendorNationalCode: string
}

export interface FormHeaderPropsModel {
  id?: string
  refetch: () => void
}

export interface ExceptionDataGridProps {
  id: string
  ownerId: string
  vendorId: string
  vendorName: string
  vendorMobileNo: string
  vendorNationalCoe: string
  vendorAddress: string
  productCategoryId: string
  productCategoryTitle: string
}

type GetShippingAgent = {
  shippingAgentId?: string
  shippingAgentTitle?: string | null
}
type GetShippingProvider = {
  shippingProviderId?: string
  shippingProviderTitle?: string | null
}
export interface SelectRowModel {
  id: string
  contractCode: string
  startDate: Date
  endDate: Date
  costCoverageType: string
  costCoverageTypeTitle: string
  costCoverageAmount: number
  shippingAgentId: string
  shippingAgentTitle: string
  shippingServiceType: string
  shippingServiceTypeTitle: string
  shippingProviderName: string
  applyOnlyOnException: true
  contractStateCode: string
  contractStateCodeTitle: string
}

export interface VendorShippingAgreementsType {
  id?: string
  contractCode?: string | null
  startDate?: string
  endDate?: string | null
  costCoverageType?: string
  costCoverageTypeTitle?: string | null
  costCoverageAmount?: number
  maxCostCoveragePrice?: number | null
  shippingAgents?: GetShippingAgent[] | null
  shippingProviders?: GetShippingProvider[] | null
  applyOnlyOnException?: boolean
  contractStateCode?: string
  contractStateCodeTitle?: string | null
}
