import { HBLink } from '@hasty-bazar/admin-shared/components'
import { HBButton, HBCarousel, HBIcon } from '@hasty-bazar/core'
import { Box, Stack, Typography, useTheme } from '@mui/material'
import { FC, PropsWithChildren } from 'react'
import CardWidget, { IBusinessCardProps } from './BusinessCard'

export type CardType = 'default' | 'offer' | 'circle'

interface IBusinessCardListProps {
  type: CardType
  link?: string
  carouselOptions?: {
    slidesPerView?: number | 'auto'
    delay?: string
  }
  title: string
  textColor?: string
  offer?: {
    title: string
    subTitle: string
    buttonText: string
    bgColor: string
    buttonBgColor: string
  }
  items: (IBusinessCardProps & { images?: string[] })[]
}

const BusinessCardList: FC<PropsWithChildren<IBusinessCardListProps>> = ({
  items,
  title,
  type,
  carouselOptions,
  link,
  offer,
  textColor,
}) => {
  const theme = useTheme()

  return (
    <Stack
      spacing={7}
      sx={{
        bgcolor: 'common.white',
        py: 6,
        pl: 6,
        borderRadius: 4,
        pr: type === 'circle' && !items?.[0]?.title ? 6 : 0,
      }}
    >
      {!!title && (
        <Stack direction="row" alignItems="center" spacing={10}>
          <Typography variant="h6" sx={{ color: textColor }}>
            {title}
          </Typography>
          {!!link && (
            <HBLink sx={{ color: 'info.main', textDecoration: 'unset' }} href={link || '#'}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="button">نمایش همه</Typography>
                <HBIcon type="angleLeft" />
              </Stack>
            </HBLink>
          )}
        </Stack>
      )}

      <Box
        sx={{
          border: (theme) =>
            !!offer || (type === 'circle' && !items?.[0]?.title)
              ? `1px solid ${theme.palette.grey[100]}`
              : 'unset',
          pt: type === 'circle' && !items?.[0]?.title ? 6 : '',
          borderRadius: 2,
          display: 'flex',
        }}
      >
        {offer && (
          <Stack
            sx={{
              bgcolor: offer.bgColor,
              borderTopLeftRadius: 16,
              borderBottomLeftRadius: 16,
              width: 200,
              px: 4,
              mr: 6,
            }}
            justifyContent="space-around"
            alignItems="center"
          >
            <Stack spacing={4}>
              <Typography sx={{ textAlign: 'center' }} variant="h6">
                {offer.title}
              </Typography>
              <Typography sx={{ textAlign: 'center' }} variant="subtitle1">
                {offer.subTitle}
              </Typography>
            </Stack>
            <HBButton sx={{ borderRadius: 6, width: 120, bgcolor: offer.buttonBgColor }}>
              {offer.buttonText}
              <HBIcon type="arrowLeft" />
            </HBButton>
          </Stack>
        )}
        <HBCarousel
          freeMode={true}
          spaceBetween={24}
          slidesPerView={carouselOptions?.slidesPerView || 'auto'}
          style={
            offer && { padding: theme.spacing(1), width: 'calc(100% - 220px)', overflow: 'hidden' }
          }
          delay={+(carouselOptions?.delay || '0')}
        >
          {items?.map((item, index) => (
            <CardWidget {...item} type={type} key={index} />
          ))}
        </HBCarousel>
      </Box>
    </Stack>
  )
}

export default BusinessCardList
