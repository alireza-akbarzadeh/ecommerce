import HBImg from '@hasty-bazar/admin-shared/containers/HBFileUploader/containers/HBImage.style'
import {
  AttributeDto,
  OrderItemDto,
  SpecificAttributeDto,
} from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { convertDateToPersian } from '@hasty-bazar/admin-shared/utils'
import { HBIconButton } from '@hasty-bazar/core'
import { Box, Grid, List, ListItem, ListItemText, Stack, Typography, useTheme } from '@mui/material'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import FinancialTransactionMessage from '../../financialTransaction.message'
import { useAppSelector } from '@hasty-bazar/admin-shared/core/redux/hooks'
interface ShipmentItemsProps {
  shoppingCartItem: OrderItemDto
}

const ShipmentItems: FC<ShipmentItemsProps> = ({ shoppingCartItem }) => {
  const { formatMessage } = useIntl()
  const { palette } = useTheme()
  const defaultCurrencyTitle = useAppSelector((state) => state.app.defaultCurrencyTitle)

  const createFields = () => {
    return (
      <>
        <Grid item xs={12} sm={2} py={4}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'grey.200',
              borderRadius: (theme) => theme.spacing(4),
              margin: (theme) => theme.spacing(0, 3),
              width: 100,
              height: 100,
            }}
          >
            <HBImg
              src={`${process.env.NEXT_PUBLIC_CDN}${shoppingCartItem?.imageUrl!}`}
              width="68"
              height="68"
            />
          </Box>
          <Box sx={({ spacing }) => ({ padding: spacing(2, 6) })}>
            <Typography sx={{ color: 'error.main' }}>
              {formatMessage(FinancialTransactionMessage.especialOffer)}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              backgroundColor: 'grey.200',
              borderRadius: (theme) => theme.spacing(2),
              width: 130,
              height: 40,
              color: 'primary.main',
            }}
          >
            <Box>
              <HBIconButton
                variant="text"
                icon="plus"
                iconStyle={{ color: palette.primary.main }}
                iconSize={'small'}
                sx={{ minWidth: 'fix-content' }}
                disabled
                onClick={() => {}}
              />
            </Box>
            <Box>{shoppingCartItem?.quantity}</Box>
            <Box>
              <HBIconButton
                variant="text"
                icon="trashAlt"
                iconStyle={{ color: palette.primary.main }}
                iconSize={'small'}
                sx={{ minWidth: 'fix-content' }}
                disabled
                onClick={() => {}}
              />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={7} py={4}>
          <Box mb={6} px={4}>
            <Typography variant="body2">{shoppingCartItem?.productName}</Typography>
          </Box>
          <ListItem>
            <Stack direction={'column'}>
              {shoppingCartItem?.specificAttributes?.map(
                (specificAttribute: SpecificAttributeDto) => (
                  <Typography variant="body2" pb={2}>
                    {`${specificAttribute?.valueTitle}`}
                  </Typography>
                ),
              )}
              {shoppingCartItem?.attribute?.map((attribute: AttributeDto) => (
                <Typography variant="body2" pb={2}>
                  {`${attribute?.name}: ${attribute?.value}`}
                </Typography>
              ))}
            </Stack>
          </ListItem>
          {!!FinancialTransactionMessage.number && (
            <Box mt={6} px={4}>
              <Typography variant="body2">
                {`${shoppingCartItem?.quantity?.toLocaleString()} ${formatMessage(
                  FinancialTransactionMessage.number,
                )}`}
              </Typography>
            </Box>
          )}
        </Grid>
        <Grid item xs={12} sm={3}>
          <List aria-label="contacts">
            {shoppingCartItem?.totalFinalPrice !== shoppingCartItem?.totalOriginalPrice && (
              <ListItem disablePadding>
                <ListItemText sx={{ color: 'grey.500', textDecoration: 'line-through' }}>
                  {shoppingCartItem?.totalOriginalPrice
                    ? `${shoppingCartItem?.totalOriginalPrice.toLocaleString()} ${defaultCurrencyTitle}`
                    : ''}
                </ListItemText>
              </ListItem>
            )}
            <ListItem disablePadding>
              <ListItemText>
                {shoppingCartItem?.totalFinalPrice
                  ? `${shoppingCartItem?.totalFinalPrice.toLocaleString()} ${defaultCurrencyTitle}`
                  : ''}
              </ListItemText>
            </ListItem>
            <ListItem disablePadding>
              <ListItemText>
                <Box display={'flex'}>
                  <Typography pr={1} variant={'body2'}>
                    {`${formatMessage(FinancialTransactionMessage.delivery)}`}
                  </Typography>
                  <Typography variant={'body2'} sx={{ color: 'grey.500' }}>
                    {`${convertDateToPersian(shoppingCartItem?.shipmentDeliveryDate!)}`}
                  </Typography>
                </Box>
              </ListItemText>
            </ListItem>
            <ListItem disablePadding>
              <ListItemText>
                <Box display={'flex'}>
                  <Typography pr={1} variant={'body2'}>
                    {`${formatMessage(FinancialTransactionMessage.range)}`}
                  </Typography>
                  <Typography variant={'body2'} sx={{ color: 'grey.500' }}>
                    {`${convertDateToPersian(shoppingCartItem?.shipmentDeliveryFromHour!)} -
                      ${convertDateToPersian(shoppingCartItem?.shipmentDeliveryToHour!)}`}
                  </Typography>
                </Box>
              </ListItemText>
            </ListItem>
          </List>
        </Grid>
      </>
    )
  }

  return (
    <Grid container item xs={12} sm={12}>
      {createFields()}
    </Grid>
  )
}

export default ShipmentItems
