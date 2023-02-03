import { defineMessages } from 'react-intl'

const scope = 'app.commerce.landing'
const landingMessages = defineMessages({
  addToBasket: {
    id: `${scope}.addToBasket`,
    defaultMessage: 'افزودن به سبد خرید',
  },
  unavailable: {
    id: `${scope}.unavailable`,
    defaultMessage: 'ناموجود',
  },
  specialOffer: {
    id: `${scope}.specialOffer`,
    defaultMessage: 'پیشنهاد ویژه',
  },
  numberLeftInStock: {
    id: `${scope}.numberLeftInStock`,
    defaultMessage: ' عدد مانده در انبار',
  },
  follower: {
    id: `${scope}.follower`,
    defaultMessage: 'دنبال کننده',
  },
  save: {
    id: `${scope}.save`,
    defaultMessage: 'ذخیره',
  },
})

export default landingMessages
