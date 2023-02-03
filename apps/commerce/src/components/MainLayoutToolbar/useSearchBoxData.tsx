import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import {
  useGetWebCatalogSuggestionQuery,
  useGetWebCatalogSaveSearchQuery,
} from '@hasty-bazar-commerce/services/catalogApi.generated'
import { useGetWebGeneralDataRecentSearchQuery } from '@hasty-bazar-commerce/services/generalDataApi.generated'
import { SEARCH_LENGTH } from './MainLayoutToolbarSearch'

type useSearchBoxDataProps = {
  searchValue: string
}

export function useSearchBoxData({ searchValue = '' }: useSearchBoxDataProps) {
  const { data: { data: suggestionList = {} } = {}, isFetching: suggestionListIsFetching } =
    useGetWebCatalogSuggestionQuery(
      {
        ...ApiConstants,
        query: searchValue?.trim(),
        facetSuggestionSize: 5,
        querySuggestionSize: 5,
        titleSuggestionSize: 0,
      },
      {
        skip: searchValue.trim().length <= SEARCH_LENGTH,
      },
    )

  const {
    data: { data: { queries: recentSuggestions = [] } = {} } = {},
    isFetching: recentSuggestionsIsFetching,
    refetch: recentSuggestionRefetch,
  } = useGetWebGeneralDataRecentSearchQuery({
    ...ApiConstants,
    filter: searchValue?.trim(),
  })

  const {
    data: { data: savedSearch = [] } = {},
    isFetching: savedSearchIsFetching,
    refetch: savedSearchRefetch,
  } = useGetWebCatalogSaveSearchQuery({
    ...ApiConstants,
    filter: searchValue?.trim(),
  })

  return {
    suggestionList,
    suggestionListIsFetching,
    recentSuggestions,
    recentSuggestionsIsFetching,
    recentSuggestionRefetch,
    savedSearch,
    savedSearchIsFetching,
    savedSearchRefetch,
  }
}
