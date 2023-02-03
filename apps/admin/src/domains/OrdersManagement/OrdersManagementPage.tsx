import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { useIntl } from 'react-intl'
import { Filter } from './containers/filter'
import OrdersManagementMessage from './ordersManagement.message'

interface OrdersManagementPageProps {
  userId?: string
  breadCrumpType?: 'order' | 'user'
}

const OrdersManagementPage = ({ userId, breadCrumpType }: OrdersManagementPageProps) => {
  const { formatMessage } = useIntl()
  const breadcrumbs = [
    {
      url: '/',
      title: formatMessage(phrasesMessages.home),
    },
    {
      url: '/ordersManagement/',
      title: formatMessage(OrdersManagementMessage.ordersManagement),
    },
  ]

  return (
    <>
      {breadCrumpType === 'order' && (
        <BreadCrumbSection
          title={formatMessage(OrdersManagementMessage.ordersManagement)}
          breadItems={breadcrumbs || []}
        />
      )}
      <Filter userId={userId} />
    </>
  )
}

export default OrdersManagementPage
