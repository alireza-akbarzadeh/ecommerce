import {
  EntityType,
  GetContentsByEntityTypeQueryResult,
} from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import { HBCarousel } from '@hasty-bazar/core'
import { Grid, Stack, styled } from '@mui/material'
import Image from 'next/image'
import { useState } from 'react'
import Swiper from 'swiper'

export const ImageWrapperStyle = styled(Stack)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  cursor: 'pointer',
  img: {
    objectFit: 'cover',
  },
}))
interface props {
  id: string
  entityTypeId: EntityType
  data: GetContentsByEntityTypeQueryResult[]
}
const CommentContentCarousel = ({ data }: props) => {
  const [activeSliderIndex, setActiveSliderIndex] = useState<number>(0)
  const [swiper, setSwiper] = useState<Swiper | null>(null)
  const gotoSlider = (index: number) => {
    if (swiper) {
      swiper.slideTo(index)
    }
  }

  return (
    <Stack sx={{ p: 6 }} spacing={4} alignItems="center">
      <HBCarousel
        onActiveIndexChange={(slider) => setActiveSliderIndex(slider.realIndex)}
        onSwiper={setSwiper}
        style={{ height: 368, width: 368 }}
      >
        {data?.map((media) => (
          <ImageWrapperStyle sx={{ position: 'relative', width: '100%', height: '100%' }}>
            <Image
              src={`${process.env.NEXT_PUBLIC_CDN}${media.value}`}
              layout="fill"
              loading="lazy"
              objectFit="cover"
            />
          </ImageWrapperStyle>
        ))}
      </HBCarousel>
      <Grid container columnSpacing={2} rowSpacing={2} justifyContent="center">
        {data?.map((media, index) => (
          <Grid item>
            <ImageWrapperStyle
              onClick={() => gotoSlider(index + 1)}
              sx={{
                ...(index === activeSliderIndex && {
                  border: (theme) => `1px solid ${theme.palette.primary.main}`,
                  borderInlineStyle: 'solid',
                }),
              }}
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_CDN}${media.value}`}
                width={48}
                height={48}
                loading="lazy"
              />
            </ImageWrapperStyle>
          </Grid>
        ))}
      </Grid>
    </Stack>
  )
}

export default CommentContentCarousel
