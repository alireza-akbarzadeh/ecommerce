import { useIntl } from 'react-intl'
import VendorShippingAgrrementsMessages from '../../VendorShippingAgreements.message'

const useFormFields = () => {
  const { formatMessage } = useIntl()

  const productColumn = [
    {
      field: 'name',
      width: 560,
      headerName: formatMessage(VendorShippingAgrrementsMessages.product),
      showInChip: true,
    },
    {
      field: 'vendor',
      width: 300,
      headerName: formatMessage(VendorShippingAgrrementsMessages.seller),
      showInChip: true,
    },
    {
      field: 'hsin',
      width: 230,
      headerName: formatMessage(VendorShippingAgrrementsMessages.code),
      showInChip: false,
    },
    { field: 'id', width: 110, headerName: 'id', hidden: true, isIdField: true },
  ]

  const vendorColumn = [
    {
      field: 'fullName',
      width: 500,
      headerName: formatMessage(VendorShippingAgrrementsMessages.seller),
      showInChip: true,
    },
    {
      field: 'mobile',
      width: 190,
      headerName: formatMessage(VendorShippingAgrrementsMessages.mobile),
      showInChip: true,
    },
    {
      field: 'stateName',
      width: 220,
      headerName: formatMessage(VendorShippingAgrrementsMessages.publishStatus),
      showInChip: true,
    },
    { field: 'id', width: 110, headerName: 'id', hidden: true, isIdField: true },
  ]

  return {
    productColumn,
    vendorColumn,
  }
}

export default useFormFields
