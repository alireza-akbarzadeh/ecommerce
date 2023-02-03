import { defineMessages } from 'react-intl'

const scope = 'app.commerce.addressManagement'
const addressesMessages = defineMessages({
  addressStatusChangedToDefaultSuccessfuly: {
    id: `${scope}.addressStatusChangedToDefaultSuccessfuly`,
    defaultMessage: 'وضعیت ادرس مورد نظر با موفقیت به پیش فرض تغییر کرد',
  },
  addressDeletedSuccessfully: {
    id: `${scope}.addressDeletedSuccessfully`,
    defaultMessage: 'آدرس با موفقیت حذف شد',
  },
  thereIsAProblem: {
    id: `${scope}.thereIsAProblem`,
    defaultMessage: 'مشکلی پیش آمده است',
  },
  address: {
    id: `${scope}.address`,
    defaultMessage: 'آدرس',
  },
  addresses: {
    id: `${scope}.addresses`,
    defaultMessage: 'آدرس ها',
  },
  create: {
    id: `${scope}.create`,
    defaultMessage: 'ایجاد',
  },
  add: {
    id: `${scope}.add`,
    defaultMessage: 'افزودن',
  },
  iGerIt: {
    id: `${scope}.iGerIt`,
    defaultMessage: 'متوجه شدم',
  },
  youCantDeleteDefaultAccount: {
    id: `${scope}.youCantDeleteDefaultAccount`,
    defaultMessage: 'نمیتوانید آدرس پیش فرض رو پاک کنید',
  },
  yes: {
    id: `${scope}.yes`,
    defaultMessage: 'بله',
  },
  no: {
    id: `${scope}.no`,
    defaultMessage: 'خیر',
  },
  areYouSureToDeleteThisAccount: {
    id: `${scope}.areYouSureToDeleteThisAccount`,
    defaultMessage: 'آیا از حذف این آدرس اطمینان دارید؟',
  },
  edit: {
    id: `${scope}.edit`,
    defaultMessage: 'ویرایش',
  },
  delete: {
    id: `${scope}.delete`,
    defaultMessage: 'حذف',
  },
  plaque: {
    id: `${scope}.plaque`,
    defaultMessage: 'پلاک',
  },
  fullAddress: {
    id: `${scope}.fullAddress`,
    defaultMessage: '{mainAddress}, محله {district}, پلاک {plaque}, واحد {unit}',
  },
})

export default addressesMessages
