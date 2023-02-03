import { HBIcon } from '@hasty-bazar/core'
import { Box, Stack, Typography } from '@mui/material'
import { useIntl } from 'react-intl'
import VendorMessages from '../../../Vendor.messages'

type InfoProps = {
  storeTitle: string
  registerDate: string
  readyToSellProductsNumber: string
  validSellNumber: string
  buyersNumber: string
}

function Info({
  buyersNumber,
  readyToSellProductsNumber,
  registerDate,
  validSellNumber,
  storeTitle,
}: InfoProps) {
  const { formatMessage } = useIntl()

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 4 }}>
        {storeTitle} {formatMessage(VendorMessages.atHastiBazaar)}
      </Typography>

      <Stack
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 2,
          my: 2,
          color: ({ palette }) => palette.grey[500],
        }}
      >
        <HBIcon
          sx={{
            fontSize: 16,
          }}
          type="store"
        />
        <Typography variant="subtitle2" sx={{ color: 'common.black' }}>
          {registerDate}
        </Typography>
      </Stack>

      <Stack
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 2,
          my: 2,
          color: ({ palette }) => palette.grey[500],
        }}
      >
        <HBIcon
          sx={{
            fontSize: 16,
          }}
          type="tag"
        />
        <Typography variant="subtitle2" sx={{ color: 'common.black' }}>
          {formatMessage(VendorMessages.readyToSellProducts)} {readyToSellProductsNumber}{' '}
          {formatMessage(VendorMessages.product)}
        </Typography>
      </Stack>

      <Stack
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 2,
          my: 2,
          color: ({ palette }) => palette.grey[500],
        }}
      >
        <HBIcon
          sx={{
            fontSize: 16,
          }}
          size="small"
          type="check"
        />
        <Typography variant="subtitle2" sx={{ color: 'common.black' }}>
          {validSellNumber} {formatMessage(VendorMessages.successfulOrder)}
        </Typography>
      </Stack>

      <Stack
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 2,
          my: 2,
          color: ({ palette }) => palette.grey[500],
        }}
      >
        <HBIcon
          sx={{
            fontSize: 16,
          }}
          type="usersAlt"
        />
        <Typography variant="subtitle2" sx={{ color: 'common.black' }}>
          {buyersNumber} {formatMessage(VendorMessages.buyer)}
        </Typography>
      </Stack>
    </Box>
  )
}

export default Info
