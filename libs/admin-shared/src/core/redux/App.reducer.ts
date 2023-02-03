import { createSlice, PayloadAction } from '@reduxjs/toolkit'
export interface AppState {
  locale: string | null
  baseUrl: string | undefined
  defaultCurrencyTitle: string | null
}

const initialState: AppState = {
  locale: null,
  baseUrl: process.env['NEXT_PUBLIC_GATEWAY'],
  defaultCurrencyTitle: null,
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLocale(state: AppState, action: PayloadAction<string>) {
      state.locale = action.payload
    },
    setCurrencyTitle(state: AppState, action: PayloadAction<string>) {
      state.defaultCurrencyTitle = action.payload
    },
  },
})

export const { setLocale, setCurrencyTitle } = appSlice.actions

export default appSlice.reducer
