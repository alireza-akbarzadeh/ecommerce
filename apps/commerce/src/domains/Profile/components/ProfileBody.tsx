import { FavoritePage } from '@hasty-bazar-commerce/domains/Favorite'
import { SavedPage } from '@hasty-bazar-commerce/domains/Saved'
import { Stack } from '@mui/material'
import { FC } from 'react'
import { AccountManagmentBody } from '../accountManagment'
import { AddressManagment } from '../addressManagment'
import { Comments } from '../comments'
import { OrderTracking } from '../orderTracking'
import { Ticket, TicketForm, Tickets } from '../ticketing'
import { Voucher } from '../voucher'
import Wallet from '../wallet'

export type ProfileBodyType =
  | 'managment'
  | 'address'
  | 'favorite'
  | 'saved'
  | 'wallet'
  | 'voucher'
  | 'order-tracking'
  | 'comments'
  | 'ticketing'
  | ''
export interface ProfileBodyProps {
  route: ProfileBodyType | null
}

const ProfileBody: FC<ProfileBodyProps> = (props) => {
  const indexs = {
    managment: <AccountManagmentBody />,
    address: <AddressManagment />,
    favorite: <FavoritePage />,
    saved: <SavedPage param="vendor" />,
    wallet: <Wallet />,
    voucher: <Voucher />,
    'order-tracking': <OrderTracking />,
    'ticketing-create': <TicketForm />,
    ticketing: <Tickets />,
    'ticketing-ticket': <Ticket />,
    comments: <Comments />,
  }

  return (
    <>
      {props.route !== 'order-tracking' && props.route && (
        <Stack
          sx={{
            width: '100%',
            bgcolor: 'white',
            borderRadius: { xs: 0, sm: 4 },
            p: { xs: 4, sm: 6 },
          }}
        >
          {indexs[props.route!]}
        </Stack>
      )}

      {props.route === 'order-tracking' && (
        <Stack sx={{ width: '100%' }}>{indexs[props.route]}</Stack>
      )}
    </>
  )
}

export default ProfileBody
