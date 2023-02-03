import { HBExplanationSummary } from '@hasty-bazar/admin-shared/components'
import { HBExplanation } from '@hasty-bazar/admin-shared/containers/HBExplanation'
import userPageMessages from '@hasty-bazar-admin/domains/Users/UserPage.messages'
import { GetPartyDetailsQueryResult } from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { Box } from '@mui/material'
import { useIntl } from 'react-intl'
import WalletChart from './wallet-chart'
import WalletHistoryTable from './wallet-history-table'

type FinancialType = {
  userId: string
  details: GetPartyDetailsQueryResult
}
const Financial = ({ userId, details }: FinancialType) => {
  const { formatMessage } = useIntl()

  return (
    <HBExplanation
      defaultExpanded
      summary={
        <HBExplanationSummary
          title={formatMessage(userPageMessages.tabFinancialInfo)}
          icon="wallet"
        />
      }
      detail={
        <Box bgcolor={'common.white'}>
          <WalletChart userId={userId} details={details} />
          <WalletHistoryTable details={details} />
        </Box>
      }
    />
  )
}
export default Financial
