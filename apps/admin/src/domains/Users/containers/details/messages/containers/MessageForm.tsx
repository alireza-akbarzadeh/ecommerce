import HBDatePickerController from '@hasty-bazar/admin-shared/containers/HBDatePickerController'
import {
  GetBusinessTypeValuesQueryResult,
  useGetAdminGeneralDataBusinessTypeValueGetAllQuery,
  useGetAdminGeneralDataProcessesQuery,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBAutocompleteController } from '@hasty-bazar/core'
import { Grid } from '@mui/material'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { UserMessagesFilter } from '../types'
import userMessages from '../userMessages.messages'

export default function MessageForm() {
  const { formatMessage } = useIntl()
  const { watch, setValue } = useFormContext()

  const { data: { data: { items: processesItems = [] } = {} } = {} } =
    useGetAdminGeneralDataProcessesQuery({
      'client-name': 'admin',
      'client-version': '1.0.0',
      pageSize: 1000,
    })

  const { data: { data: { items: typeItems = [] } = {} } = {} } =
    useGetAdminGeneralDataBusinessTypeValueGetAllQuery({
      'client-name': 'admin',
      'client-version': '1.0.0',
      businessTypeId: '1094',
    })

  const { data: { data: { items: protocolTypeItems = [] } = {} } = {} } =
    useGetAdminGeneralDataBusinessTypeValueGetAllQuery({
      'client-name': 'admin',
      'client-version': '1.0.0',
      businessTypeId: '1065',
    })

  const { data: { data: { items: panelTypeItems = [] } = {} } = {} } =
    useGetAdminGeneralDataBusinessTypeValueGetAllQuery({
      'client-name': 'admin',
      'client-version': '1.0.0',
      businessTypeId: '1010',
    })

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={4}>
        <HBAutocompleteController<UserMessagesFilter, GetBusinessTypeValuesQueryResult>
          label={formatMessage(userMessages.formType)}
          fieldName="messageTransferType"
          isOptionEqualToValue={(o, v) => o.id == v.id}
          getOptionLabel={(option) => `${option.title}`}
          options={typeItems || []}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <HBDatePickerController
          name="fromDateTime"
          label={formatMessage(userMessages.formFromDate)}
          formRules={{ required: false }}
          onChange={(value: any) => {
            setValue('toDateTime', null)
          }}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <HBDatePickerController
          name="toDateTime"
          label={formatMessage(userMessages.formToDate)}
          formRules={{ required: false }}
          disabled={watch('fromDateTime') ? false : true}
          minDateTime={new Date(watch('fromDateTime'))}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <HBAutocompleteController<UserMessagesFilter, GetBusinessTypeValuesQueryResult>
          label={formatMessage(userMessages.formSendType)}
          fieldName="protocolType"
          isOptionEqualToValue={(o, v) => o.id == v.id}
          getOptionLabel={(option) => `${option.title}`}
          options={protocolTypeItems || []}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <HBAutocompleteController<UserMessagesFilter, any>
          label={formatMessage(userMessages.formMessageEvent)}
          fieldName="reason"
          isOptionEqualToValue={(o, v) => o.id == v.id}
          getOptionLabel={(option) => `${option.title}`}
          options={processesItems || []}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <HBAutocompleteController<UserMessagesFilter, GetBusinessTypeValuesQueryResult>
          label={formatMessage(userMessages.formSendFromPort)}
          fieldName="panelType"
          isOptionEqualToValue={(o, v) => o.id == v.id}
          getOptionLabel={(option) => `${option.title}`}
          options={panelTypeItems || []}
        />
      </Grid>
    </Grid>
  )
}
