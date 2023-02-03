import { CreateAddressDialog } from '@hasty-bazar-commerce/containers'
import { IAddressModel } from '@hasty-bazar-commerce/containers/Address/CreateAddressForm'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { usePutWebIdrCustomersByIdAddressAndAddressIdDefaultMutation } from '@hasty-bazar-commerce/Service-Enhancers/AddressApi.enhances'
import { Stack, Typography } from '@mui/material'
import { useSession } from 'next-auth/react'
import { FC, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import CheckoutPageMessages from '../../CheckoutPage.messages'
import { SectionItemWrapper } from '../../CheckoutPage.style'
import ActiveAddress from './ActiveAddress'
import ChooseAddressDialog from './ChooseAddressDialog'

const DeliveryAddress: FC<{ readonlyAddress?: boolean }> = ({ readonlyAddress }) => {
  const [openCreateDialog, setOpenCreateDialog] = useState<boolean>(false)
  const [openAddressesDialog, setOpenAddressesDialog] = useState<boolean>(false)
  const [editingAddress, setEditingAddress] = useState<IAddressModel>({})
  const [defaultAddressMutate] = usePutWebIdrCustomersByIdAddressAndAddressIdDefaultMutation()
  const { data } = useSession()

  const changeDefault = async (addressId: string) => {
    await defaultAddressMutate({
      ...ApiConstants,
      id: data?.user?.partyRoleId!,
      addressId,
    }).unwrap()
  }

  return (
    <SectionItemWrapper>
      <Stack spacing={4}>
        <Typography variant="h4">
          <FormattedMessage {...CheckoutPageMessages.deliveryAddress} />
        </Typography>

        <ActiveAddress
          onEdit={(address) => {
            setEditingAddress({ ...address, unit: address.unit?.toString() })
            setOpenCreateDialog(true)
          }}
          setOpenAddressesDialog={() => setOpenAddressesDialog(true)}
          setOpenCreateDialog={() => setOpenCreateDialog(true)}
          readonlyAddress={readonlyAddress}
        />
      </Stack>
      {openCreateDialog && (
        <CreateAddressDialog
          address={editingAddress}
          open={openCreateDialog}
          onClose={() => {
            setEditingAddress({})
            setOpenCreateDialog(false)
          }}
          onChangeDefaultAddress={changeDefault}
        />
      )}

      {openAddressesDialog && (
        <ChooseAddressDialog
          onClose={() => setOpenAddressesDialog(false)}
          open={openAddressesDialog}
        />
      )}
    </SectionItemWrapper>
  )
}

export default DeliveryAddress
