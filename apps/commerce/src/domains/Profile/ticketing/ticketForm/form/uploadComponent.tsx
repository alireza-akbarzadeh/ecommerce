import { CircularProgressWithLabel } from '@hasty-bazar-commerce/components/CircularProgressWithLabel'
import { EntityTypeEnums } from '@hasty-bazar-commerce/core/enums'
import { errorsToString } from '@hasty-bazar-commerce/core/utils/errorsToString'
import useUploader from '@hasty-bazar-commerce/hooks/useUploadFile'
import {
  PostWebCmsContentsFileApiArg,
  PostWebCmsContentsFileApiResponse,
} from '@hasty-bazar-commerce/services/cmsApi.generated'
import { ContentTypeEnums, HBButton, HBIcon } from '@hasty-bazar/core'
import { Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import ticketingMessages from '../../ticketing.messages'

interface UploadComponentProps {
  onUpload: (data: { file: File; data: PostWebCmsContentsFileApiResponse }) => void
  disabled?: boolean
  setLoading?: (value: boolean) => void
}

type UploadDataType = Partial<PostWebCmsContentsFileApiArg['body']>
function UploadComponent({ onUpload, disabled, setLoading }: UploadComponentProps) {
  const { formatMessage } = useIntl()
  const [errorMessage, setErrorMessage] = useState<string>()
  const [file, setFile] = useState<File>()
  const url = `${process.env.NEXT_PUBLIC_GATEWAY}/Web/CMS/Contents/file`
  const {
    data,
    error,
    cancelRequest,
    isLoading,
    submitForm,
    uploadProgress: { percentage },
  } = useUploader<UploadDataType, PostWebCmsContentsFileApiResponse>({
    url,
  })

  const onChooseFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(undefined)
    const _file = event.target.files?.[0]
    const isImage = _file?.type.includes('image')
    const isVideo = _file?.type.includes('video')
    const isPDF = _file?.type.includes('pdf')

    const ContentType = isImage
      ? ContentTypeEnums.Image
      : isVideo
      ? ContentTypeEnums.Video
      : ContentTypeEnums.Document

    const formData: UploadDataType = {
      EntityId: '1',
      ParentId: '',
      Factor: '',
      ContentType,
      File: _file,
      EntityTypeId: String(EntityTypeEnums.Ticket),
    }
    setFile(_file)

    if (_file) {
      submitForm(formData)
    }
  }

  useEffect(() => {
    if (data && file) {
      onUpload({
        file,
        data,
      })
    }
    setLoading?.(isLoading)
  }, [isLoading, data])

  return (
    <Stack
      component="label"
      htmlFor="file"
      sx={{
        width: '120px',
        minWidth: '120px',
        minHeight: '120px',
        overflow: 'hidden',
        borderRadius: 2,
        height: '120px',
        border: ({ palette }) => '1px dashed ' + palette.grey[500],
      }}
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={error ? 2 : 4.5}
      justifyContent="center"
    >
      {isLoading ? (
        <>
          <CircularProgressWithLabel value={percentage! || 0} color="info" showTick />
          <HBButton
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              cancelRequest()
            }}
            size="small"
            variant="text"
          >
            <Typography variant="caption" color="info.main">
              {formatMessage(ticketingMessages.cancel)}
            </Typography>
          </HBButton>
        </>
      ) : (
        <>
          <HBIcon
            type="upload"
            sx={{
              color: 'grey.500',
            }}
          />
          <Typography variant="subtitle2" color="grey.500">
            {formatMessage(ticketingMessages.uploadFile)}
          </Typography>
          {error && error?.message !== 'canceled' && (
            <Typography textAlign={'center'} variant="caption" color="error.main">
              {errorsToString(error)}
            </Typography>
          )}

          {errorMessage && (
            <Typography textAlign={'center'} variant="caption" color="error.main">
              {errorMessage}
            </Typography>
          )}
        </>
      )}
      <input
        disabled={disabled}
        accept="image/*"
        onChange={onChooseFile}
        type="file"
        id="file"
        hidden
      />
    </Stack>
  )
}

export default UploadComponent
