export type ChangeRecordHistoryEnvironmentType = {
  platform: string
  source: string
  username: string
  userId: string
  fullname: string
  userIp: string
  machineName: string
}

export type ChangeRecordHistorySourceType = {
  service: string
  type: string
  actionName: string
}
export type ChangeRecordHistoryChangeItemType = {
  number: number
  entityType: string
  entityId: string
  columnName: string
  localColumnName: string
  originalValue: string
  currentValue: string
  auditType: number
  propertyName: string
  localAuditType: string
}

export type ChangeRecordHistoryRowsType = {
  id: string
  trackingId: string
  number: number
  auditType: number
  localAuditType: string
  environment: ChangeRecordHistoryEnvironmentType
  source: ChangeRecordHistorySourceType
  auditDate: string
  createDate: string
  changesItems: ChangeRecordHistoryChangeItemType[]
}
