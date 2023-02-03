import { baseIdsApi as api } from '@hasty-bazar-commerce/core/redux/baseIdsApi'
import { ApiResultMessage } from '@hasty-bazar-commerce/services/generalDataApi.generated'
import { PasswordLevel } from '@hasty-bazar/auth'

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    postIdsCreateOtpForRegister: build.mutation<
      PostIdsApiCreateOtpForRegisterApiResponse,
      PostIdsApiCreateOtpForRegisterApiArg
    >({
      query: (queryArg) => ({
        url: `/api/AuthCustomer/CreateOtpForRegister`,
        method: 'POST',
        body: { user: queryArg.user },
      }),
      transformResponse: (response) =>
        ({ data: response } as PostIdsApiCreateOtpForRegisterApiResponse),
    }),
    postIdsValidateOTPForRegister: build.mutation<
      PostIdsApiValidateOTPForRegisterApiResponse,
      PostIdsApiValidateOTPForRegisterApiArg
    >({
      query: (queryArg) => ({
        url: `/api/AuthCustomer/ValidateOTPForRegister`,
        method: 'POST',
        body: {
          otpToken: queryArg.otpToken,
          OTPCode: queryArg.OTPCode,
        },
      }),
      transformResponse: (response) =>
        ({ data: response } as PostIdsApiValidateOTPForRegisterApiResponse),
    }),
    postIdsValidateOTPForForgotPassword: build.mutation<
      PostIdsApiValidateOTPForForgotPasswordApiResponse,
      PostIdsApiValidateOTPForForgotPasswordApiArg
    >({
      query: (queryArg) => ({
        url: `/api/AuthCustomer/ValidateOTPForForgotPassword`,
        method: 'POST',
        body: {
          otpToken: queryArg.otpToken,
          OTPCode: queryArg.OTPCode,
        },
      }),
      transformResponse: (response) =>
        ({ data: response } as PostIdsApiValidateOTPForForgotPasswordApiResponse),
    }),
    postIdsForgotPassword: build.mutation<
      PostIdsApiForgotPasswordApiResponse,
      PostIdsApiForgotPasswordApiArg
    >({
      query: (queryArg) => ({
        url: `/api/AuthCustomer/CreateOTPForChangePassword`,
        method: 'POST',
        body: { user: queryArg.user },
      }),
      transformResponse: (response) => ({ data: response } as PostIdsApiForgotPasswordApiResponse),
    }),
    postIdsChangePassword: build.mutation<
      PostIdsApiChangePasswordApiResponse,
      PostIdsApiChangePasswordApiArg
    >({
      query: (queryArg) => ({
        url: `/api/AuthCustomer/change-password`,
        method: 'POST',
        body: {
          username: queryArg.username,
          currentPassword: queryArg.currentPassword,
          newPassword: queryArg.newPassword,
        },
      }),
      transformResponse: (response) => ({ data: response } as PostIdsApiChangePasswordApiResponse),
    }),
    postIdsSetPassword: build.mutation<
      PostIdsApiSetPasswordApiResponse,
      PostIdsApiSetPasswordApiArg
    >({
      query: (queryArg) => ({
        url: `/api/AuthCustomer/SetPassword`,
        method: 'POST',
        body: {
          newPassword: queryArg.newPassword,
          userName: queryArg.userName,
          otpToken: queryArg.otpToken,
        },
      }),
      transformResponse: (response) => ({ data: response } as PostIdsApiSetPasswordApiResponse),
    }),
    postIdsCreateOTPForLogin: build.mutation<
      PostIdsApiCreateOTPForLoginApiResponse,
      PostIdsApiCreateOTPForLoginApiArg
    >({
      query: (queryArg) => ({
        url: `/api/AuthCustomer/CreateOTPForLogin`,
        method: 'POST',
        body: {
          user: queryArg.user,
        },
      }),
      transformResponse: (response) =>
        ({ data: response } as PostIdsApiCreateOTPForLoginApiResponse),
    }),

    getOtpSetting: build.query<GetOtpSettingApiResponse, GetOtpSettingApiArg>({
      query: (queryArg) => ({
        url: `/api/Auth/GetOtpSetting`,
      }),
    }),
  }),
  overrideExisting: true,
})

export type IDSApiResponse<T> = {
  success?: boolean
  messages?: ApiResultMessage[] | null
  data?: T
}

// CreateOtpForRegister post
export type CreateOtpForRegisterResult = {
  otpToken: string
  message: string
}
export type PostIdsApiCreateOtpForRegisterApiResponse = IDSApiResponse<CreateOtpForRegisterResult>

export interface PostIdsApiCreateOtpForRegisterApiArg {
  user: string
}

// ValidateOTPForRegister post
export type ValidateOTPForRegisterResult = {
  changePasswordToken: string
  success: boolean
  error?: string
}
export type PostIdsApiValidateOTPForRegisterApiResponse =
  IDSApiResponse<ValidateOTPForRegisterResult>

export interface PostIdsApiValidateOTPForRegisterApiArg {
  otpToken: string
  OTPCode: string
}

// ValidateOTPForForgotPassword post
export type ValidateOTPForForgotPasswordResult = {
  changePasswordToken: string
  success: boolean
  error?: string
}
export type PostIdsApiValidateOTPForForgotPasswordApiResponse =
  IDSApiResponse<ValidateOTPForForgotPasswordResult>

export interface PostIdsApiValidateOTPForForgotPasswordApiArg {
  otpToken: string
  OTPCode: string
}

// ForgotPassword post
export type ForgotPasswordResult = {
  otpToken: string
  message: string
}
export type PostIdsApiForgotPasswordApiResponse = IDSApiResponse<ForgotPasswordResult>

export interface PostIdsApiForgotPasswordApiArg {
  user: string
}

// ChangePassword post
export type ChangePasswordResult = {
  success: boolean
}
export type PostIdsApiChangePasswordApiResponse = IDSApiResponse<ChangePasswordResult>

export interface PostIdsApiChangePasswordApiArg {
  username: string
  currentPassword: string
  newPassword: string
}

// setPassword post
export type SetPasswordResult = {
  success: boolean
  error: string
}
export type PostIdsApiSetPasswordApiResponse = IDSApiResponse<SetPasswordResult>

export interface PostIdsApiSetPasswordApiArg {
  newPassword: string
  userName: string
  otpToken: string
}

// CreateOTPForLogin post
export type CreateOTPForLoginResult = {
  otpToken: string
  message: string
}
export type PostIdsApiCreateOTPForLoginApiResponse = IDSApiResponse<CreateOTPForLoginResult>
export interface GetOtpSettingApiResponse {
  numberOfOtpDigit: number
  delayTimeForDataEntry: number
  passwordMinLength: number
  passwordMaxLength: number
  passwordLevel: PasswordLevel
}

export type GetOtpSettingApiArg = {}
export interface PostIdsApiCreateOTPForLoginApiArg {
  user: string
}

export const {
  usePostIdsCreateOtpForRegisterMutation,
  usePostIdsValidateOTPForRegisterMutation,
  usePostIdsForgotPasswordMutation,
  usePostIdsChangePasswordMutation,
  usePostIdsValidateOTPForForgotPasswordMutation,
  usePostIdsSetPasswordMutation,
  usePostIdsCreateOTPForLoginMutation,
  useGetOtpSettingQuery,
} = injectedRtkApi

export { injectedRtkApi as idsApi }

export const idsReducer = {
  [injectedRtkApi.reducerPath]: injectedRtkApi.reducer,
}
export const idsMiddleware = injectedRtkApi.middleware
