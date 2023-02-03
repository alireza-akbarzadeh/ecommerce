import { TextWithHBIcon } from '@hasty-bazar-commerce/components'
import { PaymentStatusEnum } from '@hasty-bazar-commerce/core/enums'
import {
  CommerceDetailTransaction,
  PaymentStatus,
} from '@hasty-bazar-commerce/services/saleApi.generated'
import { HBIcon, HBIconType } from '@hasty-bazar/core'
import {
  Accordion,
  accordionClasses,
  AccordionDetails,
  AccordionSummary,
  accordionSummaryClasses,
  Box,
  collapseClasses,
  Grid,
  Hidden,
  Stack,
  styled,
  Typography,
} from '@mui/material'
import { format } from 'date-fns-jalali'
import { default as dayJs, default as dayjs } from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { FC } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import OrderTrackingMessages from '../../orderTracking.messages'

dayjs.extend(utc)

interface IOrderHistoryProps {
  expanded: boolean
  transactions: CommerceDetailTransaction[]
}

const GridStyle = styled(Grid)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const dateFormat = 'YYYY-MM-DDThh:mm:ss'
const jalaliDateFormat = 'yyyy/MM/dd،k:mm'

const paymentTypes: Record<PaymentStatus, { message: string; icon: HBIconType; color: string }> = {
  [PaymentStatusEnum.Canceled]: {
    message: 'cancelPayMessage',
    icon: 'exclamationTriangle',
    color: 'error.main',
  },
  [PaymentStatusEnum.Failed]: {
    message: 'orderUnSuccess',
    icon: 'timesCircle',
    color: 'error.main',
  },
  [PaymentStatusEnum.None]: {
    message: 'nonePayMessage',
    icon: 'exclamationTriangle',
    color: 'warning.main',
  },
  [PaymentStatusEnum.Success]: {
    message: 'orderSuccess',
    icon: 'check',
    color: 'success.main',
  },
  [PaymentStatusEnum.Waiting]: {
    message: 'await-payment',
    icon: 'exclamationCircle',
    color: 'warning.main',
  },
}

const StatusIconWrapper: FC<{ icon: HBIconType; color: string }> = ({ icon, color }) => {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{
        borderRadius: '100%',
        backgroundColor: color,
        width: 22,
        height: 22,
        p: 0.5,
      }}
    >
      <HBIcon size="small" sx={{ color: 'common.white', lineHeight: 0 }} type={icon} />
    </Stack>
  )
}

const Status: FC<{
  message: string
  icon: HBIconType
  color: string
}> = ({ color, icon, message }) => {
  const { formatMessage } = useIntl()
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <StatusIconWrapper color={color} icon={icon} />
      <Typography variant="subtitle2" color={color}>
        {formatMessage({
          ...OrderTrackingMessages[message as keyof typeof OrderTrackingMessages],
        })}
      </Typography>
    </Stack>
  )
}

const OrderHistory: FC<IOrderHistoryProps> = (props) => {
  const { expanded, transactions } = props
  return (
    <Accordion
      expanded={expanded}
      sx={{
        [`& .${accordionSummaryClasses.root}`]: { display: 'none' },
        [`& .${collapseClasses.root}`]: {
          borderTop: (theme) => `1px solid ${theme.palette.grey[200]}`,
          mt: 2,
        },
        [`&.${accordionClasses.root}`]: {
          boxShadow: 'none',
          mt: 1,
        },
      }}
    >
      <AccordionSummary />
      <AccordionDetails>
        <Box sx={{ px: { sm: 6, xs: 0 }, py: { sm: 4, xs: 1 } }}>
          <Grid columns={5} container>
            {transactions.map((item) => (
              <>
                <GridStyle
                  item
                  sm={1}
                  xs={12}
                  sx={{ justifyContent: { sm: 'flex-start!important', xs: 'space-between' } }}
                >
                  {item.paymentStatus && <Status {...paymentTypes[item.paymentStatus]} />}
                  <Hidden smUp>
                    <Typography variant="subtitle2" color="grey.900">
                      <FormattedMessage
                        {...OrderTrackingMessages.priceWithCurrency}
                        values={{
                          price: item.amount ? item.amount.toLocaleString() : '',

                          currency: item.currency,
                        }}
                      />
                    </Typography>
                  </Hidden>
                </GridStyle>
                <GridStyle item sm={3} xs={12} sx={{ justifyContent: 'flex-start' }}>
                  <Stack sx={{ flex: 1 }} spacing={4}>
                    <Hidden smDown>
                      <TextWithHBIcon
                        text={
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography variant="subtitle2" color="text.secondary">
                              <FormattedMessage {...OrderTrackingMessages.paymentType} />
                            </Typography>
                            <Typography variant="overline" sx={{ userSelect: 'text' }}>
                              {item.paymentProviderName}
                            </Typography>
                          </Stack>
                        }
                        iconColor="grey.500"
                        iconType="creditCard"
                      />
                    </Hidden>
                    <Hidden smUp>
                      <Stack spacing={2}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          sx={{ width: '100%' }}
                          justifyContent="space-between"
                        >
                          <Typography variant="subtitle2" color="grey.900">
                            <FormattedMessage {...OrderTrackingMessages.internetPay} />
                          </Typography>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Box>
                              <HBIcon sx={{ color: 'grey.500' }} type="creditCard" />
                            </Box>
                            <Typography color="grey.700" variant="overline">
                              {item.paymentProviderName}
                            </Typography>
                          </Stack>
                        </Stack>

                        <Stack alignItems="flex-end">
                          <Typography variant="subtitle2" color="grey.900">
                            {format(
                              dayJs(dayJs(item.date).format(dateFormat), dateFormat).toDate(),
                              jalaliDateFormat,
                            )}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Hidden>
                    <Hidden smDown>
                      <TextWithHBIcon
                        text={
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography variant="subtitle2" color="text.secondary">
                              <FormattedMessage {...OrderTrackingMessages.followUpCode} />
                            </Typography>
                            <Typography variant="subtitle2" sx={{ userSelect: 'text' }}>
                              {item.trackingNumber}
                            </Typography>
                          </Stack>
                        }
                        iconColor="grey.500"
                        iconType="documentInfo"
                      />
                    </Hidden>
                    <Hidden smUp>
                      <Stack spacing={2} alignItems="flex-start">
                        <Typography variant="subtitle2" color="grey.700">
                          <FormattedMessage {...OrderTrackingMessages.followUpCode} />
                        </Typography>
                        <Typography variant="subtitle2" sx={{ userSelect: 'text' }}>
                          {item.trackingNumber}
                        </Typography>
                      </Stack>
                    </Hidden>
                  </Stack>
                </GridStyle>
                <Hidden smDown>
                  <GridStyle item xs={12} sm={1} sx={{ justifyContent: 'flex-end' }}>
                    <Stack alignItems="flex-end" spacing={4}>
                      <Typography variant="subtitle2" color="grey.900">
                        <FormattedMessage
                          {...OrderTrackingMessages.priceWithCurrency}
                          values={{
                            price: item.amount ? item.amount.toLocaleString() : '',

                            currency: item.currency,
                          }}
                        />
                      </Typography>

                      <Typography variant="subtitle2" color="text.secondary" textAlign="end">
                        {format(
                          dayJs(dayJs(item.date).format(dateFormat), dateFormat).toDate(),
                          jalaliDateFormat,
                        )}
                      </Typography>
                    </Stack>
                  </GridStyle>
                </Hidden>
              </>
            ))}
          </Grid>
        </Box>
      </AccordionDetails>
    </Accordion>
  )
}

export default OrderHistory
