import { defineMessages } from 'react-intl'

const phrasesMessages = defineMessages({
  hastiBazar: {
    id: `app.global.hastiBazar`,
    defaultMessage: 'بازار اینترنتی دارتیل',
  },
  save: {
    id: `app.global.save`,
    defaultMessage: 'ذخیره',
  },
  search: {
    id: `app.global.search`,
    defaultMessage: 'جستجو',
  },
  searching: {
    id: `app.global.searching`,
    defaultMessage: 'در حال جستجو ...',
  },

  passwordIsRequired: {
    id: `app.global.passwordIsRequired`,
    defaultMessage: 'لطفا کلمه عبور را وارد نمایید',
  },
  passwordIsTooShort: {
    id: `app.global.minPasswordErrorMessage`,
    defaultMessage: `حداقل طول کلمه عبور {minLength} کارکتر می باشد`,
  },
  passwordIsTooLong: {
    id: `app.global.maxPasswordErrorMessage`,
    defaultMessage: `حداکثر طول کلمه عبور {maxLength} کارکتر می باشد`,
  },
  passwordMustContainNumber: {
    id: `app.global.passwordShouldContainNumber`,
    defaultMessage: 'حداقل یک عدد در کلمه عبور باشد',
  },
  passwordMustHaveAtLeastOneCapitalLetter: {
    id: `app.global.passwordShouldContainCapitalLetter`,
    defaultMessage: 'حداقل یک کاراکتر بزرگ در کلمه عبور باشد',
  },
  passwordMustContainLowercase: {
    id: `app.global.passwordShouldContainSmallLetter`,
    defaultMessage: 'حداقل یک کاراکتر کوچک در کلمه عبور باشد',
  },
  passwordMustContainSpecialCharacter: {
    id: `app.global.passwordShouldContainSpecialCharacter`,
    defaultMessage: 'حداقل یک کاراکتر خاص در کلمه عبور باشد',
  },
  passwordMustEnglishCharacters: {
    id: `app.global.passwordShouldEnglishCharacters`,
    defaultMessage: 'کلمه عبور باید فقط از حروف انگلیسی تشکیل شده باشد',
  },
  password: {
    id: `app.global.password`,
    defaultMessage: 'رمز عبور',
  },
  unexpectederror: {
    id: `app.global.unexpectederror`,
    defaultMessage: 'مشکلی در سرور به وجود آمده است',
  },
})
export default phrasesMessages
