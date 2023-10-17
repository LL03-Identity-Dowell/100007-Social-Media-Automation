import { configureStore } from '@reduxjs/toolkit';
import userInfoSlice from "./features/userInfo"

export const store = configureStore({
  reducer: {
    data: userInfoSlice
  },
});

