import { VideoThumbnail } from '@hasty-bazar-commerce/components/VideoThumbnail'
import { ContentTypeEnums, HBIcon } from '@hasty-bazar/core'
import { Box, Button, CircularProgress, Stack, styled, Typography } from '@mui/material'
import Image from 'next/image'
import { FC, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import OrderTrackingMessages from '../../../orderTracking.messages'
import { useRefund } from '../RefundContext'

const { log } = console

const TextStyle = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
}))

interface IFileResponse {
  type: 'image' | 'video'
  link: string
}

const thumbnailSize = 120

interface IRefundFileUploaderProps {
  readOnly?: boolean
}

const RefundFileUploader: FC<IRefundFileUploaderProps> = (props) => {
  const { readOnly } = props
  const { productRefundation } = useRefund()
  const [sendedFiles, setSendedFiles] = useState<IFileResponse[]>([])
  const [status, setStatus] = useState<{
    variant: 'error' | 'success' | 'progress'
    value?: string | number
  } | null>(null)
  const { formatMessage } = useIntl()

  const handleAddFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(null)
    const uploadedFile = event.target.files && (event.target.files[0] as File)
    event.target.value = ''

    if (!uploadedFile) return

    if (uploadedFile.size > 10 * 1024 * 1024) {
      setStatus({
        variant: 'error',
        value: formatMessage({ ...OrderTrackingMessages.fileUploadSizeError }),
      })
      return
    }

    const ContentType = uploadedFile.type.includes('image')
      ? ContentTypeEnums.Image
      : ContentTypeEnums.Video

    const sendedFile: IFileResponse = {
      link: '',
      type: ContentType === ContentTypeEnums.Image ? 'image' : 'video',
    }

    const formData = new FormData()
    formData.append('EntityTypeId', '8034')
    formData.append('EntityId', productRefundation!.orderId)
    formData.append('Factor', 'refund')
    formData.append('ContentType', `${ContentType}`)
    formData.append('File', uploadedFile)

    const request = new XMLHttpRequest()
    request.open('POST', `${process.env.NEXT_PUBLIC_CMS_URL}/Contents/file`)

    request.upload.addEventListener('progress', (e) => {
      setStatus({ variant: 'progress', value: (e.loaded / e.total) * 100 })
    })

    request.addEventListener('loadend', function (e) {
      if (request.status === 200) {
        setStatus({ variant: 'success' })
        sendedFile.link = JSON.parse(request.response).data.value
        setSendedFiles([...sendedFiles, sendedFile])
        setTimeout(() => {
          setStatus(null)
        }, 2000)
      }
    })

    request.addEventListener('error', (e) => {
      log(e)
    })

    request.send(formData)
  }

  return (
    <Stack gap={4} direction="row" flexWrap="wrap">
      {!readOnly && (
        <Button
          sx={{
            border: (theme) => `1px dashed ${theme.palette.grey[500]}`,
            width: 120,
            height: 120,
            borderRadius: 2,
          }}
          variant="text"
          component="label"
          disabled={!!status}
        >
          {status?.variant !== 'progress' && status?.variant !== 'success' ? (
            <Stack alignItems="center" spacing={4}>
              <HBIcon size="small" type="upload" sx={{ color: 'grey.500' }} />
              <Stack alignItems="center">
                <TextStyle variant="caption" color="text.secondary">
                  <FormattedMessage {...OrderTrackingMessages.uploadFile} />
                </TextStyle>
                {status?.variant === 'error' ? (
                  <TextStyle variant="caption" color="error.main">
                    {status.value}
                  </TextStyle>
                ) : null}
              </Stack>
            </Stack>
          ) : status?.variant === 'success' ? (
            <Stack alignItems="center" spacing={4}>
              <Stack
                alignItems="center"
                justifyContent="center"
                sx={{ bgcolor: 'success.main', width: 32, height: 32, borderRadius: '100%' }}
              >
                <HBIcon type="check" size="small" sx={{ color: 'common.white' }} />
              </Stack>
              <TextStyle variant="caption" color="text.secondary">
                <FormattedMessage {...OrderTrackingMessages.withSuccess} />
              </TextStyle>
            </Stack>
          ) : (
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <CircularProgress variant="determinate" value={status.value as number} />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="caption" component="div" color="grey.700">{`${Math.round(
                  status.value as number,
                )}%`}</Typography>
              </Box>
            </Box>
          )}

          <input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleAddFile(e)
            }}
            hidden
            accept="image/*, video/*"
            type="file"
          />
        </Button>
      )}

      {sendedFiles.map((file, index) => (
        <Box
          key={`refunded-image-${productRefundation?.orderId}-${index}`}
          sx={{ borderRadius: 2, overflow: 'hidden', position: 'relative' }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              bgcolor: '#FFFFFFCC',
              zIndex: 2,
            }}
          />
          {file.type === 'image' ? (
            <Box
              sx={{
                overflow: 'hidden',
                width: thumbnailSize,
                height: thumbnailSize,
                position: 'relative',
                flexShrink: 0,
              }}
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_CDN}${file.link}`}
                layout="fill"
                loading="lazy"
                objectFit="cover"
                objectPosition="center"
                alt={`refund-image-${index}`}
              />
            </Box>
          ) : (
            <Box sx={{ position: 'relative' }}>
              <Stack
                alignItems="center"
                justifyContent="center"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  zIndex: 3,
                }}
              >
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  sx={{ borderRadius: '100%', bgcolor: 'common.white', width: 40, height: 40 }}
                >
                  <HBIcon sx={{ color: 'grey.500' }} size="small" type="play" />
                </Stack>
              </Stack>
              <VideoThumbnail
                hideDuration
                src={file.link}
                width={thumbnailSize}
                height={thumbnailSize}
              />
            </Box>
          )}
        </Box>
      ))}
    </Stack>
  )
}

export default RefundFileUploader
