import { HBIcon } from '@hasty-bazar/core'
import { IconButton, Modal, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { useIntl } from 'react-intl'
import ticketingMessages from '../ticketing.messages'
import { TicketType } from './ticketItem'

export interface ImageTicketProps {
  data: TicketType
}

function ImageTicket({ data }: ImageTicketProps) {
  const [open, setOpen] = useState(false)
  const { formatMessage } = useIntl()

  function onClose() {
    setOpen(false)
  }
  function onOpen() {
    setOpen(true)
  }
  const filePath = `${process.env.NEXT_PUBLIC_CDN}/${data.filePath}`
  const isImage =
    filePath.includes('jpg') ||
    filePath.includes('png') ||
    filePath.includes('jpeg') ||
    filePath.includes('gif') ||
    filePath.includes('PNG') ||
    filePath.includes('JPG') ||
    filePath.includes('JPEG') ||
    filePath.includes('GIF')
  const isVideo = filePath.includes('mp4') || filePath.includes('mov') || filePath?.includes('avi')
  const isPDF = filePath.includes('.pdf')
  if (!data.filePath) {
    return null
  }
  return (
    <>
      <Stack display="flex" width="100%" justifyContent="flex-start">
        <Stack
          bgcolor="info.lighter"
          sx={{
            borderRadius: 4,
            borderBottomLeftRadius: 1,
            overflow: 'hidden',
            display: 'flex',

            justifyContent: 'flex-end',
            py: 4,
            px: 2,
            width: {
              sx: '90%',
              md: '40%',
            },
          }}
        >
          <Stack display="flex" justifyContent="flex-end" gap={2} flexDirection="row">
            <Stack>
              <Typography dir="ltr" variant="subtitle2">
                {data?.filePath?.slice(9)}
              </Typography>
            </Stack>

            {(isVideo || isImage) && (
              <Stack
                sx={{
                  borderRadius: 4,
                  height: 80,
                  minWidth: 100,
                  width: 100,
                  position: 'relative',
                }}
                onClick={onOpen}
              >
                <Stack
                  component={isImage ? 'img' : 'video'}
                  controls={isVideo || undefined}
                  autoPlay={false}
                  sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    zIndex: 1,
                    objectFit: 'contain',
                  }}
                  src={filePath}
                  alt={data?.filePath?.slice(9)}
                  children={isVideo ? <source src={filePath} type="video/mp4" /> : undefined}
                />

                {isVideo && (
                  <Stack
                    sx={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      zIndex: 2,
                      opacity: 0.5,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <HBIcon type="playCircle" sx={{ color: 'common.white' }} size="large" />
                  </Stack>
                )}
              </Stack>
            )}

            {isPDF && (
              <Stack
                component="a"
                download
                href={filePath}
                sx={{
                  borderRadius: 4,
                  height: 80,
                  width: 100,
                  position: 'relative',
                }}
              >
                <Stack
                  sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',

                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <HBIcon type="file" size="large" />
                </Stack>
              </Stack>
            )}
          </Stack>
        </Stack>
      </Stack>
      <Modal open={open} onClose={onClose}>
        <Stack
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: {
              xs: '90%',
              md: '40%',
            },
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 4,

            overflow: 'auto',
            p: 6,
          }}
          display={'flex'}
          gap={4}
        >
          <Stack
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6">
              {formatMessage(ticketingMessages[isImage ? 'showImage' : 'showVideo'])}
            </Typography>
            <IconButton onClick={onClose}>
              <HBIcon type="times" size="small" sx={{ color: 'grey.500' }} />
            </IconButton>
          </Stack>

          <Stack
            component={isImage ? 'img' : 'video'}
            controls={isVideo || undefined}
            alt={data?.filePath || ''}
            sx={{
              borderRadius: 4,
              height: 400,
              cursor: 'pointer',
              objectFit: {
                xs: 'unset',
                md: 'cover',
              },
              width: '100%',
            }}
            src={filePath}
            children={isVideo ? <source src={filePath} type="video/mp4" /> : undefined}
          ></Stack>
        </Stack>
      </Modal>
    </>
  )
}

export default ImageTicket
