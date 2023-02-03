import { defineMessages } from 'react-intl'
const banksMessages = defineMessages({
  banks: {
    id: `app.admin.domains.banks.banks`,
    defaultMessage: 'بانک ها',
  },
  row: {
    id: `app.admin.domains.banks.row`,
    defaultMessage: 'ردیف',
  },
  name: {
    id: `app.admin.domains.banks.name`,
    defaultMessage: 'نام بانک',
  },
  latinName: {
    id: `app.admin.domains.banks.latinName`,
    defaultMessage: 'نام لاتین بانک',
  },
  preNumber: {
    id: `app.admin.domains.banks.preNumber`,
    defaultMessage: 'پیش شماره کارت',
  },
  preIbanNumber: {
    id: `app.admin.domains.banks.preIbanNumber`,
    defaultMessage: 'پیش شماره شبا',
  },
  latinSummaryName: {
    id: `app.admin.domains.banks.latinSummaryName`,
    defaultMessage: 'نام اختصاری بانک',
  },
  logo: {
    id: `app.admin.domains.banks.logo`,
    defaultMessage: 'لگوی بانک',
  },
  status: {
    id: `app.admin.domains.banks.status`,
    defaultMessage: 'وضعیت',
  },
  interInformation: {
    id: `app.admin.domains.banks.interInformation`,
    defaultMessage: 'ورود اطلاعات بانک',
  },
  uploadLogoPlease: {
    id: `app.admin.domains.banks.uploadLogoPlease`,
    defaultMessage: 'لطفا تصویر لوگو بانک را آپلود کنید',
  },
  confirmationMessageDeleting: {
    id: `app.domains.banks.confirmationMessageDeleting`,
    defaultMessage: `آیا از حذف {msg} بانک اطمینان دارید؟`,
  },
  confirmationTitleDeleting: {
    id: `app.domains.banks.confirmationTitleDeleting`,
    defaultMessage: 'حذف بانک',
  },
  uploadLogo: {
    id: `app.domains.banks.uploadLogo`,
    defaultMessage: 'آپلود عکس',
  },
  banksSuccessChangeStatus: {
    id: `app.admin.domains.banks.success.change.status`,
    defaultMessage: 'تعداد {changeCount} رکورد با موفقیت تغییر وضعیت داده شد',
  },
  banksDeleteSuccessFully: {
    id: `app.admin.domains.banks.delete.successfully`,
    defaultMessage: 'تعداد {bankCount} بانک حذف شد',
  },
  banksChangeStateConfirm: {
    id: `app.admin.domains.taxes.change.state.confirm`,
    defaultMessage: 'آیا از تغییر وضعیت {changeCount} بانک اطمینان دارید؟',
  },
  banksChangeState: {
    id: `app.admin.domains.taxes.change.state.confirm`,
    defaultMessage: 'تغییر وضعیت بانک',
  },
})
export default banksMessages
