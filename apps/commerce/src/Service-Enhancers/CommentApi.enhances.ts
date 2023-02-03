import { socialApi } from '@hasty-bazar-commerce/services/socialApi.generated'

export const enhancedApiWithTags = socialApi.enhanceEndpoints({
  addTagTypes: ['reaction', 'saveComment', 'deleteComment', 'editComment'],
  endpoints: {
    getWebSocialCommentsProduct: {
      providesTags: ['reaction', 'saveComment', 'deleteComment', 'editComment'],
    },
    getWebSocialCommentsPartyWaitingforcomments: {
      providesTags: ['reaction', 'saveComment', 'deleteComment', 'editComment'],
    },
    getWebSocialCommentsPartyComments: {
      providesTags: ['reaction', 'saveComment', 'deleteComment', 'editComment'],
    },
    postWebSocialCommentsByCommentIdCommentReaction: {
      invalidatesTags: ['reaction'],
    },
    postWebSocialComments: {
      invalidatesTags: ['saveComment'],
    },
    deleteWebSocialCommentsById: {
      invalidatesTags: ['deleteComment'],
    },
    putWebSocialCommentsById: {
      invalidatesTags: ['editComment'],
    },
  },
})

export const {
  useGetWebSocialCommentsProductQuery,
  useGetWebSocialCommentsPartyWaitingforcommentsQuery,
  useGetWebSocialCommentsPartyCommentsQuery,
  useLazyGetWebSocialCommentsProductQuery,
  usePostWebSocialCommentsByCommentIdCommentReactionMutation,
  usePostWebSocialCommentsMutation,
  useDeleteWebSocialCommentsByIdMutation,
  usePutWebSocialCommentsByIdMutation,
} = enhancedApiWithTags
