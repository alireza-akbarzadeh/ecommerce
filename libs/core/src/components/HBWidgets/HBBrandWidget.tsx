import { BrandPageDisplayType, HBCarousel } from '@hasty-bazar/core'
import {
  Box,
  Stack,
  styled,
  Theme,
  Typography,
  useMediaQuery,
  useTheme,
  Divider,
} from '@mui/material'
import { FC, PropsWithChildren, useMemo } from 'react'
import HBLink from '../HBLink'
import { stringify } from 'query-string'

enum PageDisplayType {
  ProductListPage = 1106001,
  DataDefault = 1106002,
}

export const HorizontalScrollerWithNoScroll = styled(Box)<{ spacing?: number }>(() => ({
  overflow: 'hidden',
  whiteSpace: 'nowrap',
}))

type DataType = {
  imageUrl?: string
  metaData?: string
  id: string
  brandPageDisplayType: number
  brandPageOriginName: string
}

export interface HBBrandWidgetProps {
  prefixImageUrl: string
  metaData?: string
  data: DataType[]
  title?: string
  noAction?: boolean
  pageDisplayType?: number
}

const HBBrandWidget: FC<PropsWithChildren<HBBrandWidgetProps>> = ({
  data,
  prefixImageUrl,
  metaData: metaDataProps,
  title,
  noAction,
  pageDisplayType,
}) => {
  const theme = useTheme()
  const breakpointsMdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  if (!data?.length) return null
  const metaData = metaDataProps ? JSON.parse(metaDataProps) : {}

  const renderBrands = useMemo(() => {
    return data?.map((item, idx) => (
      <>
        <Box key={item.id} height="100%">
          <BrandLink
            brandPageDisplayType={item.brandPageDisplayType}
            id={item.id}
            pageOriginName={item.brandPageOriginName}
            pageDisplayType={pageDisplayType!}
            noAction={noAction}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              px={{ md: 6 }}
              height={{ md: '100%' }}
            >
              <Box
                component="img"
                src={item?.imageUrl ? `${prefixImageUrl}${item?.imageUrl}` : '/'}
                maxWidth={{ md: 140, sm: 94, xs: 60 }}
                maxHeight={{ md: 140, sm: 94, xs: 60 }}
                sx={{
                  objectFit: 'contain',
                  objectPosition: 'center',
                }}
              />
            </Box>
          </BrandLink>
        </Box>
        {breakpointsMdDown && (idx + 1) % 4 === 0 && idx < data.length - 1 && (
          <Box width="100%" key={item.id + 'divider'} component="p" py={4}>
            <Divider sx={{ color: 'grey.200' }} />
          </Box>
        )}
      </>
    ))
  }, [])

  return (
    <Stack
      spacing={6}
      sx={{
        bgcolor: 'common.white',
        borderRadius: { xs: 'unset', sm: 4 },
        overflow: 'hidden',
        width: { xs: `calc(100% + ${theme.spacing(8)})`, sm: 'unset' },
        ml: { xs: -4, sm: 'unset' },
      }}
      p={6}
    >
      <Typography variant={'h6'} color={metaData?.fontColor}>
        {title}
      </Typography>
      <Box
        sx={{
          border: `1px solid ${theme.palette.grey[100]}`,
          py: 4,
          px: 4,
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          '& div.swiper-slide:not(last-child)': {
            borderRight: `1px solid ${theme.palette.grey[200]}`,
          },
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
            flexWrap: 'wrap',
            '& > a,& > div': {
              flex: '1 0 25%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            },
          },
        }}
      >
        {!breakpointsMdDown ? (
          <HBCarousel freeMode={true} slidesPerView={6}>
            {renderBrands}
          </HBCarousel>
        ) : (
          renderBrands
        )}
      </Box>
    </Stack>
  )
}

export default HBBrandWidget

interface BrandLinkProps {
  pageDisplayType: number
  id: string
  brandPageDisplayType: number
  pageOriginName: string
  noAction?: boolean
}

const BrandLink: FC<PropsWithChildren<BrandLinkProps>> = (props) => {
  const { brandPageDisplayType, pageOriginName, id, pageDisplayType, children, noAction } = props

  if (noAction) return <>{children}</>

  if (
    pageDisplayType === PageDisplayType.ProductListPage ||
    brandPageDisplayType === BrandPageDisplayType.BrandProducts
  )
    return (
      <HBLink
        href={`/collection/?${stringify({
          baseFilter: JSON.stringify({ brands: [id] }),
        })}`}
        target="_blank"
      >
        {children}
      </HBLink>
    )

  if (brandPageDisplayType === BrandPageDisplayType.OtherPage) {
    if (!pageOriginName) return <>{children}</>
    return (
      <HBLink href={`/brand-landing/${pageOriginName}/`} target="_blank">
        {children}
      </HBLink>
    )
  }

  return (
    <HBLink href={`/brand/${id}`} target="_blank">
      {children}
    </HBLink>
  )
}
