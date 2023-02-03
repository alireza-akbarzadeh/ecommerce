import { useGetAdminCatalogProductsPreviewByIdQuery } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { Stack, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { FC } from 'react'

const ProductName: FC = () => {
  const { id } = useRouter().query as { id: string }
  const productData = useGetAdminCatalogProductsPreviewByIdQuery({
    'client-name': 'HIT.Hastim.Catalog.Endpoints.WebApi',
    'client-version': '1.0.0',
    id,
  })
  const english = /^[A-Za-z]*$/

  const activeUniqueProduct =
    productData.data?.data?.uniqueProducts?.find((item) => id === item.id) || {}

  return (
    <Stack spacing={4}>
      <Typography color="text.primary" variant="subtitle1">
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
        }}
      >
        {activeUniqueProduct?.systemName}
      </Typography>
    </Stack>
  )
}

export default ProductName
