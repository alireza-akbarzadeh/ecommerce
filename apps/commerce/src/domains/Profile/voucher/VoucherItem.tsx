import { TextWithHBIcon } from '@hasty-bazar-commerce/components'
import useCopyToClipboard from '@hasty-bazar-commerce/hooks/useCopyToclipboard'
import { GetCustomVoucherCustomerResult } from '@hasty-bazar-commerce/services/saleApi.generated'
import { Box, ButtonBase, Grid, Stack, Theme, Typography, useMediaQuery } from '@mui/material'
import { FC } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import VoucherMessages from './Voucher.messages'

type IVoucherItem = {
  content: GetCustomVoucherCustomerResult
  expire?: boolean
}

const VoucherItem: FC<IVoucherItem> = ({ content, expire }) => {
  const { formatDate, formatMessage } = useIntl()
  const [_, copy] = useCopyToClipboard()

  const {
    color,
    customerUsedCount,
    endDate,
    endDateCount,
    title,
    usageLimit,
    voucherCode,
    currnecyTitle,
    minPurchaseValue,
  } = content
  const breakpointDownSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  const colorGenerator = (defaultColor?: string) => {
    const color = expire ? 'text.secondary' : defaultColor ? defaultColor : 'text.primary'
    return color
  }

  const colorSelector: Partial<Record<string, { bgcolor: string; color: string }>> = {
    green: { bgcolor: 'success.light', color: 'success.dark' },
    red: { bgcolor: 'error.lighter', color: 'error.main' },
    orange: { bgcolor: 'warning.lighter', color: 'warning.dark' },
  }

  return (
    <Grid
      container
      sx={{
        p: 4,
        borderRadius: 4,
        border: ({ palette }) => `1px solid ${palette.grey[300]}`,
        filter: expire ? 'grayscale(1)' : 'unset',
      }}
      alignItems="flex-end"
      justifyContent="space-between"
      rowGap={4}
    >
      <Grid item xs="auto">
        <Stack spacing={4}>
          <Typography variant="subtitle2" sx={{ userSelect: 'text' }} color={colorGenerator()}>
            <FormattedMessage
              {...VoucherMessages.voucherTitle}
              values={{
                title,
                minPriceValue: minPurchaseValue ?? '0',
                currency: currnecyTitle,
              }}
            />
          </Typography>
          <Stack direction="row" spacing={4} alignItems="center">
            {endDate && (
              <TextWithHBIcon
                iconType="calendarAlt"
                iconColor={expire ? 'text.disabled' : 'grey.700'}
                text={formatDate(endDate)}
                textColor={colorGenerator()}
              />
            )}
            <TextWithHBIcon
              iconType="tagAlt"
              iconColor={expire ? 'text.disabled' : 'grey.700'}
              text={formatMessage(VoucherMessages.voucherUsageCount, {
                usageLimit: (usageLimit || 0).toString(),
              })}
              textColor={colorGenerator()}
            />
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            {((endDateCount && !expire) || expire) && (
              <Box
                sx={{
                  borderRadius: 2,
                  bgcolor: expire
                    ? 'grey.100'
                    : color
                    ? colorSelector[color?.toLowerCase()]?.bgcolor
                    : 'success.light',
                  border: ({ palette }) => (expire ? `1px solid ${palette.grey[300]}` : 'unset'),
                  py: 1.5,
                  px: { xs: 2, sm: 4 },
                }}
              >
                <Typography
                  variant={breakpointDownSm ? 'caption' : 'body2'}
                  color={colorGenerator(
                    color ? colorSelector[color?.toLowerCase()]?.color : 'text.primary',
                  )}
                >
                  {expire
                    ? formatMessage(VoucherMessages.expireVoucher)
                    : formatMessage(VoucherMessages.voucherEndDateCount, {
                        endDateCount: endDateCount?.toString(),
                      })}
                </Typography>
              </Box>
            )}
            {!!customerUsedCount && (
              <Box
                sx={{
                  borderRadius: 2,
                  bgcolor: 'grey.100',
                  border: ({ palette }) => (expire ? `1px solid ${palette.grey[300]}` : 'unset'),
                  py: 1.5,
                  px: { xs: 2, sm: 4 },
                }}
              >
                <Typography
                  variant={breakpointDownSm ? 'caption' : 'body2'}
                  color={colorGenerator()}
                >
                  {formatMessage(VoucherMessages.voucherCustomerUsedCount, {
                    voucherCustomerUsedCount: customerUsedCount.toString(),
                  })}
                </Typography>
              </Box>
            )}
          </Stack>
        </Stack>
      </Grid>
      <Grid item xs={12} sm="auto">
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{
            borderRadius: 2,
            bgcolor: 'info.lighter',
            py: 1.5,
            px: 4,
          }}
        >
          <Typography
            sx={{
              borderRadius: 2,
              bgcolor: 'grey.100',
              py: 1.5,
              px: 4,
              userSelect: 'text',
            }}
            color={colorGenerator()}
          >
            {voucherCode}
          </Typography>
          {expire ? (
            <TextWithHBIcon
              text={formatMessage(VoucherMessages.voucherCopy)}
              iconType="copy"
              iconColor={colorGenerator('info.dark')}
              textColor={colorGenerator('info.dark')}
              sx={{ width: { xs: '100%' } }}
            />
          ) : (
            <ButtonBase
              onClick={() => {
                if (voucherCode) copy(voucherCode)
              }}
            >
              <TextWithHBIcon
                text={formatMessage(VoucherMessages.voucherCopy)}
                iconType="copy"
                iconColor={colorGenerator('info.dark')}
                textColor={colorGenerator('info.dark')}
                sx={{ width: { xs: '100%' } }}
              />
            </ButtonBase>
          )}
        </Stack>
      </Grid>
    </Grid>
  )
}

export default VoucherItem
