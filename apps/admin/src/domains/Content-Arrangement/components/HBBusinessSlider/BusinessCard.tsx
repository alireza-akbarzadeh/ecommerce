import { HBLink } from '@hasty-bazar/admin-shared/components'
import { HBCountDownTimer, HBIcon, HBIconButton } from '@hasty-bazar/core'
import { Box, Stack, styled, Typography, useTheme } from '@mui/material'
import Slide from '@mui/material/Slide'
import Image from 'next/image'
import { FC, useState } from 'react'
import { CardType } from './BusinessCardList'
import { useAppSelector } from '@hasty-bazar/admin-shared/core/redux/hooks'
export interface IBusinessCardProps {
  price?: number | string
  imageUrl?: string
  realPrice?: number | string
  percentDiscount?: number
  link?: string
  title?: string
  remainingTime?: number
  numberOfOrder?: number
  type: CardType
  basketCount?: number
  rate?: number
  numberOfRate?: number
  hasFastSending?: boolean
}

const PriceBoxStyle = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  marginTop: `${theme.spacing(4)} !important`,
}))

const BusinessCard: FC<IBusinessCardProps> = (props) => {
  const {
    price,
    imageUrl,
    realPrice,
    percentDiscount,
    link,
    title,
    remainingTime,
    numberOfOrder,
    type,
    rate,
    numberOfRate,
    hasFastSending,
    basketCount: basketCountProp,
  } = props

  const { palette } = useTheme()
  const [showAddBasket, setShowAddBasket] = useState(false)
  const [basketCount, setBasketCount] = useState(basketCountProp || 0)
  const defaultCurrencyTitle = useAppSelector((state) => state.app.defaultCurrencyTitle)

  return (
    <Stack spacing={2} alignItems={type === 'circle' ? 'center' : 'flex-start'}>
      <Box
        sx={{
          borderRadius: type !== 'circle' ? 2 : '100%',
          width: type !== 'circle' ? 212 : 140,
          height: type !== 'circle' ? 212 : 140,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <HBLink href={link}>
          <Image src={imageUrl!} layout="fill" objectFit="contain" objectPosition="center" />
        </HBLink>
        {type === 'default' &&
          (!basketCount ? (
            <Box
              sx={{
                m: 2,
                position: 'absolute',
                display: 'flex',
                alignItems: 'flex-start',
                borderRadius: 2,
                overflow: 'hidden',
              }}
              onMouseEnter={() => setShowAddBasket(true)}
              onMouseLeave={() => setShowAddBasket(false)}
            >
              <HBIconButton
                sx={{ bgcolor: 'primary.main', borderColor: 'primary.main', zIndex: 999 }}
                variant="contained"
                icon="shoppingBag"
                iconStyle={{ color: palette.common.white }}
                iconSize={'medium'}
              />
              <Slide direction={'left'} in={showAddBasket} mountOnEnter unmountOnExit>
                <Typography
                  component="polygon"
                  bgcolor="common.white"
                  color="primary.main"
                  variant="overline"
                  sx={{ pl: 7, pr: 2, py: 2, borderRadius: 2, ml: -5, mt: 0.25, cursor: 'pointer' }}
                  points="0,100 30,100 50,00, 100,100"
                  onClick={() => setBasketCount(basketCount + 1)}
                >
                  افزودن به سبد خرید
                </Typography>
              </Slide>
            </Box>
          ) : (
            <Stack
              direction="row"
              spacing={1}
              bgcolor="common.white"
              p={2}
              alignItems="center"
              sx={{ position: 'absolute', borderRadius: 2, m: 2, p: 0 }}
            >
              <HBIconButton
                variant="text"
                icon="plus"
                iconStyle={{ color: palette.primary.main }}
                iconSize={'small'}
                sx={{ minWidth: 'fix-content' }}
                onClick={() => setBasketCount(basketCount + 1)}
              />
              <Typography variant="caption" color="primary.main">
                {basketCount}
              </Typography>
              <HBIconButton
                variant="text"
                icon={basketCount > 1 ? 'minus' : 'trashAlt'}
                iconStyle={{ color: palette.primary.main }}
                iconSize={'small'}
                sx={{ minWidth: 'fix-content' }}
                onClick={() => setBasketCount(basketCount - 1)}
              />
            </Stack>
          ))}
      </Box>
      {/* start --- title */}
      {title && (
        <Typography component="div" variant="subtitle1" color="text.primary">
          {title}
        </Typography>
      )}
      {price && (
        <PriceBoxStyle>
          <Typography
            px={2}
            py={1}
            bgcolor="primary.main"
            color="common.white"
            borderRadius={2}
            variant="subtitle2"
          >
            {percentDiscount}%
          </Typography>
          <Typography variant="subtitle1" color="text.primary">
            {price}
            <Typography component="span" variant="subtitle2" color="text.primary" ml={1}>
              {`${defaultCurrencyTitle}`}
            </Typography>
          </Typography>
        </PriceBoxStyle>
      )}
      {/* end --- title */}
      {/* start --- sub title */}
      {realPrice && (
        <Box display="flex" justifyContent="flex-end" width="100%">
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ textDecoration: 'line-through' }}
          >
            {realPrice}
          </Typography>
        </Box>
      )}
      {typeof remainingTime === 'number' && remainingTime >= 0 && (
        <Box
          sx={{ bgcolor: 'error.light', width: 'calc(100% - 16px)', p: 2, borderRadius: 2 }}
          display="flex"
          justifyContent="space-between"
        >
          <Box display="flex" alignItems={'center'}>
            <HBIcon size="small" type="stopwatch" sx={{ color: 'error.dark' }} />
            <HBCountDownTimer
              targetDate={new Date().getTime() + 1000 * 60 * 2}
              linkText=""
              sx={{
                '& > h5': (theme) => ({
                  padding: theme.spacing(0),
                  color: theme.palette.error.dark,
                  height: 20,
                  margin: 0,
                  ...theme.typography.subtitle2,
                }),
                '& > p': (theme) => ({
                  color: theme.palette.error.dark,
                  fontSize: 18,
                  margin: theme.spacing(0, 1),
                  ...theme.typography.subtitle2,
                }),
              }}
              maximumShowed="hours"
            />
          </Box>
          <Typography variant="caption" color="error.dark" display="flex" alignItems={'center'}>
            {numberOfOrder} <HBIcon size="small" type="shoppingBag" sx={{ color: 'error.dark' }} />
          </Typography>
        </Box>
      )}
      {/* start --- sub title */}
      {/* start ---- rate and fast sending */}
      <Box
        display="flex"
        justifyContent="space-between"
        width="100%"
        alignItems="center"
        height={32}
      >
        <Box>
          {!!hasFastSending && (
            <Typography
              component="div"
              p={1}
              bgcolor="info.light"
              color="info.dark"
              borderRadius={2}
              variant="overline"
              display="flex"
              alignItems="center"
            >
              <HBIcon
                type="truck"
                size="medium"
                sx={{ color: 'info.dark', mr: 1.5, fontSize: '1.5rem' }}
              />{' '}
              ارسال سریع
            </Typography>
          )}
        </Box>
        <Box>
          {!!rate && (
            <Box display="flex" alignItems="center">
              <Typography variant="caption" sx={{ color: 'text.secondary' }} mr={1}>
                ({numberOfRate})
              </Typography>
              <Typography variant="overline" sx={{ color: 'warning.light' }} mr={1.5}>
                {rate}
              </Typography>
              <HBIcon type="favorite" sx={{ color: 'warning.main' }} size="small" />
            </Box>
          )}
        </Box>
      </Box>
      {/* end ---- rate and fast sending */}
    </Stack>
  )
}

export default BusinessCard
