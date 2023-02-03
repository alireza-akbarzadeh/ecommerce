import { defineMessages } from 'react-intl'

const scope = 'app.commerce.components'
const ComponentsMessages = defineMessages({
  noResult: {
    id: `${scope}.noResult`,
    defaultMessage: 'نتیجه‌ای یافت نشد.',
  },
  cargoItemQuantity: {
    id: `${scope}.cargoItemQuantity`,
    defaultMessage: '{count} عدد',
  },
  back: {
    id: `${scope}.back`,
    defaultMessage: 'بازگشت',
  },
  continue: {
    id: `${scope}.continue`,
    defaultMessage: 'ادامه',
  },
  home: {
    id: `${scope}.home`,
    defaultMessage: 'خانه',
  },
  category: {
    id: `${scope}.category`,
    defaultMessage: 'دسته بندی',
  },
  basket: {
    id: `${scope}.basket`,
    defaultMessage: 'سبد خرید',
  },
  profile: {
    id: `${scope}.profile`,
    defaultMessage: 'پروفایل',
  },
})

export default ComponentsMessages
