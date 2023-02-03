import instance from '@hasty-bazar/admin-shared/core/handler'
import { errorsToString } from '@hasty-bazar/admin-shared/utils'
import { HBCircularProgressBtn, HBIcon, openToast, useUploadFile } from '@hasty-bazar/core'
import { Box, Button, Stack, Typography } from '@mui/material'
import { FC, useEffect, useRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import attributesPageMessages from '../../Attributes.messages'
import { IAttributeDetailSubjectForm } from '../../components/AttributeDetailDialog'

const IconController: FC = () => {
  const Form = useFormContext<IAttributeDetailSubjectForm>()
  const errorMessage = Form.formState.errors['attributeIcon']?.message
  const textInput = useRef(null)
  const { formatMessage } = useIntl()
  const iconPath = Form.watch('attributeIcon')

  const {
    error,
    filePath,
    isLoading,
    handleChange: handleChangeUse,
  } = useUploadFile(`${process.env.NEXT_PUBLIC_GATEWAY}/Admin/CMS/Files/`, instance)

  useEffect(() => {
    if (filePath && !error) {
      Form.setValue('attributeIcon', filePath)
    } else {
      Form.setValue('attributeIcon', '')
      if (error) {
        openToast({ message: errorsToString(error), type: 'error' })
      }
    }
  }, [filePath, error])

  return (
    <Controller
      name={'attributeIcon'}
      control={Form.control}
      render={({ field }) => (
        <Button
          variant="outlined"
          component="label"
          color="inherit"
          fullWidth
          sx={{
            borderColor: (theme) => theme.palette.grey[300],
            height: 40,
          }}
        >
          <Stack
            direction={'row'}
            sx={{ width: '100%', height: 40 }}
            justifyContent="space-between"
            alignItems={'center'}
          >
            <Typography variant="body2" color={(theme) => theme.palette.grey[500]}>
              {formatMessage(attributesPageMessages.icon)}
            </Typography>

            <Box sx={{ maxHeight: '100%', display: 'flex' }}>
              {isLoading && <HBCircularProgressBtn size={24} />}
              {!isLoading && (filePath || iconPath) && (
                <img
                  src={`${process.env.NEXT_PUBLIC_CDN}${filePath || iconPath}`}
                  alt=""
                  style={{ maxHeight: '100%', maxWidth: 50 }}
                />
              )}
              {!isLoading && !filePath && !iconPath && (
                <HBIcon type="imagePlus" size="small" sx={{ mt: 1 }} />
              )}
            </Box>
          </Stack>
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={async (e) => {
              const path = await handleChangeUse(e)
              field.onChange(path)
            }}
          />
          <input type="hidden" {...field} ref={textInput} />
        </Button>
      )}
    />
  )
}

export default IconController
