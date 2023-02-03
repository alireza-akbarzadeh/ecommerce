import { defineMessages } from 'react-intl'

const scope = 'app.admin'

const validationsMessages = defineMessages({
  enterValid: {
    id: `app.admin.enterValid`,
    defaultMessage: 'لطفا {msg} معتبری وارد کنید.',
  },
  isRequired: {
    id: `app.admin.isRequired`,
    defaultMessage: '{msg} اجباری است.',
  },
  minArrayLengthValidation: {
    id: `app.admin.minArrayLengthValidation`,
    defaultMessage: 'لطفا حداقل {count} آیتم وارد کنید.',
  },
  minLengthValidation: {
    id: `app.admin.minLengthValidation`,
    defaultMessage: 'حداقل باید {count} کاراکتر وارد کنید.',
  },
  mostNumberWithCount: {
    id: `app.admin.mostNumberWithCount`,
    defaultMessage: 'حداقل باید {count} عدد وارد کنید.',
  },
  wrongPattern: {
    id: `app.admin.wrongPattern`,
    defaultMessage: 'الگو اشتباه است باید از این الگو پیروی کنید: {msg}',
  },
})
export default validationsMessages
