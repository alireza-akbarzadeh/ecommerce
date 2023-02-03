import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import {
  useDeleteWebCatalogSaveSearchMutation,
  usePostWebCatalogSaveSearchMutation,
} from '@hasty-bazar-commerce/services/catalogApi.generated'
import { NextRouter } from 'next/router'

export const useSaveQuery = (
  refetchSavedQuery: () => void,
  router: NextRouter,
  search?: string,
) => {
  const [saveSearchQuery, { isLoading: saveSearchQueryLoading }] =
    usePostWebCatalogSaveSearchMutation()
  const [deleteSearchQuery, { isLoading: deleteSearchQueryLoading }] =
    useDeleteWebCatalogSaveSearchMutation()

  const handleModifyQuery = (id?: string) => {
    if (id) {
      deleteSearchQuery({
        ...ApiConstants,
        id,
      }).then(() => refetchSavedQuery())
    } else {
      saveSearchQuery({
        ...ApiConstants,
        saveSearchModel: {
          title: search ?? '',
          query: router.asPath,
        },
      }).then(() => refetchSavedQuery())
    }
  }
  return { handleModifyQuery, saveSearchQueryLoading, deleteSearchQueryLoading }
}
