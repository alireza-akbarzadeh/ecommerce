import { ShipmentTrackingDto } from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { convertDateToPersian } from '@hasty-bazar/admin-shared/utils'
import { HBClassesType } from '@hasty-bazar/core'
import { Box, Divider, Grid, Typography } from '@mui/material'
import { FC, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import OrdersManagementMessage from '../../ordersManagement.message'
import { ExtractShippingTrackingsListModel, ReciverModel } from '../../types'
import ShipmentItems from './ShipmentItems'
import { useAppSelector } from '@hasty-bazar/admin-shared/core/redux/hooks'

type HBPageClassNames = 'gridSection'

const classes: HBClassesType<HBPageClassNames> = {
  gridSection: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}

interface ShipmentInfoProps {
  shipmentTrackings: ShipmentTrackingDto
  partyId: string
  agentName: string
}

const ShipmentInfo: FC<ShipmentInfoProps> = ({ shipmentTrackings, partyId, agentName }) => {
  const [extractShippingTrackingsList, setExtractShippingTrackingsList] =
    useState<ExtractShippingTrackingsListModel>({})
  const [reciver, setReciver] = useState<ReciverModel>({})
  const { formatMessage } = useIntl()
  const defaultCurrencyTitle = useAppSelector((state) => state.app.defaultCurrencyTitle)

  useEffect(() => {
    setExtractShippingTrackingsList({
      shipmentTypesName: shipmentTrackings.shipmentTypesName,
      deliveryTypesName: shipmentTrackings.providerName,
      deliveryCoName: agentName,
      trackingNumber: shipmentTrackings.trackingNumber,
      predictDeliveryDate: shipmentTrackings.predictDeliveryDate as string,
      deliveryDate: shipmentTrackings.deliveryDate as string,
      deliveryOpenDate: shipmentTrackings.deliveryHour,
      shipmentFee: shipmentTrackings.shipmentFee,
      sharePlatform: shipmentTrackings.sharePlatform,
      shareVendor: shipmentTrackings.shareVendor,
      shareCustomer: shipmentTrackings.shareCustomer,
      deliveryStatusName: shipmentTrackings.deliveryStatusName,
      deliveryServiceStatusName: shipmentTrackings.deliveryServiceStatusName,
    })
    setReciver({
      reciverName: shipmentTrackings.reciverName,
      reciverPhoneNumber: shipmentTrackings.reciverPhoneNumber,
      reciverAddress: shipmentTrackings.reciverAddress,
    })
  }, [shipmentTrackings])

  const setVAlue = (property: string, data: ReciverModel | ExtractShippingTrackingsListModel) => {
    switch (property) {
      case 'predictDeliveryDate':
      case 'deliveryDate':
        //@ts-ignore
        return convertDateToPersian(data[property])
      case 'shipmentFee':
        //@ts-ignore
        return data[property]
          ? //@ts-ignore
            `${data[property].toLocaleString()} ${defaultCurrencyTitle}`
          : 0
      case 'trackingNumber':
      case 'reciverPhoneNumber':
        //@ts-ignore
        return data[property] ?? ``
      case 'sharePlatform':
      case 'shareVendor':
      case 'shareCustomer':
        //@ts-ignore
        return data[property]
          ? //@ts-ignore
            `${data[property].toLocaleString()} ${defaultCurrencyTitle}`
          : 0
      default:
        //@ts-ignore
        return data[property] ?? ``
    }
  }

  const createOthersFields = (data: ExtractShippingTrackingsListModel) => {
    return Object.keys(data)?.map((property) => {
      return (
        <Grid item xs={12} sm={4}>
          <Box display="flex">
            <Typography pr={1}>{`${formatMessage(OrdersManagementMessage[property])} `}</Typography>
            <Typography sx={{ color: 'grey.500' }}>{setVAlue(property, data)}</Typography>
          </Box>
        </Grid>
      )
    })
  }

  const createReciverFields = (data: ReciverModel) => {
    return (
      <>
        <Grid item xs={12} sm={4}>
          <Box display="flex">
            <Typography pr={1}>{`${formatMessage(
              OrdersManagementMessage.reciverName,
            )}`}</Typography>
            <Typography sx={{ color: 'grey.500' }}>{setVAlue('reciverName', data)}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box display="flex">
            <Typography pr={1}>{`${formatMessage(
              OrdersManagementMessage.reciverPhoneNumber,
            )}`}</Typography>
            <Typography sx={{ color: 'grey.500' }}>
              {setVAlue('reciverPhoneNumber', data)}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Box display="flex">
            <Typography pr={1}>{`${formatMessage(
              OrdersManagementMessage.reciverAddress,
            )}`}</Typography>
            <Typography sx={{ color: 'grey.500' }}>{setVAlue('reciverAddress', data)}</Typography>
          </Box>
        </Grid>
      </>
    )
  }

  return (
    <>
      <Grid spacing={6}>
        <Grid container item xs={12} sm={12} sx={classes.gridSection}>
          <Grid container spacing={6}>
            {createOthersFields(extractShippingTrackingsList)}
          </Grid>
          <Box width="100%" mt={6} mb={6}>
            <Divider sx={{ color: 'grey.200' }} />
          </Box>
          <Grid container spacing={6}>
            {createReciverFields(reciver)}
          </Grid>
          <Box width="100%" mt={6}>
            <Divider sx={{ color: 'grey.200' }} />
          </Box>
        </Grid>
      </Grid>
      <ShipmentItems partyId={partyId} {...{ shipmentTrackings }} />
    </>
  )
}

export default ShipmentInfo
