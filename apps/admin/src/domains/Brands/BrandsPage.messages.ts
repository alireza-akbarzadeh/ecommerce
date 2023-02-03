import { defineMessages } from 'react-intl'

const brandsPageMessages = defineMessages({
  general: {
    id: `app.admin.domains.brands.general`,
    defaultMessage: 'عمومی',
  },
  brand: {
    id: `app.admin.domains.brands.brand`,
    defaultMessage: 'مشخصات برندها',
  },
  editBrand: {
    id: `app.admin.domains.brands.editBrand`,
    defaultMessage: 'ویرایش برند',
  },
  addBrand: {
    id: `app.admin.domains.brands.addBrand`,
    defaultMessage: 'افزودن برند',
  },
  brandValues: {
    id: `app.admin.domains.brands.brandValue`,
    defaultMessage: 'مقادیر برند',
  },
  brandName: {
    id: `app.admin.domains.brands.brandName`,
    defaultMessage: 'نام برند',
  },
  brandLatinName: {
    id: `app.admin.domains.brands.brandLatinName`,
    defaultMessage: 'نام لاتین برند',
  },
  code: {
    id: `app.admin.domains.brands.code`,
    defaultMessage: 'کد اختصاری',
  },
  madeType: {
    id: `app.admin.domains.brands.madeType`,
    defaultMessage: 'محل ساخت',
  },
  countryOfOrigin: {
    id: `app.admin.domains.brands.countryOfOrigin`,
    defaultMessage: 'مبدا ساخت',
  },
  brandIcon: {
    id: `app.admin.domains.brands.brandIcon`,
    defaultMessage: 'آیکون برند',
  },
  foundedYear: {
    id: `app.admin.domains.brands.foundedYear`,
    defaultMessage: 'سال تاسیس',
  },
  isLuxBrand: {
    id: `app.admin.domains.brands.isLuxBrand`,
    defaultMessage: 'آیا برند لوکس است؟',
  },
  site: {
    id: `app.admin.domains.brands.site`,
    defaultMessage: 'آدرس سایت',
  },
  slogon: {
    id: `app.admin.domains.brands.slogon`,
    defaultMessage: 'شعار برند',
  },
  restrictionsOnUse: {
    id: `app.admin.domains.brands.restrictionsOnUse`,
    defaultMessage: 'محدودیت استفاده در گروه کالا',
  },
  state: {
    id: `app.admin.domains.brands.state`,
    defaultMessage: 'مرحله',
  },
  id: {
    id: `app.admin.domains.brands.id`,
    defaultMessage: 'شناسه',
  },
  yes: {
    id: `app.admin.domains.brands.yes`,
    defaultMessage: 'بلی',
  },
  no: {
    id: `app.admin.domains.brands.no`,
    defaultMessage: 'خیر',
  },
  deleteBernd: {
    id: `app.admin.domains.brands.deleteBernd`,
    defaultMessage: 'حذف برند',
  },
  errorOnDelete: {
    id: `app.admin.domains.brands.errorOnDelete`,
    defaultMessage: 'خطا در حذف رکورد',
  },
  unsuccessDelete: {
    id: `app.admin.domains.brands.unsuccessDelete`,
    defaultMessage: 'رکورد با موفقیت حذف نگردید',
  },
  areYouSure: {
    id: `app.admin.domains.brands.areYouSure`,
    defaultMessage: 'آیا از حذف count برند اطمینان داری',
  },
  uploadFile: {
    id: `app.admin.domains.brands.uploadFile`,
    defaultMessage: 'فایل را آپلود کنید',
  },
  save: {
    id: `app.admin.domains.brands.save`,
    defaultMessage: 'ذخیره کردن',
  },
  wouldYouLikeToSaveTheChanges: {
    id: `app.admin.domains.brands.wouldYouLikeToSaveTheChanges`,
    defaultMessage: 'آیا تمایل به ذخیره تغییرات دارید؟',
  },
  dashboard: {
    id: `app.admin.domains.brands.dashboard`,
    defaultMessage: 'داشبورد',
  },
  content: {
    id: `app.admin.domains.brands.content`,
    defaultMessage: 'محتوا',
  },
  preview: {
    id: `app.admin.domains.brands.preview`,
    defaultMessage: 'پیش نمایش',
  },
  publicationStatus: {
    id: `app.admin.domains.brands.publicationStatus`,
    defaultMessage: 'وضعیت انتشار',
  },
  changeStatus: {
    id: `app.admin.domains.brands.changeStatus`,
    defaultMessage: 'تغییر وضعیت',
  },
  draft: {
    id: `app.admin.domains.brands.draft`,
    defaultMessage: 'پیش نویس',
  },
  uploadLogoIcon: {
    id: `app.admin.domains.brands.uploadLogoIcon`,
    defaultMessage: 'تصویر لوگو را آپلود کنید',
  },
  someSelectedRecordsCannotBeDeletedAccordingToTheState: {
    id: `app.admin.domains.brands.someSelectedRecordsCannotBeDeletedAccordingToTheState`,
    defaultMessage: 'بعضی از رکوردهای انتخابی با توجه به مرحله جاری قابل حذف نیستند',
  },
  selectedRecordCannotBeEditAccordingToTheState: {
    id: `app.admin.domains.brands.selectedRecordCannotBeEditAccordingToTheState`,
    defaultMessage: 'رکورد انتخابی با توجه به مرحله جاری قابل ویرایش نیست',
  },
  release: {
    id: `app.admin.domains.brands.release`,
    defaultMessage: 'انتشار',
  },
  usedInvalidCharacter: {
    id: `app.admin.domains.brands.usedInvalidCharacter`,
    defaultMessage: 'کارکتر غیر مجاز استفاده شده',
  },
  yearIsNotValid: {
    id: `app.admin.domains.brands.yearIsNotValid`,
    defaultMessage: 'سال معتبر نیست',
  },
  contentTitle: {
    id: `app.admin.domains.brands.contentTitle`,
    defaultMessage: 'عنوان',
  },
  contentSeo: {
    id: `app.admin.domains.brands.contentSeo`,
    defaultMessage: 'متن SEO',
  },
  contentDescription: {
    id: `app.admin.domains.brands.contentDescription`,
    defaultMessage: 'توضیحات',
  },
  contentAdded: {
    id: `app.admin.domains.brands.contentAdded`,
    defaultMessage: 'محتوا با موفقیت ثبت شد',
  },
  contentUpdated: {
    id: `app.admin.domains.brands.contentAdded`,
    defaultMessage: 'محتوا با موفقیت ویرایش شد',
  },
  contentTags: {
    id: `app.admin.domains.brands.defaultTags`,
    defaultMessage: 'تگ های پیش فرض',
  },
  relatedGroupToBrand: {
    id: `app.admin.domains.brands.relatedGroupToBrand`,
    defaultMessage: 'گروه های کالایی مرتبط با برند',
  },
  usableBrandsAddError: {
    id: 'app.domains.brands.relatedProductGroupByBrand.add.error',
    defaultMessage: 'برند مورد نظر قبلا در سیستم ثبت شده است',
  },
  usableBrandsGridId: {
    id: 'app.domains.brands.relatedProductGroupByBrand.grid.id',
    defaultMessage: 'شناسه',
  },
  relatedGroup: {
    id: 'app.domains.brands.relatedProductGroupByBrand.grid.relatedGroup',
    defaultMessage: 'گروه مرتبط',
  },
  usableBrandsGridCategoryName: {
    id: 'app.domains.brands.relatedProductGroupByBrand.grid.categoryName',
    defaultMessage: 'نام دسته‌بندی',
  },
  usableBrandsGridIsActive: {
    id: 'app.domains.brands.relatedProductGroupByBrand.grid.isActive',
    defaultMessage: 'وضعیت',
  },
  usableBrandsDeleteDialogTitle: {
    id: 'app.domains.brands.relatedProductGroupByBrand.deleteDialog.title',
    defaultMessage: 'حذف گروه های مرتبط با برند',
  },
  usableBrandsDeleteDialogContent: {
    id: 'app.domains.brands.relatedProductGroupByBrand.deleteDialog.content',
    defaultMessage: 'آیا از حذف {msg}  گروه های مرتبط با برند اطمینان دارید؟',
  },
  usableBrandsChangeStatusDialogTitle: {
    id: 'app.domains.brands.relatedProductGroupByBrand.changeStatusDialog.title',
    defaultMessage: 'تغییر وضعیت گروه های مرتبط با برند',
  },
  usableBrandsChangeStatusDialogContent: {
    id: 'app.domains.brands.relatedProductGroupByBrand.changeStatusDialog.content',
    defaultMessage: 'آیا از تغییر وضعیت {msg} گروه های مرتبط با برند اطمینان دارید؟',
  },
  usableBrandsEditSuccess: {
    id: 'app.domains.brands.relatedProductGroupByBrand.usableBrandsEditSuccess',
    defaultMessage: 'وضعیت با موفقیت ویرایش شد',
  },
  brandsSuccessChangeStatus: {
    id: `app.admin.domains.certificates.docs.success.change.status`,
    defaultMessage: 'تعداد {changeCount} رکورد با موفقیت تغییر وضعیت داده شد',
  },
  displayShowType: {
    id: 'app.domains.brands.relatedProductGroupByBrand.displayShowType',
    defaultMessage: 'نوع نمایش صفحه',
  },
  displayType: {
    id: 'app.domains.brands.relatedProductGroupByBrand.displayType',
    defaultMessage: 'صفحه نمایش',
  },
  successfullyDeleted: {
    id: 'app.domains.brands.relatedProductGroupByBrand.successfullyDeleted',
    defaultMessage: 'حذف با موفقیت انجام شد',
  },
})
export default brandsPageMessages
