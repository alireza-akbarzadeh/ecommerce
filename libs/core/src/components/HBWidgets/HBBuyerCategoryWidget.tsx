import { HBCarousel } from '@hasty-bazar/core'
import { Box, Stack, styled, Theme, Typography, useMediaQuery } from '@mui/material'
import { useRouter } from 'next/router'
import { stringify } from 'query-string'
import { FC, PropsWithChildren } from 'react'

const MAXIMUM_IN_ROW = 5

export const HorizontalScrollerWithNoScroll = styled(Box)<{ spacing?: number }>(() => ({
  overflow: 'hidden',
  whiteSpace: 'nowrap',
}))

type DataType = { imageUrl?: string; title?: string; id: string }

export interface HBBuyerCategoryWidgetProps {
  prefixImageUrl: string
  metaData?: string
  data: DataType[]
  title?: string
  noAction?: boolean
}

const HBBuyerCategoryWidget: FC<PropsWithChildren<HBBuyerCategoryWidgetProps>> = ({
  data,
  title,
  metaData: metaDataProps,
  prefixImageUrl,
  noAction,
}) => {
  const metaData = metaDataProps ? JSON.parse(metaDataProps) : {}
  if (!data?.length) return null
  const breakpointsMdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const breakpointsSmDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const router = useRouter()

  const handleRouting = (categoryId: string) => {
    if (!noAction)
      router.push(
        `/collection/?collectionId=${metaData.queryId}&${stringify({
          baseFilter: JSON.stringify({ categories: categoryId }),
        })}`,
      )
  }

  return (
    <Stack
      spacing={8}
      p={6}
      sx={{
        bgcolor: 'common.white',
        borderRadius: 4,
        overflow: 'hidden',
      }}
    >
      {!!title && (
        <Typography
          variant={'h4'}
          color={metaData?.fontColor}
          sx={{ width: '100%', textAlign: 'center' }}
        >
          {title}
        </Typography>
      )}

      <Box
        sx={(theme) => ({
          border: 'unset',
          borderRadius: 2,
          display: 'flex',
          height: { xs: 455, sm: data?.length > MAXIMUM_IN_ROW ? 455 : 'unset' },
          '& .swiper-button-prev, & .swiper-button-next': {
            opacity: 0,
            '&:hover': {
              opacity: `1 !important`,
            },
          },
          [theme.breakpoints.up('md')]: {
            '&:hover': {
              '& .swiper-button-prev': {
                opacity: 0.7,
              },
              '& .swiper-button-next': {
                opacity: 0.7,
              },
            },
          },
        })}
      >
        <HBCarousel
          freeMode={true}
          spaceBetween={32}
          slidesPerView={!breakpointsMdDown ? MAXIMUM_IN_ROW : 'auto'}
          delay={metaData?.delayTime || undefined}
          grid={{
            rows: breakpointsSmDown ? 2 : data?.length > MAXIMUM_IN_ROW ? 2 : 1,
          }}
          navigation={!breakpointsMdDown}
        >
          {data?.map((item) => (
            <Stack spacing={4} alignItems={'center'} width={194} pr={6} key={item.id}>
              <Box
                onClick={() => handleRouting((item as any).categoryId)}
                sx={{
                  borderRadius: '50%',
                  border: (theme) => `1px solid ${theme.palette.grey[200]}`,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 168,
                  height: 168,
                  cursor: 'pointer',
                }}
              >
                <Box
                  component="img"
                  src={item?.imageUrl ? `${prefixImageUrl}${item?.imageUrl}` : '/'}
                  sx={{ objectFit: 'contain', objectPosition: 'center', width: '80%' }}
                />
              </Box>
              {item?.title && (
                <Typography
                  onClick={() => handleRouting((item as any).categoryId)}
                  component="div"
                  variant="subtitle1"
                  color="text.primary"
                  sx={{
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    width: '100%',
                    textAlign: 'center',
                    cursor: 'pointer',
                  }}
                >
                  {item?.title}
                </Typography>
              )}
            </Stack>
          ))}
        </HBCarousel>
      </Box>
    </Stack>
  )
}

export default HBBuyerCategoryWidget
