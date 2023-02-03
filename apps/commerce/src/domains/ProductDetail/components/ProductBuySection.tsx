import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import {
  catalogApi,
  useGetWebCatalogProductDetailByHsinQuery,
} from '@hasty-bazar-commerce/services/catalogApi.generated'
import { Box, Grid, Theme, useMediaQuery } from '@mui/material'
import { useRouter } from 'next/router'
import { FC, useEffect } from 'react'
import { ProductSpecialAttributes, ProductVisualContent } from '.'
import { useProductDetail } from '../ProductDetailContext'
import VendorWrapper from './vendor/VendorWrapper'
import { ProductName } from './visual-content'

interface ProductBuySectionProps {
  pageTitle: string
  pageDescription: string
}

const ProductBuySection: FC<ProductBuySectionProps> = ({ pageDescription, pageTitle }) => {
  const isTablet = useMediaQuery((theme: Theme) => theme.breakpoints.between('sm', 'md'))

  const {
    product,
    valuingProductDetail,
    setActiveUniqueProduct,
    setSpecificSelectedValues,
    activeOtherVendors,
    activeUniqueProduct,
    setActiveOtherVendors,
  } = useProductDetail()

  const [getOtherVendorsQuery] =
    catalogApi.useLazyGetWebCatalogCommerceOtherVendorByProductIdAndVendorIdQuery()

  const { query } = useRouter()
  const hsin = query?.hsin?.[0]

  const { data: productDetail } = useGetWebCatalogProductDetailByHsinQuery({
    ...ApiConstants,
    hsin: hsin!,
  })

  useEffect(() => {
    if (productDetail?.data) {
      valuingProductDetail(productDetail?.data)
    }
  }, [productDetail])

  useEffect(() => {
    if (product && hsin) {
      const tempActiveProduct = product.uniqueProducts?.find((p) => p.hsin === hsin)
      if (tempActiveProduct) {
        setActiveUniqueProduct(tempActiveProduct)
        const specificAttributes: Record<string, string> = {}
        tempActiveProduct.specificAttributes?.forEach((attr) => {
          if (attr.id && attr.valueId) specificAttributes[attr.id] = attr.valueId
        })

        setSpecificSelectedValues(specificAttributes)
      }
    }
  }, [product])

  const getOtherVendors = async () => {
    if (activeUniqueProduct) {
      const res = await getOtherVendorsQuery({
        ...ApiConstants,
        productId: activeUniqueProduct.id!,
        vendorId: product?.vendor?.id!,
      }).unwrap()

      if (res.data) {
        setActiveOtherVendors(res.data)
      }
    }
  }

  useEffect(() => {
    getOtherVendors()
  }, [activeUniqueProduct])

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container columnSpacing={5} rowGap={6}>
        {isTablet && (
          <Grid item xs={12}>
            <ProductName />
          </Grid>
        )}
        <Grid item xs={12} sm={6.5} md={4.5}>
          <ProductVisualContent />
        </Grid>
        <Grid item xs={12} sm={5.5} md={3.5}>
          <ProductSpecialAttributes />
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <VendorWrapper />
        </Grid>
      </Grid>
    </Box>
  )
}

export default ProductBuySection
