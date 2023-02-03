import { cmsApi } from '@hasty-bazar/admin-shared/services/cmsApi.generated'

export const enhancedApiWithTags = cmsApi.enhanceEndpoints({
  addTagTypes: ['pages', 'sections'],
  endpoints: {
    putAdminCmsContentsById: {
      invalidatesTags: ['pages'],
    },
  },
})

export const { usePutAdminCmsContentsByIdMutation } = enhancedApiWithTags
