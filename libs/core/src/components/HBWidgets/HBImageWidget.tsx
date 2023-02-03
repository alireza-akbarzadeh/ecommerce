import { HBButton, HBIcon } from '@hasty-bazar/core'
import { Box, Stack, Theme, Typography, useMediaQuery } from '@mui/material'
import { SxProps } from '@mui/system'
import { useRouter } from 'next/router'
import { FC, useMemo } from 'react'

export interface HBImageWidgetProps {
  closable?: boolean
  type?:
    | 'IMAGE_DEFAULT'
    | 'IMAGE-WITHOUT-TITLE'
    | 'ADS_SLIDER_DEFAULT'
    | 'IMAGE_TWO_ROWS'
    | 'IMAGE_ONLY'
    | string
  sx?: SxProps<Theme>
  metaData?: string
  imageUrl?: string
  title?: string
  description?: string
}

const HBImageWidget: FC<HBImageWidgetProps> = (props) => {
  const router = useRouter()
  const metadata = props?.metaData ? JSON.parse(props.metaData) : {}

  const { type, sx, closable, imageUrl, title, description } = props
  const xsBreakpoint = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  const calcHeight = useMemo(() => {
    switch (type) {
      case 'IMAGE-WITHOUT-TITLE':
      case 'IMAGE_ONLY':
        return 122
      case 'IMAGE_DEFAULT':
        return { xs: 126, md: 202 }
      case 'IMAGE_TWO_ROWS':
        return 65
      case 'ADS_SLIDER_DEFAULT':
        return { xs: 160, sm: 340, md: 363 }
      default:
        return 267
    }
  }, [type])

  const calcBoxWidth = useMemo(() => {
    if (type === 'ADS_SLIDER_DEFAULT') return { xs: 172, sm: 268, md: 464 }
    return 464
  }, [type])

  const calcDirectionBox = useMemo(() => {
    switch (type) {
      case 'ADS_SLIDER_DEFAULT':
        return 'column'
      case 'IMAGE-WITHOUT-TITLE':
        return { xs: 'column', md: 'row' }
      default:
        return 'row'
    }
  }, [type])

  const calcJustifyContent = useMemo(() => {
    switch (type) {
      case 'IMAGE_DEFAULT_LEFT_ALIGN':
        return 'flex-end'
      default:
        return ''
    }
  }, [type])

  const calcStackPy = useMemo(() => {
    switch (type) {
      case 'IMAGE_TWO_ROWS':
        return { xs: 2, sm: 4 }
      default:
        return { xs: 4, sm: 6 }
    }
  }, [type])

  const calcStackPx = useMemo(() => {
    switch (type) {
      case 'IMAGE_TWO_ROWS':
        return { xs: 2, sm: 4, md: 4 }
      default:
        return { xs: 4, sm: 6, md: 8 }
    }
  }, [type])

  return (
    <Box
      display={'flex'}
      justifyContent={type === 'ADS_SLIDER_DEFAULT' ? 'start' : 'center'}
      alignItems={type === 'ADS_SLIDER_DEFAULT' ? { xs: 'start', md: 'center' } : 'center'}
      sx={{
        height: calcHeight,
        px: { xs: 2, sm: 'unset' },
        pt: type === 'ADS_SLIDER_DEFAULT' ? { xs: 2, sm: 4, md: 'unset' } : 'unset',
        position: 'relative',
        borderRadius: 4,
        overflow: 'hidden',
        ...sx,
        '&:hover': {
          '& .closeableBox': {
            opacity: 1,
          },
        },
      }}
    >
      {!!imageUrl && (
        <Box
          component={metadata?.url ? 'a' : 'div'}
          target="_blank"
          href={(metadata?.url as string)?.includes('http') ? metadata.url : '//' + metadata.url}
        >
          <Box
            src={imageUrl!}
            width="100%"
            height="100%"
            component="img"
            sx={{
              position: 'absolute',
              cursor: metadata?.url ? 'pointer' : 'auto',
              objectFit: 'fill',
              top: 0,
              right: 0,
            }}
          />
        </Box>
      )}

      {closable && (
        <Box
          className="closeableBox"
          sx={(theme) => ({
            position: 'absolute',
            top: 8,
            right: 8,
            borderRadius: 50,
            bgcolor: 'rgba(255,255,255,0.7)',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            opacity: 0,
            padding: theme.spacing(2),
            '&:hover': {
              backgroundColor: theme.palette.common.white,
            },
          })}
          onClick={(e) =>
            e?.currentTarget?.parentElement?.parentElement?.setAttribute('style', 'display: none')
          }
        >
          <HBIcon type="times" sx={{ color: 'grey.500', fontSize: 16, display: 'flex' }} />
        </Box>
      )}
      {type !== 'IMAGE_ONLY' && (!!title || !!description) && (
        <Stack
          alignItems={type === 'ADS_SLIDER_DEFAULT' ? '' : 'center'}
          justifyContent={calcJustifyContent}
          px={calcStackPx}
          py={calcStackPy}
          sx={{
            borderRadius: 4,
            backgroundColor: metadata?.backgroundColor,
            width: type === 'IMAGE-WITHOUT-TITLE' ? 'unset' : calcBoxWidth,
            opacity: type === 'ADS_SLIDER_DEFAULT' ? 0.8 : 'unset',
            flexDirection: calcDirectionBox,
            zIndex: 99,
            ml: type === 'ADS_SLIDER_DEFAULT' ? { sm: 3.5 } : 0,
          }}
        >
          {type !== 'IMAGE-WITHOUT-TITLE' && !!title && (
            <Typography
              variant={xsBreakpoint ? 'subtitle1' : 'h4'}
              sx={{ color: metadata?.fontColor }}
              mb={1}
            >
              {title}
            </Typography>
          )}
          {!!description && (
            <Typography
              component="div"
              dangerouslySetInnerHTML={{ __html: description + '' }}
              mt={type === 'IMAGE_DEFAULT' ? { xs: 0, sm: 4, md: 6 } : 0}
              sx={{
                '& *': {
                  fontFamily: (theme) => `${theme.typography.fontFamily} !important`,
                  m: 0,
                },
                zIndex: 1,
              }}
            />
          )}
          {metadata?.hasButton && (
            <Box
              display={'flex'}
              justifyContent="end"
              mt={type !== 'IMAGE-WITHOUT-TITLE' ? { xs: 2, sm: 6 } : 0}
            >
              <HBButton
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  router.push(metadata?.button?.link || '#')
                }}
                variant="contained"
                sx={{
                  mt: type === 'IMAGE_DEFAULT' ? 8 : 'unset',
                  ml: type === 'IMAGE_DEFAULT' ? 'unset' : 6,
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: metadata?.button?.backgroundColor,
                  minWidth: 100,
                  px: 4,
                }}
                size={xsBreakpoint ? 'small' : 'large'}
              >
                <Typography
                  variant="h6"
                  color="text.primary"
                  mr={3}
                  sx={{ color: metadata?.button?.fontColor }}
                >
                  {metadata?.button?.name}
                </Typography>
                <HBIcon type="arrowLeft" sx={{ color: metadata?.button?.fontColor }} />
              </HBButton>
            </Box>
          )}
        </Stack>
      )}
    </Box>
  )
}

HBImageWidget.defaultProps = { type: 'IMAGE_DEFAULT' }

export default HBImageWidget
