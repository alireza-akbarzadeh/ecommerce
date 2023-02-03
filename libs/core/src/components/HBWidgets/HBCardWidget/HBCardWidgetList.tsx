import { HBButton, HBCarousel, HBIcon } from '@hasty-bazar/core'
import { Box, Stack, styled, Theme, Typography, useMediaQuery, useTheme } from '@mui/material'
import { FC, PropsWithChildren } from 'react'
import HBLink from '../../HBLink'
import CardWidgetDefault from './HBCardWidget'
import { CardType, CollectionData, HBCardWidgetProps } from './HBCardWidgetType'

export const HorizontalScrollerWithNoScroll = styled(Box)<{ spacing?: number }>(() => ({
  overflow: 'hidden',
  whiteSpace: 'nowrap',
}))

export interface ICardWidgetListProps {
  type: CardType
  content: {
    metaData?: string
    data?: CollectionData[]
    title?: string
    description?: string
  }
  noDivider?: boolean
  addToBasketTitle?: HBCardWidgetProps['addToBasketTitle']
  unavailableTitle?: HBCardWidgetProps['unavailableTitle']
  cardWidgetCustom?: FC<HBCardWidgetProps>
  prefixImageUrl: string
  noAction?: boolean
  slidesPerView?: number
}

const HBCardWidgetList: FC<PropsWithChildren<ICardWidgetListProps>> = ({
  content,
  type,
  noDivider,
  addToBasketTitle,
  unavailableTitle,
  cardWidgetCustom: CardWidgetCustom,
  prefixImageUrl,
  noAction,
  slidesPerView,
}) => {
  const theme = useTheme()
  const metaData = content?.metaData ? JSON.parse(content?.metaData) : {}
  if (!content?.data?.length) return null
  const breakpointsMdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  const CardWidget = CardWidgetCustom ?? CardWidgetDefault

  const sidebar = (
    <Stack
      sx={{
        bgcolor: metaData?.backgroundColor,
        borderTopLeftRadius: { md: 16 },
        borderBottomLeftRadius: { md: 16 },
        width: { xs: 150, md: 200 },
        px: { xs: 2, md: 4 },
        height: { xs: '100%', md: 'unset' },
      }}
      justifyContent="center"
      alignItems="center"
      spacing={10}
    >
      <Stack spacing={4}>
        <Typography
          sx={{ textAlign: 'center', color: metaData?.fontColor }}
          variant="h5"
          textAlign="center"
        >
          {content?.title}
        </Typography>
        <Typography
          component="div"
          dangerouslySetInnerHTML={{ __html: content?.description + '' }}
          textAlign="center"
        />
      </Stack>
      {metaData?.hasButton && (
        <HBLink
          href={
            noAction
              ? undefined
              : metaData?.button.link || `/collection?collectionId=${metaData?.queryId}`
          }
          passHref
        >
          <HBButton
            sx={{
              borderRadius: 6,
              bgcolor: metaData?.button?.backgroundColor,
              color: `${metaData?.button?.fontColor} !important`,
            }}
          >
            {metaData?.button.text}
            <HBIcon type="arrowLeft" />
          </HBButton>
        </HBLink>
      )}
    </Stack>
  )

  return (
    <Stack
      spacing={7}
      sx={{
        bgcolor:
          type === 'BUSINESS_SLIDER_DEFAULT' && !!metaData?.backgroundColor
            ? metaData.backgroundColor
            : 'common.white',
        py: type !== 'BUSINESS_SLIDER_WITH_SIDEBAR' ? 6 : 'unset',
        pl: type !== 'BUSINESS_SLIDER_WITH_SIDEBAR' ? 6 : 'unset',
        borderRadius:
          type === 'BUSINESS_SLIDER_DEFAULT' || type === 'BUSINESS_SLIDER_WITH_SIDEBAR'
            ? { xs: 'unset', md: 4 }
            : 4,
        pr: 0,
        overflow: 'hidden',
        width: (theme) => ({
          xs: `calc(100% + ${theme.spacing(8)})`,
          sm: `calc(100% + ${theme.spacing(12)})`,
          md: 'unset',
        }),
        marginLeft: { xs: -4, sm: -6, md: 'unset' },
      }}
    >
      {!!content?.title && type !== 'BUSINESS_SLIDER_WITH_SIDEBAR' && (
        <Stack direction="row" alignItems="center" spacing={10}>
          <Typography variant={'h6'} color={metaData?.fontColor} component="h3">
            {content?.title}
          </Typography>
          {!!metaData?.hasButton && (
            <HBLink
              sx={{
                textDecoration: 'unset',
              }}
              href={
                noAction
                  ? undefined
                  : metaData?.button?.link || `/collection?collectionId=${metaData?.queryId}`
              }
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                bgcolor={metaData?.button?.backgroundColor || 'unset'}
                pl={4}
                pr={2.5}
                py={0.88}
                borderRadius={2}
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
        sx={{
          border: (theme) =>
            type === 'BUSINESS_SLIDER_WITH_SIDEBAR'
              ? `1px solid ${theme.palette.grey[100]}`
              : 'unset',
          borderRadius: type === 'BUSINESS_SLIDER_WITH_SIDEBAR' && breakpointsMdDown ? 0 : 2,
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
          '& div.swiper-wrapper': {
            '&:first-of-type': {
              pl: { md: type === 'BUSINESS_SLIDER_WITH_SIDEBAR' ? 6 : 0 },
            },
          },
        }}
      >
        {type === 'BUSINESS_SLIDER_WITH_SIDEBAR' && !breakpointsMdDown && sidebar}

        <HBCarousel
          freeMode={true}
          spaceBetween={24}
          slidesPerView={slidesPerView || 'auto'}
          delay={metaData?.delayTime || undefined}
          style={
            type === 'BUSINESS_SLIDER_WITH_SIDEBAR'
              ? {
                  padding: theme.spacing(breakpointsMdDown ? 0 : 6),
                  paddingLeft: 'unset',
                  paddingRight: '0',
                  width: breakpointsMdDown ? 'unset' : 'calc(100% - 200px)',
                  overflow: 'hidden',
                }
              : {}
          }
          navigation={!breakpointsMdDown}
          loop={false}
        >
          {type === 'BUSINESS_SLIDER_WITH_SIDEBAR' && breakpointsMdDown && sidebar}

          {content?.data?.map((item, index) => (
            <Box
              height="100%"
              py={type === 'BUSINESS_SLIDER_WITH_SIDEBAR' && breakpointsMdDown ? 6 : 'unset'}
              key={item.id}
            >
              <CardWidget
                data={{ ...item, imageUrl: prefixImageUrl + item.imageUrl }}
                type={type}
                key={item.id! + index}
                noDivider={noDivider}
                addToBasketTitle={addToBasketTitle}
                unavailableTitle={unavailableTitle}
                noAction={noAction}
              />
            </Box>
          ))}
        </HBCarousel>
      </Box>
    </Stack>
  )
}

export default HBCardWidgetList
