import { defineMessages } from 'react-intl'

const scope = 'app.vendor.domains.products.containers.recordChangeHistory'
const recordChangeHistoryMessages = defineMessages({
  record: {
    id: `${scope}.record`,
    defaultMessage: 'ردیف',
  },
  operation: {
    id: `${scope}.operation`,
    defaultMessage: 'عملیات',
  },
  username: {
    id: `${scope}.username`,
    defaultMessage: 'نام کاربری',
  },
  changeDate: {
    id: `${scope}.changeDate`,
    defaultMessage: 'تاریخ تغییر',
  },
  changeHour: {
    id: `${scope}.changeHour`,
    defaultMessage: 'ساعت تغییر',
  },
  gateway: {
    id: `${scope}.gateway`,
    defaultMessage: 'درگاه',
  },
  userIp: {
    id: `${scope}.userIp`,
    defaultMessage: 'IP کاربر',
  },
  seeDetails: {
    id: `${scope}.seeDetails`,
    defaultMessage: 'مشاهده جزییات',
  },
  fieldFilter: {
    id: `${scope}.fieldFilter`,
    defaultMessage: 'فیلتر فیلد',
  },
  fieldName: {
    id: `${scope}.fieldName`,
    defaultMessage: 'نام فیلد',
  },
  fromValue: {
    id: `${scope}.fromValue`,
    defaultMessage: 'از مقدار',
  },
  toValue: {
    id: `${scope}.toValue`,
    defaultMessage: 'به مقدار',
  },
  seeMore: {
    id: `${scope}.seeMore`,
    defaultMessage: 'مشاهده جزییات',
  },
})

export default recordChangeHistoryMessages
