import { catalogApi } from '@hasty-bazar/admin-shared/services/catalogApi.generated'

export const enhancedApiWithTags = catalogApi.enhanceEndpoints({
  addTagTypes: ['brands'],
  endpoints: {
    getAdminCatalogBrandsById: {
      providesTags: ['brands'],
    },
    postAdminCatalogBrands: {
      invalidatesTags: ['brands'],
    },
    putAdminCatalogBrandsById: {
      invalidatesTags: ['brands'],
    },
  },
})

export const {
  useGetAdminCatalogBrandsByIdQuery,
  usePostAdminCatalogBrandsMutation,
  usePutAdminCatalogBrandsByIdMutation,
} = enhancedApiWithTags
