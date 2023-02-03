import { HBMap } from '@hasty-bazar-commerce/containers/HBMap'
import { ConnectionModel } from '@hasty-bazar-commerce/services/catalogApi.generated'
import { HBIcon, HBIconType } from '@hasty-bazar/core'
import { Box, Stack, Typography } from '@mui/material'
import { useIntl } from 'react-intl'
import VendorMessages from '../../../Vendor.messages'

type InfoProps = {
  storeTitle: string
  connection: ConnectionModel
}

function Contact({ storeTitle, connection }: InfoProps) {
  const { formatMessage } = useIntl()
  const { city, province, latitude = 0, longitude = 0, plaque, ...connectionRest } = connection

  let contacts = []
  const getContactChangedData = (key: string) => {
    switch (key) {
      case 'mobile':
        return 'phone'
      case 'whatsApp':
        return 'whatsapp'
      case 'email':
        return 'envelope'
      case 'streetLine':
        return 'locationPoint'
      default:
        return key
    }
  }
  for (const [key, value] of Object?.entries(connectionRest ?? {})) {
    contacts.push({ key: getContactChangedData(key), value })
  }

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 4 }}>
        {formatMessage(VendorMessages.contactWith)} {storeTitle}
      </Typography>
      {contacts.map((contact) => {
        return (
          <>
            {contact.value && (
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
                  type={contact.key as HBIconType}
                />
                <Typography variant="subtitle2" sx={{ color: 'common.black' }}>
                  {contact?.value} {contact?.key === 'instagram' ? '@' : ''}
                </Typography>
              </Stack>
            )}
          </>
        )
      })}

      {latitude && longitude ? (
        <HBMap
          sx={{ height: 160, borderRadius: ({ spacing }) => spacing(4), mt: 6 }}
          center={[latitude, longitude]}
          isShowMarker
          dragging={false}
          hasZoomBox={false}
          scrollWheelZoom={false}
        />
      ) : null}
    </Box>
  )
}

export default Contact
