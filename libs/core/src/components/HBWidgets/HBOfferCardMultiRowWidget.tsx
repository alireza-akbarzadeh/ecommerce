import { HBCarousel, HBIcon } from '@hasty-bazar/core'
import { Box, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import { FC, useEffect, useState } from 'react'
import HBLink from '../HBLink'

type DataType = {
  title?: string
  currencyName?: string
  link?: string
  description?: string
  imageUrl?: string
  price?: number
  oldPrice?: number
  order?: number
  parentId?: string
  vendorId?: string
  categoryId?: string
  brandId?: string
  id?: string
  hsin?: string
  slug?: string
}

export interface HBOfferCardMultiRowWidgetProps {
  prefixImageUrl: string
  metaData?: string
  title?: string
  data?: DataType[]
  noAction?: boolean
}
const HBOfferCardMultiRowWidget: FC<HBOfferCardMultiRowWidgetProps> = (props) => {
  const [carouselData, setCarouselData] = useState<DataType[][]>([])
  const theme = useTheme()
  const smallWidth = useMediaQuery(theme.breakpoints.down('md'))
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const metaData = props?.metaData ? JSON.parse(props.metaData) : {}
  let data: DataType[] = []
  if (props.data) {
    data = JSON.parse(JSON.stringify(props.data))?.sort(
      (a: DataType, b: DataType) => a.order! - b.order!,
    )
  }

  useEffect(() => {
    const tempData: DataType[][] = []
    for (let index = 0; index < data.length; index++) {
      if (index % 2 === 0) {
        const item1 = data[index]
        const item2 = data[index + 1]
        tempData.push([item1, item2])
      }
    }
    setCarouselData(tempData)
  }, [smallWidth])

  const routing = (item: DataType) => {
    let route = `/product/${item?.hsin}/${item.slug}`

    return route
  }

  return (
    <Box
      sx={{
        bgcolor: metaData?.backgroundColor,
        p: 6,
        borderRadius: 4,
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
      <Stack spacing={4} direction="row">
        <Typography variant="h6" mb={6} color={metaData?.fontColor}>
          {props?.title}
        </Typography>
        {metaData?.hasButton && (
          <HBLink
            sx={{
              textDecoration: 'unset',
            }}
            href={
              props.noAction
                ? undefined
                : metaData?.button?.link || `/collection?collectionId=${metaData?.queryId}`
            }
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              pl={4}
              pr={2.5}
              py={0.88}
              borderRadius={2}
              bgcolor={metaData?.button?.backgroundColor || 'unset'}
            >
              <Typography variant="button" color={metaData?.button?.fontColor}>
                {metaData?.button?.text || 'نمایش بیشتر'}
              </Typography>
              <HBIcon type="angleLeft" sx={{ color: metaData?.button?.fontColor }} />
            </Stack>
          </HBLink>
        )}
      </Stack>
      {!smallWidth ? (
        <Box
          display="flex"
          flexWrap="wrap"
          justifyContent="space-between"
          sx={(theme) => ({
            '& > a:nth-of-type(-n+3)': {
              marginBottom: (theme) => theme.spacing(4),
            },
            [theme.breakpoints.down('sm')]: {
              '& > a': {
                marginBottom: (theme) => theme.spacing(4),
                width: '100%',
              },
            },
          })}
        >
          {data?.slice(0, 6)?.map((item, idx) => (
            <HBLink href={props.noAction ? undefined : routing(item)} passHref key={item.id! + idx}>
              <Box
                bgcolor="common.white"
                display="flex"
                justifyContent="space-between"
                pr={4}
                width={333.33}
                height={194}
                sx={{
                  borderRadius: 4,
                }}
              >
                <Box width={167}>
                  <Stack spacing={2} mt={8} ml={4}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        display: '-webkit-box',
                        height: 60,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        color: 'text.priamry',
                      }}
                    >
                      {item?.title}
                    </Typography>
                    <Typography variant="subtitle1">{item?.description}</Typography>
                    <Typography
                      variant="h6"
                      color="text.primary"
                      sx={{
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        width: 143,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item?.price?.toLocaleString()}{' '}
                      <Typography color="text.primary" variant="subtitle2" component="span">
                        {item.currencyName}
                      </Typography>
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{ textDecoration: 'line-through' }}
                      pb={4}
                    >
                      {item?.oldPrice?.toLocaleString()}
                    </Typography>
                  </Stack>
                </Box>

                <Box
                  component="img"
                  sx={{ objectFit: 'inherit' }}
                  src={props.prefixImageUrl + item?.imageUrl!}
                  width={150}
                  height={150}
                  m="auto"
                />
              </Box>
            </HBLink>
          ))}
        </Box>
      ) : (
        <HBCarousel
          spaceBetween={24}
          slidesPerView={!isMobile ? 2 : 1}
          delay={metaData?.delayTime || undefined}
          style={{ width: '100%' }}
          navigation
        >
          {carouselData?.map((item, index: number) => {
            return (
              <Stack direction="column" gap={6} key={(item?.[index]?.id || '') + index}>
                {item.map((i) => (
                  <HBLink href={routing(i)} passHref key={i?.id! + i?.title! + 'card'}>
                    <Box
                      bgcolor="common.white"
                      display="flex"
                      justifyContent="space-between"
                      pr={4}
                      height={194}
                      sx={{
                        borderRadius: 4,
                      }}
                    >
                      <Box width={167}>
                        <Stack spacing={2} mt={8} ml={4}>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              display: '-webkit-box',
                              height: 60,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              color: 'text.priamry',
                            }}
                          >
                            {i?.title}
                          </Typography>
                          <Typography
                            variant="h6"
                            color="text.primary"
                            sx={{
                              textOverflow: 'ellipsis',
                              overflow: 'hidden',
                              width: 143,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {i?.price?.toLocaleString()}{' '}
                            <Typography color="text.primary" variant="subtitle2" component="span">
                              {i?.currencyName}
                            </Typography>
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            sx={{ textDecoration: 'line-through' }}
                            pb={4}
                          >
                            {i?.oldPrice?.toLocaleString()}
                          </Typography>
                        </Stack>
                      </Box>
                      <Box width={150} maxHeight={150} m="auto">
                        <Box
                          component="img"
                          sx={{ objectFit: 'contain', objectPosition: 'center' }}
                          src={props.prefixImageUrl + i?.imageUrl!}
                          width={150}
                          height={150}
                          m="auto"
                        />
                      </Box>
                    </Box>
                  </HBLink>
                ))}
              </Stack>
            )
          })}
        </HBCarousel>
      )}
    </Box>
  )
}
export default HBOfferCardMultiRowWidget
