enum DailySaleReport {
  reportType = 1098,
  statusInformation = 1099,
  filterDateType = 1097,
  Summarized = '1098001',
}
enum DailySaleReportFields {
  dateTypeId = '1097001',
  All = '1099001',
  Detailed = '1098001',
}

enum DailyWorkFlowStateMachineId {
  code = '19',
}

export { DailySaleReport, DailyWorkFlowStateMachineId, DailySaleReportFields }
