import { CreateAddressDialog } from '@hasty-bazar-commerce/containers'
import { IAddressModel } from '@hasty-bazar-commerce/containers/Address/CreateAddressForm'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import {
  AddressAsDefaultResultApiResult,
  useDeleteWebIdrCustomersByIdAddressAndAddressIdMutation,
  useGetWebIdrCustomersByIdAddressQuery,
  usePutWebIdrCustomersByIdAddressAndAddressIdDefaultMutation,
} from '@hasty-bazar-commerce/services/idrApi.generated'
import { HBButton, HBDialog, HBIcon, HBLoading, HBToast } from '@hasty-bazar/core'
import { RadioGroup, Stack, Theme, Typography, useMediaQuery } from '@mui/material'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import addressesMessages from './addresses.messages'
import { AddressItem } from './containers'

export type ShowTostType = {
  open: boolean
  message: string
  type?: 'error' | 'success'
}

const AddressManagment = () => {
  const { formatMessage } = useIntl()
  const breakpointDownSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const [openCreateDialog, setOpenCreateDialog] = useState<boolean>(false)
  const [activeAddress, setActiveAddress] = useState<string>('')
  const [address, setAddress] = useState<IAddressModel>()
  const [showTost, setShowToast] = useState<ShowTostType>({ open: false, message: '' })
  const { data } = useSession()
  const [deleteAddressMutate, { isLoading }] =
    useDeleteWebIdrCustomersByIdAddressAndAddressIdMutation()
  const [defaultAddressMutate] = usePutWebIdrCustomersByIdAddressAndAddressIdDefaultMutation()
  const [dialog, setDialog] = useState<'default' | 'confirmation' | ''>('')
  const [removingAddress, setRemovingAddress] = useState<string>('')

  const {
    data: adderessData,
    refetch,
    isFetching,
  } = useGetWebIdrCustomersByIdAddressQuery(
    {
      ...ApiConstants,
      id: data?.user?.partyRoleId ?? '',
    },
    { skip: !data?.user?.partyRoleId },
  )

  useEffect(() => {
    if (data?.user && !adderessData) refetch()
  }, [data, adderessData, refetch])

  useEffect(() => {
    if (adderessData?.data?.items)
      setActiveAddress(adderessData.data!.items!.find((_) => _.isDefault)?.id || '')
  }, [adderessData])

  const handleChangeDefault = (event: React.ChangeEvent<HTMLInputElement>) => {
    setActiveAddress((event.target as HTMLInputElement).value)
    defaultAddressMutate({
      ...ApiConstants,
      id: data!.user!.partyRoleId,
      addressId: (event.target as HTMLInputElement).value,
    }).then((res: { data: AddressAsDefaultResultApiResult }) => {
      if (res?.data?.success)
        setShowToast({
          message: formatMessage(addressesMessages.addressStatusChangedToDefaultSuccessfuly),
          open: true,
          type: 'success',
        })
    })
  }

  const handleRemoveAddress = (id: string) => {
    if (activeAddress === id) {
      setDialog('default')
    } else {
      setRemovingAddress(id)
      setDialog('confirmation')
    }
  }

  const sendRemoveRequest = () => {
    deleteAddressMutate({
      ...ApiConstants,
      addressId: removingAddress,
      id: data!.user!.partyRoleId,
    })
      .unwrap()
      .then((res) => {
        setShowToast({
          message: formatMessage(addressesMessages.addressDeletedSuccessfully),
          open: true,
          type: 'success',
        })
        refetch()
        setDialog('')
      })
      .catch((err) => {
        setShowToast({
          message: formatMessage(addressesMessages.thereIsAProblem),
          open: true,
          type: 'error',
        })
        setDialog('')
      })
  }

  return (
    <Stack spacing={6}>
      <Stack
        sx={{
          width: '100%',
          bgcolor: 'grey.100',
          pr: 2,
          pl: 4,
          py: 2,
          borderRadius: 2,
        }}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography variant="subtitle1" color="text.primary">
          {formatMessage(addressesMessages.addresses)}
        </Typography>
        <HBButton
          onClick={() => setOpenCreateDialog(true)}
          sx={{ minWidth: { xs: 80, sm: 'initial' }, boxShadow: 'none' }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <HBIcon type="plus" />
            {!breakpointDownSm && (
              <Typography variant="button" color="background.paper">
                {formatMessage(addressesMessages.add)}
              </Typography>
            )}
          </Stack>
        </HBButton>
      </Stack>
      {isFetching ? (
        <HBLoading />
      ) : (
        <RadioGroup value={activeAddress} onChange={handleChangeDefault}>
          <Stack spacing={8}>
            {adderessData?.data?.items?.map((address) => (
              <AddressItem
                key={address.id}
                address={{
                  id: address.id!,
                  title: address.title!,
                  mainText: `${address.prefixAddress} ${
                    address.streetLine! ? `, ${address.streetLine}` : ''
                  }`,
                  phoneNumber: address.recipientMobileNo ?? '',
                  postalCode: address.postalCode!,
                  plaque: address.plaque!,
                  username: address.recipientName ?? '',
                  district: address.district ?? '',
                  unit: address.unit?.toString() ?? '',
                }}
                longitude={address.longitude}
                latitude={address.latitude}
                onRemove={() => handleRemoveAddress(address.id!)}
                onEdit={() => {
                  setAddress({ ...address, unit: address?.unit!.toString() })
                  setOpenCreateDialog(true)
                }}
                checked={address.id === activeAddress}
              />
            ))}
          </Stack>
        </RadioGroup>
      )}
      {openCreateDialog && (
        <CreateAddressDialog
          address={address}
          open={openCreateDialog}
          onClose={() => {
            setOpenCreateDialog(false)
            setAddress(undefined)
          }}
          onUpdateAddresses={refetch}
        />
      )}
      <HBToast
        open={showTost.open}
        message={showTost.message}
        type={showTost?.type || 'error'}
        vertical="top"
        autoHideDuration={6000}
        onClose={() => setShowToast({ open: false, message: '', type: showTost?.type })}
      />

      <HBDialog
        open={dialog === 'default'}
        onClose={() => setDialog('')}
        acceptBtn={formatMessage(addressesMessages.iGerIt)}
        onAccept={() => setDialog('')}
        title={formatMessage(addressesMessages.youCantDeleteDefaultAccount)}
        onReject={() => setDialog('')}
      />

      <HBDialog
        open={dialog === 'confirmation'}
        onClose={() => setDialog('')}
        acceptBtn={formatMessage(addressesMessages.yes)}
        rejectBtn={formatMessage(addressesMessages.no)}
        onAccept={() => sendRemoveRequest()}
        title={formatMessage(addressesMessages.areYouSureToDeleteThisAccount)}
        onReject={() => setDialog('')}
        loading={isLoading}
      />
    </Stack>
  )
}

export default AddressManagment
