import { Container, Grid } from '@mui/material'
import { CategoriesWidget } from './components/CategoriesWidget'
import Filter from './components/Filter/Filter'
import FilterBadges from './components/FilterBadges'
import SearchResult from './components/SearchResult'
import { useSearchFilter } from './hooks/useSearchFilter'

function SearchPage() {
  const {
    resultData,
    filterItems,
    resetFilter,
    handleSubmitFilters,
    drawerOpen,
    handlePagination,
    PAGE_SIZE,
    handleModifyQuery,
    handleSorting,
    setDrawerOpen,
    page,
    isVendor,
    sortingItems,
    filterLoading,
    sortDrawerOpen,
    setSortDrawerOpen,
    sortBy,
    categoriesFilter,
    savedQueryData,
    modifyQueryLoading,
    selectedFilters,
    totalResult,
    params,
    setPaginationMode,
    paginationMode,
    containerRef,
    clearFilterGroup,
  } = useSearchFilter()

  return (
    <Container maxWidth="lg" sx={{ p: '0 !important', mt: !isVendor ? -2 : 'unset' }}>
      <Grid container sx={{ mx: 0 }} ref={containerRef}>
        {!isVendor && (
          <>
            <FilterBadges
              {...{
                setSortDrawerOpen,
                sortBy,
                filterItems,
                setDrawerOpen,
              }}
            />
            <CategoriesWidget
              {...{
                categoriesFilter,
                handleSubmitFilters,
                selectedFilters,
                filterLoading,
              }}
            />
          </>
        )}
        <Filter
          {...{
            filterItems,
            handleSubmitFilters,
            setDrawerOpen,
            drawerOpen,
            sortDrawerOpen,
            setSortDrawerOpen,
            selectedFilters,
            resetFilter,
            isVendor,
            clearFilterGroup,
            params,
          }}
          searchQty={totalResult}
        />
        <SearchResult
          {...{
            handlePagination,
            handleModifyQuery,
            handleSorting,
            setDrawerOpen,
            sortDrawerOpen,
            setSortDrawerOpen,
            page,
            savedQueryData,
            modifyQueryLoading,
            filterLoading,
            sortBy,
            filterItems,
            params,
            setPaginationMode,
            paginationMode,
          }}
          data={(resultData as any) ?? []}
          pageSize={PAGE_SIZE}
          totalResultQty={totalResult}
          sortingItems={
            sortingItems?.map((item) => ({
              title: String(item.title),
              value: item.id || 0,
            })) || []
          }
        />
      </Grid>
    </Container>
  )
}

export default SearchPage
