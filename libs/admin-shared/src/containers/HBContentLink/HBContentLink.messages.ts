import { defineMessages } from 'react-intl'

const contentLinkMessages = defineMessages({
  notValidLink: {
    id: `app.containers.HBContentLink.notValidLink`,
    defaultMessage: 'لینک وارد شده معتبر نیست',
  },
  errorOnAddLink: {
    id: `app.containers.HBContentLink.errorOnAddLink`,
    defaultMessage: 'خطا در افزودن لینک',
  },
  errorOnCheckLink: {
    id: `app.containers.HBContentLink.errorOnCheckLink`,
    defaultMessage: 'خطا در چک کردن لینک',
  },
  errorOnDeleteLink: {
    id: `app.containers.HBContentLink.errorOnDeleteLink`,
    defaultMessage: 'خطا در حذف کردن لینک',
  },
  linkList: {
    id: `app.containers.HBContentLink.linkList`,
    defaultMessage: 'لینک های ثبت شده',
  },
  linkTitle: {
    id: `app.containers.HBContentLink.linkTitle`,
    defaultMessage: 'لینک URL',
  },
})
export default contentLinkMessages
