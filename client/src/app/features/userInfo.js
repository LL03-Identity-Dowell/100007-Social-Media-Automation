import { createSlice } from '@reduxjs/toolkit';

const userInfoSlice = createSlice({
  name: 'sessionId', // Name of the slice
  initialState: {
    data: [], // Initial data
  },
  reducers: {
    setData: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setData } = userInfoSlice.actions;
export default userInfoSlice.reducer