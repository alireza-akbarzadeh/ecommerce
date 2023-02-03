import { GetAllRelatedProductsQueryResult } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { HBCardWidget, HBCarousel } from '@hasty-bazar/core'
import { Box, Stack, styled, Theme, Typography, useMediaQuery, useTheme } from '@mui/material'
import { FC, PropsWithChildren } from 'react'

export const HorizontalScrollerWithNoScroll = styled(Box)<{ spacing?: number }>(() => ({
  overflow: 'hidden',
  whiteSpace: 'nowrap',
}))

export type CardType = 'BUSINESS_SLIDER_MOST'

interface ICardWidgetListProps {
  products: GetAllRelatedProductsQueryResult[]
  title?: string
}

const CardWidgetList: FC<PropsWithChildren<ICardWidgetListProps>> = ({ products, title }) => {
  const theme = useTheme()
  const breakpointsMdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  if (!products.length) return null
  return (
    <Stack
      spacing={7}
      sx={{
        bgcolor: 'common.white',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          border: (theme) => `1px solid ${theme.palette.grey[100]}`,
          borderRadius: 2,
          flexDirection: 'column',
          display: 'flex',
          '& .swiper-button-prev, & .swiper-button-next': {
            opacity: 0,
            '&:hover': {
              opacity: `1 !important`,
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
        }}
      >
        <Stack
          sx={{
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
            width: 200,
            px: 4,
          }}
          justifyContent="center"
          alignItems="center"
          spacing={10}
        >
          <Stack spacing={4}>
            <Typography sx={{ textAlign: 'center' }} variant="h5">
              {title}
            </Typography>
          </Stack>
        </Stack>

        <HBCarousel
          freeMode={true}
          spaceBetween={24}
          slidesPerView={'auto'}
          style={{
            padding: theme.spacing(6),
            paddingLeft: 'unset',
            width: 'calc(100% - 200px)',
            overflow: 'hidden',
          }}
          navigation={!breakpointsMdDown}
        >
          {products?.map((item, index) => (
            <HBCardWidget
              data={{
                ...item,
                imageUrl: `${process?.env?.NEXT_PUBLIC_CDN}${item?.defaultImage}`,
                title: item?.name,
                price: item?.price,
                hasPromotion: true,
              }}
              noAction
              type={'BUSINESS_SLIDER_MOST'}
              key={index}
            />
          ))}
        </HBCarousel>
      </Box>
    </Stack>
  )
}

export default CardWidgetList
