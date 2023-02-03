import WithdrawalRequestsMessages from '../messages/index.messages'
import { FiltersProps, FiltersForm } from '../types'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'

function useFilters(props: FiltersProps) {
  const { onFilter, onResetFilter } = props
  const { formatMessage } = useIntl()
  const formProviderProps = useForm<FiltersForm>({
    mode: 'onChange',
  })
  const statusCodes = [
    { value: '0', title: formatMessage(WithdrawalRequestsMessages.caseStatus1) },
    { value: '1', title: formatMessage(WithdrawalRequestsMessages.caseStatus2) },
  ]

  const handleResetFilters = () => {
    formProviderProps.reset()
    onResetFilter()
  }

  return { onFilter, statusCodes, handleResetFilters, formProviderProps, formatMessage }
}

export default useFilters
