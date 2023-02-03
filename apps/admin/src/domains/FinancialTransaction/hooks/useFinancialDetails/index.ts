import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { useGetAdminAccountingApiFinancialTransactionByIdQuery } from '@hasty-bazar/admin-shared/services/accountingApi.generated'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import FinancialTransactionMessage from '../../financialTransaction.message'

const useFinancialDetails = () => {
  const { formatMessage } = useIntl()
  const { query, push } = useRouter()
  const id = query?.id?.[0] ?? ('' as string)
  const handleBack = () => {
    push('/financialTransaction')
  }
  const breadcrumbs = [
    {
      url: '/',
      title: formatMessage(phrasesMessages.home),
    },
    {
      url: '/financialTransaction',
      title: formatMessage(FinancialTransactionMessage.financialManagement),
    },
  ]
  const { data } = useGetAdminAccountingApiFinancialTransactionByIdQuery(
    {
      'client-name': '',
      'client-version': '',
      id,
    },
    {
      skip: !id,
    },
  )
  return { data, breadcrumbs, handleBack, formatMessage }
}

export default useFinancialDetails
