import { useGetWebCatalogCommerceSavedVendorQuery } from '@hasty-bazar-commerce/Service-Enhancers/SavedApi.enhances'
import { useSession } from 'next-auth/react'
import { useMemo } from 'react'
import { ApiConstants } from '../constants'

const useGetSavedVendors = () => {
  const { data } = useSession()

  const { data: savedVendors, isFetching } = useGetWebCatalogCommerceSavedVendorQuery(
    {
      ...ApiConstants,
      partyId: data?.user?.partyId ? data?.user?.partyId : '0',
    },
    { skip: !data?.user?.partyId },
  )

  const memorizedValue = useMemo(() => {
    return { savedVendors: savedVendors?.data, loading: isFetching }
  }, [savedVendors])

  return memorizedValue
}

export default useGetSavedVendors
