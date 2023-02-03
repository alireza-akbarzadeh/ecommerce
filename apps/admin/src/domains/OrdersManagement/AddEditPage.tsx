import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { useGetAdminSaleOrderByOrderIdBasketQuery } from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { HBClassesType } from '@hasty-bazar/core'
import { Box, Grid, useTheme } from '@mui/material'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import VendorShipment from './components/ordersDetail/VendorShipment'
import TransactionHistory from './components/TransactionHistory'
import OrdersManagementMessages from './ordersManagement.message'

type HBPageClassNames = 'gridSection'

export const classes: HBClassesType<HBPageClassNames> = {
  gridSection: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}

const AddEditPage = () => {
  const { formatMessage } = useIntl()
  const router = useRouter()
  const { spacing } = useTheme()
  const id = router.query.id?.[0]
  const { data: vendorsShipmentData } = useGetAdminSaleOrderByOrderIdBasketQuery(
    {
      'client-name': 'admin',
      'client-version': '1.0.0',
      orderId: id!,
    },
    { skip: !id },
  )

  const breadcrumbs = [
    {
      url: '/',
      title: formatMessage(phrasesMessages.dashboard),
    },
    {
      url: '/ordersManagement/',
      title: formatMessage(OrdersManagementMessages.ordersManagementInfo),
    },
  ]

  return (
    <>
      <BreadCrumbSection
        title={formatMessage(OrdersManagementMessages.ordersManagement)}
        breadItems={breadcrumbs}
      />
      <Box>
        {vendorsShipmentData?.data && <TransactionHistory data={vendorsShipmentData?.data} />}
        <Grid container spacing={spacing(6)} mb={10}>
          <Grid container item xs={12} sm={12} sx={classes.gridSection} mt={6}>
            <VendorShipment {...{ vendorsShipmentData }} />
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default AddEditPage
