import { Box, Grid, Theme, useMediaQuery } from '@mui/material'
import { FC } from 'react'
import ProductSpecialAttributes from './ProductSpecialAttributes'
import { VendorWrapper } from './vendor'
import { ProductName, ProductVisualContent } from './visual-content'

const ProductBuySection: FC = () => {
  const isTablet = useMediaQuery((theme: Theme) => theme.breakpoints.between('sm', 'md'))

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
