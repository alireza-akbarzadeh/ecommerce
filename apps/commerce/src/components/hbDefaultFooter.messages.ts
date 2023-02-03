import { defineMessages } from 'react-intl'

const scope = 'app.commerce.footer'
const hbDefaultFooterMessage = defineMessages({
  enterYourEmailToGetTheLatestNews: {
    id: `${scope}.enterYourEmailToGetTheLatestNews`,
    defaultMessage: 'برای اطلاع از آخرین تخفیف‌ها ایمیل خود را وارد کنید',
  },
  enterYourEmail: {
    id: `${scope}.enterYourEmail`,
    defaultMessage: 'ایمیل خود را وارد نمایید',
  },
  save: {
    id: `${scope}.save`,
    defaultMessage: 'ثبت',
  },
  copyRightIntellectual: {
    id: `${scope}.copyRightIntellectual`,
    defaultMessage:
      '© تمام حقوق مادی و معنوی اين وب‌سايت برای شرکت نوآوران داد و ستد هستی (بازار اینترنتی دارتیل) است. (نسخه {version})',
  },
  operationSuccessfullyDone: {
    id: `${scope}.operationSuccessfullyDone`,
    defaultMessage: 'عملیات با موفقیت انجام شد',
  },
})

export default hbDefaultFooterMessage
