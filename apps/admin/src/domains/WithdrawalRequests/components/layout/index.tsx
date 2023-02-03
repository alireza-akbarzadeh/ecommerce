import messages from '../../messages/index.messages'
import { Box, Typography } from '@mui/material'
import { HBIcon } from '@hasty-bazar/core'
import { LayoutProps } from '../../types'
import { useIntl } from 'react-intl'

function Layout(props: LayoutProps) {
  const { breadcrumbs, dataGridAndFilters } = props
  const { formatMessage } = useIntl()

  return (
    <Box>
      <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
        {breadcrumbs}
      </Box>
      <Box
        bgcolor="common.white"
        p={8}
        borderRadius={({ spacing }) => spacing(3)}
        display={'flex'}
        flexDirection={'column'}
        gap={8}
        sx={{
          border: (theme) => `1px solid ${theme.palette.grey[200]}`,
        }}
      >
        <Typography variant="h6" display={'flex'} gap={2}>
          <HBIcon type="moneyBill" />
          {formatMessage(messages.viewRequests)}
        </Typography>
        {dataGridAndFilters}
      </Box>
    </Box>
  )
}

export default Layout
