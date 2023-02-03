import HBDatePickerController from '@hasty-bazar/admin-shared/containers/HBDatePickerController'
import { useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import {
  GetStatesQueryResult,
  useGetWorkflowStateMachineByStateMachineIdStateQuery,
} from '@hasty-bazar/admin-shared/services/workflowApi.generated'
import { HBAutocompleteController, HBButton } from '@hasty-bazar/core'
import { Box, Grid, Stack } from '@mui/material'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import userFeedbackMessages from '../UserFeedback.messages'

export type UserFeedbackFilterFormType = {
  recommendationType?: { id: number; title: string }
  fromDateTime?: string | null
  toDateTime?: string | null
  rate?: number
  stateCode?: { code: string; title: string }
}

type UserFeedbackFilterProps = {
  onClear?: () => void
}

export default function UserFeedbackFilter({ onClear }: UserFeedbackFilterProps) {
  const { formatMessage } = useIntl()
  const { watch, setValue } = useFormContext<UserFeedbackFilterFormType>()
  const { data: { data: { items: workflowItems = [] } = {} } = {} } =
    useGetWorkflowStateMachineByStateMachineIdStateQuery({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      stateMachineId: '1029687454610751488',
    })

  const { data: { data: { items: recommendationTypes = [] } = {} } = {} } =
    useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      businessType: 1084,
    })

  return (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={6}>
        <Grid item xs={12} md={4}>
          <HBAutocompleteController<UserFeedbackFilterFormType, any>
            label={formatMessage(userFeedbackMessages.recommendationType)}
            fieldName="recommendationType"
            isOptionEqualToValue={(o, v) => o.id == v.id}
            getOptionLabel={(option) => `${option.title}`}
            options={recommendationTypes || []}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <HBDatePickerController
            name="fromDateTime"
            label={formatMessage(userFeedbackMessages.fromDate)}
            formRules={{ required: false }}
            onChange={(value: any) => {
              setValue('toDateTime', null)
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <HBDatePickerController
            name="toDateTime"
            label={formatMessage(userFeedbackMessages.toDate)}
            formRules={{ required: false }}
            disabled={watch('fromDateTime') ? false : true}
            minDateTime={new Date(watch('fromDateTime')!)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <HBAutocompleteController<UserFeedbackFilterFormType, GetStatesQueryResult>
            label={formatMessage(userFeedbackMessages.workflow)}
            fieldName="stateCode"
            isOptionEqualToValue={(o, v) => o.code == v.code}
            getOptionLabel={(option) => `${option.title}`}
            options={workflowItems || []}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <HBAutocompleteController<UserFeedbackFilterFormType, any>
            label={formatMessage(userFeedbackMessages.score)}
            fieldName="rate"
            isOptionEqualToValue={(o, v) => o == v}
            getOptionLabel={(option) => `${option}`}
            options={['0', '1', '2', '3', '4', '5']}
          />
        </Grid>
      </Grid>
      <Stack justifyContent="space-between" direction="row" sx={{ mt: 8 }}>
        <HBButton variant="outlined" onClick={onClear}>
          {formatMessage(userFeedbackMessages.clearFilter)}
        </HBButton>
        <HBButton type="submit">{formatMessage(userFeedbackMessages.submitFilter)}</HBButton>
      </Stack>
    </Box>
  )
}
