import { HBIcon } from '@hasty-bazar/core'
import { Box, Typography } from '@mui/material'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import OrdersManagementMessage from '../../ordersManagement.message'

const Header: FC = () => {
  const { formatMessage } = useIntl()
  return (
    <Box display="flex" alignItems="center">
      <HBIcon type="shoppingBasket" />
      <Typography variant="h5" ml={2}>
        {formatMessage(OrdersManagementMessage.orders)}
      </Typography>
    </Box>
  )
}

export default Header
