import { defineMessages } from 'react-intl'

const scope = 'app.admin.domains.users.containers.details.userFeedback'
const userFeedbackMessages = defineMessages({
  feedbackTitle: {
    id: `${scope}.feedbackTitle`,
    defaultMessage: 'بازخوردها',
  },
  recommendationType: {
    id: `${scope}.recommendationType`,
    defaultMessage: 'نوع توصیه',
  },
  workflow: {
    id: `${scope}.workflow`,
    defaultMessage: 'گردش کار',
  },
  score: {
    id: `${scope}.score`,
    defaultMessage: 'امتیاز',
  },
  fromDate: {
    id: `${scope}.fromDate`,
    defaultMessage: 'از تاریخ',
  },
  toDate: {
    id: `${scope}.toDate`,
    defaultMessage: 'تا تاریخ',
  },
  clearFilter: {
    id: `${scope}.clearFilter`,
    defaultMessage: 'حذف فیلتر',
  },
  submitFilter: {
    id: `${scope}.submitFilter`,
    defaultMessage: 'اعمال فیلتر',
  },
})
export default userFeedbackMessages
