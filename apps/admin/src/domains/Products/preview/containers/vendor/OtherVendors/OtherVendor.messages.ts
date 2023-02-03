import { defineMessages } from 'react-intl'

const scope = 'app.commerce.containers.other-vendors'
const OtherVendorMessages = defineMessages({
  hasGuaranty: {
    id: `${scope}.hasGuaranty`,
    defaultMessage: 'ضمانت دارد',
  },
  hasNoGuaranty: {
    id: `${scope}.hasNoGuaranty`,
    defaultMessage: 'ضمانت ندارد',
  },
})

export default OtherVendorMessages
