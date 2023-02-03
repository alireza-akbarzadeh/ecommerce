import { defineMessages } from 'react-intl'

export const scope = 'app.commerce.auth'
const AuthPageMessages = defineMessages({
  termsTitle: {
    id: `${scope}.termsTitle`,
    defaultMessage: 'قوانین و مقررات دارتیل',
  },
  hastiTermsTitle: {
    id: `${scope}.hastiTermsTitle`,
    defaultMessage: 'قوانین و مقررات دارتیل',
  },
  hastiTermsTitleWith: {
    id: `${scope}.hastiTermsTitleWith`,
    defaultMessage: 'با',
  },
  hastiTermsTitleEnd: {
    id: `${scope}.hastiTermsTitleEnd`,
    defaultMessage: 'موافقم',
  },
  unAcceptTerms: {
    id: `${scope}.unAcceptTerms`,
    defaultMessage: 'نمی پذیرم',
  },
  acceptTerms: {
    id: `${scope}.acceptTerms`,
    defaultMessage: 'میپذیرم',
  },
  signInTitle: {
    id: `${scope}.signInTitle`,
    defaultMessage: 'ورود به حساب کاربری',
  },
  signInSubTitle: {
    id: `${scope}.signInSubTitle`,
    defaultMessage: 'لطفا شماره موبایل و رمز عبور خود را وارد کنید.',
  },
  signUpTitle: {
    id: `${scope}.signUpTitle`,
    defaultMessage: 'ثبت نام',
  },
  signUpSubTitle: {
    id: `${scope}.signUpSubTitle`,
    defaultMessage: 'اطلاعات زیر را تکمیل کنید.',
  },
  signInPasswordTitle: {
    id: `${scope}.signInPasswordTitle`,
    defaultMessage: 'رمز عبور',
  },
  signInPasswordSubTitle: {
    id: `${scope}.signInPasswordSubTitle`,
    defaultMessage: 'رمز عبور حساب کاربری خود را وارد نمایید.',
  },
  signInForgotPassword: {
    id: `${scope}.signInForgotPassword`,
    defaultMessage: 'فراموشی رمز عبور',
  },
  signInOTPPassword: {
    id: `${scope}.signInOTPPassword`,
    defaultMessage: ' ورود با رمز عبور یک‌بار مصرف',
  },
  signInWithPassword: {
    id: `${scope}.signInWithPassword`,
    defaultMessage: ' ورود با رمز عبور',
  },
  signInOtpTitle: {
    id: `${scope}.signInOtpTitle`,
    defaultMessage: 'رمز یکبار مصرف',
  },
  signInOtpSubTitle: {
    id: `${scope}.signInOtpTitle`,
    defaultMessage: `کد ارسال شده به شماره {username} را وارد کنید.`,
  },
  signUpOtpTitle: {
    id: `${scope}.signUpOtpTitle`,
    defaultMessage: 'کد تایید ثبت نام',
  },
  signUpOtpSubTitle: {
    id: `${scope}.signUpOtpSubTitle`,
    defaultMessage: `کد تایید ارسال شده به شماره {username} را وارد نمایید`,
  },
  signUpSetPasswordTitle: {
    id: `${scope}.signUpSetPasswordTitle`,
    defaultMessage: 'انتخاب رمز عبور',
  },
  signUpSetPasswordSubTitle: {
    id: `${scope}.signUpSetPasswordSubTitle`,
    defaultMessage: 'لطفا برای حساب کاربری خود رمز عبور تعیین کنید.',
  },
  checkUserExistTitle: {
    id: `${scope}.checkUserExistTitle`,
    defaultMessage: 'ورود یا ثبت نام',
  },
  checkUserExistSubTitle: {
    id: `${scope}.checkUserExistSubTitle`,
    defaultMessage: 'لطفا شماره موبایل خود را وارد کنید.',
  },
  signUpSetPasswordDescLength: {
    id: `${scope}.signUpSetPasswordDescLength`,
    defaultMessage: '- طول رمز عبور حداقل {length} کاراکتر باشد',
  },
  signUpSetPasswordDescMaxLength: {
    id: `${scope}.signUpSetPasswordDescMaxLength`,
    defaultMessage: '- طول رمز عبور حداکثر {length} کاراکتر باشد',
  },
  signUpSetPasswordDescLowerCase: {
    id: `${scope}.signUpSetPasswordDescUpperCase`,
    defaultMessage: '- شامل حروف کوچک لاتین باشد',
  },
  signUpSetPasswordDescUpperCase: {
    id: `${scope}.signUpSetPasswordDescLowerCase`,
    defaultMessage: '- شامل حروف بزرگ لاتین باشد',
  },
  signUpSetPasswordDescChar: {
    id: `${scope}.signUpSetPasswordDescChar`,
    defaultMessage: '- شامل نشانه و کاراکتر (مانند @ # $ *) باشد',
  },
  mobileNoLabel: {
    id: `${scope}.mobileNoLabel`,
    defaultMessage: 'شماره موبایل',
  },
  mobileNoFaultMessage: {
    id: `${scope}.mobileNoFaultMessage`,
    defaultMessage: 'شماره موبایل به صورت صحیح وارد نشده است',
  },
  signUpLinkText: {
    id: `${scope}.signUpLinkText`,
    defaultMessage: 'انتقال به صفحه ثبت نام',
  },
  textInputValidationText: {
    id: `${scope}.textInputValidationText`,
    defaultMessage: ' از حروف فارسی استفاده کنید',
  },
  faultMessage: {
    id: `${scope}.faultMessage`,
    defaultMessage: 'دریافت اطلاعات با خطا مواجه شد',
  },
  userCannotAccess: {
    id: `${scope}.faultMessage`,
    defaultMessage: 'شما مجاز به انجام این کار نمی باشید',
  },
  otpCode: {
    id: `${scope}.otpCode`,
    defaultMessage: 'کد تایید',
  },
  resendOtpCode: {
    id: `${scope}.resendOtpCode`,
    defaultMessage: 'ارسال مجدد کد',
  },
  nameMaxLength: {
    id: `${scope}.nameMaxLength`,
    defaultMessage: 'حداکثر از ۶۴ کاراکتر استفاده کنید',
  },
  nameMinLength: {
    id: `${scope}.nameMinLength`,
    defaultMessage: 'حداقل از ۲ کاراکتر استفاده کنید',
  },
  firstNameLabel: {
    id: `${scope}.firstNameLabel`,
    defaultMessage: 'نام (به فارسی)',
  },
  lastNameLabel: {
    id: `${scope}.lastNameLabel`,
    defaultMessage: 'نام خانوادگی (به فارسی)',
  },
  untilResendOtpCode: {
    id: `${scope}.untilResendOtpCode`,
    defaultMessage: 'ثانیه تا درخواست مجدد کد ',
  },
  changePassSuccessfull: {
    id: `${scope}.changePassSuccessfull`,
    defaultMessage: ' رمز عبور با موفقیت تغییر یافت.',
  },
  signUpSuccessfull: {
    id: `${scope}.signUpSuccessfull`,
    defaultMessage: 'ثبت نام شما با موفقیت انجام شد.',
  },
  completeProfile: {
    id: `${scope}.completeProfile`,
    defaultMessage: 'تکمیل پروفایل کاربری',
  },
  goToSignInPage: {
    id: `${scope}.goToSignInPage`,
    defaultMessage: ' در حال انتقال به صفحه ی ورود',
  },
  goingBackStep: {
    id: `${scope}.goingBackStep`,
    defaultMessage: ' در حال بازگشت به صفحه قبل',
  },
  editNumber: {
    id: `${scope}.editNumber`,
    defaultMessage: 'ویرایش شماره موبایل',
  },
  nextStep: {
    id: `${scope}.nextStep`,
    defaultMessage: 'ادامه',
  },
  enter: {
    id: `${scope}.enter`,
    defaultMessage: 'ورود',
  },
  accept: {
    id: `${scope}.accept`,
    defaultMessage: 'تایید رمز عبور',
  },
  backStep: {
    id: `${scope}.backStep`,
    defaultMessage: 'بازگشت',
  },
  setPassword: {
    id: `${scope}.setPassword`,
    defaultMessage: 'انتخاب رمز عبور',
  },
  setPasswordSubTitle: {
    id: `${scope}.setPasswordSubTitle`,
    defaultMessage: 'لطفا برای حساب کاربری خود رمز عبور تعیین کنید.',
  },
  passwordHelpText: {
    id: `${scope}.passwordHelpText`,
    defaultMessage:
      'طول رمز حداقل 8 کاراکتر، شامل حروف انگلیسی بزرگ و کوچک و نشانه ها ( مثلا ! @ # $) باشد.',
  },
  confirm: {
    id: `${scope}.confirm`,
    defaultMessage: 'تایید',
  },
  back: {
    id: `${scope}.back`,
    defaultMessage: 'بازگشت',
  },
  password: {
    id: `${scope}.password`,
    defaultMessage: 'رمز عبور',
  },
  forgetPasswordOtpErrorMessage: {
    id: `${scope}.forgetPasswordOtpErrorMessage`,
    defaultMessage: "'شما مجاز به انجام این کار نمی باشید'",
  },
  forgetPassword: {
    id: `${scope}.forgetPassword`,
    defaultMessage: 'فراموشی رمز عبور',
  },
  forgetPasswordSubTitle: {
    id: `${scope}.forgetPasswordSubTitle`,
    defaultMessage: ` برای تغییر رمز عبورتان، کد تایید ارسال شده به شماره {username} را وارد کنید.`,
  },
  resendOtp: {
    id: `${scope}.resendOtp`,
    defaultMessage: 'ارسال مجدد کد',
  },
  extraTimerText: {
    id: `${scope}.extraTimerText`,
    defaultMessage: 'ثانیه تا درخواست مجدد کد',
  },
  containsOneEnglishCharacter: {
    id: `${scope}.hasOneEnglishCharacter`,
    defaultMessage: 'حداقل یک کاراکتر انگلیسی در کلمه عبور باشد',
  },
  loginWithOtp: {
    id: `${scope}.hasOneEnglishCharacter`,
    defaultMessage: 'ورود با رمز یک بار مصرف',
  },
})

export default AuthPageMessages
