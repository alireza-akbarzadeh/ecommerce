import { Box, Typography } from '@mui/material'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import OrdersManagementMessages from '../../ordersManagement.message'

interface CreateAccordinTitleProps {
  vendorName: string
  totalPrice: number
  actualCommissionPrice: number
  inProggressCommissionPrice: number
}

const CreateAccordinTitle: FC<CreateAccordinTitleProps> = ({
  vendorName,
  totalPrice,
  actualCommissionPrice,
  inProggressCommissionPrice,
}) => {
  const { formatMessage } = useIntl()

  const createEachTitle = (title: string, value: number | string) => {
    return (
      <Box width="100%" display="flex" flexDirection="row">
        <Typography variant="h6" fontWeight="bold" mr={1}>
          {formatMessage(OrdersManagementMessages[title])}
        </Typography>
        <Typography variant="h6" fontWeight="bold" sx={{ color: 'info.main' }}>
          {typeof value === 'string' ? value : value?.toLocaleString()}
        </Typography>
      </Box>
    )
  }

  return (
    <Box width="100%" display="flex" flexDirection="row">
      {createEachTitle('vendorName', vendorName)}
      {createEachTitle('totalAmountOfSale', totalPrice)}
      {createEachTitle('actualCommissionPrice', actualCommissionPrice)}
      {createEachTitle('inProggressCommissionPrice', inProggressCommissionPrice)}
    </Box>
  )
}

export default CreateAccordinTitle
