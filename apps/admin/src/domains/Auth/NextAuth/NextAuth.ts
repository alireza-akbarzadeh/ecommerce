import { ContentTypeEnums, EntityTypeEnums } from '@hasty-bazar/admin-shared/core/enums'
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next'
import BaseNextAuth, {
  getServerSession as baseGetServerSession,
  NextAuthOptions,
  Session,
} from 'next-auth'
import { JWT } from 'next-auth/jwt'
import Credentials from 'next-auth/providers/credentials'
import { pick } from 'ramda'
import { nextAuthLogger as logger, NEXTAUTH_DEBUG_MODE } from './includes/NextAuth.common'
import {
  AuthToken,
  JWTCallbackParamType,
  NextAuthParamOptions,
  SignInCredentials,
} from './includes/NextAuth.types'

const { log } = console

const ACCESS_TOKEN_URL = `${process.env.NEXT_PUBLIC_NEXTAUTH_CREDENTIAL_AUTHORIZATION_URL}/connect/token`
const REVOKE_ACCESS_TOKEN_URL = `${process.env.NEXT_PUBLIC_NEXTAUTH_CREDENTIAL_AUTHORIZATION_URL}/api/Auth/LogOut`
const REVOKE_REFRESH_TOKEN_URL = `${process.env.NEXT_PUBLIC_NEXTAUTH_CREDENTIAL_AUTHORIZATION_URL}/connect/revocation`
const CLIENT_ID = process.env.NEXTAUTH_CREDENTIAL_CLIENT_ID
const CLIENT_SECRET = process.env.NEXTAUTH_CREDENTIAL_CLIENT_SECRET

async function refreshAccessToken(token: JWT) {
  try {
    const response = await fetch(ACCESS_TOKEN_URL, {
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: token.refresh_token,
      } as any),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    })

    const refreshedTokens = await response.json()

    if (!response.ok) {
      throw refreshedTokens
    }

    const selectToken: AuthToken = pick(
      [
        'access_token',
        'refresh_token',
        'token_type',
        'fullname',
        'currency',
        'date_format',
        'tax_percent',
        'expires_in',
      ],
      refreshedTokens,
    ) as AuthToken
    selectToken.expires_in = Date.now() + selectToken.expires_in * 1000

    return {
      ...token,
      ...selectToken,
    }
  } catch (error) {
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    }
  }
}

async function revokeJWTTokens(token: JWT) {
  log(REVOKE_ACCESS_TOKEN_URL, 'REVOKE_ACCESS')

  try {
    await fetch(REVOKE_ACCESS_TOKEN_URL, {
      headers: {
        Authorization: token.access_token as string,
      },
      method: 'POST',
    })
      .then((res) => res.json())
      .then((data) => {
        log(data, 'data')
      })
      .catch((error) => {
        log(error, 'error')

        throw new Error(error)
      })

    await fetch(REVOKE_REFRESH_TOKEN_URL, {
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        token_type_hint: 'refresh_token',
        token: token.refresh_token as string,
      } as any),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    }).catch((error) => {
      throw new Error(error)
    })
  } catch (error) {
    logger.error(error, '[REVOKE_TOKEN]')
  }
}

export const nextAuthDefaultOptions = (
  req: GetServerSidePropsContext['req'],
  res: GetServerSidePropsContext['res'],
) => {
  const defaultOptions: NextAuthOptions = {
    providers: [
      Credentials({
        id: 'SIGN_IN',
        name: 'SignIn',
        credentials: {
          username: { label: 'Username', type: 'text' },
          password: { label: 'Password', type: 'password' },
        },
        //@ts-ignore
        async authorize(credentials: SignInCredentials | undefined) {
          logger.info(credentials!, '[SIGN_IN][CREDENTIALS]')

          const response = await fetch(`${ACCESS_TOKEN_URL}`, {
            body: new URLSearchParams({
              grant_type: 'password',
              scope: 'offline_access',
              client_id: CLIENT_ID,
              client_secret: CLIENT_SECRET,
              ...credentials,
            } as any),
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },

            method: 'POST',
          })

          const res = await response.json()

          if (!response?.ok && res?.error) {
            logger.error(res, '[[SIGN_IN]][RESPONSE][ERROR]')
            throw new Error(res?.error_description || res?.error)
          }

          logger.info(res, '[[SIGN_IN]][RESPONSE]')

          const selectToken: AuthToken = pick(
            [
              'access_token',
              'refresh_token',
              'token_type',
              'fullname',
              'currency',
              'date_format',
              'tax_percent',
              'expires_in',
            ],
            res,
          ) as AuthToken
          selectToken.expires_in = Date.now() + selectToken.expires_in * 1000

          try {
            const userData = await fetch(
              `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/IDR/customers/GetPartyByUserName/?UserName=${credentials?.username}`,
            )
              .then((res) => res.json())
              .then((res) => res.data)

            const userImage = await fetch(
              `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/CMS/Contents/${EntityTypeEnums.User}/${userData?.partyId}?ContentType=${ContentTypeEnums.Image}&factor=ProfileImage`,
            )
              .then((res) => res.json())
              .then((res) => res.data)

            const avatar =
              userImage?.items?.length > 1
                ? userImage?.items[userImage?.items?.length - 1]?.value
                : ''

            return {
              ...selectToken,
              user: { ...userData, avatar, userName: credentials?.username },
            }
          } catch (error) {
            throw new Error(
              String(error).replace('Error:', '') ||
                'دسترسی شما تایید نشد ، لطفا با مدیر سیستم تماس بگیرید',
            )
          }
        },
      }),
    ],
    session: {
      strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_JWT_SECRET,
    jwt: {
      ...(NEXTAUTH_DEBUG_MODE && {
        encode: (params) => (params?.token ? JSON.stringify(params.token) : ''),
        decode: (params) => JSON.parse(params?.token ?? ''),
      }),
    },

    callbacks: {
      async jwt({ token, user: signInToken, account }: JWTCallbackParamType) {
        logger.info({ token, account, signInToken }, '[CALLBACKS][JWT][PARAMS]')
        // Signing in
        if (account?.provider === 'SIGN_IN' && signInToken?.access_token) {
          return signInToken
        }
        //@ts-ignore
        token = token?.access_token ? token : null

        logger.info(token, '[CALLBACKS][JWT][TOKEN]')

        if (Date.now() < token?.expires_in) {
          return token
        }

        return refreshAccessToken(token)
      },
      async session({ session, token }) {
        logger.info({ session, token }, '[CALLBACKS][SESSION][PARAMS]')
        if (token) {
          session.user = (token.user || null) as any
          session.accessToken = token.access_token as string
        } else {
          logger.info({ session, token }, '[CALLBACKS][SESSION][NO_TOKEN]')
          //@ts-ignore
          session = null
        }
        logger.info({ session, token }, '[CALLBACKS][SESSION][FULLFILLED]')
        return session
      },
    },

    pages: { signIn: '/' },
    debug: NEXTAUTH_DEBUG_MODE,
    events: {
      async signOut(message) {
        // await revokeJWTTokens(message.token)
        logger.info(message, '[EVENT][SIGN_OUT]')
      },
      async session(message) {
        logger.info(message, '[EVENT][SESSION]')
      },
    },
    logger: {
      error(code, metadata) {
        logger.error(code, metadata, '[LOGGER][ERROR]')
      },
      warn(code) {
        logger.warn(code, '[LOGGER][WARN]')
      },
      debug(code, metadata) {
        logger.debug(code, metadata, '[LOGGER][DEBUG]')
      },
    },
  }
  return defaultOptions
}

const NextAuth = (req: NextApiRequest, res: NextApiResponse, options?: NextAuthParamOptions) => {
  const defaultOptions = nextAuthDefaultOptions(req, res)
  if (typeof options === 'function') {
    options = options(defaultOptions)
  } else {
    options = options || {}
  }

  return BaseNextAuth(req, res, { ...defaultOptions, ...options })
}

export default NextAuth

export const getServerSession = async (
  context: GetServerSidePropsContext,
): Promise<Session | null> =>
  baseGetServerSession(context, nextAuthDefaultOptions(context.req, context.res))
