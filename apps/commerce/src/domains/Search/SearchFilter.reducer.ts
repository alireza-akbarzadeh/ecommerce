import { RootState } from '@hasty-bazar-commerce/core/redux/store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IFilterItems } from './searchFilterModels'

export interface SearchFilterState {
  selectedFilterItems: IFilterItems[]
}

const initialState: SearchFilterState = {
  selectedFilterItems: [],
}

const searchFilterSlice = createSlice({
  name: 'searchFilter',
  initialState,
  reducers: {
    addFilterItem(state: SearchFilterState, action: PayloadAction<IFilterItems>) {
      if (
        !state.selectedFilterItems?.some?.((filterItem) =>
          action.payload.isRangeFilter
            ? filterItem.ids?.toString() === action.payload.ids?.toString()
            : filterItem.id === action.payload.id,
        )
      ) {
        state.selectedFilterItems.push(action.payload)
      }
    },
    clearFilterItemsGroup(state: SearchFilterState, action: PayloadAction<IFilterItems>) {
      state.selectedFilterItems = state.selectedFilterItems.filter((item) =>
        action.payload.filterName === 'attributes'
          ? item.attributeCode !== action.payload.attributeCode
          : item.filterName !== action.payload.filterName,
      )
    },
    removeFilterItem(state: SearchFilterState, action: PayloadAction<IFilterItems>) {
      state.selectedFilterItems = state.selectedFilterItems.filter((item) =>
        action.payload.isRangeFilter
          ? item.ids?.toString() === action.payload.ids?.toString()
          : item.id !== action.payload.id,
      )
    },
    replaceFilterItem(state: SearchFilterState, action: PayloadAction<IFilterItems>) {
      state.selectedFilterItems = state.selectedFilterItems.filter(
        (item) => item.filterName !== action.payload.filterName,
      )
      state.selectedFilterItems.push(action.payload)
    },
    clearAllFilterItems(state: SearchFilterState) {
      state.selectedFilterItems = []
    },
  },
})

export const selectSelectedFilter = (state: RootState) => state.searchFilter.selectedFilterItems

export const selectSelectedFilterItemsGroupBy = (
  state: RootState,
): { [key: string]: IFilterItems[] } => {
  return state.searchFilter.selectedFilterItems.reduce((r, a) => {
    if (a.filterName !== 'attributes') {
      r[a.filterName] = r[a.filterName] || []
      r[a.filterName].push(a)
    } else {
      r[a.filterTitle!] = r[a.filterTitle!] || []
      r[a.filterTitle!].push(a)
    }
    return r
  }, Object.create(null))
}

export const {
  addFilterItem,
  clearFilterItemsGroup,
  removeFilterItem,
  replaceFilterItem,
  clearAllFilterItems,
} = searchFilterSlice.actions
export default searchFilterSlice.reducer
