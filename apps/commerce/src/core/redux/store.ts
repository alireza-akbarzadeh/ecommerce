import { AppState } from '@hasty-bazar-commerce/domains/App/App.reducer'
import { SearchFilterState } from '@hasty-bazar-commerce/domains/Search/SearchFilter.reducer'
import { middleware, reducers as apiReducers } from '@hasty-bazar-commerce/services'
import { Action, AnyAction, combineReducers, configureStore, ThunkAction } from '@reduxjs/toolkit'
import { idsMiddleware, idsReducer } from '../utils/IdsApi'
import reducers from './reducers'
import { createWrapper, HYDRATE } from 'next-redux-wrapper'

export interface ApplicationState {
  app: AppState
  searchFilter: SearchFilterState
}

const combinedReducer = combineReducers({
  ...idsReducer,
  ...apiReducers,
  ...reducers,
})

const reducer = (state: ReturnType<typeof combinedReducer>, action: AnyAction) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state, // use previous state
      ...action.payload, // apply delta from hydration
    }
    return nextState
  } else {
    return combinedReducer(state, action)
  }
}

export function makeStore() {
  return configureStore<ApplicationState>({
    reducer,
    devTools: true,
    //@ts-ignore
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(...middleware, idsMiddleware),
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type AppDispatch = AppStore['dispatch']
export type RootState = ReturnType<AppStore['getState']>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
// if you want to see wrapper logs set debug to true
export const wrapper = createWrapper<AppStore>(makeStore, { debug: false })
