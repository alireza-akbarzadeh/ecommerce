import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { AddressItem } from '@hasty-bazar-commerce/domains/Profile/addressManagment'
import {
  useGetWebIdrCustomersByIdAddressQuery,
  usePutWebIdrCustomersByIdAddressAndAddressIdDefaultMutation,
} from '@hasty-bazar-commerce/Service-Enhancers/AddressApi.enhances'
import { HBDialog, HBDivider } from '@hasty-bazar/core'
import { RadioGroup, Stack } from '@mui/material'
import { useSession } from 'next-auth/react'
import { FC, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import CheckoutPageMessages from '../../CheckoutPage.messages'

interface IChooseAddressDialog {
  open: boolean
  onClose: () => void
  addNewAddress?: () => void
}

const ChooseAddressDialog: FC<IChooseAddressDialog> = (props) => {
  const { onClose, open } = props
  const { formatMessage } = useIntl()
  const { data } = useSession()
  const [activeAddress, setActiveAddress] = useState<string>('')
  const [defaultAddressMutate] = usePutWebIdrCustomersByIdAddressAndAddressIdDefaultMutation()

  const { data: adderessData } = useGetWebIdrCustomersByIdAddressQuery(
    {
      ...ApiConstants,
      id: data!.user!.partyRoleId!,
    },
    { skip: !data?.user?.partyRoleId },
  )

  useEffect(() => {
    if (adderessData?.data?.items)
      setActiveAddress(adderessData!.data!.items!.find((_) => _.isDefault)!.id!)
  }, [adderessData])

  const handleChangeDefault = (event: React.ChangeEvent<HTMLInputElement>) => {
    setActiveAddress((event.target as HTMLInputElement).value)
    defaultAddressMutate({
      ...ApiConstants,
      id: data!.user!.partyRoleId!,
      addressId: (event.target as HTMLInputElement).value,
    })
  }

  return (
    <HBDialog
      maxWidth="sm"
      fullWidth
      title={formatMessage(CheckoutPageMessages.chooseAddress)}
      onReject={() => onClose()}
      onBackdropClick={() => onClose()}
      content={
        <RadioGroup value={activeAddress} onChange={handleChangeDefault}>
          <Stack spacing={2} pr={{ xs: 4, sm: 0 }} divider={<HBDivider />}>
            {adderessData?.data?.items?.map((address) => (
              <AddressItem
                key={address.id}
                address={{
                  id: address.id!,
                  title: address.title!,
                  mainText: address.prefixAddress! + `${address.streetLine! ?? ''}` ?? '',
                  phoneNumber: address.recipientMobileNo ?? '',
                  postalCode: address.postalCode!,
                  plaque: address.plaque!,
                  username: address.recipientName ?? '',
                  district: address.district ?? '',
                  unit: address.unit?.toString() ?? '',
                }}
                longitude={address.longitude}
                latitude={address.latitude}
                checked={address.isDefault ?? false}
                hideMap
                unchangeable
              />
            ))}
          </Stack>
        </RadioGroup>
      }
      open={open}
      onClose={() => onClose()}
    />
  )
}

export default ChooseAddressDialog
