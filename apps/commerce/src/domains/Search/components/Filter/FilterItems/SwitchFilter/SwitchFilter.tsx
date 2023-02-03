import SearchMessages from '@hasty-bazar-commerce/domains/Search/Search.messages'
import { HBSwitch } from '@hasty-bazar/core'
import { Stack, Typography } from '@mui/material'
import { memo } from 'react'
import { useIntl } from 'react-intl'

const SwitchFilter = () => {
  const { formatMessage } = useIntl()

  return (
    <Stack direction="row" justifyContent="space-between">
      <Typography variant="h6" children={formatMessage(SearchMessages.freeDelivery)} />
      <HBSwitch />
    </Stack>
  )
}

export default memo(SwitchFilter)
