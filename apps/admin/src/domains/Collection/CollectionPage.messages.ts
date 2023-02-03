import { defineMessages } from 'react-intl'

const collectionPageMessages = defineMessages({
  general: {
    id: `app.admin.domains.collection.general`,
    defaultMessage: 'عمومی',
  },
  collection: {
    id: `app.admin.domains.collection.collection`,
    defaultMessage: 'مجموعه',
  },
  editCollection: {
    id: `app.admin.domains.collection.editCollection`,
    defaultMessage: 'ویرایش مجموعه',
  },
  addCollection: {
    id: `app.admin.domains.collection.addCollection`,
    defaultMessage: 'افزودن مجموعه',
  },
  id: {
    id: `app.admin.domains.collection.id`,
    defaultMessage: 'شناسه',
  },
  code: {
    id: `app.admin.domains.collection.code`,
    defaultMessage: 'کد',
  },
  collectionName: {
    id: `app.admin.domains.collection.collectionName`,
    defaultMessage: 'عنوان',
  },
  originName: {
    id: `app.admin.domains.collection.originName`,
    defaultMessage: 'عنوان سیستمی',
  },
  resultDataType: {
    id: `app.admin.domains.collection.resultDataType`,
    defaultMessage: 'نحوه خروجی داده',
  },
  maxDisplayResult: {
    id: `app.admin.domains.collection.maxDisplayResult`,
    defaultMessage: 'حداکثر تعداد نمایش',
  },
  state: {
    id: `app.admin.domains.collection.state`,
    defaultMessage: 'مرحله',
  },
  status: {
    id: `app.admin.domains.collection.status`,
    defaultMessage: 'وضعیت',
  },
  deleteCollection: {
    id: `app.admin.domains.collection.deleteCollection`,
    defaultMessage: 'حذف مجموعه',
  },
  errorOnDelete: {
    id: `app.admin.domains.collection.errorOnDelete`,
    defaultMessage: 'خطا در حذف رکورد',
  },
  unsuccessDelete: {
    id: `app.admin.domains.collection.unsuccessDelete`,
    defaultMessage: 'رکورد با موفقیت حذف نگردید',
  },
  successDelete: {
    id: `app.admin.domains.collection.successDelete`,
    defaultMessage: 'رکورد با موفقیت حذف گردید',
  },
  successEdit: {
    id: `app.admin.domains.collection.successEdit`,
    defaultMessage: 'رکورد با موفقیت ویرایش گردید',
  },
  areYouSure: {
    id: `app.admin.domains.collection.areYouSure`,
    defaultMessage: 'آیا از حذف count مجموعه اطمینان داری',
  },
  save: {
    id: `app.admin.domains.collection.save`,
    defaultMessage: 'ذخیره کردن',
  },
  wouldYouLikeToSaveTheChanges: {
    id: `app.admin.domains.collection.wouldYouLikeToSaveTheChanges`,
    defaultMessage: 'آیا تمایل به ذخیره تغییرات دارید؟',
  },
  dashbord: {
    id: `app.admin.domains.collection.dashbord`,
    defaultMessage: 'داشبورد',
  },
  preview: {
    id: `app.admin.domains.collection.preview`,
    defaultMessage: 'پیش نمایش',
  },
  publicationStatus: {
    id: `app.admin.domains.collection.publicationStatus`,
    defaultMessage: 'وضعیت انتشار',
  },
  changeStatus: {
    id: `app.admin.domains.collection.changeStatus`,
    defaultMessage: 'تغییر وضعیت',
  },
  draft: {
    id: `app.admin.domains.collection.draft`,
    defaultMessage: 'پیش نویس',
  },
  someSelectedRecordsCannotBeDeletedAccordingToTheState: {
    id: `app.admin.domains.collection.someSelectedRecordsCannotBeDeletedAccordingToTheState`,
    defaultMessage: 'بعضی از رکوردهای انتخابی با توجه به مرحله جاری قابل حذف نیستن',
  },
  selectedRecordCannotBeEditAccordingToTheState: {
    id: `app.admin.domains.collection.selectedRecordCannotBeEditAccordingToTheState`,
    defaultMessage: 'رکورد انتخابی با توجه به مرحله جاری قابل ویرایش نیست',
  },
  release: {
    id: `app.admin.domains.collection.release`,
    defaultMessage: 'انتشار',
  },
  dynamicQuery: {
    id: `app.admin.domains.collection.dynamicQuery`,
    defaultMessage: 'پرس و جوی پویا',
  },
  categoriesOfFilters: {
    id: `app.admin.domains.collection.categoriesOfFilters`,
    defaultMessage: 'دسته بندی فیلترها',
  },
  collectionType: {
    id: `app.admin.domains.collection.collectionType`,
    defaultMessage: 'انواع مجموعه خروجی',
  },
  collectionQueryResult: {
    id: `app.admin.domains.collection.collectionQueryResult`,
    defaultMessage: 'نتیجه اجرای کوئری',
  },
  bigger: {
    id: `app.admin.domains.collection.bigger`,
    defaultMessage: 'بزرگتر',
  },
  smaller: {
    id: `app.admin.domains.collection.smaller`,
    defaultMessage: 'کوچکتر',
  },
  equal: {
    id: `app.admin.domains.collection.equal`,
    defaultMessage: 'مساوی',
  },
  smallerequal: {
    id: `app.admin.domains.collection.smallerequal`,
    defaultMessage: 'کوچکتر مساوی',
  },
  greaterequal: {
    id: `app.admin.domains.collection.greaterequal`,
    defaultMessage: 'بزرگتر مساوی',
  },
  against: {
    id: `app.admin.domains.collection.against`,
    defaultMessage: 'مخالف',
  },
  sortPriority: {
    id: `app.admin.domains.collection.sortPriority`,
    defaultMessage: 'انتخاب اولویت نمایش',
  },
  addSortOption: {
    id: `app.admin.domains.collection.addSortOption`,
    defaultMessage: 'افزودن اولویت نمایش',
  },
  systemParameter: {
    id: `app.admin.domains.collection.systemParameter`,
    defaultMessage: 'ورودی سیستمی',
  },
  yes: {
    id: `app.admin.domains.collection.yes`,
    defaultMessage: 'بلی',
  },
  no: {
    id: `app.admin.domains.collection.no`,
    defaultMessage: 'خیر',
  },
  cacheTime: {
    id: `app.admin.domains.collection.cacheTime`,
    defaultMessage: 'تنظیم زمان بروزرسانی',
  },
  durationTime: {
    id: `app.admin.domains.collection.durationTime`,
    defaultMessage: 'بازه زمانی (دقیقه)',
  },
})
export default collectionPageMessages
