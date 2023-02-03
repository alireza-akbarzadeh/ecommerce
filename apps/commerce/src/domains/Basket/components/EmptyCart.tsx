import { HBButton, HBIcon } from '@hasty-bazar/core'
import { Box, Stack, styled, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { FormattedMessage } from 'react-intl'
import BasketMessages from '../basket.messages'

const TypographyStyle = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
}))

const EmptyCart: FC = () => {
  const router = useRouter()

  return (
    <Stack
      alignItems="center"
      sx={{ flex: 1, borderRadius: 2, bgcolor: 'common.white', pt: 8, pb: 6, mt: 3 }}
      spacing={6}
    >
      <Box
        component="img"
        src="/assets/svg/EmptyBasket.svg"
        width={{ sm: 160, xs: 120 }}
        height={{ sm: 136, xs: 96 }}
      />
      <Stack spacing={1}>
        <TypographyStyle variant="h6">
          <FormattedMessage {...BasketMessages.emptyCart} />
        </TypographyStyle>
        <TypographyStyle variant="subtitle1" color="text.secondary">
          <FormattedMessage {...BasketMessages.seeMoreProduct} />
        </TypographyStyle>
      </Stack>
      <HBButton onClick={() => router.push('/discountDay')}>
        <Stack direction="row" spacing={3} alignItems="center">
          <Typography>
            <FormattedMessage {...BasketMessages.offsAndSuggests} />
          </Typography>
          <HBIcon type="arrowLeft" />
        </Stack>
      </HBButton>
    </Stack>
  )
}

export default EmptyCart
