import { defineMessages } from 'react-intl'

const scope = 'app.commerce.favorite'
const FavoriteMessages = defineMessages({
  favoritesWithCount: {
    id: `${scope}.favoritesWithCount`,
    defaultMessage: 'محصولات پسند شده ({count} عدد)',
  },
  addToBasket: {
    id: `${scope}.addToBasket`,
    defaultMessage: 'افزودن به سبد خرید',
  },
  removeSelcteds: {
    id: `${scope}.removeSelcteds`,
    defaultMessage: 'حذف موارد انتخابی ',
  },
  priceDiscount: {
    id: `${scope}.priceDiscount`,
    defaultMessage: '{discount}٪-',
  },
  priceWithCurrency: {
    id: `${scope}.priceWithCurrency`,
    defaultMessage: '{price} {currency}',
  },
  addNote: {
    id: `${scope}.addNote`,
    defaultMessage: 'افزودن یادداشت',
  },
  vendorSatisficationWithValue: {
    id: `${scope}.vendorSatisficationWithCount`,
    defaultMessage: '٪{value}  رضایت از فروشگاه',
  },
  soldCount: {
    id: `${scope}.soldCount`,
    defaultMessage: '{count} عدد فروخته شده',
  },
  remainingCount: {
    id: `${scope}.remainingCount`,
    defaultMessage: 'تنها {count} عدد در انبار باقی مانده',
  },
  removeConfirmMessage: {
    id: `${scope}.removeConfirmMessage`,
    defaultMessage: 'آیا از حذف موارد انتخابی مطمئن هستید؟',
  },
  cancel: {
    id: `${scope}.cancel`,
    defaultMessage: 'انصراف',
  },
  remove: {
    id: `${scope}.remove`,
    defaultMessage: 'حذف',
  },
  notFound: {
    id: `${scope}.notFound`,
    defaultMessage: 'نتیجه‌ای یافت نشد.',
  },
  hastiBazaarText: {
    id: `${scope}.hastiBazaarText`,
    defaultMessage: 'بازار اینترنتی دارتیل',
  },
  removeUnavailableProduct: {
    id: `${scope}.removeUnavailableProduct`,
    defaultMessage: 'محصولات ناموجود را حذف کنید',
  },
})

export default FavoriteMessages
