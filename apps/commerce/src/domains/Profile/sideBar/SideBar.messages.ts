import { defineMessages } from 'react-intl'

const scope = 'app.commerce.profile.sideBar'
const SideBarMessages = defineMessages({
  accountBalanceTitle: {
    id: `${scope}.accountBalanceTitle`,
    defaultMessage: 'موجودی کیف پول :',
  },
  accountBalanceValue: {
    id: `${scope}.accountBalanceValue`,
    defaultMessage: '{value} {unit}',
  },
  addCredit: {
    id: `${scope}.addCredit`,
    defaultMessage: 'افزایش موجودی',
  },
  accountManagment: {
    id: `${scope}.accountManagment`,
    defaultMessage: 'حساب من',
  },
  wallet: {
    id: `${scope}.wallet`,
    defaultMessage: 'کیف پول',
  },
  orders: {
    id: `${scope}.orders`,
    defaultMessage: 'سفارش‌های من',
  },
  address: {
    id: `${scope}.address`,
    defaultMessage: 'آدرس‌های من',
  },
  favorites: {
    id: `${scope}.favorites`,
    defaultMessage: 'پسند شده‌ها',
  },
  saved: {
    id: `${scope}.saved`,
    defaultMessage: 'ذخیره‌شده‌ها',
  },
  comments: {
    id: `${scope}.comments`,
    defaultMessage: 'نظرات من',
  },
  voucher: {
    id: `${scope}.voucher`,
    defaultMessage: 'تخفیف‌ها و جایزه‌ها',
  },
  notes: {
    id: `${scope}.notes`,
    defaultMessage: 'پشتیبانی',
  },
  signOut: {
    id: `${scope}.signOut`,
    defaultMessage: 'خروج',
  },
  remove: {
    id: `${scope}.remove`,
    defaultMessage: 'حذف',
  },
})

export default SideBarMessages
