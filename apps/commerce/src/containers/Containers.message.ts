import { defineMessages } from 'react-intl'

const scope = 'app.commerce.containers'
const ContainersMessages = defineMessages({
  addToBasketError: {
    id: `${scope}.addToBasketError`,
    defaultMessage: 'افزودن به سبد خرید با مشکل مواجه شد',
  },
  changeQuantityError: {
    id: `${scope}.changeQuantityError`,
    defaultMessage: 'تغییر در سبد خرید با مشکل مواجه شده است',
  },
  removeFromProductError: {
    id: `${scope}.removeFromProductError`,
    defaultMessage: 'حذف از سبد خرید با مشکل مواجه شد',
  },
  similarProducts: {
    id: `${scope}.similarProducts`,
    defaultMessage: 'کالاهای مشابه',
  },
  buyFromOtherVendors: {
    id: `${scope}.buyFromOtherVendors`,
    defaultMessage: 'خرید از فروشگاه دیگر',
  },
  notDefindedAddress: {
    id: `${scope}.notDefindedAddress`,
    defaultMessage: 'این محدوده تعریف نشده است',
  },
  localityValidationFailed: {
    id: `${scope}.localityValidationFailed`,
    defaultMessage: 'شهر یا استان انتخاب شده با نقشه منطبق نیست',
  },
  addAddressTitle: {
    id: `${scope}.addAddressTitle`,
    defaultMessage: 'آدرس  تحویل جدید',
  },
  editAddressTitle: {
    id: `${scope}.editAddressTitle`,
    defaultMessage: 'ویرایش آدرس تحویل',
  },
  vendorsCount: {
    id: `${scope}.vendorsCount`,
    defaultMessage: '{count} فروشگاه دیگر',
  },
  nationalCodeTitle: {
    id: `${scope}.nationalCodeTitle`,
    defaultMessage: 'کد ملی',
  },
  nationalCodeDesc: {
    id: `${scope}.nationalCodeDesc`,
    defaultMessage: 'برای نهایی‌سازی سفارش خود، لطفا کد ملی خود را وارد کنید',
  },
  cancel: {
    id: `${scope}.cancel`,
    defaultMessage: 'انصراف',
  },
  saveAndcontinueOrderLabel: {
    id: `${scope}.saveAndcontinueOrderLabel`,
    defaultMessage: 'ثبت و ادامه خرید',
  },
  saveAndContinueLabel: {
    id: `${scope}.saveAndContinueLabel`,
    defaultMessage: 'ثبت و ادامه',
  },
  select: {
    id: `${scope}.select`,
    defaultMessage: 'انتخاب',
  },
  saved: {
    id: `${scope}.saved`,
    defaultMessage: 'ذخیره شده',
  },
  addToSaveVendor: {
    id: `${scope}.addToSaveVendor`,
    defaultMessage: 'ذخیره ',
  },
  buyOrderSuccess: {
    id: `${scope}.buyOrderSuccess`,
    defaultMessage: 'افزودن به سبد خرید با موفقیت انجام شد',
  },
  locationOfTheNewAddress: {
    id: `${scope}.locationOfTheNewAddress`,
    defaultMessage: 'ایجاد آدرس',
  },
  newAddressDetails: {
    id: `${scope}.newAddressDetails`,
    defaultMessage: 'جزئیات آدرس جدید',
  },
  menu: {
    id: `${scope}.menu`,
    defaultMessage: 'منو',
  },
})

export default ContainersMessages
