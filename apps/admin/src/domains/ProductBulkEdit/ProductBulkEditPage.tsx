import BreadCrumbSection from '@hasty-bazar/admin-shared/components/BreadCrumb/BreadCrumbSection'

import { Box, Typography } from '@mui/material'
import { useIntl } from 'react-intl'
import BulkEditProductsDataGrid from './containers/productsDataGrid'
import ProductBulkEditMessages from './ProductBulkEdit.messages'

function ProductBulkEditPage() {
  const { formatMessage } = useIntl()

  const breadcrumbs = [
    {
      url: '/',
      title: formatMessage(ProductBulkEditMessages.dashboard),
    },
    {
      url: '/product-bulk-edit/',
      title: formatMessage(ProductBulkEditMessages.bulkEditTitle),
    },
  ]

  return (
    <Box>
      <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
        <BreadCrumbSection
          title={formatMessage(ProductBulkEditMessages.bulkEditTitle)}
          breadItems={breadcrumbs}
        />
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
          {formatMessage(ProductBulkEditMessages.bulkEditTitle2)}
        </Typography>

        <BulkEditProductsDataGrid />
      </Box>
    </Box>
  )
}

export default ProductBulkEditPage
