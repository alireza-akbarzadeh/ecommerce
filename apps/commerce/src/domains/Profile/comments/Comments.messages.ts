import { defineMessages } from 'react-intl'

const scope = 'app.commerce.profile.comments'
const CommentsMessages = defineMessages({
  waiterComments: {
    id: `${scope}.waiterComments`,
    defaultMessage: 'در انتظار ثبت نظر',
  },
  userComments: {
    id: `${scope}.userComments`,
    defaultMessage: 'نظرات من',
  },
  commentsCount: {
    id: `${scope}.commentsCount`,
    defaultMessage: '{count} نفر برای این کالا نظر ثبت کرده اند',
  },
  commentsLikeCount: {
    id: `${scope}.commentsLikeCount`,
    defaultMessage: 'نظر شما برای {count} نفر مفید بود',
  },
  addCommentButton: {
    id: `${scope}.addCommentButton`,
    defaultMessage: 'ثبت نظر',
  },
  removeComment: {
    id: `${scope}.removeComment`,
    defaultMessage: 'حذف نظر',
  },
  removeCommentMessage: {
    id: `${scope}.removeCommentMessage`,
    defaultMessage: 'آیا مطمئن هستید که می‌خواهید نظر خود را حذف کنید؟',
  },
  deleteCommentSuccess: {
    id: `${scope}.deleteCommentSuccess`,
    defaultMessage: 'نظر با موفقیت حذف شد.',
  },
  connectionError: {
    id: `${scope}.connectionError`,
    defaultMessage: 'درخواست شما با خطا مواجه شد، لطفا مجددا تلاش نمایید.',
  },
  cancel: {
    id: `${scope}.cancel`,
    defaultMessage: 'انصراف',
  },
  remove: {
    id: `${scope}.remove`,
    defaultMessage: 'حذف',
  },
  edit: {
    id: `${scope}.edit`,
    defaultMessage: 'ویرایش',
  },
  allComments: {
    id: `${scope}.allComments`,
    defaultMessage: 'همه',
  },
  draftComments: {
    id: `${scope}.draftComments`,
    defaultMessage: 'در حال بررسی',
  },
  publishedComments: {
    id: `${scope}.publishedComments`,
    defaultMessage: 'تایید شده',
  },
  rejectedComments: {
    id: `${scope}.rejectedComments`,
    defaultMessage: 'رد شده',
  },
})

export default CommentsMessages
