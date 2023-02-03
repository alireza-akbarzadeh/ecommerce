import { Box } from '@mui/material'
import React, { useCallback, useState } from 'react'
import { UserCompaniesGrid } from './containers'
import { CompaniesGrid } from './containers/companiesGrid'

export default function Companies() {
  const [companyId, setCompanyId] = useState<string | undefined | null>()

  const GridMemo = useCallback(() => <UserCompaniesGrid companyId={companyId} />, [companyId])

  return (
    <>
      <CompaniesGrid onChangeCompanySelected={(id) => setCompanyId(id)} />
      <Box mt={35}>
        <GridMemo />
      </Box>
    </>
  )
}
