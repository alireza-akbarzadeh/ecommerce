import { defineMessages } from 'react-intl'

const scope = 'app.commerce.pageNotFound'
const notFoundMessage = defineMessages({
  pageNotFound: {
    id: `${scope}.pageNotFound`,
    defaultMessage: 'صفحه ای پیدا نشد',
  },
  thisPageIsUnavailableOrHasBeenRemoved: {
    id: `${scope}.thisPageIsUnavailableOrHasBeenRemoved`,
    defaultMessage: 'این صفحه در دسترس نیست یا حذف شده است',
  },
  backToMainPage: {
    id: `${scope}.backToMainPage`,
    defaultMessage: 'بازگشت به صفحه اصلی',
  },
})

export default notFoundMessage
