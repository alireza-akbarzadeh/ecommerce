import { GetPartyDetailsQueryResult } from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { Grid } from '@mui/material'
import AccountInfo from './containers/account/account'
import FinancialInfo from './containers/financial/financial'

type FinancialInformationType = {
  userId: string
  details: GetPartyDetailsQueryResult
}

const FinancialInformation = ({ userId, details }: FinancialInformationType) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <FinancialInfo userId={userId} details={details} />
      </Grid>
      <Grid item xs={12}>
        <AccountInfo />
      </Grid>
    </Grid>
  )
}
export default FinancialInformation
