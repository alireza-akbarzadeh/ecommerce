import { IAddressModel } from '@hasty-bazar-commerce/containers/Address/CreateAddressForm'
import { HBMap } from '@hasty-bazar-commerce/containers/HBMap'
import { FC, useState } from 'react'
import { useFormContext } from 'react-hook-form'

interface IAddressMapProps {
  loadingChanged: (loading: boolean) => void
  fetchCompleted: (status: boolean) => void
}

const AddressMap: FC<IAddressMapProps> = ({ fetchCompleted, loadingChanged }) => {
  const { setValue, watch, reset, getValues } = useFormContext<IAddressModel>()
  const [address, setAddress] = useState('')

  const getCenterMap = (): [number, number] | undefined => {
    if (watch('latitude') && watch('longitude')) {
      return [watch('latitude') ?? 0, watch('longitude') ?? 0]
    } else {
      return undefined
    }
  }

  return (
    <HBMap
      sx={{ height: '100%' }}
      center={getCenterMap()}
      onClick={(val) => {
        setValue('longitude', val?.lng)
        setValue('latitude', val?.lat)
      }}
      isShowSearch
      addressFetchCallback={(value) => {
        if (typeof value !== 'boolean') {
          const addressDescriptionArr = value.address.split('،')
          const addressShortDescription = addressDescriptionArr.slice(-2)
          setAddress(`${addressShortDescription.join('،')}`)
          reset({
            ...getValues(),
            prefixAddress: value.address,
            cityId: value.cityId,
            provinceId: value.provinceId,
          })
          fetchCompleted(true)
        } else {
          fetchCompleted(false)
        }
      }}
      isLoading={loadingChanged}
      hasPopupMessage={address !== ''}
      popupMessage={address}
    />
  )
}

export default AddressMap
