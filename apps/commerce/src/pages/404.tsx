import { NotFoundPage } from '@hasty-bazar-commerce/domains/NotFoundPage'
import notFoundMessage from '@hasty-bazar-commerce/domains/NotFoundPage/notFound.messages'
import { useIntl } from 'react-intl'

export default function FourOhFour() {
  const { formatMessage } = useIntl()
  return (
    <NotFoundPage
      title={formatMessage(notFoundMessage.pageNotFound)}
      subTitle={formatMessage(notFoundMessage.thisPageIsUnavailableOrHasBeenRemoved)}
    />
  )
}
