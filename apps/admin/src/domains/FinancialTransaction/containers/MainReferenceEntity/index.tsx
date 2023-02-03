import { HBLink } from '@hasty-bazar/admin-shared/components'
import { GetAllFinancialTransactionQueryResult } from '@hasty-bazar/admin-shared/services/accountingApi.generated'
import { Box } from '@mui/material'
import { ICellRendererParams } from 'ag-grid-community'
import { FC } from 'react'

interface MainReferenceEntityProps {
  data?: ICellRendererParams & GetAllFinancialTransactionQueryResult
}

const MainReferenceEntity: FC<MainReferenceEntityProps> = ({ data }) => {
  const mainReferenceDescription = data?.mainReferenceDescription
  const mainReferenceId = data?.mainReferenceId

  return (
    <Box display="flex" alignItems="center" height={'100%'}>
      <HBLink
        underline={'none'}
        href={`/ordersManagement/orderDetails/${mainReferenceId!}`}
        variant={'subtitle2'}
        color={'info.main'}
      >
        {`${mainReferenceDescription}`}
      </HBLink>
    </Box>
  )
}

export default MainReferenceEntity
