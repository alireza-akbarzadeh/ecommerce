import { VideoThumbnail } from '@hasty-bazar-commerce/components'
import { ContentTypeEnums } from '@hasty-bazar-commerce/core/enums'
import { MediaDto } from '@hasty-bazar-commerce/services/catalogApi.generated'
import { GetAllProductAttachmentCommentsQueryResult } from '@hasty-bazar-commerce/services/socialApi.generated'
import { HBCarousel, HBImageMagnifier } from '@hasty-bazar/core'
import { Box, CardMedia, Stack } from '@mui/material'
import Image from 'next/image'
import { useState } from 'react'
import { useProductDetail } from '../../ProductDetailContext'
import { MediaWrapperStyle } from './Contents.style'
import ContentsDialog from './ContentsDialog'

const Contents = () => {
  const { activeUniqueProduct } = useProductDetail()
  const [openContentsDialog, setOpenContentsDialog] = useState<boolean>(false)
  const [activceIndex, setActiveIndex] = useState<number>(0)

  const clickedOnMedia = (index: number) => {
    setOpenContentsDialog(true)
    setActiveIndex(index)
  }

  const handleCloseMediaDialog = () => {
    setOpenContentsDialog(false)
    setActiveIndex(0)
  }

  const getMedia = (media: GetAllProductAttachmentCommentsQueryResult | MediaDto) => {
    if ('path' in media) {
      return { path: media.path, mediaType: media.mediaType }
    } else if ('filePath' in media) {
      return { path: media.filePath, mediaType: media.fileType }
    }
  }

  return (
    <Stack direction="row" spacing={6}>
      <HBCarousel
        style={{ height: 328, width: 48 }}
        slidesPerView={6}
        freeMode
        direction="vertical"
        spaceBetween={8}
        loop={false}
      >
        {activeUniqueProduct?.mediaList?.map((media, index) => {
          return (
            <MediaWrapperStyle
              key={`product-contents-${index}`}
              onClick={() => clickedOnMedia(index)}
            >
              {media.mediaType === ContentTypeEnums.Video ? (
                <VideoThumbnail src={getMedia(media)?.path ?? ''} width={48} height={48} />
              ) : (
                <Box
                  sx={{
                    overflow: 'hidden',
                    width: 48,
                    height: 48,
                    position: 'relative',
                    flexShrink: 0,
                  }}
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_CDN}${getMedia(media)?.path}`}
                    layout="fill"
                    loading="lazy"
                    objectFit="contain"
                    objectPosition="center"
                    alt={`product-image-${index}-${activeUniqueProduct.name}`}
                  />
                </Box>
              )}
            </MediaWrapperStyle>
          )
        })}
      </HBCarousel>
      <HBCarousel
        initialSlide={0}
        allowTouchMove={false}
        style={{ height: 328, maxWidth: 328, overflow: 'hidden' }}
      >
        {activeUniqueProduct?.mediaList?.map((media, index) => {
          return (
            <MediaWrapperStyle key={`full-carousel-${index}`}>
              {media.mediaType === ContentTypeEnums.Video ? (
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
                />
              ) : (
                <HBImageMagnifier
                  zoom={2}
                  width={'100%'}
                  height="328px"
                  src={`${process.env.NEXT_PUBLIC_CDN}${media.path}`}
                  resultHeight={400}
                  resultWidth={600}
                />
              )}
            </MediaWrapperStyle>
          )
        })}
      </HBCarousel>
      {openContentsDialog && (
        <ContentsDialog onClose={() => handleCloseMediaDialog()} activeIndex={activceIndex} />
      )}
    </Stack>
  )
}

export default Contents
