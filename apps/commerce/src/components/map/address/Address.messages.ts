import { defineMessages } from 'react-intl'

export const scope = 'app.components.map.address'
const AddressMessages = defineMessages({
  addressTitle: {
    id: `${scope}.addressTitle`,
    defaultMessage: 'عنوان ادرس',
  },
  postallAddress: {
    id: `${scope}.postallAddress`,
    defaultMessage: 'نشانی پستی *',
  },
  changePlace: {
    id: `${scope}.changePlace`,
    defaultMessage: 'اصلاح موقعیت مکانی روی نقشه',
  },
  yourAddress: {
    id: `${scope}.yourAddress`,
    defaultMessage: 'آدرس بالا بر اساس موقعیت مکانی شما وارد شده است.',
  },
  optionalAddress: {
    id: `${scope}.optionalAddress`,
    defaultMessage: 'آدرس اختیاری',
  },
  province: {
    id: `${scope}.province`,
    defaultMessage: 'استان',
  },
  city: {
    id: `${scope}.city`,
    defaultMessage: 'شهر',
  },
  district: {
    id: `${scope}.district`,
    defaultMessage: 'محله',
  },
  plaque: {
    id: `${scope}.plaque`,
    defaultMessage: 'پلاک',
  },
  unit: {
    id: `${scope}.unit`,
    defaultMessage: 'واحد',
  },
  postalCode: {
    id: `${scope}.postalCode`,
    defaultMessage: 'کدپستی',
  },
  deliverUser: {
    id: `${scope}.deliverUser`,
    defaultMessage: 'گیرنده سفارش خودم هستم',
  },
  recipientName: {
    id: `${scope}.recipientName`,
    defaultMessage: 'نام گیرنده',
  },
  recipientMobileNo: {
    id: `${scope}.recipientMobileNo`,
    defaultMessage: 'شماره موبایل گیرنده',
  },
  postalCodeIncorrect: {
    id: `${scope}.postalCodeIncorrect`,
    defaultMessage: 'کدپستی وارد شده اشتباه است',
  },
  requiredField: {
    id: `${scope}.requiredField`,
    defaultMessage: 'این فیلد الزامی است',
  },
  mobileNumberIncorrect: {
    id: `${scope}.mobileNumberIncorrect`,
    defaultMessage: 'شماره موبایل گیرنده وارد شده اشتباه است',
  },
})

export default AddressMessages
