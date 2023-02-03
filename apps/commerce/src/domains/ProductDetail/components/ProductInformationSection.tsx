import { StickyBox } from '@hasty-bazar-commerce/components'
import { Box, Grid, useMediaQuery, useTheme } from '@mui/material'
import { FC } from 'react'
import { ProductInformation } from '../ProductInformation'
import { VendorWrapper } from './vendor'

const ProductInformationSection: FC = () => {
  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down('md'))
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container columnSpacing={{ xs: 0, md: 6 }}>
        <Grid item xs={12} md={8} sx={{ overflowX: 'clip' }}>
          <ProductInformation />
        </Grid>
        {!isSmall && (
          <Grid item md={4}>
            <StickyBox>
              <VendorWrapper />
            </StickyBox>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}

export default ProductInformationSection
