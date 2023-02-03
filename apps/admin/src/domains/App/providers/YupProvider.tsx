import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import validationsMessages from '@hasty-bazar-admin/core/translations/validations.messages'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import { setLocale } from 'yup'

const YupProvider: FC = () => {
  const { formatMessage } = useIntl()
  setLocale({
    mixed: {
      required: ({ path }) =>
        `${formatMessage(validationsMessages.isRequired, {
          msg: path,
        })}`,
    },
    string: {
      // required: ({ path }) =>
      //   `${formatMessage(validationsMessages.isRequired, {
      //     msg: path,
      //   })}`,
      length: ({ length }) =>
        `${formatMessage(validationsMessages.mostNumberWithCount, {
          count: length,
        })}`,
      email: () =>
        formatMessage(validationsMessages.enterValid, {
          msg: formatMessage(phrasesMessages.email),
        }),
      url: () =>
        formatMessage(validationsMessages.enterValid, {
          msg: formatMessage(phrasesMessages.url),
        }),
      min: ({ min }) =>
        `${formatMessage(validationsMessages.minLengthValidation, {
          count: min,
        })}`,
    },
    array: {
      // required: ({ path }) =>
      //   `${formatMessage(validationsMessages.isRequired, {
      //     msg: path,
      //   })}`,
      min: ({ min }) =>
        `${formatMessage(validationsMessages.minArrayLengthValidation, {
          count: min,
        })}`,
    },
  })
  return <></>
}
export default YupProvider
