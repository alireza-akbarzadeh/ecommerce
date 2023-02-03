import { defineMessages } from 'react-intl'
const scope = 'app.admin.domains.users.businessDays'
const businessDaysMessages = defineMessages({
  businessDays: {
    id: `${scope}.businessDays`,
    defaultMessage: 'تقویم کاری فروشگاه',
  },
  detailsOfDeliveryDays: {
    id: `${scope}.detailsOfDeliveryDays`,
    defaultMessage: 'جزئیات روزهای تحویل',
  },
  holidays: {
    id: `${scope}.holidays`,
    defaultMessage: 'روزهای تعطیل',
  },
  notDelivery: {
    id: `${scope}.notDelivery`,
    defaultMessage: 'تحویل نداریم',
  },
  submitFilter: {
    id: `${scope}.submitFilter`,
    defaultMessage: 'اعمال فیلتر',
  },
  removeFilter: {
    id: `${scope}.removeFilter`,
    defaultMessage: 'حذف فیلتر',
  },
  days: {
    id: `${scope}.days`,
    defaultMessage: 'ایام هفته',
  },
  kindOfDays: {
    id: `${scope}.kindOfDays`,
    defaultMessage: 'نوع روز',
  },
  deliveryFrom: {
    id: `${scope}.deliveryFrom`,
    defaultMessage: 'تحویل از ساعت',
  },
  deliveryTo: {
    id: `${scope}.deliveryTo`,
    defaultMessage: 'تحویل تا ساعت',
  },
  status: {
    id: `${scope}.status`,
    defaultMessage: 'وضعیت',
  },
  row: {
    id: `${scope}.row`,
    defaultMessage: 'ردیف',
  },
  workDay: {
    id: `${scope}.workDay`,
    defaultMessage: 'کاری',
  },
  holiDay: {
    id: `${scope}.holiDay`,
    defaultMessage: 'تعطیل',
  },
  partTime: {
    id: `${scope}.partTime`,
    defaultMessage: 'نیم روز',
  },
  vocationDay: {
    id: `${scope}.vocationDay`,
    defaultMessage: 'روزهای تعطیل',
  },
  confirmationMessageDeleting: {
    id: `${scope}.confirmationMessageDeleting`,
    defaultMessage: `آیا از حذف {msg} روز کاری اطمینان دارید؟`,
  },
  confirmationTitleDeleting: {
    id: `${scope}.confirmationTitleDeleting`,
    defaultMessage: 'حذف روزهای کاری',
  },
  confirmationMessageDeletingNonDelivery: {
    id: `${scope}.confirmationMessageDeletingNonDelivery`,
    defaultMessage: `آیا از حذف {msg} روز تعطیل اطمینان دارید؟`,
  },
  confirmationTitleDeletingNonDelivery: {
    id: `${scope}.confirmationTitleDeletingNonDelivery`,
    defaultMessage: 'حذف روزهای تعطیل',
  },
  workingDayDeleteSuccessFully: {
    id: `${scope}.workingDayDeleteSuccessFully`,
    defaultMessage: 'تعداد {count} روز کاری حذف شد',
  },
  holidayDayDeleteSuccessFully: {
    id: `${scope}.holidayDayDeleteSuccessFully`,
    defaultMessage: 'تعداد {count} روز تعطیل حذف شد',
  },
  workingDaysChangeStateConfirm: {
    id: `${scope}.workingDaysChangeStateConfirm`,
    defaultMessage: 'آیا از تغییر وضعیت {changeCount} روز کاری اطمینان دارید؟',
  },
  workingDaysChangeState: {
    id: `a${scope}.workingDaysChangeState`,
    defaultMessage: 'تغییر وضعیت روز کاری',
  },
  date: {
    id: `a${scope}.date`,
    defaultMessage: 'تاریخ',
  },
  detailsOfHolidayDays: {
    id: `${scope}.detailsOfDeliveryDays`,
    defaultMessage: 'جزئیات روزهای تعطیل',
  },
  fromDate: {
    id: `a${scope}.fromDate`,
    defaultMessage: 'از تاریخ',
  },
  toDate: {
    id: `a${scope}.toDate`,
    defaultMessage: 'تا تاریخ',
  },
})
export default businessDaysMessages
