import HBDatePickerController from '@hasty-bazar/admin-shared/containers/HBDatePickerController'
import {
  GetCategoryResult,
  GetSecendCategoryResult,
  useGetAdminCrmTicketsGetCaseSecondTypeQuery,
  useGetAdminCrmTicketsGetCategoryQuery,
} from '@hasty-bazar/admin-shared/services/crmApi.generated'
import { HBAutocompleteController } from '@hasty-bazar/core'
import { Grid } from '@mui/material'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import crmMessages from '../../crm.message'
import { CrmFilterModel } from '../../types'

type menuItem = {
  title: React.ReactNode
  value: string | number
  iconPath?: React.ReactNode
}

export default function CrmForm() {
  const { formatMessage } = useIntl()
  const { setValue, watch, getValues } = useFormContext()

  const { data: { data: ticketsCategories } = {} } = useGetAdminCrmTicketsGetCategoryQuery(
    {
      'client-name': 'admin',
      'client-version': '1.0.0',
      caseTypeCode: Number(watch('caseTypeCaption')?.value),
    },
    { skip: !watch('caseTypeCaption')?.value, refetchOnMountOrArgChange: true },
  )

  const { data: { data: ticketsCaseSecond } = {} } = useGetAdminCrmTicketsGetCaseSecondTypeQuery(
    {
      'client-name': 'admin',
      'client-version': '1.0.0',
      caseTypeCode: Number(watch('caseTypeCaption')?.value),
      requestCategoryCode: watch('requestCategoryCode')?.requestCategoryCode,
    },
    {
      skip: !watch('caseTypeCaption')?.value || !watch('requestCategoryCode')?.requestCategoryCode,
      refetchOnMountOrArgChange: true,
    },
  )

  const caseTypeCaptions = [
    { value: '1', title: formatMessage(crmMessages.caseType1) },
    { value: '2', title: formatMessage(crmMessages.caseType2) },
    { value: '3', title: formatMessage(crmMessages.caseType3) },
  ]

  const satisfactionLevelCodes = [
    { value: '1', title: formatMessage(crmMessages.satisfactionLevel1) },
    { value: '2', title: formatMessage(crmMessages.satisfactionLevel2) },
    { value: '3', title: formatMessage(crmMessages.satisfactionLevel3) },
    { value: '4', title: formatMessage(crmMessages.satisfactionLevel4) },
    { value: '5', title: formatMessage(crmMessages.satisfactionLevel5) },
  ]

  const caseOriginCodes = [
    { value: '1', title: formatMessage(crmMessages.caseMobile) },
    { value: '3', title: formatMessage(crmMessages.caseWebsite) },
  ]
  const statusCodes = [
    { value: '0', title: formatMessage(crmMessages.caseStatus1) },
    { value: '1', title: formatMessage(crmMessages.caseStatus2) },
  ]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={4}>
        <HBAutocompleteController<CrmFilterModel, menuItem>
          label={formatMessage(crmMessages.documentType)}
          fieldName="caseTypeCaption"
          isOptionEqualToValue={(o, v) => o.value == v.value}
          getOptionLabel={(option) => `${option.title}`}
          options={caseTypeCaptions}
          autoCompleteProps={{
            onChange: (e, value) => {
              setValue('caseTypeCaption', value)
              setValue('requestCategoryCode', undefined)
              setValue('secondRequestTypeCode', undefined)
            },
          }}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <HBAutocompleteController<CrmFilterModel, GetCategoryResult>
          label={formatMessage(crmMessages.requestFloor)}
          fieldName="requestCategoryCode"
          isOptionEqualToValue={(o, v) => o.requestCategoryCode == v.requestCategoryCode}
          getOptionLabel={(option) => `${option.requestCategoryName}`}
          options={ticketsCategories || []}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <HBAutocompleteController<CrmFilterModel, GetSecendCategoryResult>
          label={formatMessage(crmMessages.reason)}
          fieldName="secondRequestTypeCode"
          isOptionEqualToValue={(o, v) => o.caseSecondTypecode == v.caseSecondTypecode}
          getOptionLabel={(option) => `${option.caseSecondTypeName}`}
          options={ticketsCaseSecond || []}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <HBAutocompleteController<CrmFilterModel, menuItem>
          label={formatMessage(crmMessages.satisfaction)}
          fieldName="satisfactionLevelCode"
          isOptionEqualToValue={(o, v) => o.value == v.value}
          getOptionLabel={(option) => `${option.title}`}
          options={satisfactionLevelCodes}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <HBAutocompleteController<CrmFilterModel, menuItem>
          label={formatMessage(crmMessages.contactPath)}
          fieldName="caseOriginCode"
          isOptionEqualToValue={(o, v) => o.value == v.value}
          getOptionLabel={(option) => `${option.title}`}
          options={caseOriginCodes}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <HBAutocompleteController<CrmFilterModel, menuItem>
          label={formatMessage(crmMessages.checkStatus)}
          fieldName="status"
          isOptionEqualToValue={(o, v) => o.value == v.value}
          getOptionLabel={(option) => `${option.title}`}
          options={statusCodes}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <HBDatePickerController
          name="requestStartDate"
          label={formatMessage(crmMessages.startRequestDate)}
          formRules={{ required: false }}
          onChange={(value: any) => {
            setValue('requestEndDate', null)
          }}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <HBDatePickerController
          name="requestEndDate"
          label={formatMessage(crmMessages.endRequestDate)}
          formRules={{ required: false }}
          disabled={watch('requestStartDate') ? false : true}
          minDateTime={new Date(watch('requestStartDate'))}
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <HBDatePickerController
          name="checkStartDate"
          label={formatMessage(crmMessages.startCheckDate)}
          formRules={{ required: false }}
          onChange={(value: any) => {
            setValue('checkEndDate', null)
          }}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <HBDatePickerController
          name="checkEndDate"
          label={formatMessage(crmMessages.endCheckDate)}
          formRules={{ required: false }}
          disabled={watch('checkStartDate') ? false : true}
          minDateTime={new Date(watch('checkStartDate'))}
        />
      </Grid>
    </Grid>
  )
}
