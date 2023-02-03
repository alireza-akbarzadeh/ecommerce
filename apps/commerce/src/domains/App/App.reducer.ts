import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface AppState {
  locale: string | null
}

const initialState: AppState = {
  locale: null,
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLocale(state: AppState, action: PayloadAction<string>) {
      state.locale = action.payload
    },
  },
})

export const { setLocale } = appSlice.actions

export default appSlice.reducer
