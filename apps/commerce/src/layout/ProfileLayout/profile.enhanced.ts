import { idrApi } from '@hasty-bazar-commerce/services/idrApi.generated'

export const enhancedApiWithTags = idrApi.enhanceEndpoints({
  addTagTypes: ['user'],
  endpoints: {
    getWebIdrCustomersByMobile: {
      providesTags: ['user'],
    },
    getWebIdrCustomersByIdIndividual: {
      providesTags: ['user'],
    },
    putWebIdrCustomersByIdIndividual: {
      invalidatesTags: ['user'],
    },
  },
})

export const {
  useGetWebIdrCustomersByMobileQuery,
  useLazyGetWebIdrCustomersByIdIndividualQuery,
  usePutWebIdrCustomersByIdIndividualMutation,
  usePutWebIdrPartiesByIdCheckNationalCodeMutation,
} = enhancedApiWithTags
