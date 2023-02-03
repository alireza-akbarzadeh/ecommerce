import { defineMessages } from 'react-intl'

const scope = 'app.vendor.validations'

const validationsMessages = defineMessages({
  enterValid: {
    id: `${scope}.enterValid`,
    defaultMessage: 'لطفا {msg} معتبری وارد کنید.',
  },
  isRequired: {
    id: `${scope}.isRequired`,
    defaultMessage: '{msg} اجباری است.',
  },
  minArrayLengthValidation: {
    id: `${scope}.minArrayLengthValidation`,
    defaultMessage: 'لطفا حداقل {count} آیتم وارد کنید.',
  },
  minLengthValidation: {
    id: `${scope}.minLengthValidation`,
    defaultMessage: 'حداقل باید {count} کاراکتر وارد کنید.',
  },
  mostNumberWithCount: {
    id: `${scope}.mostNumberWithCount`,
    defaultMessage: 'حداقل باید {count} عدد وارد کنید.',
  },
  wrongPattern: {
    id: `${scope}.wrongPattern`,
    defaultMessage: 'الگو اشتباه است باید از این الگو پیروی کنید: {msg}',
  },
  errorMessageDeleting: {
    id: `${scope}.errorMessageDeleting`,
    defaultMessage: `خطا در حذف {msg} ردیف`,
  },
  successUpdate: {
    id: `${scope}.successUpdate`,
    defaultMessage: 'اطلاعات با موفقیت ویرایش شد',
  },
  errorFileSize: {
    id: `${scope}.successUpdate`,
    defaultMessage: 'حجم فایل انتخابی بیشتر از حد مجاز است',
  },
  invalidDate: {
    id: `${scope}.invalidDate`,
    defaultMessage: 'فرمت تاریخ اشتباه است',
  },
  minValue: {
    id: `${scope}.minValue`,
    defaultMessage: 'حداقل مقدار مجاز {minValue} می باشد',
  },
  maxValue: {
    id: `${scope}.maxValue`,
    defaultMessage: 'حداکثر مقدار مجاز {maxValue} می باشد',
  },
  currentDate: {
    id: `${scope}.maxValue`,
    defaultMessage: 'تاریخ نمی تواند از روز جاری کمتر باشد',
  },
})
export default validationsMessages
