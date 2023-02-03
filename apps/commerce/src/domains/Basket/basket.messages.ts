import { defineMessages } from 'react-intl'

const scope = 'app.commerce.product-detail'
const BasketMessages = defineMessages({
  cartWithCount: {
    id: `${scope}.cart`,
    defaultMessage: 'سبد خرید ({count} کالا)',
  },
  vendorWithName: {
    id: `${scope}.vendorWithName`,
    defaultMessage: 'فروشگاه {name}',
  },
  priceWithCurrency: {
    id: `${scope}.priceWithCurrency`,
    defaultMessage: '{price} {currency}',
  },
  off: {
    id: `${scope}.off`,
    defaultMessage: 'تخفیف:',
  },
  totalCart: {
    id: `${scope}.totalCart`,
    defaultMessage: 'مجموع سبد خرید:',
  },
  order: {
    id: `${scope}.order`,
    defaultMessage: 'ثبت سفارش',
  },
  showFullCart: {
    id: `${scope}.showFullCart`,
    defaultMessage: 'نمایش کامل سبد خرید',
  },
  removeAll: {
    id: `${scope}.removeAll`,
    defaultMessage: 'حذف سفارش',
  },
  vendor: {
    id: `${scope}.vendor`,
    defaultMessage: 'فروشگاه',
  },
  yourBasketIsEmpty: {
    id: `${scope}.yourBasketIsEmpty`,
    defaultMessage: 'سبد خرید شما خالی است ',
  },
  removeVendorProducts: {
    id: `${scope}.removeVendorProducts`,
    defaultMessage: 'حذف کالاهای این فروشگاه',
  },
  emptyCart: {
    id: `${scope}.emptyCart`,
    defaultMessage: 'سبد خرید شما خالی است ',
  },
  seeMoreProduct: {
    id: `${scope}.seeMoreProduct`,
    defaultMessage: 'برای مشاهده محصولات بیشتر به صفحه زیر بروید',
  },
  offsAndSuggests: {
    id: `${scope}.offsAndSuggests`,
    defaultMessage: 'تخفیف‌ها و پیشنهادات',
  },
  cartText: {
    id: `${scope}.cartText`,
    defaultMessage: 'سبد خرید',
  },
  favorites: {
    id: `${scope}.favorites`,
    defaultMessage: 'پسند شده‌ها',
  },
  awaitPaymentCount: {
    id: `${scope}.awaitPaymentCount`,
    defaultMessage: 'شما {count} سفارش در انتظار پرداخت دارید',
  },
  payable: {
    id: `${scope}.payable`,
    defaultMessage: 'قابل پرداخت',
  },
  cancelTime: {
    id: `${scope}.cancelTime`,
    defaultMessage: 'در صورت عدم پرداخت سفارش شما تا {time} دقیقه دیگر لغو خواهد شد',
  },
  cancelOrder: {
    id: `${scope}.cancelOrder`,
    defaultMessage: 'لغو سفارش',
  },
  pay: {
    id: `${scope}.pay`,
    defaultMessage: 'پرداخت',
  },
  cancelOrderConfirmation: {
    id: `${scope}.cancelOrderConfirmation`,
    defaultMessage: 'آیا می‌خواهید سفارش خود را لغو کنید؟',
  },
  cancel: {
    id: `${scope}.cancel`,
    defaultMessage: 'آیا از لغو سفارش خود مطمئن هستید؟',
  },
  reject: {
    id: `${scope}.reject`,
    defaultMessage: 'انصراف',
  },
  cancelSuccess: {
    id: `${scope}.cancelSuccess`,
    defaultMessage: 'کنسل کردن سفارش با موفقیت انجام شد',
  },
  cancelWord: {
    id: `${scope}.cancelWord`,
    defaultMessage: 'لغو',
  },
  viewFullBasket: {
    id: `${scope}.viewFullBasket`,
    defaultMessage: 'نمایش کامل سبد خرید',
  },
  registerOrder: {
    id: `${scope}.registerOrder`,
    defaultMessage: 'ثبت سفارش',
  },
  unavailable: {
    id: `${scope}.unavailable`,
    defaultMessage: 'ناموجود',
  },
  gotoOrders: {
    id: `${scope}.gotoOrders`,
    defaultMessage: 'رفتن به سفارشات',
  },
})

export default BasketMessages
