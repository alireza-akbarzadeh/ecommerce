import { VideoThumbnail } from '@hasty-bazar-commerce/components'
import { ContentTypeEnums } from '@hasty-bazar-commerce/core/enums'
import { MediaDto } from '@hasty-bazar-commerce/services/catalogApi.generated'
import { GetAllProductAttachmentCommentsQueryResult } from '@hasty-bazar-commerce/services/socialApi.generated'
import { HBCarousel } from '@hasty-bazar/core'
import { CardMedia, Grid, Stack } from '@mui/material'
import Image from 'next/image'
import { FC, useEffect, useState } from 'react'
import Swiper from 'swiper'
import { MediaWrapperStyle } from './Contents.style'

interface IuserMedia {
  content: GetAllProductAttachmentCommentsQueryResult[] | MediaDto[]
  activeIndex?: number
}

const ProductMedia: FC<IuserMedia> = ({ content, activeIndex }) => {
  const [activeSliderIndex, setActiveSliderIndex] = useState<number>(activeIndex ?? 0)
  const [swiper, setSwiper] = useState<Swiper | null>(null)
  const gotoSlider = (index: number) => {
    if (swiper) {
      swiper.slideTo(index, 0)
    }
  }

  const getMedia = (media: GetAllProductAttachmentCommentsQueryResult | MediaDto) => {
    if ('path' in media) {
      return { path: media.path, mediaType: media.mediaType }
    } else if ('filePath' in media) {
      return { path: media.filePath, mediaType: media.fileType }
    }
  }

  useEffect(() => {
    if (!activeIndex || !swiper) return
    setActiveSliderIndex(activeIndex)
    gotoSlider(activeIndex)
  }, [activeIndex, swiper])

  const pauseVideo = (index: number) => {
    const media = content[index]
    if (getMedia(media)?.mediaType === ContentTypeEnums.Video) {
      const video = document.getElementById(`${index}-video`) as HTMLVideoElement
      if (video) {
        video.pause()
      }
    }
  }

  return (
    <Stack sx={{ p: 6 }} spacing={4} alignItems="center">
      <HBCarousel
        onActiveIndexChange={(slider) => {
          pauseVideo(activeSliderIndex)
          setActiveSliderIndex(slider.realIndex)
        }}
        onSwiper={setSwiper}
        style={{ height: 368, width: 368 }}
      >
        {content.map((media, index) => {
          return (
            <MediaWrapperStyle sx={{ position: 'relative', width: '100%', height: '100%' }}>
              {getMedia(media)?.mediaType === ContentTypeEnums.Video ? (
                <CardMedia
                  component="video"
                  sx={{
                    width: 'inherit',
                    height: 'inherit',
                    objectFit: 'fill',
                    objectPosition: 'center',
                  }}
                  controls
                  src={`${process.env.NEXT_PUBLIC_CDN}${getMedia(media)?.path}`}
                  id={`${index}-video`}
                />
              ) : (
                <Image
                  src={`${process.env.NEXT_PUBLIC_CDN}${getMedia(media)?.path}`}
                  layout="fill"
                  loading="lazy"
                  objectFit="contain"
                />
              )}
            </MediaWrapperStyle>
          )
        })}
      </HBCarousel>
      <Grid container columnSpacing={2} rowSpacing={2} justifyContent="center">
        {content.map((media, index) => {
          return (
            <Grid item>
              <MediaWrapperStyle
                onClick={() => {
                  gotoSlider(index)
                  pauseVideo(activeSliderIndex)
                }}
                sx={{
                  position: 'relative',
                  width: 55,
                  height: 55,
                  ...(index === activeSliderIndex && {
                    border: ({ palette }) => `1px solid ${palette.primary.main}`,
                    borderInlineStyle: 'solid',
                  }),
                }}
              >
                {getMedia(media)?.mediaType === ContentTypeEnums.Video ? (
                  <VideoThumbnail
                    src={getMedia(media)?.path ?? ''}
                    width={'inherit'}
                    height={'inherit'}
                  />
                ) : (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_CDN}${getMedia(media)?.path}`}
                    layout="fill"
                    objectFit="contain"
                  />
                )}
              </MediaWrapperStyle>
            </Grid>
          )
        })}
      </Grid>
    </Stack>
  )
}

export default ProductMedia
