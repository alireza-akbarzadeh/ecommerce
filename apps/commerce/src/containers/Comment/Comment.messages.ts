import { defineMessages } from 'react-intl'

const scope = 'app.commerce.Comment'
const CommentMessages = defineMessages({
  connectionError: {
    id: `${scope}.connectionError`,
    defaultMessage: 'درخواست شما با خطا مواجه شد، لطفا مجددا تلاش نمایید.',
  },
  fileFormatNotValid: {
    id: `${scope}.fileFormatNotValid`,
    defaultMessage: 'فرمت فایل انتخابی اشتباه است.',
  },
  deleteFileSuccess: {
    id: `${scope}.deleteFileSuccess`,
    defaultMessage: 'فایل با موفقیت حذف شد.',
  },
  addCommentSuccess: {
    id: `${scope}.addCommentSuccess`,
    defaultMessage: 'نظر شما با موفقیت ثبت شد و پس از تایید، در وب‌سایت نمایش داده می‌شود.',
  },
  updateCommentSuccess: {
    id: `${scope}.updateCommentSuccess`,
    defaultMessage: 'نظر با موفقیت ویرایش گردید و پس از تایید، نمایش داده میشود.',
  },
  uploadFileLimit: {
    id: `${scope}.uploadFileLimit`,
    defaultMessage: 'حداکثر حجم فایل ۶MB میباشد.',
  },
  confrim: {
    id: `${scope}.confrim`,
    defaultMessage: 'ثبت',
  },
  saveCommentTitle: {
    id: `${scope}.saveCommentTitle`,
    defaultMessage: 'ثبت امتیاز و نظر',
  },
  updateCommentTitle: {
    id: `${scope}.updateCommentTitle`,
    defaultMessage: 'ویرایش امتیاز و نظر',
  },
  commentSubjectLabel: {
    id: `${scope}.commentSubjectLabel`,
    defaultMessage: 'عنوان نظر',
  },
  commentDescriptionLabel: {
    id: `${scope}.commentDescriptionLabel`,
    defaultMessage: 'متن نظر',
  },
  commentUploadLabel: {
    id: `${scope}.commentUploadLabel`,
    defaultMessage: 'ارسال تصاویر مربوطه',
  },
  commentUploadLimitLabel: {
    id: `${scope}.commentUploadLimitLabel`,
    defaultMessage: '(حداکثر حجم فایل ۶MB)',
  },
  commentBodyPlaceholder: {
    id: `${scope}.commentBodyPlaceholder`,
    defaultMessage: 'متن نظر خود را بنویسید ',
  },
  saveRateMessage: {
    id: `${scope}.saveRateMessage`,
    defaultMessage: 'به این کالا امتیاز دهید:',
  },
  commentTermsMessage: {
    id: `${scope}.commentTermsMessage`,
    defaultMessage: 'ثبت نظر به معنی موافقت با قوانین انتشار نظرات کاربران است.',
  },
  commentTermsTitle: {
    id: `${scope}.commentTermsTitle`,
    defaultMessage: 'قوانین انتشار نظرات کاربران',
  },
  recommended: {
    id: `${scope}.recommended`,
    defaultMessage: 'خرید این کالا را پیشنهاد می‌کنم',
  },
  notRecommended: {
    id: `${scope}.notRecommended`,
    defaultMessage: 'خرید این کالا را پیشنهاد نمی‌کنم',
  },
  notSure: {
    id: `${scope}.notSure`,
    defaultMessage: 'در مورد خرید این کالا مطمئن نیستم',
  },
  veryBad: {
    id: `${scope}.veryBad`,
    defaultMessage: 'خیلی بد',
  },
  bad: {
    id: `${scope}.bad`,
    defaultMessage: 'بد',
  },
  usual: {
    id: `${scope}.usual`,
    defaultMessage: 'معمولی',
  },
  good: {
    id: `${scope}.good`,
    defaultMessage: 'خوب',
  },
  veryGood: {
    id: `${scope}.veryGood`,
    defaultMessage: 'خیلی خوب',
  },
})

export default CommentMessages
