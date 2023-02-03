import { generalDataApi } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'

export const enhancedApiWithTags = generalDataApi.enhanceEndpoints({
  addTagTypes: ['collection'],
  endpoints: {
    getAdminGeneralDataCollectionById: {
      providesTags: ['collection'],
    },
    postAdminGeneralDataCollection: {
      invalidatesTags: ['collection'],
    },
    putAdminGeneralDataCollectionById: {
      invalidatesTags: ['collection'],
    },
  },
})

export const {
  useGetAdminGeneralDataCollectionByIdQuery,
  usePostAdminGeneralDataCollectionMutation,
  usePutAdminGeneralDataCollectionByIdMutation,
} = enhancedApiWithTags
