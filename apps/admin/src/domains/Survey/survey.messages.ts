import { defineMessages } from 'react-intl'

const scope = 'app.admin.survey'

const surveyMessages = defineMessages({
  surveyQuestions: {
    id: `${scope}.surveyQuestions`,
    defaultMessage: 'انواع سوالات نظرسنجی',
  },
  type: {
    id: `${scope}.type`,
    defaultMessage: 'نوع',
  },
  title: {
    id: `${scope}.title`,
    defaultMessage: 'عنوان',
  },
  displayType: {
    id: `${scope}.displayType`,
    defaultMessage: 'نحوه نمایش',
  },
  iconCategoryType: {
    id: `${scope}.'iconCategoryType`,
    defaultMessage: 'نوع دسته‌بندی آیکن',
  },
  howToUse: {
    id: `${scope}.howToUse`,
    defaultMessage: 'نحوه استفاده',
  },
  minNumberOfCharacters: {
    id: `${scope}.minNumberOfCharacters`,
    defaultMessage: 'حداقل تعداد انتخاب/کاراکتر',
  },
  maxNumberOfCharacters: {
    id: `${scope}.maxNumberOfCharacters`,
    defaultMessage: 'حداکثر تعداد انتخاب/کاراکتر',
  },
  state: {
    id: `${scope}.state`,
    defaultMessage: 'مرحله',
  },
  successfullyDeleted: {
    id: `${scope}.successfullyDeleted`,
    defaultMessage: 'حذف با موفقیت انجام شد',
  },
  confirmationMessageDeleting: {
    id: `${scope}.confirmationMessageDeleting`,
    defaultMessage: `آیا از حذف {msg} نظرسنجی اطمینان دارید؟`,
  },
  confirmationTitleDeleting: {
    id: `${scope}.confirmationTitleDeleting`,
    defaultMessage: 'حذف نظرسنجی',
  },
  editSurvey: {
    id: `${scope}.editSurvey`,
    defaultMessage: 'ویرایش نظرسنجی',
  },
  addSurvey: {
    id: `${scope}.addSurvey`,
    defaultMessage: 'افزودن نظرسنجی',
  },
  choicesList: {
    id: `${scope}.choicesList`,
    defaultMessage: 'لیست انتخاب‌ها',
  },
  affectedBy: {
    id: `${scope}.affectedBy`,
    defaultMessage: 'تاثیرپذیری',
  },
  surveyLikeToSave: {
    id: `${scope}.surveyLikeToSave`,
    defaultMessage: 'آیا تمایل به ذخیره تغییرات دارید؟ ',
  },
  choicesDeleteSuccessFully: {
    id: `${scope}.delete.successfully`,
    defaultMessage: 'تعداد {choicesCount} انتخابی حذف شد',
  },
  confirmationMessageDeletingChoices: {
    id: `${scope}.confirmationMessageDeletingChoices`,
    defaultMessage: `آیا از حذف {msg} مورد انتخاب شده اطمینان دارید؟`,
  },
  confirmationTitleDeletingChoices: {
    id: `${scope}.confirmationTitleDeletingChoices`,
    defaultMessage: 'حذف انتخابی‌ها',
  },
  choiceList: {
    id: `${scope}.choiceList`,
    defaultMessage: 'لیست انتخاب',
  },
  choiceTitle: {
    id: `${scope}.choiceTitle`,
    defaultMessage: 'عنوان',
  },
  choiceWorthiness: {
    id: `${scope}.choiceWorthiness`,
    defaultMessage: 'ارزش',
  },
  choiceOrder: {
    id: `${scope}.choiceOrder`,
    defaultMessage: 'ترتیب',
  },
  affectedByDeleteSuccessFully: {
    id: `${scope}.delete.successfully`,
    defaultMessage: 'تعداد {affectedByCount} تاثیرپذیری حذف شد',
  },
  confirmationMessageDeletingAffectedBy: {
    id: `${scope}.confirmationMessageDeletingAffectedBy`,
    defaultMessage: `آیا از حذف {msg} مورد انتخاب شده اطمینان دارید؟`,
  },
  confirmationTitleDeletingAffectedBy: {
    id: `${scope}.confirmationTitleDeletingAffectedBy`,
    defaultMessage: 'حذف تاثیرپذیری',
  },
  effectiveIn: {
    id: `${scope}.effectiveIn`,
    defaultMessage: 'موثر در',
  },
  effectRate: {
    id: `${scope}.effectRate`,
    defaultMessage: 'میزان تاثیر',
  },
  surveyAddedSuccessfully: {
    id: `${scope}.surveyAddedSuccessfully`,
    defaultMessage: 'نظرسنجی با موفقیت اضافه شد',
  },
  surveyUpdatedSuccessfully: {
    id: `${scope}.surveyUpdatedSuccessfully`,
    defaultMessage: 'نظرسنجی با موفقیت ویرایش شد',
  },
})
export default surveyMessages
