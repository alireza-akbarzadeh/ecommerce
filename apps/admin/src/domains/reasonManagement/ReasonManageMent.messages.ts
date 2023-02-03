import { defineMessages } from 'react-intl'

type ReasonsManagementPageType = {
  [key: string]: {
    id: string
    defaultMessage: string
  }
}

const ReasonsManagementPageMessages: ReasonsManagementPageType = defineMessages({
  reasonsSettingsManagement: {
    id: `app.page.domains.reasonsSettingsManagement`,
    defaultMessage: 'مدیریت تنظیمات دلایل',
  },
  placeOfUseReason: {
    id: `app.page.domains.placeOfUseReason`,
    defaultMessage: 'محل استفاده دلیل',
  },
  use: {
    id: `app.page.domains.use`,
    defaultMessage: 'استفاده کننده',
  },
  ReduceSellerPoints: {
    id: `app.page.domains.ReduceSellerPoints`,
    defaultMessage: 'کاهنده امتیاز فروشنده',
  },
  productReusability: {
    id: `app.page.domains.productReusability`,
    defaultMessage: 'قابلیت استفاده مجدد کالا',
  },
  needToRecordDes: {
    id: `app.page.domains.needToRecordDes`,
    defaultMessage: ' نیاز به ثبت توضیحات',
  },
  needToPasteTheImage: {
    id: `app.page.domains.needToPasteTheImage`,
    defaultMessage: 'نیاز به الصاق تصویر',
  },
  typeRefun: {
    id: `app.page.domains.typeRefun`,
    defaultMessage: 'نوع مرجوعی',
  },
  possibilityOfRefund: {
    id: `app.page.domains.possibilityOfRefund`,
    defaultMessage: 'امکان بازگشت وجه',
  },
  returnValueCalculationFormula: {
    id: `app.page.domains.returnValueCalculationFormula`,
    defaultMessage: 'فرمول محاسبه ارزش مرجوعی',
  },
  reasonSetting: {
    id: `app.page.domains.reasonSetting`,
    defaultMessage: 'تنظیمات دلایل',
  },
  pleaseInsertReason: {
    id: `app.page.domains.pleaseInsertReason`,
    defaultMessage: 'لطفا اطلاعات دلایل را وارد کنید',
  },
  approveBack: {
    id: `app.page.domains.approveBack`,
    defaultMessage: 'آیا می خواهید اطلاعات تغییر یافته را ذخیره کنید ؟',
  },
  editReasonSetting: {
    id: `app.page.domains.editReasonSetting`,
    defaultMessage: 'ویرایش  دلایل',
  },
  addReasonSetting: {
    id: `app.page.domains.addReasonSetting`,
    defaultMessage: 'ایجاد  دلایل',
  },
  NeedToRegisterDescription: {
    id: `app.page.domains.needToRecordDes`,
    defaultMessage: 'نیاز به ثبت توضیحات دارد',
  },
  NeedToPasteTheImage: {
    id: `app.page.domains.NeedToPasteTheImage`,
    defaultMessage: 'نیاز به الصاق تصویر دارد',
  },
  status: {
    id: `app.page.domains.status`,
    defaultMessage: 'وضعیت',
  },
  effectOnCustomerGrade: {
    id: `app.page.domains.effectOnCustomerGrade`,
    defaultMessage: 'کاهنده امتیاز خریدار',
  },
  deActive: {
    id: `app.page.domains.canceled`,
    defaultMessage: 'غیر فعال',
  },
  dialogConfirmDelete: {
    id: `app.page.domains.dialogConfirmDelete`,
    defaultMessage: ' آیا از حذف  این ردیف مطمئن  هستید ؟',
  },
})
export default ReasonsManagementPageMessages
