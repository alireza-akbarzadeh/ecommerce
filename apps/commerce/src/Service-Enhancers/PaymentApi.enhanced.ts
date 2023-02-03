import { paymentApi } from '@hasty-bazar-commerce/services/paymentApi.generated'

export const enhancedApiWithTags = paymentApi.enhanceEndpoints({
  addTagTypes: ['withdraw'],
  endpoints: {
    getWebPaymentWalletBalance: {
      providesTags: ['withdraw'],
    },
    postWebPaymentWalletWithdraw: {
      invalidatesTags: ['withdraw'],
    },
  },
})

export const { usePostWebPaymentWalletWithdrawMutation, useGetWebPaymentWalletBalanceQuery } =
  enhancedApiWithTags
