import { useGetWebSaleBasketByClientSessionIdBasketMinimalQuery } from '@hasty-bazar-commerce/Service-Enhancers/BasketApi.enhanced'
import { BasketSubjectFuncs } from '@hasty-bazar-commerce/subjects/BasketSubjects'
import { useEffect, useMemo } from 'react'
import { ApiConstants } from '../constants'
import useClientSession from './useClientSession'

const useGetMinimal = () => {
  const clientSessionId = useClientSession()

  const {
    data: minimalData,
    refetch,
    isFetching,
  } = useGetWebSaleBasketByClientSessionIdBasketMinimalQuery(
    {
      ...ApiConstants,
      clientSessionId: clientSessionId!,
    },
    { skip: !clientSessionId },
  )

  useEffect(() => {
    const channel = new BroadcastChannel(process.env.HASTI_BROADCAST_NAME!)
    channel.addEventListener('message', () => {
      if (!!document && !document.hasFocus()) {
        refetch()
      }
    })
    return () => {
      channel.close()
    }
  }, [])

  useEffect(() => {
    const subscrition = BasketSubjectFuncs.getSignOut().subscribe((res) => {
      refetch()
    })

    return () => {
      subscrition.unsubscribe()
    }
  }, [])

  const memorizedValue = useMemo(() => {
    return { data: minimalData?.data, refetch, minimaloading: isFetching }
  }, [minimalData, isFetching])

  return memorizedValue
}

export default useGetMinimal
