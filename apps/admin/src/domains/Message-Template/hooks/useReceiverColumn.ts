import { GetPartiesQueryResult } from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { HBSelectMultiColumnColumnDefs } from '@hasty-bazar/core'
import { useIntl } from 'react-intl'
import messageTemplatePageMessages from '../MessageTemplate.messages'

const useReceiverColumn = () => {
  const { formatMessage } = useIntl()
  const columnDefs: HBSelectMultiColumnColumnDefs<GetPartiesQueryResult>[] = [
    {
      headerName: '',
      field: 'id' as keyof GetPartiesQueryResult,
      width: 100,
      showInChip: false,
      isIdField: true,
      hidden: true,
    },
    {
      headerName: formatMessage(messageTemplatePageMessages.firstName),
      field: 'firstName' as keyof GetPartiesQueryResult,
      width: 100,
      showInChip: true,
    },
    {
      headerName: formatMessage(messageTemplatePageMessages.lastName),
      field: 'lastName' as keyof GetPartiesQueryResult,
      width: 140,
      showInChip: true,
    },
    {
      headerName: formatMessage(messageTemplatePageMessages.mobile),
      field: 'mobile' as keyof GetPartiesQueryResult,
      width: 140,
      showInChip: false,
    },
    {
      headerName: formatMessage(messageTemplatePageMessages.email),
      field: 'email' as keyof GetPartiesQueryResult,
      width: 140,
      showInChip: false,
    },
  ]
  return { columnDefs }
}
export default useReceiverColumn
