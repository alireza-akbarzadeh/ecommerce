import { defineMessages } from 'react-intl'

const scope = 'app.admin.domains.users.userMessages'

const userMessages = defineMessages({
  titleTab: {
    id: `${scope}.titleTab`,
    defaultMessage: 'فیلتر پیام',
  },
  titleUserTab: {
    id: `${scope}.titleUserTab`,
    defaultMessage: 'مدیریت پیام ها',
  },
  formType: {
    id: `${scope}.formType`,
    defaultMessage: 'نوع',
  },
  formFromDate: {
    id: `${scope}.formFromDate`,
    defaultMessage: 'از تاریخ',
  },
  formToDate: {
    id: `${scope}.formToDate`,
    defaultMessage: 'تا تاریخ',
  },
  formSendType: {
    id: `${scope}.formSendType`,
    defaultMessage: 'نحوه ارسال',
  },
  formMessageEvent: {
    id: `${scope}.formMessageEvent`,
    defaultMessage: 'رخداد پیام',
  },
  formSendFromPort: {
    id: `${scope}.formSendFromPort`,
    defaultMessage: 'ارسال از درگاه',
  },
  buttonSearch: {
    id: `${scope}.buttonSearch`,
    defaultMessage: 'اعمال فیلتر',
  },
  gridDate: {
    id: `${scope}.gridDate`,
    defaultMessage: 'زمان ارسال/دریافت',
  },
  gridTitle: {
    id: `${scope}.gridTitle`,
    defaultMessage: 'عنوان پیام/قالب',
  },
  gridMessage: {
    id: `${scope}.gridMessage`,
    defaultMessage: 'متن پیام',
  },
  gridFullName: {
    id: `${scope}.gridFullName`,
    defaultMessage: 'نام و نام خانوادگی',
  },
  gridMobileEmail: {
    id: `${scope}.gridMobile`,
    defaultMessage: 'شماره همراه/ایمیل',
  },
})
export default userMessages
