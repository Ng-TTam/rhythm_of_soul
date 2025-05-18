import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../model/profile/UserProfile';

interface UserState {
  currentUser: User | null;
}

const initialState: UserState = {
  currentUser: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserSlice(state, action: PayloadAction<User>) {
      state.currentUser = action.payload;
    },
    updateUser: (state, action: PayloadAction<User>) => {
        if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    },
    clearUserSlice(state) {
      state.currentUser = null;
    },
  },
});

export const { setUserSlice, clearUserSlice, updateUser } = userSlice.actions;
export default userSlice.reducer;
