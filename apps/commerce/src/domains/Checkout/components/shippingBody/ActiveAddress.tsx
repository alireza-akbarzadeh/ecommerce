import AddressInfo, {
  AddressInfoClasses,
} from '@hasty-bazar-commerce/components/Address/AddressInfo'
import useGetUserAddress from '@hasty-bazar-commerce/core/hook/useGetUserAddress'
import addressesMessages from '@hasty-bazar-commerce/domains/Profile/addressManagment/addresses.messages'
import { GetAddressModel } from '@hasty-bazar-commerce/services/idrApi.generated'
import { HBButton, HBIcon, HBIconButton } from '@hasty-bazar/core'
import { Box, Stack, styled, Typography } from '@mui/material'
import Image from 'next/image'
import { FC } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import CheckoutPageMessages from '../../CheckoutPage.messages'

interface IActiveAddress {
  setOpenAddressesDialog: () => void
  setOpenCreateDialog: () => void
  onEdit: (address: GetAddressModel) => void
  readonlyAddress?: boolean
}

const AddressInfoStyle = styled(Box)(({ theme }) => ({
  [`& .${AddressInfoClasses.iconWrapper}`]: {
    color: `${theme.palette.grey[500]}!important`,
  },
  [`& .${AddressInfoClasses.text}`]: {
    color: theme.palette.text.secondary,
  },
}))

const ButtonStyle = styled(HBButton)(({ theme }) => ({
  alignItems: 'center',
  color: `${theme.palette.info.main}!important`,
  gap: theme.spacing(1),
  padding: 0,
  '&:disabled': {
    filter: 'grayscale(1)',
    opacity: 0.6,
    cursor: 'not-allowed',
    backgroundColor: 'transparent',
  },
}))

const ActiveAddress: FC<IActiveAddress> = (props) => {
  const { formatMessage } = useIntl()
  const { setOpenAddressesDialog, setOpenCreateDialog, onEdit, readonlyAddress } = props
  const { activeAddress, addressData } = useGetUserAddress()

  return (
    activeAddress && (
      <>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="subtitle1" color="text.primary">
            {activeAddress.title}
          </Typography>
          {!readonlyAddress && (
            <HBIconButton
              onClick={() => onEdit(activeAddress)}
              sx={{
                color: (theme) => `${theme.palette.info.main}!important`,
                backgroundColor: 'inherit!important',
                border: 'none',
              }}
              icon={<HBIcon type="editAlt" size="small" />}
            />
          )}
        </Stack>
        <AddressInfoStyle>
          <AddressInfo
            icon="locationPoint"
            text={formatMessage(
              { ...addressesMessages.fullAddress },
              {
                mainAddress: `${activeAddress.prefixAddress} ${activeAddress.streetLine}`,
                plaque: activeAddress.plaque,
                district: activeAddress.district,
                unit: activeAddress.unit,
              },
            )}
          />
        </AddressInfoStyle>
        <AddressInfoStyle>
          <AddressInfo icon="mailboxAlt" text={activeAddress.postalCode!.toString() ?? ''} />
        </AddressInfoStyle>
        <AddressInfoStyle>
          <AddressInfo
            text={activeAddress.recipientMobileNo!.toString() ?? ''}
            icon="mobileAndroid"
          />
        </AddressInfoStyle>
        <AddressInfoStyle>
          <AddressInfo text={activeAddress.recipientName ?? ''} icon="user" />
        </AddressInfoStyle>
        {!readonlyAddress && (
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            alignItems="flex-start"
            justifyContent="space-between"
          >
            <ButtonStyle
              variant="text"
              disabled={!(addressData?.data?.items && addressData?.data?.items.length > 1)}
              onClick={() => setOpenAddressesDialog()}
            >
              <Image src="/assets/svg/repeat.svg" width={22} height={22} />
              <Typography>
                <FormattedMessage
                  {...CheckoutPageMessages.changeAddressWithCount}
                  values={{
                    count: addressData?.data?.items
                      ? addressData?.data?.items.length.toString()
                      : '0',
                  }}
                />
              </Typography>
            </ButtonStyle>
            <ButtonStyle variant="text" onClick={() => setOpenCreateDialog()}>
              <HBIcon type="plus" size="small" />
              <Typography>
                <FormattedMessage {...CheckoutPageMessages.addNewAddress} />
              </Typography>
            </ButtonStyle>
          </Stack>
        )}
      </>
    )
  )
}

export default ActiveAddress
