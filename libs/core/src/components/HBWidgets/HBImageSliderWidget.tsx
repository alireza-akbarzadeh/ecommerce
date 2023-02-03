import { HBCarousel, ValuingCustomPagination } from '@hasty-bazar/core'
import { Box, Theme, useMediaQuery } from '@mui/material'
import { FC, useMemo } from 'react'
import HBImageWidget from './HBImageWidget'

export interface HBImageSliderWidgetProps {
  data: {
    metaData?: string
    imageUrl?: string
    title?: string
    description?: string
    order: number
  }[]
  prefixImageUrl: string
  metaData?: string | null
}
const HBImageSliderWidget: FC<HBImageSliderWidgetProps> = (props) => {
  const { data, prefixImageUrl, metaData: metaDataProps } = props
  const breakpointsMd = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))

  const sortData = useMemo(() => [...data]?.sort((x, y) => x.order! - y.order!), [])
  const slideDelay = metaDataProps ? JSON.parse(metaDataProps)?.delayTime : {}
  return (
    <Box
      sx={(theme) => ({
        '& .swiper-button-prev, & .swiper-button-next': {
          opacity: 0,
          '&:hover': {
            opacity: `1 !important`,
          },
          '&:after': {
            pt: 1,
          },
        },
        '& .swiper-button-prev': {
          '&:after': {
            pr: 0.25,
          },
        },
        '& .swiper-button-next': {
          '&:after': {
            pl: 0.25,
          },
        },
        '&:hover': {
          '& .swiper-button-prev': {
            opacity: 0.7,
          },
          '& .swiper-button-next': {
            opacity: 0.7,
          },
        },
        [theme.breakpoints.only('xs')]: {
          '& .swiper-pagination-bullets': {
            bottom: '0 !important',
          },
        },
      })}
    >
      <HBCarousel
        pagination={{
          renderBullet(index, className) {
            return ValuingCustomPagination(index, className)
          },
          clickable: true,
        }}
        navigation={breakpointsMd ? true : false}
        delay={slideDelay}
        loop
      >
        {sortData?.map((banner, index) => (
          <HBImageWidget
            key={'banner' + index}
            type={'ADS_SLIDER_DEFAULT'}
            {...banner}
            imageUrl={banner.imageUrl ? prefixImageUrl + banner.imageUrl : undefined}
          />
        ))}
      </HBCarousel>
    </Box>
  )
}
export default HBImageSliderWidget
