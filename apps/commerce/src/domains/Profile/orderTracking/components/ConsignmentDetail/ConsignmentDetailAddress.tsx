import AddressInfo, {
  AddressInfoClasses,
} from '@hasty-bazar-commerce/components/Address/AddressInfo'
import { HBMap } from '@hasty-bazar-commerce/containers/HBMap'
import { Box, Grid, Stack, styled, Typography } from '@mui/material'
import { isNil } from 'ramda'
import { FC, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import OrderTrackingMessages from '../../orderTracking.messages'
import { OrderTrackingDetailWrappers } from '../../OrderTracking.styles'
import ConsignmentMapDialog from './ConsignmentMapDialog'

const AddressInfoStyle = styled(Box)(({ theme }) => ({
  [`& .${AddressInfoClasses.iconWrapper}`]: {
    color: `${theme.palette.grey[500]}!important`,
  },
  [`& .${AddressInfoClasses.text}`]: {
    color: theme.palette.text.secondary,
  },
}))

const AddressInfoSpacing = 2

interface IConsignmentDetailAddressProps {
  name?: string | null
  address?: string | null
  username?: string | null
  postalCode?: string | null
  mobileNumber?: string | null
  lat?: number | null
  lng?: number | null
  plaque?: string | null
  district?: string | null
  unit?: number | null
}

const ConsignmentDetailAddress: FC<IConsignmentDetailAddressProps> = (props) => {
  const { name, address, username, postalCode, mobileNumber, lat, lng, plaque, district, unit } =
    props
  const [openMapDialog, setOpenMapDialog] = useState<boolean>(false)
  const { formatMessage } = useIntl()
  return (
    <OrderTrackingDetailWrappers
      direction="row"
      spacing={13.5}
      alignItems="flex-end"
      justifyContent="space-between"
    >
      <Grid container alignItems="center" mb={2}>
        <Grid item xs={12} sm={12} md={12}>
          <Stack sx={{ flex: 1, overflow: 'hidden' }} spacing={4}>
            <Typography variant="h4">
              <FormattedMessage {...OrderTrackingMessages.deliveryAddress} />
            </Typography>

            <>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="h6" color="text.primary">
                  {name}
                </Typography>
              </Stack>
              {address && plaque && (
                <AddressInfoStyle>
                  <AddressInfo
                    spacing={AddressInfoSpacing}
                    icon="locationPoint"
                    text={formatMessage(
                      { ...OrderTrackingMessages.fullAddress },
                      {
                        mainAddress: (
                          <Typography
                            variant="subtitle2"
                            sx={{ direction: 'initial', display: 'inline-flex' }}
                          >
                            {address}
                          </Typography>
                        ),
                        plaque,
                        district,
                        unit,
                      },
                    )}
                  />
                </AddressInfoStyle>
              )}
            </>
          </Stack>
        </Grid>

        <Grid item xs={12} sm={7} md={7}>
          <Stack sx={{ flex: 1, overflow: 'hidden' }} spacing={4} mb={2}>
            {!!username && (
              <AddressInfoStyle mt={4}>
                <AddressInfo spacing={AddressInfoSpacing} text={username} icon="user" />
              </AddressInfoStyle>
            )}

            {!!postalCode && (
              <AddressInfoStyle>
                <AddressInfo spacing={AddressInfoSpacing} icon="mailboxAlt" text={postalCode} />
              </AddressInfoStyle>
            )}

            {!!mobileNumber && (
              <AddressInfoStyle>
                <AddressInfo
                  spacing={AddressInfoSpacing}
                  text={mobileNumber}
                  icon="mobileAndroid"
                />
              </AddressInfoStyle>
            )}
          </Stack>
        </Grid>
        {!isNil(lat) && !isNil(lng) && (
          <Grid item xs={12} sm={5} md={5}>
            <Box
              onClick={() => {
                setOpenMapDialog(true)
              }}
              sx={{ overflow: 'hidden', borderRadius: 4, width: '100%', height: 150 }}
            >
              <HBMap
                sx={{ height: '100%', width: '100%' }}
                hasZoomBox={false}
                center={[lat, lng]}
              />
            </Box>
          </Grid>
        )}
      </Grid>
      <ConsignmentMapDialog
        open={openMapDialog}
        position={[lat!, lng!]}
        setClose={() => setOpenMapDialog(false)}
        title={name ?? ''}
      />
    </OrderTrackingDetailWrappers>
  )
}

export default ConsignmentDetailAddress
