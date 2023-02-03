import { generalDataApi } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'

export const enhancedApiWithTags = generalDataApi.enhanceEndpoints({
  addTagTypes: ['process'],
  endpoints: {
    getAdminGeneralDataProcessesById: {
      providesTags: ['process'],
    },
    putAdminGeneralDataProcessesById: {
      invalidatesTags: ['process'],
    },
  },
})

export const {
  useGetAdminGeneralDataProcessesByIdQuery,
  usePutAdminGeneralDataProcessesByIdMutation,
} = enhancedApiWithTags
