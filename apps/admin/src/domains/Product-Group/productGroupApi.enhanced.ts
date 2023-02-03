import { catalogApi } from '@hasty-bazar/admin-shared/services/catalogApi.generated'

export const enhancedApiWithTags = catalogApi.enhanceEndpoints({
  addTagTypes: ['productGroupValues', 'productValues'],
  endpoints: {
    getAdminCatalogCategories: {
      providesTags: ['productGroupValues'],
    },
    postAdminCatalogCategories: {
      invalidatesTags: ['productGroupValues'],
    },
    putAdminCatalogCategoriesById: {
      invalidatesTags: ['productGroupValues'],
    },

    getAdminCatalogCategoriesById: {
      providesTags: ['productValues'],
    },
    deleteAdminCatalogCategoriesByIdAttributesAndAttributeId: {
      invalidatesTags: ['productValues'],
    },
  },
})

export const {
  useGetAdminCatalogCategoriesQuery,
  usePostAdminCatalogCategoriesMutation,
  usePutAdminCatalogCategoriesByIdMutation,
  useGetAdminCatalogCategoriesByIdQuery,
  useDeleteAdminCatalogCategoriesByIdAttributesAndAttributeIdMutation,
} = enhancedApiWithTags
