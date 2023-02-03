export type CrmFilterModel = {
  caseTypeCaption?: string
  secondRequestTypeCode?: string
  requestCategoryCode?: string
  satisfactionLevelCode?: string
  caseOriginCode?: string
  status?: string
  requestStartDate?: string
  requestEndDate?: string
  checkStartDate?: string
  checkEndDate?: string
  partyId?: string
}

export type CrmGridModel = {
  id: string
  caseTypeCaption?: string
  requestCategoryName?: string
  secondRequestTypeName?: string
  status?: string
  messageDescription?: string
  trackingCode?: string
  mobile?: string
  caseOriginCode?: string
  response?: string
  responseDateTime?: string
  deviceType?: number
  satisfactionLevelCode?: string
  shippingCode?: string
  createDate?: string
  filePath?: string
  adminRead?: boolean
  voiceUrl?: string
  statusTitle?: string
}
