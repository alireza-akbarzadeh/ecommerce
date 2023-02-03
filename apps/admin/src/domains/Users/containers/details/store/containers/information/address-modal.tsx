import userPageMessages from '@hasty-bazar-admin/domains/Users/UserPage.messages'
import {
  RoleResult,
  usePostAdminIdrRolesByIdAddressMutation,
} from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { ResultModel } from '@hasty-bazar/admin-shared/services/localityApi.generated'
import { HBForm, openToast } from '@hasty-bazar/core'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import ModalAddressDetails from './modals/address-details'
import ModalAddressMap from './modals/address-map'

export type AddressModalType = {
  openAddressMapDialog: boolean
  setOpenAddressMapDialog: Dispatch<React.SetStateAction<boolean>>
  getModelMapCenter: () => [number, number] | undefined
  handleChangeLocation: (location: [number, number]) => void
  handleChangeLocationMap: () => void
  isAddOrEdit?: boolean
  openAddressDetailsDialog: boolean
  setOpenAddressDetailsDialog: Dispatch<SetStateAction<boolean>>
  currentLocation: [number, number]
  detailsRole: RoleResult
  addressDetails: any
  refetchAddress: () => void
  streetLineDetails: never[] | ResultModel
}

export type AddressDetailsFormDataType = {
  title: 'string'
  country: 'string'
  provinceId: 'string'
  cityId: 'string'
  district: 'string'
  streetLine: 'string'
  plaque: 'string'
  unit: number
  postalCode: 'string'
  latitude: number
  longitude: number
  isRecipient: boolean
  recipientName: 'string'
  recipientMobileNo: 'string'
  isDefault: boolean
}

const AddressModal = ({
  openAddressDetailsDialog,
  setOpenAddressDetailsDialog,
  setOpenAddressMapDialog,
  currentLocation,
  detailsRole,
  addressDetails,
  refetchAddress,
  openAddressMapDialog,
  getModelMapCenter,
  handleChangeLocation,
  handleChangeLocationMap,
  streetLineDetails,
}: AddressModalType) => {
  const { formatMessage } = useIntl()

  const formProviderProps = useForm<AddressDetailsFormDataType>({
    mode: 'all',
  })

  const [createAddress, { reset: resetUpdate }] = usePostAdminIdrRolesByIdAddressMutation()

  const handleSubmit = (values: AddressDetailsFormDataType) => {
    const body = {
      ...values,
      recipientMobileNo: '09000000000',
      recipientName: '--',
    }
    resetUpdate()
    createAddress({
      'client-name': 'create-address',
      'client-version': '1.0.0',
      id: detailsRole.partyRoleId || '',
      addPartyRoleAddressesModel: body,
    }).then((res) => {
      setOpenAddressDetailsDialog(false)
      refetchAddress()
      //@ts-ignore
      if (res?.data?.success) {
        openToast({ message: formatMessage(userPageMessages.saveAddressSuccess), type: 'success' })
      }
    })
  }

  useEffect(() => {
    if (addressDetails?.length) {
      addressDetails.map((item: any) => {
        switch (item.geoTypeValueCode) {
          case '1':
            formProviderProps.setValue('country', item.id || '')
            break
          case '2':
            formProviderProps.setValue('provinceId', item.id || '')
            break
          case '3':
            formProviderProps.setValue('cityId', item.id || '')
            break

          default:
            break
        }
      })
    } else {
      formProviderProps.reset({})
    }
  }, [addressDetails])

  return (
    <HBForm id="address" formProviderProps={formProviderProps} onSubmit={handleSubmit}>
      <ModalAddressMap
        getModelMapCenter={() => getModelMapCenter()}
        handleChangeLocation={handleChangeLocation}
        handleChangeLocationMap={handleChangeLocationMap}
        openAddressMapDialog={openAddressMapDialog}
        setOpenAddressMapDialog={setOpenAddressMapDialog}
      />
      <ModalAddressDetails
        openAddressDetailsDialog={openAddressDetailsDialog}
        setOpenAddressDetailsDialog={setOpenAddressDetailsDialog}
        setOpenAddressMapDialog={setOpenAddressMapDialog}
        currentLocation={currentLocation}
        streetLineDetails={streetLineDetails}
        onSubmit={handleSubmit}
      />
    </HBForm>
  )
}

export default AddressModal
