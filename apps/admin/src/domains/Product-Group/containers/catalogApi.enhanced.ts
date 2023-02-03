import { catalogApi } from '@hasty-bazar/admin-shared/services/catalogApi.generated'

export const enhancedApiWithTags = catalogApi.enhanceEndpoints({
  addTagTypes: ['categoryAcceptions'],
  endpoints: {
    getAdminCatalogCategoriesByIdAcceptions: {
      providesTags: ['categoryAcceptions'],
    },
    postAdminCatalogCategoriesByIdCategoryAcceptions: {
      invalidatesTags: ['categoryAcceptions'],
    },
    deleteAdminCatalogCategoriesByIdCategoryAcceptionsAndAcceptionValueCode: {
      invalidatesTags: ['categoryAcceptions'],
    },
  },
})

export const {
  usePostAdminCatalogCategoriesByIdCategoryAcceptionsMutation,
  useGetAdminCatalogCategoriesByIdAcceptionsQuery,
  useDeleteAdminCatalogCategoriesByIdCategoryAcceptionsAndAcceptionValueCodeMutation,
} = enhancedApiWithTags
