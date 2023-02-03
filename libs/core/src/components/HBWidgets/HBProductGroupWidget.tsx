import { DisplayExtractType, HBCarousel, HBIcon, PageDisplayType } from '@hasty-bazar/core'
import { Box, Stack, styled, Theme, Typography, useMediaQuery } from '@mui/material'
import { stringify } from 'query-string'
import { FC, PropsWithChildren } from 'react'
import HBLink from '../HBLink'

export const HorizontalScrollerWithNoScroll = styled(Box)<{ spacing?: number }>(() => ({
  overflow: 'hidden',
  whiteSpace: 'nowrap',
}))

export type ProductGroupType = 'BUSINESS_SLIDER_CATEGORY' | 'BUSINESS_SLIDER_SIMPLE'

export interface HBProductGroupWidgetProps {
  type: ProductGroupType
  metaData?: string
  title?: string
  data: {
    id: string
    imageUrl?: string
    title?: string
    categoryPageOriginName: string
    categoryCollectionId: string
    categoryDisplayExtractType: number
  }[]
  prefixImageUrl: string
  noAction?: boolean
  pageDisplayType?: number
}

const renderSlidePerView = {
  BUSINESS_SLIDER_SIMPLE: {
    0: {
      slidesPerView: 3,
      grid: {
        rows: 3,
      },
      spaceBetween: undefined,
    },
    600: {
      spaceBetween: 24,
      slidesPerView: 4,
    },
    960: {
      slidesPerView: 6,
    },
  },
  BUSINESS_SLIDER_CATEGORY: {
    0: {
      slidesPerView: 2,
    },
    500: {
      slidesPerView: 3,
    },
    650: {
      slidesPerView: 3,
    },
    800: {
      slidesPerView: 5,
    },
    960: {
      slidesPerView: 8,
    },
  },
}

const selectorWidth = {
  BUSINESS_SLIDER_SIMPLE: 'unset',
  BUSINESS_SLIDER_CATEGORY: { xs: 'auto' },
}

const selectorSizeWrapper = {
  BUSINESS_SLIDER_SIMPLE: {
    width: { xs: 70, sm: 140 },
    height: { xs: 70, sm: 140 },
    bgcolor: 'grey.100',
    borderRadius: 50,
  },
  BUSINESS_SLIDER_CATEGORY: { width: 72, height: 72 },
}

const HBProductGroupWidget: FC<PropsWithChildren<HBProductGroupWidgetProps>> = ({
  metaData: metaDataProps,
  data,
  type,
  title,
  prefixImageUrl,
  noAction,
  pageDisplayType,
}) => {
  const metaData = metaDataProps ? JSON.parse(metaDataProps) : {}
  if (!data?.length) return null
  const breakpointsMdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  return (
    <Stack
      sx={(theme) => ({
        bgcolor: 'common.white',
        py: 6,
        pl: 6,
        borderRadius: { xs: 0, sm: 4 },
        pr: 6,
        overflow: 'hidden',
        width: { xs: `calc(100% + ${theme.spacing(8)})`, sm: 'unset' },
        ml: { xs: -4, sm: 'unset' },
      })}
    >
      {!!title && (
        <Stack direction="row" alignItems="center" spacing={10}>
          <Typography variant={'h6'} color={metaData?.fontColor}>
            {title}
          </Typography>
          {!!metaData?.hasButton && (
            <HBLink
              sx={{
                textDecoration: 'unset',
                '&:hover span,&:hover i': { color: 'black', opacity: 0.2 },
              }}
              href={noAction ? undefined : metaData?.button?.link}
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                bgcolor={metaData?.button?.backgroundColor || 'unset'}
              >
                <Typography variant="button" color={metaData?.button?.fontColor}>
                  {metaData?.button?.text}
                </Typography>
                <HBIcon type="angleLeft" sx={{ color: metaData?.button?.fontColor }} />
              </Stack>
            </HBLink>
          )}
        </Stack>
      )}

      <Box
        sx={(theme) => ({
          border: 'unset',
          pt: type === 'BUSINESS_SLIDER_SIMPLE' ? 6 : '',
          borderRadius: 2,
          mt: 2,
          display: 'flex',
          height: type === 'BUSINESS_SLIDER_SIMPLE' ? { xs: 300, sm: 425, md: 'unset' } : 'unset',
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
          [theme.breakpoints.down('md')]: {
            '& .swiper-wrapper': {
              '& div.swiper-slide': {
                '&:nth-of-type(even)': {
                  marginTop:
                    type === 'BUSINESS_SLIDER_SIMPLE' ? `${theme.spacing(4)} !important` : '',
                },
                margin: 'unset !important',
              },
            },
          },
        })}
      >
        <HBCarousel
          freeMode={true}
          // spaceBetween={breakpointsMdDown ?"":24}
          delay={metaData?.delayTime || undefined}
          navigation={!breakpointsMdDown}
          breakpoints={renderSlidePerView[type]}
        >
          {data?.map((item) => (
            <ProductGroupLink
              key={item.id}
              categoryDisplayExtractType={item.categoryDisplayExtractType}
              collectionId={metaData.queryId}
              id={item.id}
              originName={item.categoryPageOriginName}
              pageDisplayType={pageDisplayType}
              type={type}
              noAction={noAction}
            >
              <Box
                sx={{
                  borderRadius: type !== 'BUSINESS_SLIDER_SIMPLE' ? 2 : '100%',
                  overflow: 'hidden',
                  position: 'relative',
                  ...selectorSizeWrapper[type],
                }}
              >
                <Box
                  position="relative"
                  width={type === 'BUSINESS_SLIDER_SIMPLE' ? { xs: 70, sm: 140 } : 72}
                  height={type === 'BUSINESS_SLIDER_SIMPLE' ? { xs: 70, sm: 140 } : 72}
                  bgcolor={type === 'BUSINESS_SLIDER_CATEGORY' ? 'grey.100' : ''}
                  borderRadius={4}
                  sx={{
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    component="img"
                    src={item?.imageUrl ? `${prefixImageUrl}${item?.imageUrl}` : '/'}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      objectPosition: 'center',
                      borderRadius: type === 'BUSINESS_SLIDER_SIMPLE' ? '100%' : '',
                    }}
                  />
                </Box>
              </Box>

              {item?.title && (
                <Typography
                  component="div"
                  variant="subtitle1"
                  color="text.primary"
                  sx={{
                    overflow: 'hidden',
                    width: '100%',
                    textAlign: 'center',
                    display: '-webkit-box',
                    '-webkit-line-clamp': '2',
                    '-webkit-box-orient': 'vertical',
                    textOverflow: 'ellipsis',
                    height: type === 'BUSINESS_SLIDER_SIMPLE' ? 40 : 'unset',
                  }}
                >
                  {item?.title}
                </Typography>
              )}
            </ProductGroupLink>
          ))}
        </HBCarousel>
      </Box>
    </Stack>
  )
}

export default HBProductGroupWidget

interface ProductGroupLinkProps {
  pageDisplayType?: number
  noAction?: boolean
  collectionId: string
  id: string
  type: ProductGroupType
  categoryDisplayExtractType: number
  originName: string
}

const ProductGroupLink: FC<PropsWithChildren<ProductGroupLinkProps>> = (props) => {
  const {
    pageDisplayType,
    noAction,
    collectionId,
    id,
    type,
    children,
    categoryDisplayExtractType,
    originName,
  } = props
  let link = ''

  if (
    pageDisplayType === PageDisplayType.DataDefault &&
    categoryDisplayExtractType === DisplayExtractType.Default
  )
    link = `/collection/?collectionId=${collectionId}&${stringify({
      baseFilter: JSON.stringify({ categories: [id] }),
    })}`
  else if (
    pageDisplayType === PageDisplayType.DataDefault &&
    categoryDisplayExtractType === DisplayExtractType.Dynamic
  )
    link = `/collection/?collectionId=${collectionId}`
  else if (
    pageDisplayType === PageDisplayType.DataDefault &&
    categoryDisplayExtractType === DisplayExtractType.Fixed
  )
    link = `/category/${originName}`
  else
    link = `/collection/?${stringify({
      baseFilter: JSON.stringify({ categories: [id] }),
    })}`
  return (
    <Stack
      component={noAction ? 'div' : 'a'}
      target="_blank"
      href={link}
      spacing={4}
      alignItems={'center'}
      width={selectorWidth[type]}
      sx={{ cursor: 'pointer' }}
    >
      {children}
    </Stack>
  )
}
