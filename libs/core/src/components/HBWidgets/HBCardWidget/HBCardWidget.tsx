import { HBButton, HBCountDownTimer, HBIcon, HBIconButton } from '@hasty-bazar/core'
import {
  Box,
  Stack,
  styled,
  Theme,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { FC, useMemo, useState } from 'react'
import HBLink from '../../HBLink'
import { HBCardWidgetProps } from './HBCardWidgetType'
import { useRouter } from 'next/router'

const TooltipStyle = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.info.main,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.info.main,
    marginBottom: `${theme.spacing(2)} !important`,
    padding: theme.spacing(3, 4),
    borderRadius: theme.spacing(2),
  },
}))

const countDownTimerStyle = {
  '& > h5': (theme: Theme) => ({
    padding: theme.spacing(0),
    color: theme.palette.error.main,
    margin: 0,
    ...theme.typography.subtitle2,
    fontWeight: 700,
  }),
  '& > p': (theme: Theme) => ({
    color: theme.palette.error.main,
    margin: theme.spacing(0, 0.5),
    ...theme.typography.subtitle2,
    fontSize: 18,
    fontWeight: 700,
  }),
}

const PriceBoxStyle = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
}))

const CardWidget: FC<HBCardWidgetProps> = (props) => {
  const {
    data: {
      price,
      imageUrl,
      campaigns,
      currencyName,
      discountPercentage,
      oldPrice,
      storeName,
      parentId,
      title,
      rate,
      vendorId,
      categoryId,
      brandId,
      quantity,
      quantityHTML,
      id,
      hasPromotion,
      maximalPerOrder,
      hsin,
      slug,
    },
    type,
    noDivider,
    addToBasketTitle,
    specialOfferTitle,
    numberLeftInStockTitle,
    addToBasket,
    addingLoading,
    count,
    decreasingLoading,
    handleMinus,
    noAction,
  } = props
  const [showCampaign, setShowCampaign] = useState(hasPromotion)
  const router = useRouter()
  const { palette, breakpoints, spacing } = useTheme()
  const breakpointDownSm = useMediaQuery(breakpoints.down('sm'))

  const isSearchResponsive = useMemo(
    () => type === 'SEARCH_AND_COLLECTION_RESULT' && breakpointDownSm,
    [type, breakpointDownSm],
  )

  const calcSizeWrapper = () => {
    switch (type) {
      case 'SEARCH_AND_COLLECTION_RESULT':
        return { width: { xs: 104, sm: 200 }, height: { xs: 104, sm: 200 } }
      default:
        return { width: 188, height: 188 }
    }
  }

  const routing = useMemo(() => {
    let route = `/product/${hsin}/${slug}`
    return route
  }, [])

  const calcWidth = () => {
    if (type === 'SEARCH_AND_COLLECTION_RESULT') return '100%'
    else return 240
  }

  return (
    <HBLink href={noAction ? undefined : routing} target="_blank">
      <Stack
        spacing={2}
        width={calcWidth()}
        borderRight={(theme) =>
          !noDivider
            ? isSearchResponsive
              ? 'unset'
              : `1px solid ${theme.palette.grey[200]}`
            : 'unset'
        }
        pr={6}
        height="100%"
        sx={{ userSelect: 'none' }}
      >
        <Box
          sx={{
            cursor: 'pointer',
          }}
          display="flex"
          width="100%"
          flexDirection={isSearchResponsive ? 'row' : 'column'}
          alignItems={type === 'SEARCH_AND_COLLECTION_RESULT' ? 'center' : 'flex-start'}
        >
          {!isSearchResponsive && (
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
              zIndex={1}
              mb={1}
              height={24}
            >
              {/* campagin */}
              <Box>
                {showCampaign && hasPromotion && (
                  <Box display="flex" justifyContent="space-between">
                    <Stack spacing={1} direction="row" alignItems={'center'}>
                      <Typography sx={{ fontWeight: '700' }} variant="subtitle2" color="error.main">
                        {specialOfferTitle}
                      </Typography>
                      <HBCountDownTimer
                        targetDate={new Date(campaigns?.[0]?.toDate || '0').getTime()}
                        linkText=""
                        maximumShowed="hours"
                        onFinished={() => setShowCampaign(false)}
                        sx={countDownTimerStyle}
                      />
                    </Stack>
                  </Box>
                )}
              </Box>
              {/* add to basket */}
              <Box>
                {Boolean(quantity) &&
                  !noAction &&
                  (type === 'BUSINESS_SLIDER_DEFAULT' ||
                    type === 'BUSINESS_SLIDER_WITH_SIDEBAR' ||
                    type === 'SEARCH_AND_COLLECTION_RESULT') &&
                  (!count ? (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        borderRadius: 2,
                        overflow: 'hidden',
                      }}
                    >
                      <TooltipStyle
                        title={
                          <Typography variant="caption" color="common.white">
                            {addToBasketTitle}
                          </Typography>
                        }
                        placement="top"
                      >
                        <HBIconButton
                          sx={{
                            borderColor: 'info.main',
                            zIndex: 8,
                            minWidth: 24,
                            width: 24,
                            height: 24,
                            '&:hover': {
                              bgcolor: 'info.main',
                              '& i': {
                                color: (theme) => `${theme.palette.common.white} !important`,
                              },
                            },
                          }}
                          variant="outlined"
                          icon="plus"
                          onClick={(event) => {
                            event.preventDefault()
                            event.stopPropagation()
                            addToBasket && addToBasket()
                          }}
                          iconStyle={{ color: palette.info.main }}
                          iconSize={'small'}
                        />
                      </TooltipStyle>
                    </Box>
                  ) : (
                    <Stack
                      direction="row"
                      spacing={1}
                      bgcolor="common.white"
                      alignItems="center"
                      sx={{
                        borderRadius: 2,
                        p: 0,
                        bgcolor: 'info.main',
                        width: 76,
                        justifyContent: 'space-between',
                      }}
                      onClick={(e) => e.preventDefault()}
                    >
                      <HBButton
                        variant="text"
                        size="small"
                        disabled={addingLoading || maximalPerOrder === count}
                        sx={{
                          minWidth: 30,
                          background: 'unset !important',
                          p: 0,
                          height: '24px !important',
                        }}
                        onClick={(event) => {
                          event.preventDefault()
                          event.stopPropagation()
                          addToBasket && addToBasket()
                        }}
                      >
                        <HBIcon
                          type="plus"
                          style={{
                            color:
                              maximalPerOrder === count
                                ? palette.text.disabled
                                : palette.common.white,
                            marginTop: spacing(1),
                            fontSize: 14,
                          }}
                        />
                      </HBButton>
                      <Typography variant="caption" color="common.white">
                        {count}
                      </Typography>
                      <HBButton
                        disabled={decreasingLoading}
                        variant="text"
                        sx={{
                          minWidth: 30,
                          background: 'unset !important',
                          p: 0,
                          height: '24px !important',
                        }}
                        onClick={(event) => {
                          event.preventDefault()
                          event.stopPropagation()
                          handleMinus && handleMinus()
                        }}
                      >
                        <HBIcon
                          type={'minus'}
                          style={{
                            color: palette.common.white,
                            marginTop: spacing(1),
                            fontSize: 14,
                          }}
                        />
                      </HBButton>
                    </Stack>
                  ))}
              </Box>
            </Box>
          )}
          <Box
            sx={{
              borderRadius: 2,
              overflow: 'hidden',
              position: 'relative',
              ...calcSizeWrapper(),
              m: '0 auto',
            }}
          >
            <Box
              borderRadius={4}
              sx={{
                objectFit: 'contain',
                objectPosition: 'center',
                ...calcSizeWrapper(),
              }}
              component="img"
              src={imageUrl || '/'}
              alt={title || ''}
            />
          </Box>
          <Stack
            width={{
              xs: type === 'SEARCH_AND_COLLECTION_RESULT' ? 'calc(100% - 104px)' : '100%',
              md: '100%',
            }}
            mt={isSearchResponsive ? 0 : 4}
            ml={isSearchResponsive ? 4 : 0}
            maxWidth={type === 'SEARCH_AND_COLLECTION_RESULT' ? { xs: 'unset', sm: 200 } : 'unset'}
          >
            {/* campagin in search result */}
            {showCampaign && hasPromotion && isSearchResponsive && (
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Stack spacing={1} direction="row" alignItems={'center'}>
                  <Typography sx={{ fontWeight: '700' }} variant="subtitle2" color="error.main">
                    {specialOfferTitle}
                  </Typography>
                  <HBCountDownTimer
                    targetDate={1672963200000}
                    linkText=""
                    maximumShowed="hours"
                    onFinished={() => setShowCampaign(false)}
                    sx={countDownTimerStyle}
                  />
                </Stack>
              </Box>
            )}
            {/* start --- title */}
            {title && (
              <Typography
                component="span"
                variant={isSearchResponsive ? 'body2' : 'subtitle2'}
                color="text.primary"
                sx={{
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  width: type === 'SEARCH_AND_COLLECTION_RESULT' ? { xs: '100%', sm: 200 } : '100%',
                  textAlign: 'left',
                  whiteSpace: 'pre-wrap',
                  maxHeight: 36,
                  height: 36,
                  mb: 2,
                  // '-webkit-line-clamp': '2',
                  WebkitLineClamp: '2',
                  // '-webkit-box-orient': 'vertical',
                  WebkitBoxOrient: 'vertical',
                  display: '-webkit-box',
                }}
              >
                {title}
              </Typography>
            )}

            <Box display="flex" justifyContent="space-between" alignItems="center">
              {/* rate */}
              <Box height={26}>
                {!!rate && (
                  <Box display="flex" alignItems="center" mb={2}>
                    <Typography variant="overline" sx={{ color: 'primary.dark' }} mr={1} mt={0.75}>
                      {rate?.toString()}
                    </Typography>
                    <Box component="img" src="/assets/svg/favorite.svg" width={14} />
                  </Box>
                )}
              </Box>

              {/*  quantity */}
              <Box>
                {!!quantity && (
                  <Typography
                    variant="caption"
                    color="error.main"
                    display="flex"
                    alignItems={'center'}
                    mb={2}
                    component="div"
                    sx={{
                      '& .product-quantity': {
                        mx: 0.5,
                      },
                    }}
                    dangerouslySetInnerHTML={{ __html: quantityHTML! }}
                  />
                )}
              </Box>
            </Box>
            {/* vendor */}
            {!!storeName && (
              <Box
                display="flex"
                alignItems="flex-start"
                mb={2}
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  router.push({
                    pathname: '/vendor',
                    query: {
                      baseFilter: JSON.stringify({ vendors: [vendorId] }),
                    },
                  })
                }}
                sx={{
                  '&:hover h6,&:hover i': {
                    color: 'info.main',
                  },
                }}
              >
                <HBIcon type="shop" sx={{ color: 'grey.500', fontSize: 14 }} size="small" />
                <Typography variant="subtitle2" color="grey.500" ml={1}>
                  {storeName}
                </Typography>
              </Box>
            )}

            {/* price */}
            {Boolean(quantity) && (oldPrice || price) && (
              <PriceBoxStyle
                width={type === 'SEARCH_AND_COLLECTION_RESULT' ? { xs: '100%', sm: 200 } : '100%'}
                justifyContent={discountPercentage ? 'space-between' : 'flex-end'}
              >
                {(!!discountPercentage || hasPromotion) && (
                  <Typography
                    px={1}
                    py={0.5}
                    bgcolor={'error.main'}
                    color="common.white"
                    borderRadius={1.5}
                    variant={isSearchResponsive ? 'overline' : 'subtitle2'}
                  >
                    {hasPromotion
                      ? (Math.round(campaigns![0].discount! * 10) / 10).toLocaleString()
                      : discountPercentage?.toLocaleString()}
                    %-
                  </Typography>
                )}
                <Stack alignItems={'center'} direction={'row'} spacing={1}>
                  <Box
                    display="flex"
                    justifyContent="flex-end"
                    width={
                      type === 'SEARCH_AND_COLLECTION_RESULT' ? { xs: '100%', sm: 'unset' } : '100%'
                    }
                    height={18}
                    mr={isSearchResponsive ? 2 : 'unset'}
                  >
                    {Boolean(quantity) && ((!!discountPercentage && oldPrice) || showCampaign) && (
                      <Typography
                        variant={isSearchResponsive ? 'caption' : 'subtitle2'}
                        color="text.disabled"
                        sx={{ textDecoration: 'line-through' }}
                      >
                        {Number(oldPrice).toLocaleString()}
                      </Typography>
                    )}
                  </Box>
                  <Typography
                    variant={isSearchResponsive ? 'subtitle2' : 'subtitle1'}
                    color="text.primary"
                    height={isSearchResponsive ? 20 : 26}
                    display="flex"
                    alignItems="center"
                  >
                    {Number(showCampaign ? campaigns?.[0]?.price : price)?.toLocaleString()}
                    <Typography
                      component="span"
                      variant={isSearchResponsive ? 'caption' : 'subtitle2'}
                      color="text.primary"
                      ml={1}
                    >
                      {currencyName}
                    </Typography>
                  </Typography>
                </Stack>
              </PriceBoxStyle>
            )}

            {/* unavailable */}
            {!quantity && (
              <Box display="flex" justifyContent={'flex-end'} width={'100%'} mt={1}>
                <Typography color="text.secondary" variant="subtitle1" fontWeight="700">
                  {quantityHTML}
                </Typography>
              </Box>
            )}
          </Stack>
        </Box>
      </Stack>
    </HBLink>
  )
}

export default CardWidget
