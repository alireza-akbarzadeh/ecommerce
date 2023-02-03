import { BusinessTypeEnums, VoucherDataType } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery,
  useGetAdminGeneralDataUserSegmentationQuery,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import {
  GetVendorsLookupQueryResult,
  useGetAdminIdrVendorsQuery,
} from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
const useFormFieldController = () => {
  const { formatMessage } = useIntl()

  const [searchText, setSearchText] = useState<string>()
  const [page, setPage] = useState<number>(1)
  const [partiesData, setPartiesData] = useState<GetVendorsLookupQueryResult[]>([])

  const vendorData = useGetAdminIdrVendorsQuery({
    'client-name': '',
    'client-version': '',
    pageSize: 10000,
    firstName: searchText,
    lastName: searchText,
    filter: '(FirstName.Contains(@FirstName) || LastName.Contains(@LastName))',
  })
  const userSegmentationData = useGetAdminGeneralDataUserSegmentationQuery({
    'client-name': '',
    'client-version': '',
    pageSize: 10000,
    stateCode: '2',
    filter: 'StateCode==@StateCode',
  })

  useEffect(() => {
    vendorData?.data?.data?.items &&
      setPartiesData((prev) => [...prev, ...vendorData?.data?.data?.items!])
  }, [vendorData?.data?.data?.items])

  const { data: providerTypeData } =
    useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery({
      'client-name': '',
      'client-version': '',
      businessType: VoucherDataType.providerType,
    })
  const { data: usageTypeData } =
    useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery({
      'client-name': '',
      'client-version': '',
      businessType: BusinessTypeEnums.UsageType,
    })

  const { data: priceValueTypeData } =
    useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery({
      'client-name': '',
      'client-version': '',
      businessType: VoucherDataType.priceValueType,
    })

  const { data: voucherUsageTypeCodeData } =
    useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery({
      'client-name': '',
      'client-version': '',
      businessType: VoucherDataType.VoucherUsageTypeCode,
    })

  const vendorColumn = [
    {
      field: 'fullName',
      width: 140,
      headerName: formatMessage(phrasesMessages.name),
      showInChip: true,
    },
    {
      field: 'mobile',
      width: 140,
      headerName: formatMessage(phrasesMessages.phoneNumber),
      showInChip: false,
    },
    { field: 'id', width: 5, headerName: 'id', hidden: true, isIdField: true },
  ]

  return {
    usageTypeData: usageTypeData?.data?.items,
    priceValueTypeApi: priceValueTypeData?.data?.items,
    providerTypeApi: providerTypeData?.data?.items,
    vendorColumn,
    setSearchText,
    setPage,
    partiesData,
    vendorData,
    setPartiesData,
    page,
    voucherUsageTypeCodeData: voucherUsageTypeCodeData?.data?.items,
    userSegmentationData: userSegmentationData?.data?.data?.items,
  }
}

export default useFormFieldController
