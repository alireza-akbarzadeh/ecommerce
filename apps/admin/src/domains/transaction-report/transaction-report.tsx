import { HBExplanationSummary } from '@hasty-bazar/admin-shared/components'
import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import { HBExplanation } from '@hasty-bazar/admin-shared/containers/HBExplanation'
import { BusinessTypeEnums } from '@hasty-bazar/admin-shared/core/enums'
import sidebarMessages from '@hasty-bazar-admin/core/translations/sidebar.messages'
import {
  GetBusinessTypeValuesQueryResult,
  useGetAdminGeneralDataBusinessTypeValueGetAllQuery,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { Box } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import TransactionsFilters from './containers/transactions-filters'
import TransactionGrid from './containers/transactions-grid'
import transactionReportMessages from './transactionReportMessages.messages'

export type TransactionReportFormType = {
  fromDate?: string | null
  toDate?: string | null
  type?: string
  transactionType?: string
  paymentMethod?: string
  transactionStatus?: string
  panelType?: string
  roleAccountParty?: string
  maximumAmount?: string
  minimumAmount?: string
}
export interface ChipData {
  key: string
  label: string
  value?: string | object
}

const TransactionReportPage = () => {
  const { formatMessage } = useIntl()
  const breadcrumbs = [
    { url: '/', title: formatMessage(sidebarMessages.dashboard) },
    { url: '/#', title: formatMessage(sidebarMessages.transactionReport) },
  ]

  const [actionUrl, setActionUrl] = useState<string | undefined>()

  const [{ PanelTypeCodes, PaymentProviderTypeCodes }, setBusinessTypes] = useState<
    Record<string, GetBusinessTypeValuesQueryResult[]>
  >({
    PanelTypeCodes: [],
    PaymentProviderTypeCodes: [],
  })

  const { data, isLoading } = useGetAdminGeneralDataBusinessTypeValueGetAllQuery({
    'client-name': 'generalData',
    'client-version': '0',
    pageSize: 1000,
  })

  const getBusinessTypes = (businessTypes: GetBusinessTypeValuesQueryResult[]) => {
    const PanelTypeCodes = businessTypes.filter(
      (item) => item.businessTypeId === BusinessTypeEnums.PanelType + '',
    )

    const PaymentProviderTypeCodes = businessTypes.filter(
      (item) => item.businessTypeId === BusinessTypeEnums.paymentProviderType + '',
    )

    // TODO: Maybe we use this
    // const RoleAccountPartyCodes = convertToSelectData(
    //   businessTypes.filter(
    //     (item) => item.businessTypeId === BusinessTypeEnums.RoleAccountParty + '',
    //   ),
    // )

    setBusinessTypes({
      PanelTypeCodes,
      PaymentProviderTypeCodes,
    })
  }

  useEffect(() => {
    if (data?.data?.items) {
      getBusinessTypes(data.data.items)
    }
  }, [data])

  const TransactionsGridMemo = useCallback(
    () => (
      <TransactionGrid
        actionUrl={actionUrl}
        paymentProviderTypeCodes={PaymentProviderTypeCodes}
        panelTypeCodes={PanelTypeCodes}
      />
    ),
    [actionUrl, PaymentProviderTypeCodes, PanelTypeCodes],
  )

  return (
    <Box>
      <BreadCrumbSection
        title={formatMessage(transactionReportMessages.breadcrumbTitle)}
        breadItems={breadcrumbs}
      />
      <HBExplanation
        defaultExpanded={true}
        summary={
          <HBExplanationSummary
            title={formatMessage(transactionReportMessages.filter)}
            icon={'filter'}
          />
        }
        detail={<TransactionsFilters changeFilter={(actionUrl) => setActionUrl(actionUrl)} />}
      />

      <HBExplanation
        defaultExpanded={true}
        summary={
          <HBExplanationSummary
            title={formatMessage(transactionReportMessages.history)}
            icon={'newspaper'}
          />
        }
        detail={!isLoading ? <TransactionsGridMemo /> : <></>}
      />
    </Box>
  )
}
export default TransactionReportPage
