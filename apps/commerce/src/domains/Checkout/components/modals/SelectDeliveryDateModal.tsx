import { Provider } from '@hasty-bazar-commerce/services/saleApi.generated'
import { HBButton, HBDialog, HBRadioButton } from '@hasty-bazar/core'
import {
  Box,
  DialogProps,
  FormControlLabel,
  Grid,
  RadioGroup,
  Stack,
  styled,
  Typography,
} from '@mui/material'
import { FC, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import CheckoutPageMessages from '../../CheckoutPage.messages'

interface ISelectDeliveryDateModal extends Required<Pick<DialogProps, 'onClose'>> {
  currentActiveProvider?: Provider
  onAccept: (optionId: string) => void
}

const BoxStyle = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(3),
  border: `1px solid ${theme.palette.grey[200]}`,
  borderRadius: theme.spacing(2),
  overflowX: 'scroll',
  [theme.breakpoints.down('md')]: {
    border: 'none',
    padding: 0,
  },
}))

const SelectDeliveryDateModal: FC<ISelectDeliveryDateModal> = (props) => {
  const { formatMessage, formatDate } = useIntl()
  const { onClose, currentActiveProvider, onAccept } = props

  const [selectedProviderOptionId, setSelectedProviderOptionId] = useState(
    currentActiveProvider?.deliveryTimes
      ?.map((item) => item?.deliveryTimeFrames?.find((time) => time.isDefault))
      .filter((option) => option)[0]?.id,
  )

  const changeTimeTable = (optionId: string) => {
    setSelectedProviderOptionId(optionId)
  }

  return (
    <HBDialog
      maxWidth="md"
      fullWidth
      open
      title={formatMessage(CheckoutPageMessages.selectShippingTime)}
      onClose={() => onClose({}, 'backdropClick')}
      onReject={() => onClose({}, 'backdropClick')}
      onBackdropClick={() => onClose({}, 'backdropClick')}
    >
      <BoxStyle>
        <RadioGroup
          value={selectedProviderOptionId}
          onChange={(_, val) => changeTimeTable(val)}
          sx={{ width: '100%', gap: 4 }}
        >
          {currentActiveProvider?.deliveryTimes?.map((time, index) => {
            return (
              <Stack
                key={index}
                direction={{ xs: 'column', sm: 'row' }}
                gap={4}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
              >
                <Box
                  sx={{
                    width: '100%',
                    maxWidth: { sm: '20%', md: '15%' },
                    minWidth: { sm: '20%', md: '15%' },
                  }}
                >
                  <Typography variant="subtitle1">
                    {formatDate(time?.date, {
                      weekday: 'long',
                      month: 'long',
                      day: '2-digit',
                    })}
                  </Typography>
                </Box>
                <Stack direction="row" gap={4} alignItems="flex-start">
                  {time.deliveryTimeFrames?.map((frame) => {
                    return (
                      <Box
                        key={frame.id}
                        sx={{
                          border: ({ palette }) => `1px solid ${palette.grey[200]}`,
                          borderRadius: 2,
                          p: 3,
                          maxWidth: 180,
                          minWidth: 180,
                          width: 180,
                        }}
                      >
                        <FormControlLabel
                          value={frame.id}
                          control={<HBRadioButton />}
                          componentsProps={{ typography: { variant: 'subtitle2' } }}
                          label={
                            <FormattedMessage
                              {...CheckoutPageMessages.timeFrame}
                              values={{
                                from: frame.from?.slice(0, 2),
                                to: frame.to?.slice(0, 2),
                              }}
                            />
                          }
                        />
                        <Stack direction="row" spacing={2}>
                          <Typography variant="body2">
                            <FormattedMessage {...CheckoutPageMessages.shippingFee} />
                          </Typography>
                          <Typography variant="body2">
                            <FormattedMessage
                              {...CheckoutPageMessages.feeWithCurrency}
                              values={{
                                fee: Number(frame.price).toLocaleString(),
                                currency: frame.currency,
                              }}
                            />
                          </Typography>
                        </Stack>
                      </Box>
                    )
                  })}
                </Stack>
              </Stack>
            )
          })}
        </RadioGroup>
      </BoxStyle>
      <Grid container mt={4} sx={{ flex: 1, justifyContent: 'space-between' }}>
        <Grid item xs={4} sm={3} md={2}>
          <HBButton fullWidth onClick={() => onClose({}, 'backdropClick')} variant="outlined">
            <FormattedMessage {...CheckoutPageMessages.cancel} />
          </HBButton>
        </Grid>
        <Grid item xs={4} sm={3} md={2}>
          <HBButton fullWidth onClick={() => onAccept(selectedProviderOptionId!)}>
            <FormattedMessage {...CheckoutPageMessages.confirm} />
          </HBButton>
        </Grid>
      </Grid>
    </HBDialog>
  )
}

export default SelectDeliveryDateModal
