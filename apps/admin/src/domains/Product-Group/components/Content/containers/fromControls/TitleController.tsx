import validationsMessages from '@hasty-bazar-admin/core/translations/validations.messages'
import { formLabelClasses, TextField } from '@mui/material'
import { FC, useRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import productGroupMessages from '../../../../ProductGroup.messages'
import ContentFieldWrapper from '../../components/ContentFieldWrapper.style'
import { ICategoryAttributeForm } from '../../Content'

const TitleController: FC = () => {
  const Form = useFormContext<ICategoryAttributeForm>()
  const errorMessage = Form.formState.errors['contentTitle']?.message
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
      name={'contentTitle'}
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
            label={formatMessage(productGroupMessages.title)}
            rows={3}
            multiline
            focused
          />
        </ContentFieldWrapper>
      )}
    />
  )
}

export default TitleController
