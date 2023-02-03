import { TextWithHBIcon } from '@hasty-bazar/admin-shared/components'
import { useAppSelector } from '@hasty-bazar/admin-shared/core/redux/hooks'
import {
  GetVoucherInfo,
  VoucherInformation,
} from '@hasty-bazar/admin-shared/services/reportApi.generated'
import { commafy } from '@hasty-bazar/admin-shared/utils'
import { Box, Grid, List, ListItem, Stack, Typography } from '@mui/material'
import { FC } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import customerDiscountCodeMessages from '../customer-discount-code.messages'

type IVoucherItem = {
  content: VoucherInformation
  expire?: boolean
}

const VoucherItem: FC<IVoucherItem> = ({ content, expire }) => {
  const { formatDate, formatMessage } = useIntl()
  const defaultCurrency = useAppSelector((state) => String(String(state.app.defaultCurrencyTitle)))
  const {
    code = '',
    color = 'text.primary',
    endDate = '',
    endDateCount = 0,
    getVoucherInfos = null,
    minPurchaseValue = null,
    title = '',
    usageTypeTitle = '',
    usedCount = '',
  } = content

  const colorGenerator = (defaultColor?: string) => {
    const color = expire ? 'text.secondary' : defaultColor ? defaultColor : 'text.primary'
    return color
  }

  return (
    <Grid
      container
      sx={{
        p: 4,
        borderRadius: 2,
        border: ({ palette }) => `1px solid ${palette.grey[300]}`,
      }}
      alignItems="flex-end"
      justifyContent="space-between"
      rowSpacing={3}
      my={2}
    >
      <Grid item xs={12} sm={11} sx={{ flexGrow: 1 }}>
        <Stack spacing={4}>
          <Typography variant="subtitle2" color={colorGenerator()}>
            <FormattedMessage
              {...customerDiscountCodeMessages.voucherTitle}
              values={{
                title,
                minPriceValue: commafy(minPurchaseValue) ?? '0',
                currency: defaultCurrency,
              }}
            />
          </Typography>
          <Stack direction="row" spacing={4} alignItems="center">
            <TextWithHBIcon
              iconColor={expire ? 'text.disabled' : 'grey.700'}
              text={endDate && formatDate(endDate)}
              textColor={colorGenerator()}
              iconProps={{ size: 'small', type: 'calendarAlt' }}
            />
            <TextWithHBIcon
              iconColor={expire ? 'text.disabled' : 'grey.700'}
              text={usageTypeTitle}
              textColor={colorGenerator()}
              iconProps={{ size: 'small', type: 'tagAlt' }}
            />
          </Stack>

          {getVoucherInfos?.length ? (
            <Stack>
              <List sx={{ width: '100%' }}>
                {getVoucherInfos?.map((item: GetVoucherInfo, index: number) => {
                  return (
                    <ListItem
                      key={index}
                      sx={{
                        p: 0,
                        borderBottom: ({ palette }) => `1px solid ${palette.grey[200]}`,
                        '&:last-child': {
                          borderBottom: 0,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          gap: 6,
                          p: 2,
                          flexWrap: 'wrap',
                        }}
                      >
                        <Typography variant="body2" sx={{ minWidth: 140 }} color={'grey.500'}>
                          {formatMessage(customerDiscountCodeMessages.orderNumber)}
                          <Box
                            component={'span'}
                            mx={1}
                            sx={({ palette }) => ({ color: palette.info.main })}
                          >
                            {item.orderNumber}
                          </Box>
                        </Typography>
                        <Typography variant="body2" sx={{ minWidth: 200 }} color={'grey.500'}>
                          {formatMessage(customerDiscountCodeMessages.orderPrice)}
                          <Box component={'span'} mx={1}>
                            {commafy(item.orderPrice)}
                          </Box>
                          {defaultCurrency}
                        </Typography>
                        <Typography variant="body2" sx={{ minWidth: 150 }} color={'grey.500'}>
                          {formatMessage(customerDiscountCodeMessages.orderDate, {
                            orderDate: formatDate(item?.orderDate || ''),
                          })}
                        </Typography>
                      </Box>
                    </ListItem>
                  )
                })}
              </List>
            </Stack>
          ) : (
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  borderRadius: 2,
                  border: '1px solid',
                  py: 1.5,
                  px: 4,
                  bgcolor:
                    color?.toLowerCase() === 'orange'
                      ? 'warning.lighter'
                      : color?.toLowerCase() === 'green'
                      ? 'success.light'
                      : color?.toLowerCase() === 'red'
                      ? 'error.light'
                      : '',
                  color:
                    color?.toLowerCase() === 'orange'
                      ? 'warning.main'
                      : color?.toLowerCase() === 'green'
                      ? 'success.dark'
                      : color?.toLowerCase() === 'red'
                      ? 'error.dark'
                      : 'text.secondary',
                }}
              >
                <Typography variant="body2">
                  {expire
                    ? formatMessage(customerDiscountCodeMessages.expireVoucher)
                    : formatMessage(customerDiscountCodeMessages.voucherEndDateCount, {
                        endDateCount: endDateCount && endDateCount.toString(),
                      })}
                </Typography>
              </Box>
              {!!usedCount && (
                <Box
                  sx={{
                    borderRadius: ({ spacing }) => spacing(2),
                    bgcolor: 'warning.lighter',
                    color: 'warning.main',
                    border: ({ palette }) => `1px solid ${palette.warning.light}`,
                    py: 1.5,
                    px: 4,
                  }}
                >
                  <Typography variant="body2">
                    {formatMessage(customerDiscountCodeMessages.voucherCustomerUsedCount, {
                      voucherCustomerUsedCount: usedCount?.toString(),
                    })}
                  </Typography>
                </Box>
              )}
            </Stack>
          )}
        </Stack>
      </Grid>
      <Grid item xs={12} sm={1} sx={{ display: 'flex', justifyContent: 'end' }}>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{
            borderRadius: 2,
            bgcolor: expire ? 'grey.200' : 'info.lighter',
            py: 1.5,
            px: 2,
            width: 'fit-content',
          }}
        >
          <Typography
            sx={{
              borderRadius: 2,
              bgcolor: 'grey.100',
              py: 1.5,
              px: 2,
            }}
            color={colorGenerator()}
          >
            {code}
          </Typography>
        </Stack>
      </Grid>
    </Grid>
  )
}

export default VoucherItem
