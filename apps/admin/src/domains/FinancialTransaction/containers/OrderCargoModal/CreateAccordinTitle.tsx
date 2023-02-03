import { ShipmentTrackingDto } from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { Box, Typography } from '@mui/material'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import FinancialTransactionMessage from '../../financialTransaction.message'
interface CreateAccordinTitleProps {
  item: ShipmentTrackingDto
}

const CreateAccordinTitle: FC<CreateAccordinTitleProps> = ({ item }) => {
  const { formatMessage } = useIntl()

  const createEachTitle = (title: string, value: number | string) => {
    return (
      <Box width="100%" display="flex" flexDirection="row">
        <Typography fontWeight="bold" pr={1}>
          {
            //@ts-ignore
            formatMessage(FinancialTransactionMessage[title])
          }
        </Typography>
        <Typography fontWeight="bold" sx={{ color: 'info.main' }}>
          {typeof value === 'string' ? value : value?.toLocaleString()}
        </Typography>
      </Box>
    )
  }

  return (
    <Box width="100%" display="flex" flexDirection="row">
      {createEachTitle('numberOfProducts', item?.shipmentProducts?.length!)}
      {createEachTitle('seller', item?.providerName!)}
      {createEachTitle('shipmentCode', item?.bundleNumber!)}
    </Box>
  )
}

export default CreateAccordinTitle
