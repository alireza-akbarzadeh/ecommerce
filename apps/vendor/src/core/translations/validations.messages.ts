import { defineMessages } from 'react-intl'

const scope = 'app.admin'

const validationsMessages = defineMessages({
  enterValid: {
    id: `app.admin.validations.enterValid`,
    defaultMessage: 'لطفا {msg} معتبری وارد کنید.',
  },
  isRequired: {
    id: `app.admin.validations.isRequired`,
    defaultMessage: '{msg} اجباری است.',
  },
  minArrayLengthValidation: {
    id: `app.admin.validations.minArrayLengthValidation`,
    defaultMessage: 'لطفا حداقل {count} آیتم وارد کنید.',
  },
  minLengthValidation: {
    id: `app.admin.validations.minLengthValidation`,
    defaultMessage: 'حداقل باید {count} کاراکتر وارد کنید.',
  },
  mostNumberWithCount: {
    id: `app.admin.validations.mostNumberWithCount`,
    defaultMessage: 'حداقل باید {count} عدد وارد کنید.',
  },
  wrongPattern: {
    id: `app.admin.validations.wrongPattern`,
    defaultMessage: 'الگو اشتباه است باید از این الگو پیروی کنید: {msg}',
  },
  errorMessageDeleting: {
    id: `app.admin.validations.errorMessageDeleting`,
    defaultMessage: `خطا در حذف {msg} ردیف`,
  },
  successUpdate: {
    id: `app.admin.validations.successUpdate`,
    defaultMessage: 'اطلاعات با موفقیت ویرایش شد',
  },
  errorFileSize: {
    id: `app.admin.validations.successUpdate`,
    defaultMessage: 'حجم فایل انتخابی بیشتر از حد مجاز است',
  },
  invalidDate: {
    id: `app.admin.validations.invalidDate`,
    defaultMessage: 'فرمت تاریخ اشتباه است',
  },
  minValue: {
    id: `app.admin.validations.minValue`,
    defaultMessage: 'حداقل مقدار مجاز {minValue} می باشد',
  },
  maxValue: {
    id: `app.admin.validations.maxValue`,
    defaultMessage: 'حداکثر مقدار مجاز {maxValue} می باشد',
  },
  currentDate: {
    id: `app.admin.validations.maxValue`,
    defaultMessage: 'تاریخ نمی تواند از روز جاری کمتر باشد',
  },
})
export default validationsMessages
