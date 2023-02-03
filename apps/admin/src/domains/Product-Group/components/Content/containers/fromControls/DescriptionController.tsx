import HBTinyEditor from '@hasty-bazar/admin-shared/components/HBTinyEditor'
import validationsMessages from '@hasty-bazar-admin/core/translations/validations.messages'
import { Box, Typography } from '@mui/material'
import { FC, useRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import productGroupMessages from '../../../../ProductGroup.messages'
import { ICategoryAttributeForm } from '../../Content'

const DescriptionController: FC = () => {
  const Form = useFormContext<ICategoryAttributeForm>()
  const errorMessage = Form.formState.errors['contentDescription']?.message
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
      name={'contentDescription'}
      control={Form.control}
      render={({ field }) => (
        <Box sx={{ my: 6 }}>
          <Box sx={{ my: 3 }}>
            <Typography variant="button" color="primary.main">
              {formatMessage(productGroupMessages.description)}
            </Typography>
            <Typography variant="button" color="primary.main" sx={{ px: 1, fontFamily: 'arial' }}>
              *
            </Typography>
          </Box>
          <HBTinyEditor {...field} />
        </Box>
      )}
    />
  )
}

export default DescriptionController
