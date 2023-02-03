import { useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { useGetWorkflowStateMachineByStateMachineIdStateQuery } from '@hasty-bazar/admin-shared/services/workflowApi.generated'
import { useState } from 'react'
import {
  DailySaleReport,
  DailySaleReportFields,
  DailyWorkFlowStateMachineId,
} from '../../enums/DailySaleReportEnums'
const useFormFieldController = () => {
  const [resetFilter, setResetFilter] = useState<boolean>(false)

  const { data: filterDateTypeApi, isLoading: filterDateTypeApiLoading } =
    useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery({
      'client-name': '',
      'client-version': '',
      businessType: DailySaleReport.filterDateType,
    })

  const { data: reportTypeApi, isLoading: reportTypeApiLoading } =
    useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery({
      'client-name': '',
      'client-version': '',
      businessType: DailySaleReport.reportType,
    })
  const { data: statusInformationApi, isLoading: statusInformationApiLoading } =
    useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery({
      'client-name': '',
      'client-version': '',
      businessType: DailySaleReport.statusInformation,
    })

  const { data: workflowStateApi } = useGetWorkflowStateMachineByStateMachineIdStateQuery({
    'client-name': '',
    'client-version': '',
    stateMachineId: DailyWorkFlowStateMachineId.code,
  })

  return {
    resetFilter,
    setResetFilter,
    filterDateTypeApiLoading,
    reportTypeApiLoading,
    statusInformationApiLoading,
    filterDateTypeApi: filterDateTypeApi?.data?.items,
    reportTypeApi: reportTypeApi?.data?.items,
    statusInformationApi: statusInformationApi?.data?.items,
    workflowStateApi: workflowStateApi?.data?.items,
    defaultDateType: filterDateTypeApi?.data?.items?.find(
      (x) => x.id === DailySaleReportFields.dateTypeId,
    ),
    defaultDataType: reportTypeApi?.data?.items?.find(
      (x) => x.id === DailySaleReportFields.Detailed,
    ),
    defaultStatus: statusInformationApi?.data?.items?.find(
      (x) => x.id === DailySaleReportFields.All,
    ),
  }
}

export default useFormFieldController
