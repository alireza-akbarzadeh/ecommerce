import instance from '@hasty-bazar/admin-shared/core/handler'
import phrasesMessages from '@hasty-bazar/admin-shared/core/translations/phrases.messages'
import { HBButton, HBIcon } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import React from 'react'
import { Controller, RegisterOptions, useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { HBUploadButton } from '../HBFileUploader/containers'
import HBImg from '../HBFileUploader/containers/HBImage.style'

export type HBUploadImageControllerProps = {
  name: string
  formRules?: RegisterOptions
  defaultValue?: string
  disabled?: boolean
}

export default function HBUploadImageController({
  name,
  formRules,
  defaultValue,
  disabled,
}: HBUploadImageControllerProps) {
  const { formatMessage } = useIntl()
  const { control, watch } = useFormContext()
  const defaultName = defaultValue || watch(name) || ''

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultName}
      rules={formRules}
      render={({ field, fieldState: { error } }) => (
        <>
          {!field.value && (
            <HBUploadButton
              error={!!error}
              uploadButtonIcon="cameraPlus"
              uploadButtonAcceptType="image/*"
              uploadButtonTitle={formatMessage(phrasesMessages.uploadImageFile)}
              uploadButtonOnUpload={async (media, file) => {
                const formData = new FormData()
                formData.append('File', file)
                instance
                  .post(`${process.env['NEXT_PUBLIC_GATEWAY']}/Admin/CMS/Files`, formData, {
                    headers: {
                      'Content-Type': 'multipart/form-data',
                      'client-name': 'Swagger on HIT.Hastim.FileServer.Endpoints.WebApi',
                      'client-version': '1.0.1.100',
                      Accept: '*/*',
                    },
                  })
                  .then((res: any) => {
                    const {
                      data: {
                        data: { path: path },
                      },
                    } = res
                    field.onChange(path)
                  })
                  .catch((err) => {})
              }}
              disabled={disabled}
            />
          )}
          {!!field.value && (
            <Box
              position="relative"
              width={120}
              height={120}
              p={1}
              sx={{
                border: ({ palette }) =>
                  `1px solid ${!error ? palette.grey[300] : palette.error.main}`,
              }}
            >
              <HBImg
                src={process.env['NEXT_PUBLIC_CDN'] + String(field.value)}
                sx={{ width: '100%', height: '100%', objectFit: 'fill' }}
              />
              <HBButton
                variant="text"
                sx={{
                  position: 'absolute',
                  top: 5,
                  right: 5,
                  minWidth: 25,
                  backgroundColor: 'common.white',
                  height: 25,
                  p: 0,
                  pt: 1,
                }}
                onClick={() => {
                  field.onChange('')
                }}
              >
                <HBIcon type="trash" size="small" />
              </HBButton>
            </Box>
          )}
        </>
      )}
    />
  )
}
