import { configureStore } from '@reduxjs/toolkit'
import { getUserInfo } from './features/userInfo'

export const store = configureStore({
  reducer: {
    [getUserInfo.reducerPath] : getUserInfo.reducer
  },
  middleware: (getDefaultMiddleware)=> getDefaultMiddleware().concat(getUserInfo.middleware)
})