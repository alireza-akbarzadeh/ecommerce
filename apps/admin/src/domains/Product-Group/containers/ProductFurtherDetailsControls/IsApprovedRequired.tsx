import { HBSwitchController } from '@hasty-bazar/admin-shared/containers/HBSwitchController'
import { Typography } from '@mui/material'
import React from 'react'
import { useIntl } from 'react-intl'
import ProductGroupPageMessages from '../../ProductGroupPage.messages'

type Props = {
  disabled?: boolean
}
export default function IsApprovedRequired({ disabled }: Props) {
  const { formatMessage } = useIntl()
  return (
    <>
      <Typography>{formatMessage(ProductGroupPageMessages.approvedRequired)}</Typography>
      <HBSwitchController name={'isApprovedRequired'} disabled={disabled} />
    </>
  )
}
