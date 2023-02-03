import pino from 'pino'

export const NEXTAUTH_DEBUG_MODE = String(process.env.NEXTAUTH_DEBUG) === 'true'

export const nextAuthLogger = pino({
  name: 'NEXTAUTH',
  enabled: NEXTAUTH_DEBUG_MODE,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
})
