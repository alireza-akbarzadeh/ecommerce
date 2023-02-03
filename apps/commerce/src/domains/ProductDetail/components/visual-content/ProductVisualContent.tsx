import { HBLink } from '@hasty-bazar-commerce/components'
import { HBBreadcrumbs, HBIcon } from '@hasty-bazar/core'
import { Box, Stack, Theme, useMediaQuery } from '@mui/material'
import { stringify } from 'query-string'
import { SelfFunctionalitiesRow } from '../../containers'
import { useProductDetail } from '../../ProductDetailContext'
import Contents from './Contents'
import ProductName from './ProductName'
import Promotion from './Promotion'

const ProductVisualContent = () => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const { activeUniqueProduct } = useProductDetail()
  return (
    <Stack spacing={6}>
      <HBBreadcrumbs
        separator={
          <Box color="info.main">
            <HBIcon type="angleLeft" size="small" />
          </Box>
        }
      >
        {[...(activeUniqueProduct?.productRoute?.length ? activeUniqueProduct.productRoute : [])]
          .reverse()
          ?.map((tag) => (
            <HBLink
              key={tag.id}
              target="_blank"
              underline="none"
              color="info.main"
              href={`/collection/?${stringify({
                baseFilter: JSON.stringify({ categories: [tag.id] }),
              })}`}
            >
              {tag.name}
            </HBLink>
          ))}
      </HBBreadcrumbs>
      {!!activeUniqueProduct?.campaign && <Promotion campagin={activeUniqueProduct?.campaign} />}

      {isMobile && <ProductName />}
      <Contents />
      <SelfFunctionalitiesRow productId={activeUniqueProduct?.id ?? ''} />
    </Stack>
  )
}

export default ProductVisualContent
