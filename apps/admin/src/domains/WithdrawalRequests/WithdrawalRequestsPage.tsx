import BreadCrumbSection from '@hasty-bazar/admin-shared/components/BreadCrumb/BreadCrumbSection'
import DataGridAndFilters from './containers/dataGridAndFilters'
import messages from './messages/index.messages'
import Layout from './components/layout'
import { useIntl } from 'react-intl'

function WithdrawalRequestsPage() {
  const { formatMessage } = useIntl()

  const breadcrumbs = [
    {
      url: '/',
      title: formatMessage(messages.dashboard),
    },
    {
      url: '/withdrawal-requests',
      title: formatMessage(messages.withdrawalRequests),
    },
  ]

  return (
    <Layout
      breadcrumbs={
        <BreadCrumbSection
          title={formatMessage(messages.withdrawalRequests)}
          breadItems={breadcrumbs}
        />
      }
      dataGridAndFilters={<DataGridAndFilters />}
    />
  )
}

export default WithdrawalRequestsPage
