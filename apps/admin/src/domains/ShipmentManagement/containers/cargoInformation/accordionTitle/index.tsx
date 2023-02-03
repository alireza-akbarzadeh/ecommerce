import { GetShipmentOrderBundleByIdQueryResult } from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { Box, Typography } from '@mui/material'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import ShipmentManagementMessage from '../../../messages'

interface AccordionTitleProps {
  accordionTitleData: GetShipmentOrderBundleByIdQueryResult
}

const AccordionTitle: FC<AccordionTitleProps> = ({ accordionTitleData }) => {
  const { formatMessage } = useIntl()
  const createEachTitle = (title: string, value: number | string) => {
    return (
      <Box width="100%" display="flex" flexDirection="row">
        <Typography variant="h6" fontWeight="bold">
          {`${formatMessage(ShipmentManagementMessage[title])} :`}
        </Typography>
        <Typography variant="h6" fontWeight="bold" sx={{ color: 'info.main' }}>
          {typeof value === 'string' ? value : value}
        </Typography>
      </Box>
    )
  }

  return (
    <Box width="100%" display="flex" flexDirection="row">
      {createEachTitle('numberOfProducts', accordionTitleData?.products?.length!)}
      {createEachTitle('providerName', accordionTitleData?.providerName!)}
      {createEachTitle('shipmentCode', accordionTitleData?.number!)}
    </Box>
  )
}

export default AccordionTitle
