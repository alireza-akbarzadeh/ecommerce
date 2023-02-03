import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import { HBUploadImageController } from '@hasty-bazar/admin-shared/containers/HBUploadImageController'
import { FormPatternsEnums } from '@hasty-bazar/admin-shared/core/enums/FormPatterns'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  GetBusinessTypeValuesByBusinessTypeQueryResult as businessTypeValues,
  useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import {
  GetGeosQueryResult,
  useGetAdminLocalityIranByProvinceIdQuery,
  useGetAdminLocalityIranQuery,
} from '@hasty-bazar/admin-shared/services/localityApi.generated'
import { HBAutocompleteController, HBButton, HBDialog } from '@hasty-bazar/core'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { UseFormReturn, useWatch } from 'react-hook-form'
import { useIntl } from 'react-intl'
import companiesMessage from '../companies.message'
import { CompanyAddEditFormType } from '../CompanyAddEdit'

type CompanyAddEditPageProps = {
  formProvider: UseFormReturn<CompanyAddEditFormType, any>
  loading?: boolean
  handleSubmit: (values: CompanyAddEditFormType) => void
}

export default function CompanyForm({
  formProvider,
  loading,
  handleSubmit,
}: CompanyAddEditPageProps) {
  const { isDirty, isValid } = formProvider.formState
  const [showBackModal, setShowBackModal] = useState(false)
  const { formatMessage } = useIntl()
  const router = useRouter()

  const { data: { data: { items: companiesType = [] } = {} } = {} } =
    useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery({
      'client-name': 'admin',
      'client-version': '1.0.0',
      businessType: 1093,
    })

  const { provinceId, organizationType } = useWatch({
    control: formProvider.control,
  })
  const { data: { data: { items: provinceData = [] } = {} } = {}, isLoading: isLoadingProvince } =
    useGetAdminLocalityIranQuery({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
    })

  const { data: { data: { items: citiesData = [] } = {} } = {}, isLoading: isLoadingCities } =
    useGetAdminLocalityIranByProvinceIdQuery(
      {
        'client-name': 'hasty-bazar-admin',
        'client-version': '1.0.0',
        provinceId: provinceId?.id! || (provinceId as string),
      },
      {
        skip: typeof provinceId === 'string' ? !provinceId : !provinceId?.id,
        refetchOnMountOrArgChange: true,
      },
    )

  const handleProvinceChange = (value: GetGeosQueryResult | null) => {
    formProvider.setValue('provinceId', value!)
    formProvider.setValue('cityId', undefined)
  }

  const handleBackClick = () => {
    if (isDirty) {
      setShowBackModal(true)
    } else {
      router.replace('/companies')
    }
  }

  const handleAcceptSave = () => {
    setShowBackModal(false)
    formProvider.handleSubmit(handleSubmit)
  }

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12} md={4}>
          <HBAutocompleteController<CompanyAddEditFormType, businessTypeValues>
            required
            label={formatMessage(companiesMessage.gridCompanyType)}
            fieldName="organizationType"
            isOptionEqualToValue={(o, v) => o.id == v}
            getOptionLabel={(option) => `${option.title}`}
            options={companiesType || []}
            formRules={{ required: true }}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <HBTextFieldController
            required
            formRules={{ required: true, maxLength: 255 }}
            name={'title'}
            label={formatMessage(companiesMessage.gridTitle)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <HBTextFieldController
            mask="000000000000000000000000"
            formRules={{ required: false, pattern: new RegExp(FormPatternsEnums.Shaba) }}
            name={'iBan'}
            label={formatMessage(companiesMessage.gridSheba)}
            inputProps={{ maxLength: 26 }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <HBTextFieldController
            formRules={{
              required: false,
              pattern: new RegExp(FormPatternsEnums.Integer),
              maxLength: 11,
              minLength: 11,
            }}
            name={'nationalCode'}
            label={formatMessage(companiesMessage.gridCompanyNationalCode)}
            inputProps={{ maxLength: 11 }}
            mask="00000000000"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <HBTextFieldController
            formRules={{
              required: false,
              pattern: new RegExp(FormPatternsEnums.Integer),
              maxLength: 12,
              minLength: 12,
            }}
            name={'economicCode'}
            label={formatMessage(companiesMessage.gridCompanyEconomicCode)}
            inputProps={{ maxLength: 12 }}
            mask="000000000000"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <HBTextFieldController
            formRules={{
              required: false,
              pattern: new RegExp(FormPatternsEnums.Integer),
              maxLength: 12,
              minLength: 12,
            }}
            name={'registerationNo'}
            label={formatMessage(companiesMessage.gridCompanyRegisterNumber)}
            inputProps={{ maxLength: 12 }}
            mask="000000000000"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <HBTextFieldController
            formRules={{ required: false, pattern: new RegExp(FormPatternsEnums.Tel) }}
            name={'phoneNo'}
            label={formatMessage(companiesMessage.gridCompanyPhone)}
            inputProps={{ maxLength: 15 }}
            mask="000000000000000"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <HBTextFieldController
            name={'email'}
            formRules={{
              required: false,
              pattern: new RegExp(FormPatternsEnums.Email),
              maxLength: 255,
            }}
            label={formatMessage(companiesMessage.gridCompanyEmail)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <HBAutocompleteController<CompanyAddEditFormType, GetGeosQueryResult>
            label={formatMessage(companiesMessage.gridProvinceName)}
            autoCompleteProps={{
              sx: { width: '100%' },
              onChange: (_, value) => {
                handleProvinceChange(value)
              },
              loading: isLoadingProvince,
            }}
            fieldName="provinceId"
            isOptionEqualToValue={(o, v) => o.id == v}
            getOptionLabel={(option) => `${option.title}`}
            options={provinceData || []}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <HBAutocompleteController<CompanyAddEditFormType, GetGeosQueryResult>
            label={formatMessage(companiesMessage.gridCityName)}
            autoCompleteProps={{
              sx: { width: '100%' },
              loading: isLoadingCities,
            }}
            fieldName="cityId"
            isOptionEqualToValue={(o, v) => o.id == v}
            getOptionLabel={(option) => `${option.title}`}
            options={provinceId ? citiesData || [] : []}
          />
        </Grid>
        <Grid item xs={12}>
          <HBTextFieldController
            formRules={{ required: false, maxLength: 4000 }}
            name={'address'}
            label={formatMessage(companiesMessage.gridCompanyAddress)}
          />
        </Grid>
        <Grid item xs={12}>
          <Box>
            <Typography variant="subtitle2" my={4} color="text.secondary">
              {formatMessage(companiesMessage.uploadLogoIcon)}
            </Typography>
          </Box>
          <Box sx={{ maxWidth: 120 }}>
            <HBUploadImageController name="logoPath" />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" mt={4}>
            <HBButton variant="outlined" onClick={handleBackClick}>
              {formatMessage(phrasesMessages.back)}{' '}
            </HBButton>
            <HBButton loading={loading} type="submit" disabled={!isDirty || !isValid}>
              {formatMessage(phrasesMessages.confirm)}{' '}
            </HBButton>
          </Stack>
        </Grid>
      </Grid>
      <HBDialog
        content={formatMessage(companiesMessage.areYouSureBack)}
        title={formatMessage(companiesMessage.goBackTitle)}
        onAccept={handleAcceptSave}
        onReject={() => router.replace('/companies')}
        open={showBackModal}
        onClose={() => setShowBackModal(false)}
        acceptBtn={formatMessage(phrasesMessages.confirm)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
    </>
  )
}
