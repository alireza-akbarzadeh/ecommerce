import { useIntl } from 'react-intl'
import ComissionSettingMessages from '../CommissionSetting.message'

const useCommissionFormColumn = () => {
  const { formatMessage } = useIntl()

  const vendorColumn = [
    {
      field: 'fullName',
      width: 250,
      headerName: formatMessage(ComissionSettingMessages.seller),
      showInChip: true,
    },
    {
      field: 'mobile',
      width: 210,
      headerName: formatMessage(ComissionSettingMessages.mobile),
      showInChip: true,
    },
    { field: 'id', width: 110, headerName: 'id', hidden: true, isIdField: true },
  ]
  const brandColumn = [
    {
      field: 'name',
      width: 110,
      headerName: formatMessage(ComissionSettingMessages.productBrand),
      showInChip: true,
    },
    { field: 'id', width: 110, headerName: 'id', hidden: true, isIdField: true },
  ]

  const productColumn = [
    {
      field: 'name',
      width: 540,
      headerName: formatMessage(ComissionSettingMessages.product),
      showInChip: true,
    },
    {
      field: 'vendor',
      width: 250,
      headerName: formatMessage(ComissionSettingMessages.seller),
      showInChip: true,
    },
    {
      field: 'hsin',
      width: 200,
      headerName: formatMessage(ComissionSettingMessages.code),
      showInChip: true,
    },
    { field: 'id', width: 110, headerName: 'id', hidden: true, isIdField: true },
  ]

  return {
    vendorColumn,
    brandColumn,
    productColumn,
  }
}
export default useCommissionFormColumn
