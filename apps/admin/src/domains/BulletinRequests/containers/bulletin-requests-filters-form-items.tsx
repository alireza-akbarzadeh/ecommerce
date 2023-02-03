import HBDatePickerController from '@hasty-bazar/admin-shared/containers/HBDatePickerController'
import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import { BusinessTypeEnums } from '@hasty-bazar/admin-shared/core/enums'
import { useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { GetNewsLetterQueryByIdResult } from '@hasty-bazar/admin-shared/services/socialApi.generated'
import { HBAutocompleteController } from '@hasty-bazar/core'
import { Grid } from '@mui/material'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import bulletinRequestsMessages from '../bulletinRequests.messages'

export default function BulletinRequestsFiltersFormItems() {
  const { formatMessage } = useIntl()
  const { watch } = useFormContext()

  const { data: { data: { items: NewsLetterType = [] } = {} } = {} } =
    useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery({
      'client-name': 'Swagger on HIT.Hastim.GeneralData.Endpoints.AdminApi',
      'client-version': '1.0.1.100',
      businessType: BusinessTypeEnums.NewsLetter,
    })

  return (
    <Grid container spacing={3} rowSpacing={6}>
      <Grid item xs={12} md={3}>
        <HBTextFieldController
          fullWidth
          name="emailAddress"
          label={formatMessage(bulletinRequestsMessages.email)}
          formRules={{ required: false }}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <HBTextFieldController
          fullWidth
          name="partyFullName"
          label={formatMessage(bulletinRequestsMessages.user)}
          formRules={{ required: false }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <HBAutocompleteController<GetNewsLetterQueryByIdResult, any>
          label={formatMessage(bulletinRequestsMessages.type)}
          fieldName="newsLetterEnum"
          isOptionEqualToValue={(o, v) => o?.fullCode == v}
          getOptionLabel={(option) => `${option?.title}`}
          options={NewsLetterType || []}
        />
      </Grid>
      <Grid item xs={12} md={3} />
      <Grid item xs={12} md={3}>
        <HBDatePickerController
          formRules={{ required: false }}
          label={formatMessage(bulletinRequestsMessages.fromRegistryDate)}
          name="fromRegisterDate"
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <HBDatePickerController
          formRules={{ required: false }}
          label={formatMessage(bulletinRequestsMessages.toRegistryDate)}
          name="toRegisterDate"
          minDateTime={new Date(watch('fromRegisterDate'))}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <HBDatePickerController
          formRules={{ required: false }}
          label={formatMessage(bulletinRequestsMessages.fromCancelDate)}
          name="fromCancelRegisterDate"
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <HBDatePickerController
          formRules={{ required: false }}
          label={formatMessage(bulletinRequestsMessages.toCancelDate)}
          name="toCancelRegisterDate"
          minDateTime={new Date(watch('fromCancelRegisterDate'))}
        />
      </Grid>
    </Grid>
  )
}
