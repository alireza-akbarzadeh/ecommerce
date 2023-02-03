import { HBAdminAccordion } from '@hasty-bazar/admin-shared/components'
import { VendorsOrderCommission } from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { Grid } from '@mui/material'
import { FC } from 'react'
import CreateAccordinTitle from './CreateAccordinTitle'
import Products from './Products'

interface ProductSummaryProps {
  data: VendorsOrderCommission[]
}

const ProductSummary: FC<ProductSummaryProps> = ({ data }) => {
  return (
    <Grid container>
      {data?.map((vendorOrder: VendorsOrderCommission) => (
        <HBAdminAccordion
          expanded
          sx={{ width: '100%' }}
          headerStyle={{ width: '100%' }}
          title={
            <CreateAccordinTitle
              vendorName={vendorOrder?.vendorName!}
              totalPrice={vendorOrder?.totalPrice!}
              actualCommissionPrice={vendorOrder?.actualCommissionPrice!}
              inProggressCommissionPrice={vendorOrder?.inProggressCommissionPrice!}
            />
          }
        >
          <Products items={vendorOrder.items!} />
        </HBAdminAccordion>
      ))}
    </Grid>
  )
}

export default ProductSummary
