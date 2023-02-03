import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { wrapper } from '@hasty-bazar-commerce/core/redux/store'
import { serverSideRequests } from '@hasty-bazar-commerce/core/utils'
import { ProductDetailProvider } from '@hasty-bazar-commerce/domains/ProductDetail/ProductDetailContext'
import DynamicLayout, { DynamicLayoutProps } from '@hasty-bazar-commerce/layout/DynamicLayout'
import HeadLayout from '@hasty-bazar-commerce/layout/HeadLayout'
import {
  useGetWebCatalogProductByIdQuery,
  useGetWebCatalogProductDetailByHsinQuery,
} from '@hasty-bazar-commerce/services/catalogApi.generated'
import { Box, Grid, gridClasses, styled } from '@mui/material'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'

interface ProductDetailProps extends DynamicLayoutProps {
  layout?: any
}

const ContainerWrapperStyle = styled(Grid)(({ theme }) => ({
  maxWidth: theme.breakpoints.values.lg,
  width: '100%',
  [`& .${gridClasses.item}`]: {
    marginBottom: theme.spacing(5),
    '& > div': {
      borderRadius: theme.spacing(4),
      margin: 'unset',
      width: '100%',
      [theme.breakpoints.down('sm')]: {
        borderRadius: 0,
      },
    },
  },
}))

const ProductDetail = (props: ProductDetailProps) => {
  const { query } = useRouter()
  const hsin = query?.hsin?.[0]

  const { data: productDetail } = useGetWebCatalogProductDetailByHsinQuery({
    ...ApiConstants,
    hsin: hsin!,
  })

  const product = productDetail?.data
  const activeUniqueProduct = productDetail?.data?.uniqueProducts?.find((_) => _.id === hsin)

  return (
    <ProductDetailProvider>
      <HeadLayout
        description={`مشخصات فنی ${activeUniqueProduct?.name}  در فروشگاه اینترنتی دارتیل `}
        title={`قیمت و خرید ${activeUniqueProduct?.name}  | دارتیل`}
        imageUrl={process.env.NEXT_PUBLIC_CDN! + product?.defaultImage || ''}
        keywords={activeUniqueProduct?.name + ',' + activeUniqueProduct?.systemName}
        product={{
          availability: activeUniqueProduct?.inventory ? 'instock' : 'outofstock',
          id: activeUniqueProduct?.id,
          imageUrl: process.env.NEXT_PUBLIC_CDN! + product?.defaultImage,
          name: activeUniqueProduct?.name || '',
          oldPrice: activeUniqueProduct?.oldPrice?.toString(),
          price: activeUniqueProduct?.price?.toString(),
        }}
      />
      <DynamicLayout
        pagePartContainers={{
          Dynamic: (children) => (
            <ContainerWrapperStyle container pt={6} px={{ xs: 0, sm: 6, md: 0 }}>
              {children}
            </ContainerWrapperStyle>
          ),
          Footer: (children) => (
            <Box mt={6} width="100%">
              {children}
            </Box>
          ),
        }}
        pageName={props.pageName}
      />
    </ProductDetailProvider>
  )
}

ProductDetail.layout = ({ children }: any) => <>{children}</>
export default ProductDetail

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    const { props } = await serverSideRequests(store, ctx, 'ProductDetail')
    return { props }
  },
)
