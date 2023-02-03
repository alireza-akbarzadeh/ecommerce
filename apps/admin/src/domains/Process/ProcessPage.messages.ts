import { defineMessages } from 'react-intl'

const processPageMessages = defineMessages({
  general: {
    id: `app.admin.domains.process.general`,
    defaultMessage: 'عمومی',
  },
  process: {
    id: `app.admin.domains.process.process`,
    defaultMessage: 'روند',
  },
  processName: {
    id: `app.admin.domains.process.processName`,
    defaultMessage: 'عنوان فرآیند',
  },
  processType: {
    id: `app.admin.domains.process.processType`,
    defaultMessage: 'نوع فرآیند',
  },
  platform: {
    id: `app.admin.domains.process.platform`,
    defaultMessage: 'پلتفرم',
  },
  parameter: {
    id: `app.admin.domains.process.parameter`,
    defaultMessage: 'پارامتر',
  },
  description: {
    id: `app.admin.domains.process.description`,
    defaultMessage: 'توضیحات',
  },
  numberOfActiveConcurrentRulesLimit: {
    id: `app.admin.domains.process.numberOfActiveConcurrentRulesLimit`,
    defaultMessage: 'محدودیت تعداد فعال قانون همزمان دارد',
  },
  errorOnDelete: {
    id: `app.admin.domains.process.errorOnDelete`,
    defaultMessage: 'خطا در حذف رکورد',
  },
  unsuccessDelete: {
    id: `app.admin.domains.process.unsuccessDelete`,
    defaultMessage: 'رکورد با موفقیت حذف نگردید',
  },
  successDelete: {
    id: `app.admin.domains.process.successDelete`,
    defaultMessage: 'رکورد با موفقیت حذف گردید',
  },
  successEdit: {
    id: `app.admin.domains.process.successEdit`,
    defaultMessage: 'رکورد با موفقیت ویرایش گردید',
  },
  areYouSure: {
    id: `app.admin.domains.process.areYouSure`,
    defaultMessage: 'آیا از حذف count پیام مرتبط با فرآیند اطمینان داری',
  },
  save: {
    id: `app.admin.domains.process.save`,
    defaultMessage: 'ذخیره کردن',
  },
  deleteProcessRelatedMessage: {
    id: `app.admin.domains.process.deleteProcessRelatedMessage`,
    defaultMessage: 'حذف پیام مرتبط با فرآیند',
  },
  id: {
    id: `app.admin.domains.process.id`,
    defaultMessage: 'شناسه',
  },
  code: {
    id: `app.admin.domains.process.code`,
    defaultMessage: 'کد',
  },
  messageTempletName: {
    id: `app.admin.domains.process.messageTempletName`,
    defaultMessage: 'عنوان پیام',
  },
  processRelatedMessages: {
    id: `app.admin.domains.process.processRelatedMessages`,
    defaultMessage: 'پیام های مرتبط با فرآیند',
  },
  ruleRelatedMessages: {
    id: `app.admin.domains.process.ruleRelatedMessages`,
    defaultMessage: 'قوانین مرتبط با فرآیند',
  },
  isRepeatable: {
    id: `app.admin.domains.process.isRepeatable`,
    defaultMessage: 'تکرار شونده',
  },
  interval: {
    id: `app.admin.domains.process.interval`,
    defaultMessage: 'تناوب تکرار(ماهانه/هفتگی/روزانه/ساعتی)',
  },
  sendStartDate: {
    id: `app.admin.domains.process.sendStartDate`,
    defaultMessage: 'تاریخ شروع ارسال',
  },
  sendEndDate: {
    id: `app.admin.domains.process.sendEndDate`,
    defaultMessage: 'تاریخ پایان ارسال',
  },
  sendStartTime: {
    id: `app.admin.domains.process.sendStartTime`,
    defaultMessage: 'زمان شروع ارسال',
  },
  sendEndTime: {
    id: `app.admin.domains.process.sendEndTime`,
    defaultMessage: 'زمان پایان ارسال',
  },
  immediately: {
    id: `app.admin.domains.process.immediately`,
    defaultMessage: 'بلافاصله',
  },
  immediatelyAfterSend: {
    id: `app.admin.domains.process.immediatelyAfterSend`,
    defaultMessage: 'بلافاصله بعد از ارسال',
  },
  sendTime: {
    id: `app.admin.domains.process.sendTime`,
    defaultMessage: 'زمان ارسال',
  },
  selectTime: {
    id: `app.admin.domains.process.selectTime`,
    defaultMessage: 'انتخاب زمان',
  },
  timeIntervalAfterCreation: {
    id: `app.admin.domains.process.timeIntervalAfterCreation`,
    defaultMessage: 'فاصله زمانی بعد از ایجاد',
  },
  sendEndDateMustBeGreateThanTheSendStartDate: {
    id: `app.admin.domains.process.sendEndDate`,
    defaultMessage: 'تاریخ پایان ارسال باید بزرگتر از تاریخ شروع ارسال باشد',
  },
  sendEndTimeMustBeGreateThanTheSendStartTime: {
    id: `app.admin.domains.process.sendEndDate`,
    defaultMessage: 'زمان پایان ارسال باید بزرگتر از زمان شروع ارسال باشد',
  },
  isRequired: {
    id: `app.admin.domains.process.isRequired`,
    defaultMessage: 'اجباری است.',
  },
  status: {
    id: `app.admin.domains.process.status`,
    defaultMessage: 'وضعیت',
  },
})
export default processPageMessages
