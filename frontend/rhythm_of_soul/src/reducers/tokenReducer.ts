import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface TokenSliceState {
    accessToken: string;
}

const initialState: TokenSliceState = {
    accessToken: '',
  };

  const tokenSlice = createSlice({
    name: 'token',
    initialState,
    reducers: {
      setToken: (state, action: PayloadAction<TokenSliceState>) => {
        state.accessToken = action.payload.accessToken;
      },
      clearToken: (state) => {
        state.accessToken = '';
      },
    },
  });

  export const { setToken, clearToken } = tokenSlice.actions;
  export default tokenSlice.reducer;