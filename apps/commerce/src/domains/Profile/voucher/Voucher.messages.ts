import { defineMessages } from 'react-intl'

const scope = 'app.commerce.profile.voucher'
const VoucherMessages = defineMessages({
  activeVouchers: {
    id: `${scope}.activeVouchers`,
    defaultMessage: 'کدهای فعال',
  },
  deActiveVouchers: {
    id: `${scope}.deActiveVouchers`,
    defaultMessage: 'کدهای منقضی شده',
  },
  voucherTitle: {
    id: `${scope}.voucherTitle`,
    defaultMessage: `{title} (حداقل سفارش: {minPriceValue} {currency} )`,
  },
  voucherUsageCount: {
    id: `${scope}.voucherUsageCount`,
    defaultMessage: `{usageLimit} بار مصرف`,
  },
  expireVoucher: {
    id: `${scope}.expireVoucher`,
    defaultMessage: 'منقضی‌شده',
  },
  voucherCustomerUsedCount: {
    id: `${scope}.voucherCustomerUsedCount`,
    defaultMessage: '{voucherCustomerUsedCount} بار استفاده‌شده',
  },
  voucherEndDateCount: {
    id: `${scope}.voucherEndDateCount`,
    defaultMessage: `قابل استفاده تا {endDateCount} روز دیگر`,
  },
  voucherCopy: {
    id: `${scope}.voucherCopy`,
    defaultMessage: 'کپی کردن',
  },
})

export default VoucherMessages
