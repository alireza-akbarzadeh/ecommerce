import userPageMessages from '@hasty-bazar-admin/domains/Users/UserPage.messages'
import {
  GetVendorAddressQueryResult,
  RoleResult,
  usePutAdminIdrVendorsByIdAddressAndAddressIdDefaultMutation,
} from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { HBAutoComplete, HBTextField } from '@hasty-bazar/core'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'

type AddressSelectItemProps = {
  addressData: GetVendorAddressQueryResult[] | null
  detailsRole: RoleResult
}

const AddressSelectItem = ({ addressData, detailsRole }: AddressSelectItemProps) => {
  const { formatMessage } = useIntl()

  const [defaultAddress, setDefaultAddress] = useState<GetVendorAddressQueryResult | null>(null)

  const [updateDefaultAddress, { reset: resetUpdate }] =
    usePutAdminIdrVendorsByIdAddressAndAddressIdDefaultMutation()

  const handleChangeDefaultAddress = (
    event: React.SyntheticEvent<Element, Event>,
    newValue: GetVendorAddressQueryResult,
  ) => {
    setDefaultAddress(newValue)
    resetUpdate()
    newValue?.id &&
      updateDefaultAddress({
        'client-name': 'change-default-address',
        'client-version': '1.0.0',
        addressId: newValue.id,
        id: detailsRole.partyRoleId || '',
      })
  }

  useEffect(() => {
    if (addressData?.length) {
      const selected = addressData?.find((item: any) => item?.isDefault) || null
      setDefaultAddress(selected)
    }
  }, [addressData?.length])

  return (
    <HBAutoComplete
      renderInput={(params) => (
        <HBTextField {...params} label={formatMessage(userPageMessages.defaultAddress)} />
      )}
      //@ts-ignore
      getOptionLabel={(option) => option.streetLine}
      options={addressData || []}
      sx={{ minWidth: 160 }}
      value={defaultAddress}
      onChange={handleChangeDefaultAddress}
    />
  )
}
export default AddressSelectItem
