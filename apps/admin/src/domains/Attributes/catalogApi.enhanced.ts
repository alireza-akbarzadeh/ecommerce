import { catalogApi } from '@hasty-bazar/admin-shared/services/catalogApi.generated'

export const enhancedApiWithTags = catalogApi.enhanceEndpoints({
  addTagTypes: ['attributerValues', 'attributes', 'attribute'],
  endpoints: {
    getAdminCatalogApiAttributeValueGetAll: {
      providesTags: ['attributerValues'],
    },
    postAdminCatalogApiAttributeValue: {
      invalidatesTags: ['attributerValues'],
    },
    putAdminCatalogApiAttributeValueById: {
      invalidatesTags: ['attributerValues'],
    },
    deleteAdminCatalogApiAttributeValueById: {
      invalidatesTags: ['attributerValues'],
    },
    getAdminCatalogApiAttributeById: {
      providesTags: ['attribute'],
    },
    postAdminCatalogApiAttribute: {
      invalidatesTags: ['attribute'],
    },
    putAdminCatalogApiAttributeById: {
      invalidatesTags: ['attribute'],
    },
  },
})

export const {
  useGetAdminCatalogApiAttributeByIdQuery,
  usePutAdminCatalogApiAttributeByIdMutation,
  useDeleteAdminCatalogApiAttributeByIdMutation,
  useGetAdminCatalogApiAttributeGetAllQuery,
  usePostAdminCatalogApiAttributeMutation,
  useGetAdminCatalogApiAttributeValueByIdQuery,
  usePutAdminCatalogApiAttributeValueByIdMutation,
  useDeleteAdminCatalogApiAttributeValueByIdMutation,
  useGetAdminCatalogApiAttributeValueGetAllQuery,
  usePostAdminCatalogApiAttributeValueMutation,
  useGetAdminCatalogApiCommisionLawsQuery,
  useGetAdminCatalogApiReturnLawsQuery,
  useGetAdminCatalogApiUnitOfMeasurementGetAllQuery,
} = enhancedApiWithTags
