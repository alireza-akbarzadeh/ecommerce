import { GetShipmentOrderBundleByIdQueryResult } from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { HBClassesType } from '@hasty-bazar/core'
import { Box, Divider, Grid } from '@mui/material'
import { FC } from 'react'
import Products from '../products'
import Bundle from './Bundle'
import Receiver from './Receiver'

type HBPageClassNames = 'gridSection'

const classes: HBClassesType<HBPageClassNames> = {
  gridSection: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}

interface DetailsProps {
  bundleDetailsData: GetShipmentOrderBundleByIdQueryResult
}

const Details: FC<DetailsProps> = ({ bundleDetailsData }) => {
  return (
    <Grid container item xs={12} sm={12} sx={classes.gridSection}>
      <Bundle {...{ bundleDetailsData }} />
      <Box width="100%" my={6}>
        <Divider sx={{ color: 'grey.200' }} />
      </Box>
      <Receiver {...{ bundleDetailsData }} />
      <Box width="100%" my={6}>
        <Divider sx={{ color: 'grey.200' }} />
      </Box>
      <Products partyId={bundleDetailsData?.customerId!} {...{ bundleDetailsData }} />
    </Grid>
  )
}

export default Details
