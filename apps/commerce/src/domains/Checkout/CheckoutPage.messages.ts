import { defineMessages } from 'react-intl'

export const scope = 'app.commerce.shipping'
const CheckoutPageMessages = defineMessages({
  previousStep: {
    id: `${scope}.previousStep`,
    defaultMessage: 'بازگشت به مرحله قبل',
  },
  totalAmount: {
    id: `${scope}.totalAmount`,
    defaultMessage: 'قیمت کالاها({count})',
  },
  productsCount: {
    id: `${scope}.productsCount`,
    defaultMessage: '({count} کالا)',
  },
  shippingFee: {
    id: `${scope}.shippingFee`,
    defaultMessage: 'هزینه ارسال',
  },
  totalDiscount: {
    id: `${scope}.totalDiscount`,
    defaultMessage: 'سود شما از خرید',
  },
  paymentAmount: {
    id: `${scope}.paymentAmount`,
    defaultMessage: 'مبلغ قابل پرداخت',
  },
  totalPay: {
    id: `${scope}.totalPay`,
    defaultMessage: 'مجموع سفارش',
  },
  continueLable: {
    id: `${scope}.continueLable`,
    defaultMessage: 'ادامه خرید',
  },
  paymentLable: {
    id: `${scope}.paymentLable`,
    defaultMessage: 'پرداخت آنلاین',
  },
  shippingLable: {
    id: `${scope}.shippingLable`,
    defaultMessage: 'تکمیل خرید',
  },
  shippingMethods: {
    id: `${scope}.shippingMethods`,
    defaultMessage: 'روش تحویل سفارش',
  },
  shippingMethodsDefault: {
    id: `${scope}.shippingMethodsDefault`,
    defaultMessage: 'همزمان',
  },
  shippingMethodsByVendor: {
    id: `${scope}.shippingMethodsByVendor`,
    defaultMessage: 'به تفکیک فروشگاه',
  },
  shippingMethodsFastest: {
    id: `${scope}.shippingMethodsFastest`,
    defaultMessage: 'سریع',
  },
  deliveryAddress: {
    id: `${scope}.deliveryAddress`,
    defaultMessage: 'آدرس تحویل سفارش',
  },
  basketList: {
    id: `${scope}.basketList`,
    defaultMessage: 'مشاهده اقلام سفارش ({count} کالا)',
  },
  orderList: {
    id: `${scope}.orderList`,
    defaultMessage: 'جزئیات سفارش شما({count} کالا)',
  },
  basket: {
    id: `${scope}.basket`,
    defaultMessage: 'سبد خرید',
  },
  shipping: {
    id: `${scope}.shipping`,
    defaultMessage: 'زمان و نحوه ارسال',
  },
  payment: {
    id: `${scope}.payment`,
    defaultMessage: 'پرداخت',
  },
  seller: {
    id: `${scope}.seller`,
    defaultMessage: 'فروشگاه',
  },
  vendorName: {
    id: `${scope}.vendorName`,
    defaultMessage: 'فروشگاه {vendorName}',
  },
  cargo: {
    id: `${scope}.cargo`,
    defaultMessage: '({count} مرسوله)',
  },
  cargoCountTitle: {
    id: `${scope}.cargoCountTitle`,
    defaultMessage: 'مرسوله {count}',
  },
  bundleShippingFee: {
    id: `${scope}.bundleShippingFee`,
    defaultMessage: 'هزینه ارسال {count} {currency}',
  },
  cargoItemQuantity: {
    id: `${scope}.cargoItemQuantity`,
    defaultMessage: '{count} عدد',
  },
  changeAddressWithCount: {
    id: `${scope}.changeAddressWithCount`,
    defaultMessage: 'تغییر آدرس ( {count} مورد)',
  },
  changeAddress: {
    id: `${scope}.changeAddress`,
    defaultMessage: 'تغییر آدرس',
  },
  addNewAddress: {
    id: `${scope}.addNewAddress`,
    defaultMessage: 'افزودن آدرس جدید',
  },
  chooseAddress: {
    id: `${scope}.chooseAddress`,
    defaultMessage: 'انتخاب آدرس',
  },
  addAddress: {
    id: `${scope}.addAddress`,
    defaultMessage: 'افزودن آدرس',
  },
  cancel: {
    id: `${scope}.cancel`,
    defaultMessage: 'انصراف',
  },
  confirm: {
    id: `${scope}.confirm`,
    defaultMessage: 'تایید',
  },
  nearestShippingTime: {
    id: `${scope}.nearestShippingTime`,
    defaultMessage: 'نزدیک‌ترین زمان ارسال',
  },
  selectShippingTime: {
    id: `${scope}.selectShippingTime`,
    defaultMessage: 'انتخاب زمان ارسال',
  },
  selectShippingProvider: {
    id: `${scope}.selectShippingProvider`,
    defaultMessage: 'انتخاب ارسال کننده',
  },
  feeWithCurrency: {
    id: `${scope}.feeWithCurrency`,
    defaultMessage: '{fee} {currency}',
  },
  shippingFeeDetail: {
    id: `${scope}.initialShippingFee`,
    defaultMessage:
      '(هزینه اولیه حمل {initialShippingFee} {currency} , تخفیف حمل {shippingFeeDiscount} {currency})',
  },
  shippingByProvider: {
    id: `${scope}.shippingBy`,
    defaultMessage: `ارسال به وسیله {provider}`,
  },
  changeDeliverProvider: {
    id: `${scope}.changeDeliverProvider`,
    defaultMessage: 'تغییر شیوه ارسال',
  },
  changeDeliverDate: {
    id: `${scope}.changeDeliverDate`,
    defaultMessage: 'تغییر زمان ارسال',
  },
  selectDeliverDate: {
    id: `${scope}.selectDeliverDate`,
    defaultMessage: 'انتخاب زمان ارسال',
  },
  newAddress: {
    id: `${scope}.newAddress`,
    defaultMessage: 'آدرس تحویل جدید',
  },
  faultMessage: {
    id: `${scope}.faultMessage`,
    defaultMessage: 'مشکلی پیش آمده است لطفا مجددا تلاش نمایید.',
  },
  onServiceErrorMessage: {
    id: `${scope}.onServiceErrorMessage`,
    defaultMessage: 'خطا در دریافت اطلاعات!',
  },
  attentionMessage: {
    id: `${scope}.attentionMessage`,
    defaultMessage: 'توجه',
  },
  unableShippingProductsMessage: {
    id: `${scope}.attentionMessage`,
    defaultMessage: 'امکان ارسال کالاهای زیر به آدرس انتخابی شما وجود ندارد',
  },
  deleteProduct: {
    id: `${scope}.deleteProduct`,
    defaultMessage: 'حذف کالا',
  },
  deliveryDatePreview: {
    id: `${scope}.deliveryDatePreview`,
    defaultMessage: 'تاریخ تحویل {date}',
  },
  deliveryTimePreview: {
    id: `${scope}.deliveryTimePreview`,
    defaultMessage: '  ساعت {to}-{from}',
  },
  deliveryDateMessage: {
    id: `${scope}.deliveryDateMessage`,
    defaultMessage: 'تاریخ تحویل',
  },
  sellersShare: {
    id: `${scope}.sellersShare`,
    defaultMessage: 'سهم فروشگاه',
  },
  buyersShare: {
    id: `${scope}.buyersShare`,
    defaultMessage: 'سهم خریدار',
  },
  shippingFeeWithoutValue: {
    id: `${scope}.shippingFeeWithoutValue`,
    defaultMessage: 'هزینه ارسال براساس آدرس، زمان تحویل، وزن و حجم مرسوله شما محاسبه می‌شود.',
  },
  paymentMethodsTitle: {
    id: `${scope}.paymentMethodsTitle`,
    defaultMessage: 'روش پرداخت سفارش',
  },
  paymentVoucherCodeTitle: {
    id: `${scope}.paymentVoucherCodeTitle`,
    defaultMessage: 'کد تخفیف',
  },
  voucherSectionTitle: {
    id: `${scope}.voucherSectionTitle`,
    defaultMessage: 'افزودن کد تخفیف',
  },
  paymentVoucherCodePlaceholder: {
    id: `${scope}.paymentVoucherCodePlaceholder`,
    defaultMessage: 'کد تخفیف خود را اینجا وارد کنید',
  },
  paymentVoucherCodeEmptyErrorMessage: {
    id: `${scope}.paymentVoucherCodeEmptyErrorMessage`,
    defaultMessage: 'کد تخفیف نمی‌تواند خالی باشد!',
  },
  paymentVoucherCodeSuccessMessage: {
    id: `${scope}.paymentVoucherCodeSuccessMessage`,
    defaultMessage: 'کد تخفیف شما با موفقیت ثبت شد',
  },
  paymentVoucherCodeFailedMessage: {
    id: `${scope}.paymentVoucherCodeFailedMessage`,
    defaultMessage: 'کد تخفیف شما اشتباه است یا قبلا استفاده شده است.',
  },
  registerBtn: {
    id: `${scope}.registerBtn`,
    defaultMessage: 'ثبت',
  },
  deleteBtn: {
    id: `${scope}.deleteBtn`,
    defaultMessage: 'حذف',
  },
  wallet: {
    id: `${scope}.wallet`,
    defaultMessage: 'پرداخت از کیف پول',
  },
  walletBalance: {
    id: `${scope}.walletBalance`,
    defaultMessage: '(موجودی {balance} {currency})',
  },
  hasAwaitPayment: {
    id: `${scope}.hasAwaitPayment`,
    defaultMessage: 'شما دارای سفارش در انتظار پرداخت هستید',
  },
  timeFrame: {
    id: `${scope}.timeFrame`,
    defaultMessage: 'ساعت {from} تا  {to}',
  },
  backToShippingMessage: {
    id: `${scope}.backToShippingMessage`,
    defaultMessage:
      'لطفا ابتدا زمان ارسال سفارش خود را انتخاب نمایید ، شما به صفحه انتخاب زمان و نحوه ارسال سفارش منتقل می‌شوید.',
  },
  backToBasketMessage: {
    id: `${scope}.backToBasketMessage`,
    defaultMessage: 'لطفا وضعیت سبد خرید را مشخص نمایید، شما به صفحه سبد خرید منتقل می‌شوید.',
  },
  shipmentDeliveryDate: {
    id: `${scope}.shipmentDeliveryDate`,
    defaultMessage: 'تاریخ تحویل {date} ',
  },
  free: {
    id: `${scope}.free`,
    defaultMessage: 'رایگان',
  },
  freeShippingFee: {
    id: `${scope}.freeShippingFee`,
    defaultMessage: 'هزینه ارسال رایگان',
  },
})

export default CheckoutPageMessages
