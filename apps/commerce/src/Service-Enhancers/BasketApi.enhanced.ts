import { saleApi } from '@hasty-bazar-commerce/services/saleApi.generated'

export const enhancedApiWithTags = saleApi.enhanceEndpoints({
  addTagTypes: [
    'addToBasket',
    'changeQuantity',
    'removeProduct',
    'removeAll',
    'removeVendorItems',
    'toShipping',
    'addByList',
    'decrease',
    'addVoucher',
    'removeVoucher',
    'refreshBasket',
  ],
  endpoints: {
    getWebSaleBasketByClientSessionIdBasketMinimal: {
      providesTags: [
        'addToBasket',
        'changeQuantity',
        'removeProduct',
        'removeAll',
        'removeVendorItems',
        'toShipping',
        'addByList',
        'decrease',
      ],
    },
    postWebSaleBasketByClientSessionIdItems: {
      invalidatesTags: ['addToBasket'],
    },
    postWebSaleBasketByClientSessionIdDecreaseItems: {
      invalidatesTags: ['decrease'],
    },
    getWebSaleBasketByClientSessionIdBasket: {
      providesTags: [
        'addToBasket',
        'changeQuantity',
        'removeProduct',
        'removeAll',
        'removeVendorItems',
        'toShipping',
        'addByList',
        'decrease',
        'addVoucher',
        'removeVoucher',
        'refreshBasket',
      ],
    },
    deleteWebSaleBasketByClientSessionIdItems: {
      invalidatesTags: ['removeProduct'],
    },
    deleteWebSaleBasketByClientSessionIdVendorAndVendorIdRelated: {
      invalidatesTags: ['removeVendorItems'],
    },
    deleteWebSaleBasketByClientSessionIdItemsAndShoppingCartProductId: {
      invalidatesTags: ['removeProduct'],
    },
    putWebSaleBasketByClientSessionIdAndProductIdItemsQuantity: {
      invalidatesTags: ['changeQuantity'],
    },
    postWebSaleBasketByClientSessionIdItemsProducts: {
      invalidatesTags: ['addToBasket'],
    },
    putWebSaleBasketVoucher: {
      invalidatesTags: ['addVoucher'],
    },
    deleteWebSaleBasketVoucher: {
      invalidatesTags: ['removeVoucher'],
    },
    postWebSaleOrderDeleteOrderCheckInBasket: {
      invalidatesTags: ['refreshBasket'],
    },
  },
})

export const {
  useGetWebSaleBasketByClientSessionIdBasketMinimalQuery,
  usePostWebSaleBasketByClientSessionIdItemsMutation,
  usePostWebSaleBasketByClientSessionIdDecreaseItemsMutation,
  useGetWebSaleBasketByClientSessionIdBasketQuery,
  useDeleteWebSaleBasketByClientSessionIdItemsMutation,
  useDeleteWebSaleBasketByClientSessionIdVendorAndVendorIdRelatedMutation,
  useDeleteWebSaleBasketByClientSessionIdItemsAndShoppingCartProductIdMutation,
  usePutWebSaleBasketByClientSessionIdAndProductIdItemsQuantityMutation,
  usePostWebSaleBasketByClientSessionIdItemsProductsMutation,
  usePutWebSaleBasketVoucherMutation,
  useDeleteWebSaleBasketVoucherMutation,
  usePostWebSaleOrderDeleteOrderCheckInBasketMutation,
} = enhancedApiWithTags
