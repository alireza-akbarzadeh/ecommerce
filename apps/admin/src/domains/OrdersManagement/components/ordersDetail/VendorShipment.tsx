import { HBAdminAccordion } from '@hasty-bazar/admin-shared/components'
import { ShipmentTrackingDto } from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { Grid } from '@mui/material'
import { PropsModel } from '../../types'
import ShipmentInfo from '../ordersDetail/ShipmentInfo'
import CreateAccordinTitle from './CreateAccordinTitle'

const VendorShipment = ({ vendorsShipmentData }: PropsModel) => {
  const shipmentTrackingsList: ShipmentTrackingDto[] | null | undefined =
    vendorsShipmentData?.data?.shipmentTrackings

  return (
    <Grid container>
      {shipmentTrackingsList?.map((item: ShipmentTrackingDto) => (
        <HBAdminAccordion
          expanded
          title={<CreateAccordinTitle {...{ item }} />}
          hidden
          sx={{ display: 'block' }}
          headerStyle={{ width: '100%' }}
        >
          <ShipmentInfo
            partyId={String(vendorsShipmentData?.data?.partyId)}
            shipmentTrackings={item}
            agentName={vendorsShipmentData?.data?.agentName}
          />
        </HBAdminAccordion>
      ))}
    </Grid>
  )
}

export default VendorShipment
