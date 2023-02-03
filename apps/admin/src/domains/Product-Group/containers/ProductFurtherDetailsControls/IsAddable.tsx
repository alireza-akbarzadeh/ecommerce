import { HBSwitchController } from '@hasty-bazar/admin-shared/containers/HBSwitchController'
import { Typography } from '@mui/material'
import React from 'react'
import { useIntl } from 'react-intl'
import ProductGroupPageMessages from '../../ProductGroupPage.messages'

type Props = {
  disabled?: boolean
}
export default function IsAddable({ disabled }: Props) {
  const { formatMessage } = useIntl()
  return (
    <>
      <Typography>{formatMessage(ProductGroupPageMessages.addAbleToOtherGroup)}</Typography>
      <HBSwitchController name={'isAddable'} disabled={disabled} />
    </>
  )
}
