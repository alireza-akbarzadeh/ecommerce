import { localityApi } from '@hasty-bazar/admin-shared/services/localityApi.generated'

export const enhancedApiWithTags = localityApi.enhanceEndpoints({
  addTagTypes: ['localityApi'],
  endpoints: {
    getAdminLocalityGeos: {
      providesTags: ['localityApi'],
    },
    postAdminLocalityGeos: {
      invalidatesTags: ['localityApi'],
    },
    putAdminLocalityGeosById: {
      invalidatesTags: ['localityApi'],
    },
    deleteAdminLocalityGeosById: {
      invalidatesTags: ['localityApi'],
    },
  },
})

export const {
  useGetAdminLocalityGeosByIdQuery,
  usePutAdminLocalityGeosByIdMutation,
  useDeleteAdminLocalityGeosByIdMutation,
  useGetAdminLocalityGeosQuery,
  usePostAdminLocalityGeosMutation,
  useGetAdminLocalityGeosSearchTitleQuery,
  useGetAdminLocalityGeoOptionsByIdQuery,
  useGetAdminLocalityGeoOptionsQuery,
} = enhancedApiWithTags
