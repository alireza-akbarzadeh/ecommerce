import VoucherManagementPage from '@hasty-bazar-admin/domains/voucherManagement/VoucherManagementPage.messages'
import { HBIcon } from '@hasty-bazar/core'
import { Box, Typography } from '@mui/material'
import { useIntl } from 'react-intl'
import ContentUpload from '../components/ContentUpload'

const Content = () => {
  const { formatMessage } = useIntl()
  return (
    <Box
      bgcolor="common.white"
      sx={{
        pb: 8,
        pt: 6,
        px: 8,
        height: 550,
        border: (theme) => `1px solid ${theme.palette.grey[200]}`,
      }}
    >
      <Box sx={{ display: 'flex', alignItem: 'center', gap: 2 }}>
        <HBIcon type={'historyAlt'} />
        <Typography variant={'h4'}>{formatMessage(VoucherManagementPage.content)}</Typography>
      </Box>
      <ContentUpload />
    </Box>
  )
}

export default Content
