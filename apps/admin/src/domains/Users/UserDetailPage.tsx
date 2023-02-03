import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import { RoleType } from '@hasty-bazar/admin-shared/core/enums/RoleType'
import {
  GetPartyAccountQueryResult,
  useGetAdminIdrPartiesByPartyIdDetailsQuery,
} from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { HBTabContainer } from '@hasty-bazar/core'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import { CrmPage } from '../Crm'
import { OrdersManagementPage } from '../OrdersManagement'
import { UserAvatar } from './containers/details'
import { CustomerDiscountCode } from './containers/details/customer-discount-code'
import { FinancialInformation } from './containers/details/financial-information'
import { MessagesPage } from './containers/details/messages'
import { Store } from './containers/details/store'
import UserAccount from './containers/details/UserAccount'
import UserContacts from './containers/details/UserContacts'
import { UserFeedback } from './containers/details/UserFeedback'
import userPageMessages from './UserPage.messages'

interface UserDetailPageProps {
  id?: string
}
export interface UserAccountProps
  extends Omit<GetPartyAccountQueryResult, 'gender' | 'companyProvinceId' | 'companyCityId'> {
  gender: any
  companyProvinceId: any
  companyCityId: any
}

export interface UserAboutusProps {
  aboutUs: string
}

export interface UserLegalInformationProps {
  companyName: string
  economicCode: string
  legalNationalCode: string
  phoneNo: string
  address: string
  registerationNo: string
  companyProvinceId: any
  companyCityId: any
  email: string
}

const UserDetailPage: FC<UserDetailPageProps> = ({ id }) => {
  const { formatMessage } = useIntl()

  const { data: { data: details = {} } = {} } = useGetAdminIdrPartiesByPartyIdDetailsQuery({
    'client-name': 'hasty-bazar-admin',
    'client-version': '1.0.0',
    partyId: id as string,
  })

  const breadcrumbs = [
    {
      url: '/',
      title: formatMessage(userPageMessages.dashboard),
    },
    {
      url: '/users',
      title: formatMessage(userPageMessages.userDetail),
    },
    {
      url: '#',
      title: details?.fullName
        ? `${formatMessage(userPageMessages.userDetailTitle)} ${details?.fullName}`
        : formatMessage(userPageMessages.userDetailTitle),
    },
  ]

  return (
    <>
      <BreadCrumbSection
        title={formatMessage(userPageMessages.userDetail)}
        breadItems={breadcrumbs}
      />
      <UserAvatar id={id} details={details} />

      <HBTabContainer
        tabPanelSx={(theme) => ({
          backgroundColor: `${theme.palette.grey[100]} !important`,
          padding: '0 !important',
        })}
        tabItemS={[
          {
            tabTitles: formatMessage(userPageMessages.tabUserAccount),
            tabContents: (
              <UserAccount
                id={id}
                isAdmin={details?.roles?.some((role) => role.type === RoleType.admin)}
              />
            ),
            tabIndex: '0',
            tabIcon: 'user',
          },
          {
            tabTitles: formatMessage(userPageMessages.tabContactInfo),
            tabContents: <UserContacts userId={id!} />,
            tabIndex: '1',
            tabIcon: 'mapMarker',
          },
          {
            tabTitles: formatMessage(userPageMessages.tabOrders),
            tabContents: <OrdersManagementPage userId={id!} />,
            tabIndex: '2',
            tabIcon: 'shoppingBasket',
          },
          {
            tabTitles: formatMessage(userPageMessages.tabFinancialInfo),
            tabContents: <FinancialInformation userId={id!} details={details} />,
            tabIndex: '3',
            tabIcon: 'coins',
          },
          {
            tabTitles: formatMessage(userPageMessages.tabUserFeedback),
            tabContents: <UserFeedback userId={id!} />,
            tabIndex: '4',
            tabIcon: 'signOutAlt',
          },
          {
            tabTitles: formatMessage(userPageMessages.store),
            tabContents: (
              <Store
                userId={id!}
                detailsRole={details?.roles?.find((role) => role.type === RoleType.vendor) || {}}
              />
            ),
            tabIndex: '5',
            tabIcon: 'user',
            tabVisible: details?.roles?.some((role) => role.type === RoleType.vendor),
          },
          {
            tabTitles: formatMessage(userPageMessages.customerDiscountCode),
            tabContents: <CustomerDiscountCode partyId={id} />,
            tabIndex: '7',
            tabIcon: 'ticket',
            tabVisible: details?.roles?.some((role) => role.type === RoleType.customer),
          },
          {
            tabTitles: formatMessage(userPageMessages.tabMessages),
            tabContents: <MessagesPage partyId={id} />,
            tabIndex: '8',
            tabIcon: 'envelopeAlt',
          },
          {
            tabTitles: formatMessage(userPageMessages.tabCrm),
            tabContents: <CrmPage partyId={id!} />,
            tabIndex: '9',
            tabIcon: 'balanceScale',
          },
        ]}
        value={'0'}
      />
    </>
  )
}
export default UserDetailPage
