import { defineMessages } from 'react-intl'

const scope = 'app.admin.components.hbtable'
const HBTableMessages = defineMessages({
  isLoadingText: {
    id: `${scope}.isLoadingText`,
    defaultMessage: 'در حال بارگیری...',
  },
  recordsNotFoundText: {
    id: `${scope}.recordsNotFoundText`,
    defaultMessage: 'رکوردی یافت نشد',
  },
})

export default HBTableMessages
