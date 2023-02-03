import { catalogApi } from '@hasty-bazar-commerce/services/catalogApi.generated'

export const enhancedApiWithTags = catalogApi.enhanceEndpoints({
  addTagTypes: ['changeInVendors', 'removeSavedSearchItem'],
  endpoints: {
    getWebCatalogCommerceSavedVendor: {
      providesTags: ['changeInVendors'],
    },
    postWebCatalogCommerceSavedVendor: {
      invalidatesTags: ['changeInVendors'],
    },
    deleteWebCatalogCommerceSavedVendorVendors: {
      invalidatesTags: ['changeInVendors'],
    },
    getWebCatalogSaveSearchTotal: {
      providesTags: ['removeSavedSearchItem'],
    },
    deleteWebCatalogSaveSearchDelete: {
      invalidatesTags: ['removeSavedSearchItem'],
    },
  },
})

export const {
  useGetWebCatalogCommerceSavedVendorQuery,
  usePostWebCatalogCommerceSavedVendorMutation,
  useDeleteWebCatalogCommerceSavedVendorVendorsMutation,
  useGetWebCatalogSaveSearchTotalQuery,
  useDeleteWebCatalogSaveSearchDeleteMutation,
} = enhancedApiWithTags
