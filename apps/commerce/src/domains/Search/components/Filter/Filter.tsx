import { ProductFilter } from '@hasty-bazar-commerce/services/generalDataApi.generated'
import { Grid, SwipeableDrawer } from '@mui/material'
import { FC, memo } from 'react'
import { IFilter, IFilterItems, IFilterParams } from '../../searchFilterModels'
import FilterBody from './FilterBody'

interface IProps {
  filterItems: IFilter[]
  setDrawerOpen(v: boolean): void
  handleSubmitFilters(v: IFilterItems): void
  searchQty: number
  drawerOpen: boolean
  selectedFilters: ProductFilter
  resetFilter(): void
  isVendor: boolean
  clearFilterGroup(filter: IFilterItems): void
  params: IFilterParams
}
const Filter: FC<IProps> = ({
  filterItems,
  setDrawerOpen,
  handleSubmitFilters,
  searchQty,
  drawerOpen,
  selectedFilters,
  resetFilter,
  isVendor,
  clearFilterGroup,
  params,
}) => {
  return (
    <>
      <Grid
        item
        xs={12}
        sm={3}
        sx={{
          display: {
            xs: 'none',
            md: 'block',
          },
        }}
        pr={isVendor ? 2 : 5}
      >
        <FilterBody
          {...{
            filterItems,
            setDrawerOpen,
            handleSubmitFilters,
            searchQty,
            selectedFilters,
            resetFilter,
            clearFilterGroup,
            params,
          }}
        />
      </Grid>
      <SwipeableDrawer
        anchor="bottom"
        open={drawerOpen}
        onOpen={() => setDrawerOpen(true)}
        onClose={() => setDrawerOpen(false)}
        sx={{
          display: {
            md: 'none',
          },
        }}
      >
        <FilterBody
          {...{
            filterItems,
            setDrawerOpen,
            handleSubmitFilters,
            searchQty,
            selectedFilters,
            resetFilter,
            clearFilterGroup,
            params,
          }}
        />
      </SwipeableDrawer>
    </>
  )
}

export default memo(Filter)
