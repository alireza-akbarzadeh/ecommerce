import { useRouter } from 'next/router'
import pino from 'pino'
import { FC, ReactNode } from 'react'
import { IntlProvider, ReactIntlErrorCode } from 'react-intl'
import en from '../../../../public/locale/en.json'
import fa from '../../../../public/locale/fa.json'

const logger = pino({
  name: 'LANGUAGE_PROVIDER',
  enabled: process.env.LOG_LANGUAGE_PROVIDER === 'true',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
})

const LanguageProvider: FC<{ children?: ReactNode }> = ({ children }) => {
  const { locale, defaultLocale } = useRouter()

  const languages = { fa, en }

  const currentLocale = locale ?? defaultLocale ?? ('fa' as any)

  // TODO memo currentLocale & languages

  return (
    <IntlProvider
      locale={currentLocale}
      // @ts-ignore TODO check why????
      messages={languages[currentLocale] as any}
      onError={(err: any) => {
        // TODO check only log on DEV env
        if (err.code === ReactIntlErrorCode.MISSING_TRANSLATION) {
          // @ts-ignore TODO on remove this ignore
          return logger.warn({ message: err.message }, '[MISSING_TRANSLATION]')
        }
        //@ts-ignore
        logger.error({ type: ReactIntlErrorCode[err.code], ...err }, '[TRANSLATION]')
      }}
    >
      {children}
    </IntlProvider>
  )
}

export default LanguageProvider
