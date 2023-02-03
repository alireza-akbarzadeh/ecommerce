import { Stack, Typography } from '@mui/material'
import { FC } from 'react'
import { useProductDetail } from '../../ProductDetailContext'

const ProductName: FC = () => {
  const { activeUniqueProduct } = useProductDetail()
  const english = /^[A-Za-z]*$/

  return (
    <Stack spacing={4}>
      <Typography
        sx={{ userSelect: 'text' }}
        color="text.primary"
        variant="subtitle1"
        component="h1"
      >
        {activeUniqueProduct?.name}
      </Typography>
      <Typography
        color="text.secondary"
        variant="caption"
        sx={{
          textAlign: activeUniqueProduct?.systemName
            ? english.test(activeUniqueProduct.systemName[0])
              ? 'end'
              : 'start'
            : 'start',
          userSelect: 'text',
        }}
        component="h3"
      >
        {activeUniqueProduct?.systemName}
      </Typography>
    </Stack>
  )
}

export default ProductName
