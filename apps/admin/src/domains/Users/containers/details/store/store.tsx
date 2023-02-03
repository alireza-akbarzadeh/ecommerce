import { HBExplanationSummary } from '@hasty-bazar/admin-shared/components'
import { HBExplanation } from '@hasty-bazar/admin-shared/containers/HBExplanation'
import userPageMessages from '@hasty-bazar-admin/domains/Users/UserPage.messages'
import { useGetAdminCmsPagesQuery } from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import {
  RoleResult,
  useGetAdminIdrVendorsByIdAddressQuery,
  useGetAdminIdrVendorsByIdQuery,
} from '@hasty-bazar/admin-shared/services/idrApi.generated'
import Grid from '@mui/material/Grid'
import { useState } from 'react'
import { useIntl } from 'react-intl'
import { BusinessDays } from './containers/businessDays'
import businessDaysMessages from './containers/businessDays/businessDays.messages'
import { Dashboard } from './containers/dashboard'
import { Information } from './containers/information'
import NameInformation from './containers/name-information/name-information'

type StoreProps = {
  userId: string
  detailsRole: RoleResult
}

const Store = ({ userId, detailsRole }: StoreProps) => {
  const { formatMessage } = useIntl()

  const [isExpandedDashboard, setIsExpandedDashboard] = useState<boolean>(false)
  const [isExpandedBusinessDays, setIsExpandedBusinessDays] = useState<boolean>(false)

  const {
    data: vendorData = {},
    isSuccess: isSuccessVendorData,
    refetch: refetchVendorData,
  } = useGetAdminIdrVendorsByIdQuery(
    {
      'client-name': 'get-vendor',
      'client-version': '0',
      id: detailsRole.partyRoleId || '',
    },
    {
      skip: !detailsRole?.partyRoleId,
    },
  )

  const { data: { data: { items: vitrinData = [] } = {} } = {} } = useGetAdminCmsPagesQuery({
    'client-name': 'Swagger on Hit.Hastim.CMS.Endpoints.WebApi',
    'client-version': '1.0.1.100',
    pageSize: 1000,
  })

  const {
    data: { data: { items: addressData = [] } = {} } = {},
    isSuccess: isSuccessAddressData,
    refetch: refetchAddress,
  } = useGetAdminIdrVendorsByIdAddressQuery(
    {
      'client-name': 'Swagger on Hit.Hastim.CMS.Endpoints.WebApi',
      'client-version': '1.0.1.100',
      id: detailsRole.partyRoleId || '',
    },
    {
      skip: !detailsRole?.partyRoleId,
    },
  )

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <NameInformation vendorData={vendorData} userId={userId} />
      </Grid>
      <Grid item xs={12}>
        <Information
          userId={userId}
          vitrinData={vitrinData}
          vendorData={vendorData}
          isSuccessVendorData={isSuccessVendorData}
          detailsRole={detailsRole}
          addressData={addressData}
          isSuccessAddressData={isSuccessAddressData}
          refetchVendorData={refetchVendorData}
          refetchAddress={refetchAddress}
        />
      </Grid>
      <Grid item xs={12}>
        <HBExplanation
          expanded={isExpandedDashboard}
          onChange={(event, expanded) => {
            setIsExpandedDashboard(expanded)
          }}
          summary={
            <HBExplanationSummary title={formatMessage(userPageMessages.dashboard)} icon="store" />
          }
          detail={isExpandedDashboard ? <Dashboard /> : <></>}
        />
      </Grid>
      <Grid item xs={12}>
        <HBExplanation
          expanded={isExpandedBusinessDays}
          onChange={(event, expanded) => {
            setIsExpandedBusinessDays(expanded)
          }}
          summary={
            <HBExplanationSummary
              title={formatMessage(businessDaysMessages.businessDays)}
              icon="calender"
              submitButton={false}
            />
          }
          detail={isExpandedBusinessDays ? <BusinessDays vendorData={vendorData} /> : <></>}
        />
      </Grid>
    </Grid>
  )
}
export default Store
