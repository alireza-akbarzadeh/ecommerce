import { defineMessages } from 'react-intl'

const scope = 'app.commerce.components.defaultHeader'
const DefaultHeaderMessges = defineMessages({
  dayDiscount: {
    id: `${scope}.dayDiscount`,
    defaultMessage: 'تخفیف‌های منتخب',
  },
  mostSale: {
    id: `${scope}.mostSale`,
    defaultMessage: 'پرفروش‌ترین‌ها',
  },
  help: {
    id: `${scope}.help`,
    defaultMessage: 'راهنما',
  },
  saleInHit: {
    id: `${scope}.saleInHit`,
    defaultMessage: 'در دارتیل بفروشید!',
  },
  favorite: {
    id: `${scope}.favorite`,
    defaultMessage: 'پسند شده‌ها',
  },
  favoriteList: {
    id: `${scope}.favorite`,
    defaultMessage: 'فهرست محصولات پسند شده',
  },
  loginOrSignUo: {
    id: `${scope}.loginOrSignUo`,
    defaultMessage: 'ثبت نام / ورود',
  },
  seeFavorites: {
    id: `${scope}.seeFavorites`,
    defaultMessage: 'مشاهده فهرست کامل',
  },
})

export default DefaultHeaderMessges
