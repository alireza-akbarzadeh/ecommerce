import {
  useGetAdminCatalogConfigurableProductsByProductIdRelatedProductQuery,
  useGetAdminCatalogProductsPreviewByIdQuery,
  useGetAdminCatalogSimpleProductsByProductIdRelatedProductQuery,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { Container, Stack, styled } from '@mui/material'
import { useRouter } from 'next/router'
import React from 'react'
import { useIntl } from 'react-intl'
import CardWidgetList from './components/CardWidgetList'
import ProductBuySection from './containers/contentSection'
import ProductInformationSection from './containers/ProductInformation/ProductInformationSection'
import { OtherVendors } from './containers/vendor'
import ProductionDetailMessages from './productDetail.messages'

const ContainerStyle = styled(Stack)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(4, 6),
  borderRadius: theme.spacing(4),
  backgroundColor: theme.palette.common.white,
  marginBottom: theme.spacing(4),
  marginTop: theme.spacing(2),
}))
const SIMPLE_PRODUCT_TYPE_CODE = 1034001
const SIMPLE_CONFIGURABLE_TYPE_CODE = 1034002
export default function PreviewPage() {
  const { id } = useRouter().query as { id: string }
  const productData = useGetAdminCatalogProductsPreviewByIdQuery({
    'client-name': 'HIT.Hastim.Catalog.Endpoints.WebApi',
    'client-version': '1.0.0',
    id,
  })
  const { formatMessage } = useIntl()
  const args = {
    'client-name': 'HIT.Hastim.Catalog.Endpoints.WebApi',
    'client-version': '1.0.0',
    id,
    productId: id,
  }

  const productType: 'simple' | 'configurable' =
    productData.data?.data?.productType === SIMPLE_PRODUCT_TYPE_CODE ? 'simple' : 'configurable'
  const relatedProducts =
    productType === 'configurable'
      ? useGetAdminCatalogSimpleProductsByProductIdRelatedProductQuery(args, {
          skip: !productType,
        })
      : useGetAdminCatalogConfigurableProductsByProductIdRelatedProductQuery(args, {
          skip: !productType,
        })
  return (
    <Stack>
      <Stack
        display={{
          xs: 'none',
          md: 'block',
        }}
        component="img"
        mb={6}
        src="/assets/imgs/header.jpg"
        alt="product"
        width="100%"
      />
      <Container maxWidth="md">
        <ContainerStyle spacing={6}>
          <ProductBuySection />
          <OtherVendors />
          <CardWidgetList
            title={formatMessage(ProductionDetailMessages.sameProduct)}
            products={relatedProducts.data?.data?.items || []}
          />
          <ProductInformationSection />
        </ContainerStyle>
      </Container>
      <Stack
        component="img"
        display={{
          xs: 'none',
          md: 'block',
        }}
        src="/assets/imgs/footer.jpg"
        alt="product"
        width="100%"
      />
    </Stack>
  )
}
