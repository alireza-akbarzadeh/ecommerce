import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import OrdersManagementMessage from '../../ordersManagement.message'

const BreadCrumb: FC = () => {
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
    <BreadCrumbSection
      title={formatMessage(OrdersManagementMessage.commissionCalculation)}
      breadItems={breadcrumbs || []}
    />
  )
}

export default BreadCrumb
