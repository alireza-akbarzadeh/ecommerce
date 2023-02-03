import { useIntl } from 'react-intl'
import FinancialTransactionMessage from '../../financialTransaction.message'

const useFormModalColumn = () => {
  const { formatMessage } = useIntl()

  const vendorColumn = [
    {
      field: 'fullName',
      width: 140,
      headerName: formatMessage(FinancialTransactionMessage.fullName),
      showInChip: true,
    },
    {
      field: 'mobile',
      width: 110,
      headerName: formatMessage(FinancialTransactionMessage.phoneNumber),
      showInChip: false,
    },
    { field: 'id', width: 110, headerName: 'id', hidden: true, isIdField: true },
  ]

  const customerColumn = [
    {
      field: 'fullName',
      width: 140,
      headerName: formatMessage(FinancialTransactionMessage.fullName),
      showInChip: true,
    },
    {
      field: 'mobile',
      width: 110,
      headerName: formatMessage(FinancialTransactionMessage.phoneNumber),
      showInChip: false,
    },
    { field: 'id', width: 110, headerName: 'id', hidden: true, isIdField: true },
  ]

  return {
    vendorColumn,
    customerColumn,
  }
}
export default useFormModalColumn
