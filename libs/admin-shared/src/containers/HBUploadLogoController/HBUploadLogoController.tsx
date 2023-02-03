import instance from '@hasty-bazar/admin-shared/core/handler'
import { HBButton, HBIcon } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import { HBUploadButton } from '../HBFileUploader/containers'
import HBImg from '../HBFileUploader/containers/HBImage.style'

export type HBUploadLogoControllerProps = {
  fieldName: string
  disabled?: boolean
  title?: string
  required?: boolean
  showDeleteButton?: boolean
}

const HBUploadLogoController = ({
  fieldName,
  disabled = false,
  title = '',
  required = false,
  ...props
}: HBUploadLogoControllerProps) => {
  const { control, watch, getValues } = useFormContext()
  const icon = watch(fieldName)

  return (
    <Controller
      name={fieldName || 'icon'}
      control={control}
      render={({ field }) => (
        <>
          {!icon && (
            <HBUploadButton
              uploadButtonIcon="cameraPlus"
              uploadButtonAcceptType="image/*"
              uploadButtonTitle={title}
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
                    field?.onChange(path)
                  })
                  .catch((err) => {})
              }}
            />
          )}
          {!!icon && (
            <Box sx={{ position: 'relative' }}>
              <HBImg
                src={process.env['NEXT_PUBLIC_CDN'] + String(getValues(fieldName))}
                sx={{ maxWidth: 120 }}
              />
              <HBButton
                variant="text"
                sx={{
                  position: 'absolute',
                  right: 4,
                  top: 4,
                  bgcolor: 'grey.200',
                  minWidth: 40,
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                }}
                onClick={() => {
                  field?.onChange('')
                }}
              >
                <HBIcon type="trash" />
              </HBButton>
            </Box>
          )}
        </>
      )}
    />
  )
}

export default HBUploadLogoController
