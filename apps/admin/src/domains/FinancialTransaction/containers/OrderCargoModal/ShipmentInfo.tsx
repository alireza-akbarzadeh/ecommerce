import { ShipmentTrackingDto } from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { HBClassesType } from '@hasty-bazar/core'
import { convertDateToPersian } from '@hasty-bazar/admin-shared/utils'
import { Box, Divider, Grid, Typography } from '@mui/material'
import { FC, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import FinancialTransactionMessage from '../../financialTransaction.message'
import ShipmentItems from './ShipmentItems'
import { useAppSelector } from '@hasty-bazar/admin-shared/core/redux/hooks'

interface ReciverModel {
  reciverName?: string | null
  reciverPhoneNumber?: string | null
  reciverAddress?: string | null
}

type HBPageClassNames = 'gridSection'
const classes: HBClassesType<HBPageClassNames> = {
  gridSection: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}

interface ShipmentInfoProps {
  shipmentTrackings: ShipmentTrackingDto
  agentName: string
}

const ShipmentInfo: FC<ShipmentInfoProps> = ({ shipmentTrackings, agentName }) => {
  const [extractShippingTrackingsList, setExtractShippingTrackingsList] =
    useState<ShipmentTrackingDto>({})
  const [reciver, setReciver] = useState<ReciverModel>({})
  const { formatMessage } = useIntl()
  const defaultCurrencyTitle = useAppSelector((state) => state.app.defaultCurrencyTitle)

  useEffect(() => {
    setExtractShippingTrackingsList({
      shipmentTypesName: shipmentTrackings.shipmentTypesName!,
      deliveryTypesName: shipmentTrackings.providerName!,
      deliveryCoName: agentName,
      trackingNumber: shipmentTrackings.trackingNumber,
      predictDeliveryDate: shipmentTrackings.predictDeliveryDate,
      deliveryDate: shipmentTrackings.deliveryDate,
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

  const setVAlue = (property: string, data: ReciverModel | ShipmentTrackingDto) => {
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

  const createOthersFields = (data: ShipmentTrackingDto) => {
    return Object.keys(data)?.map((property) => {
      return (
        <Grid item xs={12} sm={4}>
          <Box display="flex">
            <Typography pr={1} variant={'body2'}>
              {
                //@ts-ignore
                `${formatMessage(FinancialTransactionMessage[property])} `
              }
            </Typography>
            <Typography sx={{ color: 'grey.500' }} variant={'body2'}>
              {setVAlue(property, data)}
            </Typography>
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
            <Typography pr={1} variant={'body2'}>
              {`${formatMessage(FinancialTransactionMessage.reciverName)}`}
            </Typography>
            <Typography sx={{ color: 'grey.500' }} variant={'body2'}>
              {setVAlue('reciverName', data)}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box display="flex">
            <Typography pr={1} variant={'body2'}>
              {`${formatMessage(FinancialTransactionMessage.reciverPhoneNumber)}`}
            </Typography>
            <Typography sx={{ color: 'grey.500' }} variant={'body2'}>
              {setVAlue('reciverPhoneNumber', data)}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Box display="flex">
            <Typography pr={1} variant={'body2'}>
              {`${formatMessage(FinancialTransactionMessage.reciverAddress)}`}
            </Typography>
            <Typography sx={{ color: 'grey.500' }} variant={'body2'}>
              {setVAlue('reciverAddress', data)}
            </Typography>
          </Box>
        </Grid>
      </>
    )
  }

  return (
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
      <Grid container item xs={12} sm={12} sx={classes.gridSection}>
        <Grid container spacing={6}>
          <ShipmentItems
            shipmentProducts={shipmentTrackings?.shipmentProducts}
            deliveryHour={shipmentTrackings?.deliveryHour!}
            deliveryDate={shipmentTrackings?.deliveryOpenDate!}
          />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default ShipmentInfo
