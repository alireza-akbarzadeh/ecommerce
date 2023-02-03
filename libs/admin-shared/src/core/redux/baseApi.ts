import { errorsToString } from '@hasty-bazar/admin-shared/utils'
import { sleep } from '@hasty-bazar/admin-shared/utils/util'
import { openToast } from '@hasty-bazar/core'
import { BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { createApi } from '@reduxjs/toolkit/query/react'
import { getSession, signOut } from 'next-auth/react'
import Router from 'next/router'

// const axiosBaseQuery =
//   (): BaseQueryFn<
//     any,
//     // {
//     //   url: string
//     //   method: AxiosRequestConfig['method']
//     //   data?: AxiosRequestConfig['data']
//     //   params?: AxiosRequestConfig['params']
//     // },
//     unknown,
//     unknown
//   > =>
//   async ({ url, method, data, params }) => {
//     try {
//       const result = await axios({ url, method, data, params })
//       return { data: result.data }
//     } catch (axiosError) {
//       let err = axiosError as AxiosError
//       return {
//         error: {
//           status: err.response?.status,
//           data: err.response?.data || err.message,
//         },
//       }
//     }
//   }

const baseQuery = fetchBaseQuery({
  cache: 'default',

  baseUrl: process.env['NEXT_PUBLIC_GATEWAY'],
  prepareHeaders: async (headers, { getState }) => {
    const session = await getSession()
    if (session?.accessToken) {
      headers.set('authorization', `Bearer ${session?.accessToken}`)
    }
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
  const session = await getSession()

  if (result.error) {
    const expectedError =
      result.error?.status && result.error?.status >= 400 && result.error?.status < 500

    if (expectedError) {
      openToast({
        message: errorsToString(result.error),
        type: 'error',
      })
      if (result.error.status === 401) {
        localStorage.setItem('error-401', JSON.stringify(result.error?.data || {}))
        localStorage.setItem('error-401-token', JSON.stringify(session?.accessToken || ''))

        signOut({ redirect: false }).then(() => {
          Router.push('/auth/signin/')
        })
      }
    } else {
      openToast({
        message: errorsToString({}),
        type: 'error',
      })
    }
  }
  return result
}
export const baseApi = createApi({
  baseQuery: baseQueryWithErrorHandler,
  endpoints: () => ({}),
})
