import { defineMessages } from 'react-intl'

const scope = 'app.commerce.faq'
const faqMessage = defineMessages({
  category: {
    id: `${scope}.category`,
    defaultMessage: 'دسته بندی',
  },
  questions: {
    id: `${scope}.questions`,
    defaultMessage: 'پرسش ها',
  },
  asks: {
    id: `${scope}.questions`,
    defaultMessage: 'پرسش های',
  },
  question: {
    id: `${scope}.questions`,
    defaultMessage: 'پرسش',
  },
  topic: {
    id: `${scope}.topic`,
    defaultMessage: 'موضوع',
  },
  whatAreYou: {
    id: `${scope}.whatAreYou`,
    defaultMessage: 'شما چیست؟',
  },
  search: {
    id: `${scope}.search`,
    defaultMessage: 'جستجو',
  },
  common: {
    id: `${scope}.common`,
    defaultMessage: 'متداول',
  },
  wereTheAnswersHelpful: {
    id: `${scope}.wereTheAnswersHelpful`,
    defaultMessage: 'آیا پاسخ ها مفید بود؟',
  },
  yes: {
    id: `${scope}.yes`,
    defaultMessage: 'بله',
  },
  no: {
    id: `${scope}.no`,
    defaultMessage: 'خیر',
  },
  youDidNotFindYourAnswer: {
    id: `${scope}.youDidNotFindYourAnswer`,
    defaultMessage: 'پاسخ خود را پیدا نکردید؟',
  },
  sendMessage: {
    id: `${scope}.sendMessage`,
    defaultMessage: 'ارسال پیام',
  },
  viewAdditionalDetails: {
    id: `${scope}.viewAdditionalDetails`,
    defaultMessage: 'مشاهده توضیحات تکمیلی',
  },
  yourAnwerIsSaved: {
    id: `${scope}.yourAnwerIsSaved`,
    defaultMessage: 'پاسخ شما درج شد',
  },
  yourAnwerIsSavedAlready: {
    id: `${scope}.yourAnwerIsSavedAlready`,
    defaultMessage: 'پاسخ شما قبلاً ذخیره شده است',
  },
})

export default faqMessage
