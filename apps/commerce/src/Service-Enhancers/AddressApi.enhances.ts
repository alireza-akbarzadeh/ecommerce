import { idrApi } from '@hasty-bazar-commerce/services/idrApi.generated'

export const enhancedApiWithTags = idrApi.enhanceEndpoints({
  addTagTypes: ['changeActive', 'addNew', 'updateAddress'],
  endpoints: {
    getWebIdrCustomersByIdAddress: {
      providesTags: ['addNew', 'changeActive', 'updateAddress'],
    },
    putWebIdrCustomersByIdAddressAndAddressIdDefault: {
      invalidatesTags: ['changeActive'],
    },
    postWebIdrCustomersByIdAddress: {
      invalidatesTags: ['addNew'],
    },
    putWebIdrCustomersByIdAddressAndAddressId: {
      invalidatesTags: ['updateAddress'],
    },
  },
})

export const {
  usePutWebIdrCustomersByIdAddressAndAddressIdDefaultMutation,
  useGetWebIdrCustomersByIdAddressQuery,
  usePostWebIdrCustomersByIdAddressMutation,
  usePutWebIdrCustomersByIdAddressAndAddressIdMutation,
} = enhancedApiWithTags
