import { paymentApi } from '@hasty-bazar/admin-shared/services/paymentApi.generated'

export const enhancedApiWithTags = paymentApi.enhanceEndpoints({
  addTagTypes: ['payment'],
  endpoints: {
    getAdminPaymentPaymentMethodGetAll: {
      providesTags: ['payment'],
    },
    getAdminPaymentPaymentProviderById: {
      providesTags: ['payment'],
    },
    postAdminPaymentPaymentProvider: {
      invalidatesTags: ['payment'],
    },
    putAdminPaymentPaymentProviderById: {
      invalidatesTags: ['payment'],
    },
    deleteAdminPaymentPaymentProviderById: {
      invalidatesTags: ['payment'],
    },
  },
})

export const {
  useGetAdminPaymentPaymentMethodGetAllQuery,
  useGetAdminPaymentPaymentProviderByIdQuery,
  usePostAdminPaymentPaymentProviderMutation,
  usePutAdminPaymentPaymentProviderByIdMutation,
  useDeleteAdminPaymentPaymentProviderByIdMutation,
} = enhancedApiWithTags
