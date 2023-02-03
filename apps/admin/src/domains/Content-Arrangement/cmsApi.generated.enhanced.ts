import { cmsApi } from '@hasty-bazar/admin-shared/services/cmsApi.generated'

export const enhancedApiWithTags = cmsApi.enhanceEndpoints({
  addTagTypes: ['pages', 'sections'],
  endpoints: {
    getAdminCmsPages: {
      providesTags: ['pages'],
    },
    getAdminCmsPagesById: {
      providesTags: ['pages'],
    },
    getAdminCmsPagesPagePartsByPageidPagepartsAndId: {
      providesTags: ['pages'],
    },
    getAdminCmsPagesGetSectionById: {
      providesTags: ['pages'],
    },
    postAdminCmsPagesSectionsByPageidSections: {
      invalidatesTags: ['pages'],
    },
    getAdminCmsPagesSectionsByPageidSectionsAndId: {
      providesTags: ['pages'],
    },
    postAdminCmsContents: {
      invalidatesTags: ['pages'],
    },
    putAdminCmsContentsById: {
      invalidatesTags: ['pages'],
    },
    putAdminCmsPagesSectionsByPageidSectionsAndId: {
      invalidatesTags: ['pages'],
    },
    deleteAdminCmsPagesSectionsByPageidSectionsAndId: {
      invalidatesTags: ['pages'],
    },
    postAdminCmsPages: {
      invalidatesTags: ['pages'],
    },
    putAdminCmsPagesUpdatePage: {
      invalidatesTags: ['pages'],
    },
    postAdminCmsPagesPagePartsByPageidPageparts: {
      invalidatesTags: ['pages'],
    },
    putAdminCmsPagesPagePartsByPageidPagepartsAndId: {
      invalidatesTags: ['pages'],
    },
    deleteAdminCmsPagesPagePartsByPageidPagepartsAndId: {
      invalidatesTags: ['pages'],
    },
    deleteAdminCmsPagesDeletePage: {
      invalidatesTags: ['pages'],
    },
    postAdminCmsPagesPagePartsActivate: {
      invalidatesTags: ['pages'],
    },
    postAdminCmsPagesSectionsActivate: {
      invalidatesTags: ['pages'],
    },
    postAdminCmsPagesClonePageParts: {
      invalidatesTags: ['pages'],
    },
  },
})

export const {
  useGetAdminCmsContentsByIdQuery,
  usePutAdminCmsContentsByIdMutation,
  useDeleteAdminCmsContentsByIdMutation,
  useGetAdminCmsContentsByEntityTypeIdAndEntityIdQuery,
  useGetAdminCmsContentsQuery,
  usePostAdminCmsContentsMutation,
  usePostAdminCmsContentsFileMutation,
  usePostAdminCmsFilesMutation,
  useGetAdminCmsPagesQuery,
  useGetAdminCmsPagesSectionsByPageidSectionsAndIdQuery,
  usePutAdminCmsPagesSectionsByPageidSectionsAndIdMutation,
  useDeleteAdminCmsPagesSectionsByPageidSectionsAndIdMutation,
  usePostAdminCmsPagesSectionsByPageidSectionsMutation,
  useGetAdminCmsTagsByIdQuery,
  usePutAdminCmsTagsByIdMutation,
  useDeleteAdminCmsTagsByIdMutation,
  useGetAdminCmsTagsQuery,
  usePostAdminCmsTagsMutation,
  useGetAdminCmsPagesByIdQuery,
  usePostAdminCmsPagesMutation,
  usePutAdminCmsPagesUpdatePageMutation,
  useGetAdminCmsPagesPagePartsByPageidPagepartsAndIdQuery,
  usePostAdminCmsPagesPagePartsByPageidPagepartsMutation,
  usePutAdminCmsPagesPagePartsByPageidPagepartsAndIdMutation,
  useDeleteAdminCmsPagesPagePartsByPageidPagepartsAndIdMutation,
  useDeleteAdminCmsPagesDeletePageMutation,
  usePostAdminCmsPagesPagePartsActivateMutation,
  usePostAdminCmsPagesSectionsActivateMutation,
  usePostAdminCmsPagesClonePagePartsMutation,
  useGetAdminCmsPagesGetSectionByIdQuery,
} = enhancedApiWithTags
