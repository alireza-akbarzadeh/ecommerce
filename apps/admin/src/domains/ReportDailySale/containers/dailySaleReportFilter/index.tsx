import HBDateTimePickerController from '@hasty-bazar/admin-shared/containers/HBDateTimePickerController'
import { GetBusinessTypeValuesByBusinessTypeQueryResult } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { GetStatesQueryResult } from '@hasty-bazar/admin-shared/services/workflowApi.generated'
import { HBAutocompleteController, HBButton } from '@hasty-bazar/core'
import { Grid, Stack } from '@mui/material'
import { FC, useEffect } from 'react'
import { UseFormReset, UseFormSetValue } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { useFormFiledController } from '../../hooks'
import ReportDailySaleMessages from '../../ReportDailySale.messages'
import { IDailySaleReportFormModel } from '../../types/IDailySaleReportFormModel'

interface IDailyReportFilter {
  setListenForm: (val: boolean) => void
  setValue: UseFormSetValue<IDailySaleReportFormModel>
  reset: UseFormReset<IDailySaleReportFormModel>
}

const DailyReportFilter: FC<IDailyReportFilter> = ({ setListenForm, setValue, reset }) => {
  const { formatMessage } = useIntl()
  const {
    statusInformationApi,
    reportTypeApi,
    filterDateTypeApi,
    workflowStateApi,
    defaultDataType,
    filterDateTypeApiLoading,
    reportTypeApiLoading,
    statusInformationApiLoading,
    defaultDateType,
    defaultStatus,
    resetFilter,
    setResetFilter,
  } = useFormFiledController()

  useEffect(() => {
    setValue('dataType', defaultDataType as GetBusinessTypeValuesByBusinessTypeQueryResult)
    setValue('dateType', defaultDateType as GetBusinessTypeValuesByBusinessTypeQueryResult)
    setValue('informingType', defaultStatus as GetBusinessTypeValuesByBusinessTypeQueryResult)
  }, [filterDateTypeApiLoading, reportTypeApiLoading, statusInformationApiLoading, resetFilter])

  const handleRemoveFilter = () => {
    reset()
    setResetFilter(!resetFilter)
  }
  return (
    <>
      <Grid container spacing={7}>
        <Grid item xs={12} sm={4}>
          <HBAutocompleteController<
            IDailySaleReportFormModel,
            GetBusinessTypeValuesByBusinessTypeQueryResult
          >
            label={formatMessage(ReportDailySaleMessages.filterDateType)}
            fieldName={'dateType'}
            isOptionEqualToValue={(o, v) => o.id == v.id}
            getOptionLabel={(option) => option.title ?? ''}
            options={filterDateTypeApi || []}
            formRules={{ required: true }}
            required
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <HBDateTimePickerController
            defaultValue={new Date()}
            label={`${formatMessage(ReportDailySaleMessages.fromDate)}*`}
            name={'startDate'}
            formRules={{ required: true }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <HBDateTimePickerController
            defaultValue={new Date()}
            label={`${formatMessage(ReportDailySaleMessages.fromDate)}`}
            name={'endDate'}
            formRules={{ required: true }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <HBAutocompleteController<
            IDailySaleReportFormModel,
            GetBusinessTypeValuesByBusinessTypeQueryResult
          >
            label={formatMessage(ReportDailySaleMessages.reportType)}
            fieldName={'dataType'}
            isOptionEqualToValue={(o, v) => o.id == v.id}
            getOptionLabel={(option) => option.title ?? ''}
            options={reportTypeApi || []}
            formRules={{ required: true }}
            autoCompleteProps={{
              onChange: (_, value) => {
                setListenForm(false)
                setValue('dataType', value as GetBusinessTypeValuesByBusinessTypeQueryResult)
              },
            }}
            required
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <HBAutocompleteController<
            IDailySaleReportFormModel,
            GetBusinessTypeValuesByBusinessTypeQueryResult
          >
            label={formatMessage(ReportDailySaleMessages.notificationStatus)}
            fieldName={'informingType'}
            isOptionEqualToValue={(o, v) => o.id == v.id}
            getOptionLabel={(option) => option.title ?? ''}
            options={statusInformationApi || []}
            formRules={{ required: true }}
            required
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <HBAutocompleteController<IDailySaleReportFormModel, GetStatesQueryResult, true>
            label={formatMessage(ReportDailySaleMessages.orderItemStatus)}
            fieldName={'statusCodes'}
            isOptionEqualToValue={(o, v) => o.id == v.id}
            getOptionLabel={(option) => option.title ?? ''}
            options={workflowStateApi || []}
            autoCompleteProps={{
              multiple: true,
            }}
          />
        </Grid>
      </Grid>
      <Stack my={7} direction="row" justifyContent={'space-between'}>
        <HBButton variant="outlined" onClick={handleRemoveFilter}>
          {formatMessage(ReportDailySaleMessages.removeFilter)}
        </HBButton>
        <HBButton type="submit">{formatMessage(ReportDailySaleMessages.filtering)}</HBButton>
      </Stack>
    </>
  )
}

export default DailyReportFilter
