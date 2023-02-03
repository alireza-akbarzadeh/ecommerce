import axios, { AxiosError, AxiosInstance } from 'axios'
import { getSession } from 'next-auth/react'
import pino from 'pino'

const baseURL = process.env.NEXT_PUBLIC_GATEWAY as string

const logger = pino({
  name: 'Axios',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
})

// a new instance of axios with a custom config.
const instance: AxiosInstance = axios.create({
  baseURL,
})

// intercept requests and add authorization token
instance.interceptors.request.use(
  async (config) => {
    const session = await getSession()
    const tokenType = 'Bearer'

    if (session?.accessToken) {
      //@ts-ignore
      config.headers.authorization = `${tokenType} ${session?.accessToken}`
    }

    return config
  },
  (error: AxiosError) => {
    logger.warn({ error })
  },
)

export default instance
