import useClientSession from '@hasty-bazar-commerce/core/hook/useClientSession'
import { NotificationDto } from '@hasty-bazar-commerce/services/saleApi.generated'
import { Box, Stack, Typography } from '@mui/material'
import Image from 'next/image'
import { FC, useState } from 'react'
import NotificationButton from './NotificationButton'

export type usedType = 'quick-basket' | 'full-page'
interface IBuyNotification extends NotificationDto {
  used: usedType
  productId?: string
}

const BuyNotification: FC<IBuyNotification> = (props) => {
  const { used, productId, ...notif } = props

  const [notification, setNotification] = useState<NotificationDto | null>({ ...notif })

  const clientSessionId = useClientSession()

  const removeNotification = () => {
    setNotification(null)
  }

  if (notification)
    return (
      <Stack
        direction="row"
        px={2}
        py={{ xs: 2, md: 3 }}
        bgcolor="warning.lighter"
        justifyContent="space-between"
        borderRadius={2}
        flexWrap="wrap"
        gap={2.5}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          {notification?.icon && (
            <Box>
              <Image
                width={24}
                height={24}
                src={`${process.env.NEXT_PUBLIC_CDN}${notification!.icon!}`}
                alt="notification-icon"
              />
            </Box>
          )}

          <Typography sx={{ flex: 1 }} variant="subtitle1" color="warning.main">
            {notification?.body}
          </Typography>
        </Stack>
        {used === 'full-page' && !!productId && !!notif.shoppingCartItemId && !!props.vendorId && (
          <Stack
            justifyContent={{ xs: 'center', sm: 'flex-start' }}
            direction="row-reverse"
            spacing={2}
            sx={{ flex: 1 }}
          >
            {notification?.metaData?.buttons?.map((button, index) => (
              <NotificationButton
                key={`${notification.vendorId}-${index}`}
                clientSessionId={clientSessionId}
                productId={productId}
                removeNotification={removeNotification}
                shoppingCartId={notif.shoppingCartItemId!}
                vendorId={props.vendorId!}
                {...button}
              />
            ))}
          </Stack>
        )}
      </Stack>
    )
  else return null
}

export default BuyNotification
