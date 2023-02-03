import {
  GetAddressModel,
  GetAddressModelGetQueryResultApiResult,
  useGetWebIdrCustomersByIdAddressQuery,
} from '@hasty-bazar-commerce/services/idrApi.generated'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { ApiConstants } from '../constants'

const useGetUserAddress = () => {
  const { data: userData } = useSession()
  const [activeAddress, setActiveAddress] = useState<GetAddressModel | null>(null)
  const [addressData, setAddressData] = useState<GetAddressModelGetQueryResultApiResult | null>(
    null,
  )

  const { data, isFetching, isLoading, isError } = useGetWebIdrCustomersByIdAddressQuery(
    {
      ...ApiConstants,
      id: userData?.user?.partyRoleId! as any,
    },
    { skip: !userData?.user?.partyRoleId },
  )

  useEffect(() => {
    if (data) {
      setAddressData(data)
      const activeAddress = data.data?.items?.find((i) => i.isDefault)
      if (activeAddress) {
        setActiveAddress(activeAddress)
      }
    }
  }, [data])

  return { activeAddress, addressData, isFetching, isLoading, isError }
}

export default useGetUserAddress
