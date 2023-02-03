import { defineMessages } from 'react-intl'

const scope = 'app.commerce.account-popover'
const AccountPopoverMessages = defineMessages({
  wallet: {
    id: `${scope}.wallet`,
    defaultMessage: 'کیف پول',
  },
  orders: {
    id: `${scope}.orders`,
    defaultMessage: 'سفارش‌ها',
  },
  comments: {
    id: `${scope}.comments`,
    defaultMessage: 'نظرات من',
  },
  logoutFromSystem: {
    id: `${scope}.logoutFromSystem`,
    defaultMessage: 'خروج',
  },
  walletBalance: {
    id: `${scope}.walletBalance`,
    defaultMessage: '{balance} {currency}',
  },
})

export default AccountPopoverMessages
