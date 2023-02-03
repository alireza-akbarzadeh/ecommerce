import { BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { createApi } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
  cache: 'default',

  baseUrl: process.env.NEXT_PUBLIC_IDS,
  prepareHeaders: async (headers) => {
    headers.set('Content-Type', 'application/json')
    headers.set('Accept', '*/*')

    return headers
  },
})
const baseQueryWithErrorHandler: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result.error) {
    // TODO handle error
  }
  return result
}
export const baseIdsApi = createApi({
  baseQuery: baseQueryWithErrorHandler,
  endpoints: () => ({}),
  reducerPath: 'idsReducerPath',
})
