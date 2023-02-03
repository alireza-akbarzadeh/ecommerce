export interface SelectRowModel {
  id: number
  providerCode: string
  providerName: string
  providerType: number
  providerTypeTitle: string
  providerPriority: number
  providerPriorityTitle: string
  CollectionType: number
  CollectionTypeTitle: string
  CostInquiryType: number
  CostInquiryTypeTitle: string
  providerShippingState: number
  providerShippingStateTitle: string
}

export interface CreateColumnsModel {
  selectedRows: SelectRowModel[]
}
