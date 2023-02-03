import { WaitingOrderDto } from '@hasty-bazar-commerce/services/saleApi.generated'
import { HBAccordion, HBIcon } from '@hasty-bazar/core'
import { accordionClasses, Stack, styled, Typography } from '@mui/material'
import { FC, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import BasketMessages from '../basket.messages'
import BasketAwaitPaymentRow from './BasketAwaitPaymentRow'

const ClickableStyle = styled(Stack)(() => ({
  cursor: 'pointer',
}))

interface IBasketAwaitPayment {
  orders: WaitingOrderDto[]
  timeHasOver: (id: string) => void
  canceledCallBack: (id: string) => void
}

const BasketAwaitPayment: FC<IBasketAwaitPayment> = (props) => {
  const { orders, timeHasOver, canceledCallBack } = props
  const [expanded, setExpanded] = useState<boolean>(true)

  return (
    <HBAccordion
      customSummary={
        <ClickableStyle
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          onClick={() => {
            setExpanded(!expanded)
          }}
          sx={{
            bgcolor: !expanded ? 'grey.100' : 'common.white',
            width: '100%',
            py: 2,
            paddingLeft: 4,
            paddingRight: 2,
            borderRadius: 2,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ width: '100%' }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Stack
                alignItems="center"
                justifyContent="center"
                sx={{
                  height: 32,
                  width: 32,
                  border: (theme) => `1px solid ${theme.palette.grey[300]}`,
                  borderRadius: 2,
                }}
              >
                <HBIcon
                  type="angleDown"
                  sx={{
                    color: 'grey.500',
                    transition: 'transform 0.2s',
                    ...(expanded && { transform: 'rotate(180deg)' }),
                  }}
                />
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography color="text.prmary" variant="subtitle1">
                  <FormattedMessage
                    {...BasketMessages.awaitPaymentCount}
                    values={{ count: orders.length }}
                  />
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </ClickableStyle>
      }
      expanded={expanded}
      sx={{
        [`& .${accordionClasses.expanded}`]: {
          margin: (theme) => `${theme.spacing(0)}!important`,
        },
        [`& .${accordionClasses.gutters}`]: {
          margin: (theme) => `${theme.spacing(0)}!important`,
          [`& .${accordionClasses.gutters}`]: {
            minHeight: 'unset',
            padding: 0,
          },
        },
        boxShadow: 'none',
        p: 0,
        border: expanded ? '1px solid' : 'none',
        borderColor: 'grey.100',
        borderRadius: 2,
      }}
      detail={
        <Stack sx={{ paddingBottom: 4 }} px={4} spacing={6}>
          {orders.map((item) => {
            return (
              <BasketAwaitPaymentRow
                key={`await-payment-${item.shoppingCartId}`}
                cancelCallBack={() => canceledCallBack(item!.shoppingCartId!)}
                timeHasOver={() => timeHasOver(item!.shoppingCartId!)}
                item={item}
              />
            )
          })}
        </Stack>
      }
    />
  )
}

export default BasketAwaitPayment
