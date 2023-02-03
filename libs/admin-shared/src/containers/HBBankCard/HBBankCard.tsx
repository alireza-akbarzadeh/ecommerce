import { useAppSelector } from '@hasty-bazar/admin-shared/core/redux/hooks'
import { dotfy } from '@hasty-bazar/admin-shared/utils/dotfy'
import { HBIconButton } from '@hasty-bazar/core'
import { Box, Stack, Typography } from '@mui/material'
import { useIntl } from 'react-intl'
import HbCardBankMessages from './HBBankCard.messages'
import { BankCardStyle, InnerCardStyle } from './styles'

type HBBankCardProps = {
  balance: number | string
  walletRefetch: () => void
}

export default function HBBankCard({ balance, walletRefetch }: HBBankCardProps) {
  const { formatMessage } = useIntl()
  const defaultCurrency = useAppSelector((state) => String(String(state.app.defaultCurrencyTitle)))
  return (
    <BankCardStyle>
      <Stack alignItems="flex-end">
        <Typography variant="h6" color="common.white" mb={4}>
          {dotfy(balance)} {defaultCurrency}
        </Typography>
        <Box display="flex" justifyContent="flex-end" alignItems="center">
          <Typography variant="button" color="grey.300">
            {formatMessage(HbCardBankMessages.balance)}
          </Typography>
          <HBIconButton
            onClick={() => walletRefetch()}
            variant="text"
            icon="redo"
            iconSize="medium"
            sx={{ color: 'common.white' }}
          />
        </Box>
      </Stack>
      <InnerCardStyle>
        <Box
          component="img"
          sx={{ objectFit: 'contain' }}
          src={'/assets/logo.png'}
          width={53}
          height={53}
          alt="logo"
        />
        <Typography variant="body2" color="info.dark">
          {formatMessage(HbCardBankMessages.hasti)}
        </Typography>
      </InnerCardStyle>
    </BankCardStyle>
  )
}
