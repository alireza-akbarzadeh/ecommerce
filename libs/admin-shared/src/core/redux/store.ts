import { AppState } from './App.reducer'
import { middleware, reducers as apiReducers } from '@hasty-bazar/admin-shared/services'
import { Action, configureStore, Store, ThunkAction } from '@reduxjs/toolkit'
import { useMemo } from 'react'
import reducers from './reducers'

//@ts-ignore
let store: Store<ApplicationState> = null

export interface ApplicationState {
  app: AppState
}

function initStore(initialState: ApplicationState): Store<ApplicationState> {
  return configureStore<ApplicationState>({
    reducer: {
      ...apiReducers,
      ...reducers,
    },
    preloadedState: initialState,
    devTools: true,
    //@ts-ignore
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(...middleware),
  })
}

export const initializeStore = (preloadedState?: any) => {
  let _store = store ?? initStore(preloadedState)

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = initStore({
      ...store.getState(),
      ...preloadedState,
    })
    // Reset the current store
    //@ts-ignore
    store = null
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store
  // Create the store once in the client
  if (!store) store = _store

  return _store
}

export function useStore(initialState: ApplicationState) {
  return useMemo(() => initializeStore(initialState), [initialState])
}

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
// setupListeners(store.dispatch);
