import { AddressInfo } from '@hasty-bazar-commerce/components'
import { HBMap } from '@hasty-bazar-commerce/containers/HBMap'
import { HBIcon, HBMenu, HBRadioButton } from '@hasty-bazar/core'
import { fontWeights } from '@hasty-bazar/material-provider'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { FC } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import addressesMessages from '../addresses.messages'

interface IAddress {
  title: string
  mainText: string
  postalCode: string
  phoneNumber: string
  mobileNumber?: string
  id: string | number
  plaque: string
  username: string
  district: string
  unit: string
}

interface IAddressItemProps {
  address: IAddress
  onRemove?: () => void
  onEdit?: () => void
  latitude?: number
  longitude?: number
  checked: boolean
  hideMap?: boolean
  unchangeable?: boolean
}

const AddressItem: FC<IAddressItemProps> = (props) => {
  const { formatMessage } = useIntl()
  const {
    address,
    onEdit,
    onRemove,
    latitude,
    longitude,
    checked,
    hideMap = false,
    unchangeable = false,
  } = props

  const { mainText, plaque, district, unit } = address

  return (
    <Stack>
      <Stack direction="row" justifyContent="space-between">
        <Stack direction="row" alignItems="center">
          <HBRadioButton value={address.id} checked={checked} sx={{ height: 'fit-content' }} />

          <Typography sx={{ userSelect: 'text' }} variant="subtitle1" color="text.primary">
            {address.title}
          </Typography>
        </Stack>
        {!unchangeable && (
          <HBMenu
            buttonProps={{ variant: 'text', sx: { p: 0, minWidth: 22 } }}
            content={<HBIcon type="ellipsisV" sx={{ color: 'grey.900' }} />}
            menuItemSx={{
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}
            menus={[
              {
                content: (
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ width: 152 }}>
                    <HBIcon type="edit" sx={{ color: 'common.black' }} />
                    <Typography variant="button" fontWeight={fontWeights.fontWeightRegular}>
                      {formatMessage(addressesMessages.edit)}
                    </Typography>
                  </Stack>
                ),
                onClick: () => {
                  if (onEdit) onEdit()
                },
              },
              {
                content: (
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ width: 152 }}>
                    <HBIcon type="trashAlt" sx={{ color: 'common.black' }} />
                    <Typography variant="button">
                      {formatMessage(addressesMessages.delete)}
                    </Typography>
                  </Stack>
                ),
                onClick: () => {
                  if (onRemove) onRemove()
                },
              },
            ]}
          />
        )}
      </Stack>
      <Grid container justifyContent="space-between">
        <Grid item xs={12} sm={9} md={9} lg={9} pl={10}>
          <Typography variant="subtitle1" color="text.primary" mb={2} sx={{ userSelect: 'text' }}>
            <FormattedMessage
              {...addressesMessages.fullAddress}
              values={{ mainAddress: mainText, plaque, district, unit }}
            />
          </Typography>
          <Box mb={4}>
            <AddressInfo text={address.postalCode} icon="mailboxAlt" />
          </Box>
          {address.mobileNumber && (
            <Box mb={4}>
              <AddressInfo text={address.mobileNumber} icon="mobileAndroid" />
            </Box>
          )}
          <Box mb={4}>
            <AddressInfo text={address.phoneNumber} icon="phone" />
          </Box>
          <Box mb={4}>
            <AddressInfo text={address.username} icon="user" />
          </Box>
        </Grid>
        <Grid item xs={12} sm={3} md={3} lg={3} container justifyContent="flex-end">
          {!!longitude && !hideMap && (
            <Box
              sx={{
                overflow: 'hidden',
                borderRadius: 4,
                width: { sm: 160, xs: '100%' },
                height: 160,
              }}
            >
              <HBMap
                sx={{ position: 'relative', height: '100%', width: '100%' }}
                hasZoomBox={false}
                center={[latitude ?? 0, longitude ?? 0]}
              />
            </Box>
          )}
        </Grid>
      </Grid>
    </Stack>
  )
}

export default AddressItem
