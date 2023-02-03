import { useIntl } from 'react-intl'
import PlatformCarrierAgrrementsMessages from '../../PlatformCarrierAgreementSettings.message'

const useFormFields = () => {
  const { formatMessage } = useIntl()

  const agentColumn = [
    {
      field: 'providerName',
      width: 300,
      headerName: formatMessage(PlatformCarrierAgrrementsMessages.agentName),
      showInChip: true,
    },
    {
      field: 'providerShippingStateTitle',
      width: 200,
      headerName: formatMessage(PlatformCarrierAgrrementsMessages.publishStatus),
      showInChip: false,
    },
    { field: 'id', width: 100, headerName: 'id', hidden: true, isIdField: true },
  ]

  const carrierColumn = [
    {
      field: 'providerName',
      width: 300,
      headerName: formatMessage(PlatformCarrierAgrrementsMessages.carrierName),
      showInChip: true,
    },
    {
      field: 'providerShippingStateTitle',
      width: 200,
      headerName: formatMessage(PlatformCarrierAgrrementsMessages.publishStatus),
      showInChip: false,
    },
    { field: 'id', width: 100, headerName: 'id', hidden: true, isIdField: true },
  ]

  return {
    agentColumn,
    carrierColumn,
  }
}

export default useFormFields
