import { useGetAdminSaleApiOrderCommissionByIdQuery } from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { HBClassesType } from '@hasty-bazar/core'
import { Box, Grid, CircularProgress } from '@mui/material'
import { useRouter } from 'next/router'
import { FC } from 'react'
import Breadcrumbs from '../../components/commissionCalculations/BreadCrumb'
import CommissionSummary from '../../components/commissionCalculations/CommissionSummary'
import ProductSummary from '../../components/commissionCalculations/ProductSummary'

type HBPageClassNames = 'gridSection'
const classes: HBClassesType<HBPageClassNames> = {
  gridSection: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}

const CommissionCalculations: FC = () => {
  const router = useRouter()
  const id = router.query.id?.[0]
  const { data: orderCommissionData, isLoading } = useGetAdminSaleApiOrderCommissionByIdQuery(
    {
      'client-name': 'Swagger on HIT.Hastim.Sale.Endpoints.AdminApi',
      'client-version': '1.0.1.100',
      id: id!,
    },
    { skip: !id },
  )

  return isLoading ? (
    <Grid container>
      <Grid item xs={12}>
        <Box display="flex" justifyContent="center" alignItems={'center'} height={'100vh'}>
          <CircularProgress color="secondary" size={20} />
        </Box>
      </Grid>
    </Grid>
  ) : (
    <>
      <Breadcrumbs />
      <Box
        bgcolor="common.white"
        px={8}
        pb={10}
        sx={{
          borderRadius: (theme) => theme.spacing(4),
          border: (theme) => `1px solid ${theme.palette.grey[200]}`,
          minHeight: 100,
        }}
      >
        <CommissionSummary data={orderCommissionData?.data!} />
      </Box>
      <Box>
        <Grid container spacing={6} mb={10}>
          <Grid container item xs={12} sm={12} sx={classes.gridSection} mt={6}>
            <ProductSummary data={orderCommissionData?.data?.vendorsOrders!} />
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default CommissionCalculations
