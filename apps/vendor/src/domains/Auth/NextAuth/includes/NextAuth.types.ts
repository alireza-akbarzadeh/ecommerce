import { NextAuthOptions } from 'next-auth'
import { CallbacksOptions } from 'next-auth/core/types'

export interface AuthToken {
  access_token: string
  refresh_token: string
  token_type: string
  fullname: string
  currency: {
    slug: string
    thousand_sep: string
    decimal_sep: string
  }
  date_format: string
  tax_percent: string
  expires_in: number
}

export type JWTCallbackParamType = Parameters<CallbacksOptions['jwt']>[0] & {
  token: AuthToken
}

export interface SignInCredentials {
  username: string
  password?: string
  captcha?: string
  loginType?: string
  otp?: string
  otpToken?: string
}

export type NextAuthParamOptions =
  | NextAuthOptions
  | {}
  | ((defaultOptions: NextAuthOptions) => NextAuthOptions | {})
