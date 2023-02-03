import { defineMessages } from 'react-intl'

const scope = 'app.admin.domains.users.customerDiscountCode'

const customerDiscountCodeMessages = defineMessages({
  titleTab: {
    id: `${scope}.titleTab`,
    defaultMessage: 'کد تخفیف های مشتری',
  },
  activeCodes: {
    id: `${scope}.activeCodes`,
    defaultMessage: 'کدهای فعال',
  },
  usedCodes: {
    id: `${scope}.activeCodes`,
    defaultMessage: 'کدهای استفاده شده',
  },
  expireCodes: {
    id: `${scope}.expireCodes`,
    defaultMessage: 'کدهای منقضی شده',
  },
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
    defaultMessage: `{title} (حداقل سفارش: {minPriceValue} هزار {currency})`,
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
  orderNumber: {
    id: `${scope}.orderNumber`,
    defaultMessage: `شماره سفارش`,
  },
  orderPrice: {
    id: `${scope}.orderPrice`,
    defaultMessage: `مبلغ سفارش`,
  },
  orderDate: {
    id: `${scope}.orderDate`,
    defaultMessage: `تاریخ سفارش {orderDate}`,
  },
  stateCode: {
    id: `${scope}.stateCode`,
    defaultMessage: 'مرحله',
  },
  provider: {
    id: `${scope}.provider`,
    defaultMessage: 'نوع ایجاد کننده',
  },
})
export default customerDiscountCodeMessages
