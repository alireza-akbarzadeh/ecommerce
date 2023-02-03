import { catalogApi } from '@hasty-bazar-commerce/services/catalogApi.generated'

export const favoriteEnhancesApi = catalogApi.enhanceEndpoints({
  addTagTypes: ['addToFavorites', 'removeFromFavorites'],
  endpoints: {
    getWebCatalogCommerceFavoriteProduct: {
      providesTags: ['addToFavorites', 'removeFromFavorites'],
    },
    getWebCatalogCommerceFavoriteProductAll: {
      providesTags: ['addToFavorites', 'removeFromFavorites'],
    },
    postWebCatalogCommerceFavoriteProduct: {
      invalidatesTags: ['addToFavorites'],
    },
    deleteWebCatalogCommerceFavoriteProduct: {
      invalidatesTags: ['removeFromFavorites'],
    },
  },
})

export const {
  usePostWebCatalogCommerceFavoriteProductMutation,
  useDeleteWebCatalogCommerceFavoriteProductMutation,
  useGetWebCatalogCommerceFavoriteProductQuery,
  useGetWebCatalogCommerceFavoriteProductAllQuery,
} = favoriteEnhancesApi
