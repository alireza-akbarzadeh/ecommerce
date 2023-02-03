import { cmsApi } from '@hasty-bazar/admin-shared/services/cmsApi.generated'

export const enhancedApiWithTags = cmsApi.enhanceEndpoints({
  addTagTypes: ['menuItemValues'],
  endpoints: {
    getAdminCmsMenugroupsByMenuGroupIdGetMenuItems: {
      providesTags: ['menuItemValues'],
    },
    postAdminCmsMenugroupsByMenuGroupIdAddMenuItem: {
      invalidatesTags: ['menuItemValues'],
    },
    putAdminCmsMenugroupsByMenuGroupIdUpdateMenuItemAndMenuItemId: {
      invalidatesTags: ['menuItemValues'],
    },
    deleteAdminCmsMenugroupsByMenuGroupIdRemoveMenuItemAndMenuItemId: {
      invalidatesTags: ['menuItemValues'],
    },
  },
})

export const {
  useGetAdminCmsMenugroupsByMenuGroupIdGetMenuItemsQuery,
  usePostAdminCmsMenugroupsByMenuGroupIdAddMenuItemMutation,
  usePutAdminCmsMenugroupsByMenuGroupIdUpdateMenuItemAndMenuItemIdMutation,
  useDeleteAdminCmsMenugroupsByMenuGroupIdRemoveMenuItemAndMenuItemIdMutation,
} = enhancedApiWithTags
