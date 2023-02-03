import { defineMessages } from 'react-intl'

const scope = 'app.commerce.account'
const AccountMessages = defineMessages({
  bankAccount: {
    id: `${scope}.bankAccount`,
    defaultMessage: 'اطلاعات حساب بانکی',
  },
  shabaNumber: {
    id: `${scope}.shabaNumber`,
    defaultMessage: 'شماره شبا',
  },
  cardNumber: {
    id: `${scope}.cardNumber`,
    defaultMessage: 'شماره کارت',
  },
  add: {
    id: `${scope}.create`,
    defaultMessage: 'افزودن',
  },
  legalEmailError: {
    id: `${scope}.legalEmailError`,
    defaultMessage: 'ایمیل وارد شده صحیح نمیباشد',
  },
  phoneNumberError: {
    id: `${scope}.phoneNumberError`,
    defaultMessage: 'شماره وارد شده صحیح نمیباشد',
  },
  economicCodeError: {
    id: `${scope}.economicCodeError`,
    defaultMessage: 'کد اقتصادی موسسه/شرکت وارد شده صحیح نمیباشد',
  },
  nationalCodeError: {
    id: `${scope}.nationalCodeError`,
    defaultMessage: 'شناسه ملی وارد شده صحیح نمیباشد',
  },
  submitData: {
    id: `${scope}.submitData`,
    defaultMessage: 'ثبت اطلاعات',
  },
  socialMediaInformation: {
    id: `${scope}.socialMediaInfo`,
    defaultMessage: 'اطلاعات شبکه های اجتماعی',
  },
  instagram: {
    id: `${scope}.instagram`,
    defaultMessage: 'اینستاگرام',
  },
  whatsApp: {
    id: `${scope}.whatsApp`,
    defaultMessage: 'واتساپ',
  },
  linkedIn: {
    id: `${scope}.linkedIn`,
    defaultMessage: 'لینکدین',
  },

  socialMediaUpdated: {
    id: `${scope}.socialMediaUpdated`,
    defaultMessage: 'اطلاعات شبکه های اجتماعی با موفقیت ثبت شد',
  },
  contactInformation: {
    id: `${scope}.contactInformations`,
    defaultMessage: 'اطلاعات تماس',
  },
  email: {
    id: `${scope}.email`,
    defaultMessage: 'ایمیل',
  },
  phoneNo: {
    id: `${scope}.phoneNo`,
    defaultMessage: 'تلفن ثابت',
  },
  contactInformationUpdated: {
    id: `${scope}.contactInformationUpdated`,
    defaultMessage: 'اطلاعات تماس با موفقیت ثبت شد',
  },
  editPhoneNumber: {
    id: `${scope}.editPhoneNumber`,
    defaultMessage: 'ویرایش شماره موبایل',
  },
  toEditPhoneNumberShouldConfirmNewAndCurrentPhoneNumber: {
    id: `${scope}.toEditPhoneNumberShouldConfirmNewAndCurrentPhoneNumber`,
    defaultMessage: 'برای ویرایش شماره موبایل، باید شماره فعلی و شماره جدید خود را تایید کنید.',
  },
  newPhoneNumber: {
    id: `${scope}.newPhoneNumber`,
    defaultMessage: 'شماره موبایل جدید',
  },
  cancel: {
    id: `${scope}.cancel`,
    defaultMessage: 'انصراف',
  },
  getConfirmCodeAndChangeNumber: {
    id: `${scope}.getConfirmCodeAndChangeNumber`,
    defaultMessage: 'دریافت کد تایید و تغییر شماره',
  },
  confirmCurrentPhoneNumber: {
    id: `${scope}.confirmCurrentPhoneNumber`,
    defaultMessage: 'تایید شماره موبایل فعلی',
  },
  toChangeToNewNumberShouldConfirmCurrentNumber: {
    id: `${scope}.toChangeToNewNumberShouldConfirmCurrentNumber`,
    defaultMessage: 'برای تغییر به شماره جدید، باید شماره فعلی را دوباره تایید کنید.',
  },
  confirmCode: {
    id: `${scope}.confirmCode`,
    defaultMessage: 'کد تایید',
  },
  sendCodeAgain: {
    id: `${scope}.sendCodeAgain`,
    defaultMessage: 'ارسال مجدد کد',
  },
  untilReRequestingTheCode: {
    id: `${scope}.untilReRequestingTheCode`,
    defaultMessage: 'تا درخواست مجدد کد',
  },
  continue: {
    id: `${scope}.continue`,
    defaultMessage: 'ادامه',
  },
  confirmNewPhoneNumber: {
    id: `${scope}.confirmNewPhoneNumber`,
    defaultMessage: 'تایید شماره موبایل جدید',
  },
  enterSendedCodeToPhoneNumber: {
    id: `${scope}.enterSendedCodeToPhoneNumber`,
    defaultMessage: 'کد وارد شده به شماره {phoneNumber} را وارد کنید',
  },
  confirmAndRegister: {
    id: `${scope}.confirmAndRegister`,
    defaultMessage: 'تایید و ثبت',
  },
  changeDefaultAccounySuccessfulyDone: {
    id: `${scope}.changeDefaultAccounySuccessfulyDone`,
    defaultMessage: 'تغییر حساب پیشفرض با موفقیت انجام شد',
  },
})

export default AccountMessages
