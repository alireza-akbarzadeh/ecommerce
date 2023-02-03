import { defineMessages } from 'react-intl'

const scope = 'app.commerce.components.shareModal'
const ShareModalMessages = defineMessages({
  twitter: {
    id: `${scope}.twitter`,
    defaultMessage: 'توییتر',
  },
  linkedin: {
    id: `${scope}.linkedin`,
    defaultMessage: 'لینکدین',
  },
  whatsapp: {
    id: `${scope}.whatsapp`,
    defaultMessage: 'واتساپ',
  },
  email: {
    id: `${scope}.email`,
    defaultMessage: 'ایمیل',
  },
  instagram: {
    id: `${scope}.instagram`,
    defaultMessage: 'اینستاگرام',
  },
  share: {
    id: `${scope}.share`,
    defaultMessage: 'اشتراک گذاری',
  },

  linkedCopied: {
    id: `${scope}.linkedCopied`,
    defaultMessage: 'لینک کپی شد',
  },
})

export default ShareModalMessages
