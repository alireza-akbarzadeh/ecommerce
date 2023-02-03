import { HBAdminAccordion } from '@hasty-bazar/admin-shared/components'
import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { useGetAdminSaleShipmentBundleBundlesByBundleIdQuery } from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { Grid } from '@mui/material'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import ShipmentManagementMessage from '../../messages'
import AccordinTitle from './accordionTitle'
import Details from './details'

const CargoInformation = () => {
  const router = useRouter()
  const { formatMessage } = useIntl()
  const id = router?.query?.id?.[0]
  const { data: { data } = {} } = useGetAdminSaleShipmentBundleBundlesByBundleIdQuery(
    {
      'client-name': 'Swagger on HIT.Hastim.Sale.Endpoints.AdminApi',
      'client-version': '1.0.0',
      bundleId: id!,
    },
    { skip: !id },
  )
  const breadcrumbs = [
    {
      url: '/',
      title: formatMessage(phrasesMessages.dashboard),
    },
    {
      url: '/shipmentManagement/',
      title: formatMessage(ShipmentManagementMessage.shipmentManagement),
    },
  ]

  return (
    <>
      <BreadCrumbSection
        title={formatMessage(ShipmentManagementMessage.shipmentManagement)}
        breadItems={breadcrumbs}
      />
      <Grid container spacing={6} mt={2}>
        <HBAdminAccordion
          expanded
          title={<AccordinTitle accordionTitleData={data!} />}
          hidden
          sx={{ display: 'block' }}
          headerStyle={{ width: '100%' }}
        >
          <Details bundleDetailsData={data!} />
        </HBAdminAccordion>
      </Grid>
    </>
  )
}

export default CargoInformation
