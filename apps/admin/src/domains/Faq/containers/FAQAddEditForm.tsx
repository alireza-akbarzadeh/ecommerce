import { HBSwitchController } from '@hasty-bazar/admin-shared/containers/HBSwitchController'
import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import { BusinessTypeEnums } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import validationsMessages from '@hasty-bazar-admin/core/translations/validations.messages'
import { QuestionUsageType } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import {
  GetBusinessTypeValuesByBusinessTypeQueryResult,
  useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBAutocompleteController, HBButton, HBDialog, HBIcon } from '@hasty-bazar/core'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { FAQFormType, FAQType, PanelFieldType } from '../FAQAddEditPage'
import FaqPageMessages from '../FaqPage.messages'
import useFormData from '../hooks/useFormData'

const FAQAddEditForm = () => {
  const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false)
  const ref = useRef<HTMLButtonElement>(null)
  const { formatMessage } = useIntl()
  const router = useRouter()

  const {
    setValue,
    getValues,
    formState: { isDirty, isValid },
  } = useFormContext<FAQType>()

  const { disableButtonStyle, readonlyFieldStyle } = useFormData()

  const handleGoBack = () => {
    if (!isDirty) {
      router.push(`/faq/show/?questionCategoryId=${router?.query?.questionCategoryId}`)
    } else setOpenConfirmModal(true)
  }
  const handleCancel = () => {
    setOpenConfirmModal(false)
    router.push(`/faq/show/?questionCategoryId=${router?.query?.questionCategoryId}`)
  }
  const handleSave = () => {
    if (isValid) ref.current?.click()
    setOpenConfirmModal(false)
  }
  const { data: { data: { items: panelTypeData = [] } = {} } = {} } =
    useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery({
      'client-name': 'Swagger on HIT.Hastim.GeneralData.Endpoints.AdminApi',
      'client-version': '1.0.1.100',
      businessType: BusinessTypeEnums.PanelType,
    })
  const { data: { data: { items: QuestionUsageTypeData = [] } = {} } = {} } =
    useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery({
      'client-name': 'Swagger on HIT.Hastim.GeneralData.Endpoints.AdminApi',
      'client-version': '1.0.1.100',
      businessType: BusinessTypeEnums.QuestionUsageType,
    })

  return (
    <Stack gap={6}>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={4}>
          <HBTextFieldController
            label={formatMessage(FaqPageMessages.numberTitle)}
            type={'number'}
            name="number"
            formRules={{ required: true }}
            maskOptions={{ mask: Number, min: 0 }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <HBAutocompleteController<FAQFormType, GetBusinessTypeValuesByBusinessTypeQueryResult>
            required
            formRules={{ required: true }}
            label={formatMessage(FaqPageMessages.questionTypeTitle)}
            fieldName="questionUsageTypeCode"
            autoCompleteProps={{
              onChange: (event, value) => {
                setValue('questionUsageTypeCode', value?.fullCode as QuestionUsageType)
              },
            }}
            isOptionEqualToValue={(option, value) => option.fullCode === value}
            getOptionLabel={(option) => option.title ?? ''}
            options={QuestionUsageTypeData || []}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <HBTextFieldController
            type={'number'}
            formRules={{ required: false }}
            name="sortOrderIndex"
            label={formatMessage(FaqPageMessages.sortOrderTitle)}
            maskOptions={{ mask: Number, min: 1 }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <HBAutocompleteController<FAQFormType, PanelFieldType, true>
            required
            formRules={{ required: true }}
            label={formatMessage(FaqPageMessages.relatedPanelTitle)}
            fieldName="panelTypeCode"
            autoCompleteProps={{
              multiple: true,
            }}
            isOptionEqualToValue={(option, value) => option.fullCode === value.fullCode}
            getOptionLabel={(option) => option?.title || ''}
            options={
              panelTypeData?.map((itm) => ({ fullCode: itm.fullCode!, title: itm.title! })) || []
            }
          />
        </Grid>
        <Grid item xs={12} sm={8} container alignItems={'center'}>
          <Typography sx={{ mx: 2 }}>{formatMessage(FaqPageMessages.isUseful)}</Typography>
          <HBSwitchController name="isUseful" formRules={{ required: false }} />
        </Grid>

        <Grid item xs={12} sm={4} container alignItems={'center'}>
          <Typography sx={{ mx: 2 }}>{formatMessage(FaqPageMessages.displayInFaq)}</Typography>
          <HBSwitchController name="displayInFAQ" formRules={{ required: false }} />
        </Grid>
        {getValues('displayInFAQ') && (
          <Grid item xs={12} sm={4}>
            <HBTextFieldController
              type={'number'}
              inputProps={{ maxLength: 150 }}
              formRules={{ required: true }}
              fullWidth
              name="sortOrderIndexInFAQ"
              label={formatMessage(FaqPageMessages.sortOrderIndexInFaq)}
              maskOptions={{ mask: Number, min: 1 }}
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <HBTextFieldController
            inputProps={{ maxLength: 150 }}
            formRules={{
              validate: (value) =>
                !!value.trim() ||
                `${formatMessage(validationsMessages.isRequired, {
                  msg: formatMessage(FaqPageMessages.questionTitle),
                })}`,
              required: {
                value: true,
                message: `${formatMessage(validationsMessages.isRequired, {
                  msg: formatMessage(FaqPageMessages.questionTitle),
                })}`,
              },
            }}
            fullWidth
            name="questionText"
            label={formatMessage(FaqPageMessages.questionTitle)}
          />
        </Grid>
        <Grid item xs={12}>
          <HBTextFieldController
            label={formatMessage(FaqPageMessages.shortAnswer)}
            name={'shortAnswer'}
            multiline
            rows={5}
            formRules={{
              validate: (value) =>
                !!value.trim() ||
                `${formatMessage(validationsMessages.isRequired, {
                  msg: formatMessage(FaqPageMessages.shortAnswer),
                })}`,
              required: {
                value: true,
                message: `${formatMessage(validationsMessages.isRequired, {
                  msg: formatMessage(FaqPageMessages.shortAnswer),
                })}`,
              },
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <Box sx={readonlyFieldStyle}>
            <Typography>{formatMessage(FaqPageMessages.numberOfViews)}</Typography>
            <Typography>{getValues('numberOfViews') || 0}</Typography>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box sx={readonlyFieldStyle}>
            <Typography>{formatMessage(FaqPageMessages.numberOfUseful)}</Typography>
            <Typography>{getValues('numberOfUseful') || 0}</Typography>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box sx={readonlyFieldStyle}>
            <Typography>{formatMessage(FaqPageMessages.numberOfNotUseful)}</Typography>
            <Typography>{getValues('numberOfNotUseful') || 0}</Typography>
          </Box>
        </Grid>
      </Grid>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between">
        <HBButton
          variant="outlined"
          onClick={handleGoBack}
          startIcon={<HBIcon type="angleRight" />}
        >
          {formatMessage(phrasesMessages.back)}
        </HBButton>
        <HBButton ref={ref} type="submit" disabled={!isValid || !isDirty} sx={disableButtonStyle}>
          {formatMessage(phrasesMessages.save)}
        </HBButton>
      </Stack>
      <HBDialog
        title={formatMessage(phrasesMessages.saveSuccess)}
        content={formatMessage(phrasesMessages.dialogConfirmationContent)}
        onAccept={handleSave}
        onReject={handleCancel}
        open={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
        acceptBtn={formatMessage(phrasesMessages.confirm)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
    </Stack>
  )
}

export default FAQAddEditForm
