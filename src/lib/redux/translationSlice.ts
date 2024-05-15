import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface TranslationState {
  payload: string
}

const initialState: TranslationState = {
  payload: '',
}

const translationSlice = createSlice({
  name: 'translation',
  initialState,
  reducers: {
    getTranslation: (state, action: PayloadAction<string>) => {
      state.payload = action.payload
    },
  },
})

export const { getTranslation } = translationSlice.actions
export default translationSlice.reducer
