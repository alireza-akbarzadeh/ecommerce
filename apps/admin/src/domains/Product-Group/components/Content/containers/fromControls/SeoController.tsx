import validationsMessages from '@hasty-bazar-admin/core/translations/validations.messages'
import { formLabelClasses, TextField } from '@mui/material'
import { FC, useRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import productGroupMessages from '../../../../ProductGroup.messages'
import ContentFieldWrapper from '../../components/ContentFieldWrapper.style'
import { ICategoryAttributeForm } from '../../Content'

const SeoController: FC = () => {
  const Form = useFormContext<ICategoryAttributeForm>()
  const errorMessage = Form.formState.errors['contentSeo']?.message
  const textInput = useRef(null)
  const { formatMessage } = useIntl()

  return (
    <Controller
      rules={{
        required: {
          value: true,
          message: formatMessage(validationsMessages.isRequired),
        },
      }}
      name={'contentSeo'}
      control={Form.control}
      render={({ field }) => (
        <ContentFieldWrapper>
          <TextField
            sx={{
              width: '100%',
              [`& .${formLabelClasses.asterisk}`]: {
                fontFamily: 'arial',
              },
            }}
            required
            inputRef={textInput}
            {...field}
            label={formatMessage(productGroupMessages.seo)}
            rows={6}
            multiline
            focused
          />
        </ContentFieldWrapper>
      )}
    />
  )
}

export default SeoController
