// import {createSlice} from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const getUserInfo = createApi({
    reducerPath: "userInfo",
    baseQuery: fetchBaseQuery({
        baseUrl: ""
    }),
    endpoints: ( builder) => ({
        getSummary: builder.query({
            query: (params) => 'test'
        })
    })
    
})