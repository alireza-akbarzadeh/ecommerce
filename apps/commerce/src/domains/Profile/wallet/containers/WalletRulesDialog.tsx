import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { useGetWebCatalogProductRulesGetallPublishedQuery } from '@hasty-bazar-commerce/services/catalogApi.generated'
import { HBDialog } from '@hasty-bazar/core'
import { Stack, Typography } from '@mui/material'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import WalletMessages from '../wallet.messages'

interface WalletRulesDialogProps {
  open: boolean
  onClose: () => void
}

const WalletRulesDialog: FC<WalletRulesDialogProps> = ({ open, onClose }) => {
  const { formatMessage } = useIntl()

  const { data } = useGetWebCatalogProductRulesGetallPublishedQuery({
    ...ApiConstants,
    processEventName: 'Sale_BuyRule_DepositWallet',
    filter: 'ProcessEventName_Equal_--ProcessEventName',
  })

  return (
    <HBDialog
      maxWidth="sm"
      fullWidth
      title={formatMessage(WalletMessages.walletRules)}
      open={open}
      onClose={() => onClose()}
      onBackdropClick={() => onClose()}
    >
      <Stack spacing={6} py={4} px={2} width="100%">
        {data?.data?.items &&
          data.data.items.map((item, index) => {
            return (
              <Stack spacing={4} key={`wallet-rule-${index}`}>
                <Typography
                  variant="body2"
                  component="div"
                  sx={{
                    '& *': {
                      fontFamily: (theme) => `${theme.typography.fontFamily} !important`,
                      textAlign: 'justify !important',
                      lineHeight: `2.3 !important`,
                    },
                  }}
                  dangerouslySetInnerHTML={{
                    __html: item?.description || '',
                  }}
                />
              </Stack>
            )
          })}
      </Stack>
    </HBDialog>
  )
}

export default WalletRulesDialog
