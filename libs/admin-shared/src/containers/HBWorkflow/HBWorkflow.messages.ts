import { defineMessages } from 'react-intl'
const scope = 'app.containers.workflow'

const workflowMessages = defineMessages({
  statusLabel: {
    id: `${scope}.statusLabel`,
    defaultMessage: 'وضعیت انتشار',
  },
  changeStatus: {
    id: `${scope}.changeStatus`,
    defaultMessage: 'تغییر وضعیت',
  },
  successChange: {
    id: `${scope}.successChange`,
    defaultMessage: 'وضعیت با موفقیت تغییر کرد',
  },
  failedChange: {
    id: `${scope}.failedChange`,
    defaultMessage: 'وضعیت تغییر نکرد',
  },
  workflow: {
    id: `${scope}.workflow`,
    defaultMessage: 'گردش کار',
  },
  workflowConfirmTitle: {
    id: `${scope}.workflowConfirmTitle`,
    defaultMessage: 'تایید تغییر گردش کار',
  },
  reasonTitle: {
    id: `${scope}.reasonTitle`,
    defaultMessage: 'دلایل',
  },
  commentTitle: {
    id: `${scope}.commentTitle`,
    defaultMessage: 'توضیحات',
  },
  workflowConfirmButton: {
    id: `${scope}.workflowConfirmButton`,
    defaultMessage: 'ثبت مرحله',
  },
  workflowNoStatus: {
    id: `${scope}.workflowNoStatus`,
    defaultMessage: 'هیچ وضعیت قابل انتخاب نیست',
  },
  workflowHistoryTitle: {
    id: `${scope}.workflowHistoryTitle`,
    defaultMessage: 'تاریخچه گردش کار',
  },
  gateway: {
    id: `${scope}.gateway`,
    defaultMessage: 'درگاه',
  },
  byUser: {
    id: `${scope}.byUser`,
    defaultMessage: 'توسط کاربر',
  },
  date: {
    id: `${scope}.date`,
    defaultMessage: 'تاریخ',
  },
  hour: {
    id: `${scope}.hour`,
    defaultMessage: 'ساعت',
  },
  fromStateTitle: {
    id: `${scope}.fromStateTitle`,
    defaultMessage: 'از وضعیت',
  },
  toStateTitle: {
    id: `${scope}.toStateTitle`,
    defaultMessage: 'به وضعیت',
  },
  result: {
    id: `${scope}.result`,
    defaultMessage: 'نتیجه اجرا',
  },
  postScript: {
    id: `${scope}.postScript`,
    defaultMessage: 'پی نوشت',
  },
  reason: {
    id: `${scope}.reason`,
    defaultMessage: 'دلیل',
  },
  draft: {
    id: `${scope}.draft`,
    defaultMessage: 'پیش نویس',
  },
  published: {
    id: `${scope}.published`,
    defaultMessage: 'انتشار یافته',
  },
  disable: {
    id: `${scope}.disable`,
    defaultMessage: 'غیر فعال',
  },
  done: {
    id: `${scope}.done`,
    defaultMessage: 'انجام شد',
  },
  notDone: {
    id: `${scope}.notDone`,
    defaultMessage: 'انجام نشد',
  },
})
export default workflowMessages
