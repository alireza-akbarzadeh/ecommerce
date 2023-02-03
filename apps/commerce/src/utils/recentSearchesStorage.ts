export const recentSearchesStorage = (searchText: string) => {
  const recentSearches = localStorage.getItem('recentSearches')
  const newRecentSearchers = recentSearches ? recentSearches.split(',') : []

  if (newRecentSearchers.indexOf(searchText) === -1 && searchText.length > 0) {
    if (newRecentSearchers.length > 4) {
      newRecentSearchers.pop()
    }

    newRecentSearchers.unshift(searchText)
  }
  localStorage.setItem('recentSearches', newRecentSearchers.toString())
}
