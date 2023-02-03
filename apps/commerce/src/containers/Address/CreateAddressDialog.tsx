import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import {
  usePostWebIdrCustomersByIdAddressMutation,
  usePutWebIdrCustomersByIdAddressAndAddressIdMutation,
} from '@hasty-bazar-commerce/Service-Enhancers/AddressApi.enhances'
import { HBDialog, HBForm, HBToast } from '@hasty-bazar/core'
import { fontWeights } from '@hasty-bazar/material-provider'
import { dialogClasses, DialogProps, Typography } from '@mui/material'
import { useSession } from 'next-auth/react'
import { FC, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { ShowTostType } from '../../domains/Profile/addressManagment/AddressManagment'
import ContainersMessages from '../Containers.message'
import CreateAddressForm, { IAddressModel } from './CreateAddressForm'

interface ICreateAddressDialogProps extends Required<Pick<DialogProps, 'onClose' | 'open'>> {
  address?: IAddressModel
  onUpdateAddresses?: () => void
  onChangeDefaultAddress?: (addressId: string) => void
}

export const addressInitialValue: IAddressModel = { recipientName: '' }

const CreateAddressDialog: FC<ICreateAddressDialogProps> = (props) => {
  const {
    open,
    onClose,
    address = addressInitialValue,
    onUpdateAddresses,
    onChangeDefaultAddress,
  } = props
  const [showTost, setShowToast] = useState<ShowTostType>({ open: false, message: '' })
  const [addressViewMode, setAddressViewMode] = useState<'map' | 'form'>('map')
  const { data } = useSession()
  const [createAddress, { isLoading: createLoading }] = usePostWebIdrCustomersByIdAddressMutation()
  const [updateAddress, { isLoading: updateLoading }] =
    usePutWebIdrCustomersByIdAddressAndAddressIdMutation()

  const handleSubmit = (values: IAddressModel) => {
    const { id, isDefault, unit, recipientMobileNo, ...rest } = values
    if (addressViewMode === 'map') return
    if (!id) {
      createAddress({
        ...ApiConstants,
        id: data?.user?.partyRoleId as any,
        addAddressesModel: {
          ...rest,
          unit: +unit!,
          recipientMobileNo: `09${recipientMobileNo}`,
          isRecipient: rest.isRecipient ?? false,
        },
      })
        .unwrap()
        .then((response) => {
          if (response.success) {
            onClose({}, 'backdropClick')
            if (onUpdateAddresses) onUpdateAddresses()
            if (response.data?.addressId) onChangeDefaultAddress?.(response.data?.addressId)
          }
        })
    } else {
      updateAddress({
        ...ApiConstants,
        id: data?.user?.partyRoleId as any,
        addressId: id,
        updateAddressesModel: {
          ...rest,
          unit: +unit!,
          recipientMobileNo: `09${recipientMobileNo}`,
          isRecipient: rest.isRecipient ?? false,
        },
      })
        .unwrap()
        .then((response) => {
          if (response.success) {
            onClose({}, 'backdropClick')
            if (onUpdateAddresses) onUpdateAddresses()
          }
        })
    }
  }

  const handleClose = () => {
    onClose({}, 'backdropClick')
  }

  return (
    <>
      <HBDialog
        maxWidth="sm"
        fullWidth
        open={open}
        onClose={handleClose}
        sx={{
          [`& .${dialogClasses.paper}`]: {
            maxWidth: 800,
          },
        }}
        title={
          <Typography variant="h5" fontWeight={fontWeights.fontWeightBold}>
            <FormattedMessage
              {...ContainersMessages[
                address?.id
                  ? 'editAddressTitle'
                  : addressViewMode === 'map'
                  ? 'locationOfTheNewAddress'
                  : 'newAddressDetails'
              ]}
            />
          </Typography>
        }
        onReject={() => handleClose()}
        onBackdropClick={() => handleClose()}
      >
        <HBForm<IAddressModel> mode="all" onSubmit={handleSubmit} defaultValues={address}>
          <CreateAddressForm
            loading={createLoading || updateLoading}
            onClose={() => handleClose()}
            onAddressViewChange={(value: 'map' | 'form') => setAddressViewMode(value)}
          />
        </HBForm>
      </HBDialog>
      <HBToast
        open={showTost.open}
        message={showTost.message}
        type={showTost?.type || 'error'}
        vertical="top"
        horizontal="right"
        autoHideDuration={5000}
        onClose={() => setShowToast({ open: false, message: '', type: showTost?.type })}
      />
    </>
  )
}

export default CreateAddressDialog
