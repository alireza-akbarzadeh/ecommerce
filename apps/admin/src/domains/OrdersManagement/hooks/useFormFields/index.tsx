import { useIntl } from 'react-intl'
import OrdersManagementMessage from '../../ordersManagement.message'

const useFormFields = () => {
  const { formatMessage } = useIntl()

  const vendorColumn = [
    {
      field: 'fullName',
      width: 300,
      headerName: formatMessage(OrdersManagementMessage.seller).replace(':', ''),
      showInChip: true,
    },
    {
      field: 'mobile',
      width: 230,
      headerName: formatMessage(OrdersManagementMessage.mobile),
      showInChip: true,
    },
    {
      field: 'stateName',
      width: 250,
      headerName: formatMessage(OrdersManagementMessage.publishStatus),
      showInChip: true,
    },
    { field: 'id', width: 110, headerName: 'id', hidden: true, isIdField: true },
  ]

  const customerColumn = [
    {
      field: 'fullName',
      width: 300,
      headerName: formatMessage(OrdersManagementMessage.customerName),
      showInChip: true,
    },
    {
      field: 'mobile',
      width: 220,
      headerName: formatMessage(OrdersManagementMessage.mobileNumber),
      showInChip: true,
    },
    {
      field: 'stateName',
      width: 230,
      headerName: formatMessage(OrdersManagementMessage.publishStatus),
      showInChip: true,
    },
    { field: 'id', width: 110, headerName: 'id', hidden: true, isIdField: true },
  ]

  const productColumn = [
    {
      field: 'name',
      width: 450,
      headerName: formatMessage(OrdersManagementMessage.product),
      showInChip: true,
    },
    {
      field: 'vendor',
      width: 200,
      headerName: formatMessage(OrdersManagementMessage.seller).replace(':', ' '),
      showInChip: true,
    },
    {
      field: 'hsin',
      width: 210,
      headerName: formatMessage(OrdersManagementMessage.code),
      showInChip: true,
    },
    { field: 'id', width: 100, headerName: 'id', hidden: true, isIdField: true },
  ]

  const agentColumn = [
    {
      field: 'providerName',
      width: 270,
      headerName: formatMessage(OrdersManagementMessage.serviceName),
      showInChip: true,
    },
    {
      field: 'providerShippingStateTitle',
      width: 230,
      headerName: formatMessage(OrdersManagementMessage.publishStatus),
      showInChip: true,
    },
    { field: 'id', width: 100, headerName: 'id', hidden: true, isIdField: true },
  ]

  const carrierColumn = [
    {
      field: 'providerName',
      width: 280,
      headerName: formatMessage(OrdersManagementMessage.agentName),
      showInChip: true,
    },
    {
      field: 'providerShippingStateTitle',
      width: 230,
      headerName: formatMessage(OrdersManagementMessage.publishStatus),
      showInChip: true,
    },
    { field: 'id', width: 100, headerName: 'id', hidden: true, isIdField: true },
  ]

  return {
    vendorColumn,
    productColumn,
    agentColumn,
    customerColumn,
    carrierColumn,
  }
}

export default useFormFields
