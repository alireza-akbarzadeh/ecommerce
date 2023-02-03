import { ContentTypeEnums, EntityTypeEnums } from '@hasty-bazar/admin-shared/core/enums'
import {
  EntityType,
  useGetAdminCmsContentsByEntityTypeIdAndEntityIdQuery,
} from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import { HBCarousel, HBImageMagnifier } from '@hasty-bazar/core'
import { Box, Stack } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import {
  MAIN_IMAGE_PRODUCT_FACTOR,
  OTHER_IMAGES_PRODUCT_FACTOR,
} from '../../../containers/productForm/contentSettings/ProductImagesAndVideos'
import { VideoThumbnail } from '../../components'
import { MediaWrapperStyle } from './Contents.style'
import ContentsDialog from './ContentsDialog'

const Contents = () => {
  const { id } = useRouter().query as { id: string }
  const productImages = useGetAdminCmsContentsByEntityTypeIdAndEntityIdQuery({
    'client-name': 'hasty-bazar-admin',
    'client-version': '1.0.0',
    entityId: id,
    entityTypeId: EntityTypeEnums.Product as unknown as EntityType,
    contentType: ContentTypeEnums.Image,
    factor: OTHER_IMAGES_PRODUCT_FACTOR,
  })
  const productMainImage = useGetAdminCmsContentsByEntityTypeIdAndEntityIdQuery({
    'client-name': 'hasty-bazar-admin',
    'client-version': '1.0.0',
    entityId: id,
    entityTypeId: EntityTypeEnums.Product as unknown as EntityType,
    contentType: ContentTypeEnums.Image,
    factor: MAIN_IMAGE_PRODUCT_FACTOR,
  })

  const productVideos = useGetAdminCmsContentsByEntityTypeIdAndEntityIdQuery({
    'client-name': 'hasty-bazar-admin',
    'client-version': '1.0.0',
    entityId: id,
    entityTypeId: EntityTypeEnums.Product as unknown as EntityType,
    contentType: ContentTypeEnums.Video,
    factor: OTHER_IMAGES_PRODUCT_FACTOR,
  })

  const images = productImages.data?.data?.items || []
  const videos = productVideos.data?.data?.items || []
  const mainImage = productMainImage.data?.data?.items || []
  const mediaList = mainImage.concat(images).concat(videos)

  const [openContentsDialog, setOpenContentsDialog] = useState<boolean>(false)
  const [activeIndex, setActiveIndex] = useState<number>(0)

  const clickedOnMedia = (index: number) => {
    setOpenContentsDialog(true)
    setActiveIndex(index)
  }

  const handleCloseMediaDialog = () => {
    setOpenContentsDialog(false)
    setActiveIndex(0)
  }

  return (
    <Stack direction="row" spacing={6}>
      <HBCarousel
        style={{ height: 328, width: 48 }}
        slidesPerView={6}
        freeMode
        direction="vertical"
        spaceBetween={8}
      >
        {mediaList?.map((media, index) => {
          return (
            <MediaWrapperStyle onClick={() => clickedOnMedia(index)}>
              {media?.contentType === ContentTypeEnums.Video ? (
                <VideoThumbnail src={media?.value ?? ''} width={48} height={48} />
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
                    src={`${process.env.NEXT_PUBLIC_CDN}${media?.value}`}
                    layout="fill"
                    loading="lazy"
                    objectFit="contain"
                    objectPosition="center"
                  />
                </Box>
              )}
            </MediaWrapperStyle>
          )
        })}
      </HBCarousel>
      <HBCarousel allowTouchMove={false} style={{ height: 328, maxWidth: 328, overflow: 'hidden' }}>
        {mediaList?.map((media) => {
          return (
            <MediaWrapperStyle>
              <HBImageMagnifier
                zoom={2}
                width={'100%'}
                height="328px"
                src={`${process.env.NEXT_PUBLIC_CDN}${media?.value}`}
                resultHeight={400}
                resultWidth={600}
              />
            </MediaWrapperStyle>
          )
        })}
      </HBCarousel>
      {openContentsDialog && (
        <ContentsDialog onClose={() => handleCloseMediaDialog()} activeIndex={activeIndex} />
      )}
    </Stack>
  )
}

export default Contents
