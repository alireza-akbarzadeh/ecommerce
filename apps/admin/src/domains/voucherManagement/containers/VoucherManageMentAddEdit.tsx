import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import DiscountProductCodeGrid from '@hasty-bazar-admin/domains/voucherManagement/components/grids/DiscountProductCodeGrid'
import DiscountProductGroupCodeGrid from '@hasty-bazar-admin/domains/voucherManagement/components/grids/DiscountProductGroupCodeGrid'
import { HBTabContainer } from '@hasty-bazar/core'
import { Stack } from '@mui/material'
import { useIntl } from 'react-intl'
import VoucherManagementPage from '../VoucherManagementPage.messages'
import DiscountSellerCodeGrid from '../components/grids/DiscountSellerCodeGrid'
import { VoucherProvider } from '../context'
import Content from './Content'
import VoucherCodeDiscountInfo from './VoucherCodeDiscountInfo'
interface VoucherManageMentAddProps {
  id?: string
}
const VoucherManageMentAddEdit = ({ id }: VoucherManageMentAddProps) => {
  const { formatMessage } = useIntl()
  const breadcrumbs = [
    {
      url: '/',
      title: formatMessage(phrasesMessages.dashboard),
    },
    {
      url: '/voucherManagement',
      title: formatMessage(VoucherManagementPage.VoucherTitle),
    },
    {
      url: '#',
      title: formatMessage(
        id ? VoucherManagementPage.editVoucher : VoucherManagementPage.addVoucher,
      ),
    },
  ]
  return (
    <VoucherProvider>
      <BreadCrumbSection
        title={formatMessage(VoucherManagementPage.VoucherTitle)}
        breadItems={breadcrumbs}
      />
      <Stack spacing={3}>
        <VoucherCodeDiscountInfo id={id!} />
        {id ? (
          <HBTabContainer
            tabItemS={[
              {
                tabTitles: formatMessage(VoucherManagementPage.content),
                tabContents: <Content />,
                tabIndex: '0',
                tabIcon: 'clipboard',
              },
              {
                tabTitles: formatMessage(VoucherManagementPage.sellerCodeDiscount),
                tabContents: <DiscountSellerCodeGrid />,
                tabIndex: '2',
                tabIcon: 'percentage',
              },
              {
                tabTitles: formatMessage(VoucherManagementPage.productCodeDiscount),
                tabContents: <DiscountProductCodeGrid />,
                tabIndex: '1',
                tabIcon: 'ticket',
              },
              {
                tabTitles: formatMessage(VoucherManagementPage.productGroupCode),
                tabContents: <DiscountProductGroupCodeGrid />,
                tabIndex: '3',
                tabIcon: 'tag',
              },
            ]}
            value={'0'}
          />
        ) : null}
      </Stack>
    </VoucherProvider>
  )
}

export default VoucherManageMentAddEdit
