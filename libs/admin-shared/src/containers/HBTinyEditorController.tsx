import { HBTinyEditor, HBTinyEditorProps } from '@hasty-bazar/admin-shared/components'
import { Box, Typography } from '@mui/material'
import { FC, memo } from 'react'
import { Controller, RegisterOptions, useFormContext } from 'react-hook-form'

interface HBTinyEditorControllerProps extends Omit<HBTinyEditorProps, 'onChange' | 'value'> {
  name: string
  formRules?: RegisterOptions
  label?: string
  required?: boolean
}

const HBTinyEditorController: FC<HBTinyEditorControllerProps> = ({ name, formRules, ...props }) => {
  const { control } = useFormContext()
  return (
    <Controller
      name={name}
      control={control}
      rules={formRules}
      render={({ field, formState }) => {
        return (
          <Box
            sx={{ position: 'relative', width: '100%', height: '100%' }}
            id={props.id ? `${props.id}_continer` : 'tinyEditorContiner'}
          >
            {props?.label && (
              <>
                <Typography variant="subtitle2" component="span">
                  {props.label}
                </Typography>
                {props.required && (
                  <Typography variant="caption" sx={{ fontFamily: 'arial', ml: 1 }}>
                    *
                  </Typography>
                )}
              </>
            )}
            <HBTinyEditor
              {...props}
              {...field}
              sx={{
                '& .tox-tinymce': {
                  borderColor: formState?.errors[name] ? 'error.main' : 'gray.300',
                },
              }}
            />
          </Box>
        )
      }}
    />
  )
}

export default memo(HBTinyEditorController)
