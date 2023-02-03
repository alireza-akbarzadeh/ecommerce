import { HBLink } from '@hasty-bazar/admin-shared/components'
import { useGetAdminCatalogProductsPreviewByIdQuery } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { HBBreadcrumbs, HBIcon } from '@hasty-bazar/core'
import { Stack, Theme, useMediaQuery } from '@mui/material'
import { useRouter } from 'next/router'
import Contents from './Contents'
import ProductName from './ProductName'
import SelfFunctionalitiesRow from './SelfFunctionalitiesRow'

const ProductVisualContent = () => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const { id } = useRouter().query as { id: string }
  const productData = useGetAdminCatalogProductsPreviewByIdQuery({
    'client-name': 'HIT.Hastim.Catalog.Endpoints.WebApi',
    'client-version': '1.0.0',
    id,
  })

  const breadcrumbs = productData.data?.data?.productRoute || []
  return (
    <Stack spacing={6}>
      <HBBreadcrumbs separator={<HBIcon type="angleLeft" size="small" />}>
        {breadcrumbs?.map((cat) => (
          <HBLink key={cat.id} underline="none" color="info.main" href="#">
            {cat?.name}
          </HBLink>
        ))}
      </HBBreadcrumbs>

      {isMobile && <ProductName />}
      <Contents />
      <SelfFunctionalitiesRow />
    </Stack>
  )
}

export default ProductVisualContent
