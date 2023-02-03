import useClientSession from '@hasty-bazar-commerce/core/hook/useClientSession'
import useGetMinimal from '@hasty-bazar-commerce/core/hook/useGetMinimal'
import {
  usePostWebSaleBasketByClientSessionIdDecreaseItemsMutation,
  usePostWebSaleBasketByClientSessionIdItemsMutation,
} from '@hasty-bazar-commerce/Service-Enhancers/BasketApi.enhanced'

import { useMemo } from 'react'
import { ApiConstants } from '../constants'

interface useBasketMethodsArgs {
  productId: string
  vendorId?: string | null
  coefficient: number
}

const useBasketMethods = (props: useBasketMethodsArgs) => {
  const { productId, vendorId } = props

  const clientSessionId = useClientSession()
  const [addToBasketMutation, { isLoading: addingLoading, error: addToBasketError }] =
    usePostWebSaleBasketByClientSessionIdItemsMutation()

  const [decreaseMutation, { isLoading: decreasingLoading, error: decreasingError }] =
    usePostWebSaleBasketByClientSessionIdDecreaseItemsMutation()

  const { data: minimalBasket, minimaloading } = useGetMinimal()

  const { count, product } = useMemo(() => {
    if (vendorId) {
      const product = minimalBasket?.vendors
        ?.find((vendor) => vendor.vendorId === vendorId)
        ?.items?.find((product) => product.productId === productId)
      const count = product?.shoppingCartQuantity || 0
      return { product, count }
    }
    const products = minimalBasket?.vendors?.flatMap((vendor) => vendor.items)
    const product = products?.find((product) => product?.productId === productId) || {}

    const productFromDifferentVendors =
      products?.filter((product) => product?.productId === productId) || []
    if (productFromDifferentVendors?.length > 1) {
      const count =
        productFromDifferentVendors
          ?.map((product) => product?.shoppingCartQuantity)
          ?.reduce((a, b) => (a || 0) + (b || 0), 0) || 0
      return {
        product,
        count,
      }
    }
    const count = product?.shoppingCartQuantity || 0

    return { product, count }
  }, [minimalBasket, vendorId, productId])

  const handleMinus = () => {
    decreaseMutation({
      ...ApiConstants,
      clientSessionId: clientSessionId!,
      decreaseFromBasketModel: { productId },
    })
      .unwrap()
      .then((res) => {
        if (res.success) {
          const channel = new BroadcastChannel(process.env.HASTI_BROADCAST_NAME!)
          channel.postMessage(true)
        }
      })
  }

  const addToBasket = () => {
    addToBasketMutation({
      ...ApiConstants,
      clientSessionId: clientSessionId!,
      addToBasketModel: { productId },
    })
      .unwrap()
      .then((res) => {
        if (res.success) {
          const channel = new BroadcastChannel(process.env.HASTI_BROADCAST_NAME!)
          channel.postMessage(true)
        }
      })
  }

  return {
    count,
    handleMinus,
    addToBasket,
    addingLoading,
    product,
    decreasingLoading,
    minimaloading,
  }
}

export default useBasketMethods
