import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import HBFormItemColorPicker from '@hasty-bazar-admin/domains/Content-Arrangement/containers/HBFormItemColorPicker'
import { HBButton } from '@hasty-bazar/core'
import { Grid, Stack } from '@mui/material'
import { FC, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import attributesPageMessages from '../Attributes.messages'
import { IAttributeDetailSubjectForm } from '../components/AttributeDetailDialog'
import { AttributeKindTypeCode } from './AttributesAddEditForm'
import { AttributeDetailDataProps } from './AttributesDetailDataGrid'
import IconController from './FormControls/IconController'

const AttributeDetailForm: FC<{
  updatedValue: AttributeDetailDataProps | null
  attributeType?: AttributeKindTypeCode
}> = ({ updatedValue, attributeType }) => {
  const { formatMessage } = useIntl()

  const {
    formState: { isValid, isDirty },
    setValue,
  } = useFormContext<IAttributeDetailSubjectForm>()

  useEffect(() => {
    if (updatedValue) {
      setValue('id', updatedValue?.id + '')
      setValue('displayOrder', updatedValue.sortOrder + '')
      setValue('attributeValue', updatedValue.value)
      setValue('attributeStatus', Boolean(updatedValue.isActive))
      setValue('attributeIcon', updatedValue.iconPath || '')
      setValue('attributeColor', updatedValue.color || '')
    } else {
      setValue('attributeStatus', true)
    }
  }, [updatedValue])

  const isRequiredColor = attributeType === AttributeKindTypeCode.Color

  return (
    <>
      <Grid item xs={12} sm={6}>
        <HBTextFieldController
          name="attributeValue"
          label={formatMessage(attributesPageMessages.attributeValue)}
          formRules={{
            required: true,
            maxLength: 200,
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <HBTextFieldController
          name="displayOrder"
          label={formatMessage(attributesPageMessages.attributesDisplayOrder)}
          formRules={{
            required: true,
            min: 0,
          }}
          mask="0000"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <HBFormItemColorPicker
          rules={{
            required: {
              value: isRequiredColor,
              message: formatMessage(attributesPageMessages.attributesRequiredColor),
            },
          }}
          label={
            formatMessage(attributesPageMessages.attributesFieldColor) +
            (isRequiredColor ? '*' : '')
          }
          formName="attributeColor"
          saveButtonLabel={formatMessage(phrasesMessages.save)}
          cancelButtonLabel={formatMessage(phrasesMessages.cancel)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <IconController />
      </Grid>
      <Stack sx={{ p: 1, m: 1, width: '100%' }} direction="row-reverse">
        <HBButton disabled={!isDirty || !isValid} type="submit" color="primary">
          {formatMessage(phrasesMessages.save)}
        </HBButton>
      </Stack>
    </>
  )
}

export default AttributeDetailForm
