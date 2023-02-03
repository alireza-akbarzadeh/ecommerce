import { HBIcon } from '@hasty-bazar/core'
import { Stack, Typography } from '@mui/material'
import { FC } from 'react'
import { FormattedMessage } from 'react-intl'
import ProductionDetailMessages from '../../domains/ProductDetail/productDetail.messages'

interface IVendorRate {
  count: string
  value: string
  liked?: boolean
  hideText?: boolean
}

const VendorRate: FC<IVendorRate> = (props) => {
  const { count, value, liked = false, hideText = false } = props
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      {!hideText && (
        <Typography variant="caption" color="text.secondary">
          <FormattedMessage {...ProductionDetailMessages.performanceAndSatisfaction} />
        </Typography>
      )}

      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="caption" color="text.secondary">
          ({count})
        </Typography>
        <Typography variant="caption" color="warning.main">
          {value}
        </Typography>
        <HBIcon sx={{ color: 'warning.main' }} type="star" size="small" />
      </Stack>
    </Stack>
  )
}

export default VendorRate
