import HBSelectMultiColumnController from '@hasty-bazar/admin-shared/containers/HBSelectMultiColumnController'
import {
  GetVendorsQueryResult,
  useGetAdminCatalogVendorsQuery,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { HBSelectMultiColumnColumnDefs } from '@hasty-bazar/core'
import { Avatar, Stack, styled } from '@mui/material'
import { memo, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import AddSimpleProductMessages from './AddProduct.messages'

export type VendorType = GetVendorsQueryResult
export interface SellerDataGridProps {
  onSelectSeller: (seller: VendorType) => void
  disabled?: boolean
  required?: boolean
  vendorId?: string
}
const PAGE_SIZE = 100000
const RootGrid = styled(Stack)(({ theme }) => ({}))
function SellerDataGrid({ onSelectSeller, disabled, vendorId, required }: SellerDataGridProps) {
  const [searchText, setSearchText] = useState<string>()
  const [page, setPage] = useState(1)
  const [value, setValue] = useState<VendorType>()
  const vendors = useGetAdminCatalogVendorsQuery({
    'client-name': 'catalog',
    'client-version': '1.0.0',
    id: '',
    pageNumber: page,
    pageSize: PAGE_SIZE,
    vendorName: searchText,
    companyName: searchText,
    filter: `VendorName.Contains(--VendorName)||CompanyName.Contains(--CompanyName)`,
  })
  const vendorsData = vendors.data?.data?.items || []

  const { formatMessage } = useIntl()

  const columnDefs: HBSelectMultiColumnColumnDefs<GetVendorsQueryResult>[] = [
    {
      headerName: formatMessage(AddSimpleProductMessages.vendorHISN),
      field: 'id' as keyof GetVendorsQueryResult,
      width: 250,
      showInChip: false,
    },
    {
      headerName: formatMessage(AddSimpleProductMessages.vendorName),
      field: 'vendorName' as keyof GetVendorsQueryResult,
      width: 200,
      showInChip: true,
    },
    {
      headerName: formatMessage(AddSimpleProductMessages.phoneNumber),
      field: 'phoneNo' as keyof GetVendorsQueryResult,
      width: 140,
      showInChip: false,
    },
    {
      headerName: formatMessage(AddSimpleProductMessages.companyName),
      field: 'companyName' as keyof GetVendorsQueryResult,
      width: 140,
      showInChip: false,
    },
    {
      headerName: formatMessage(AddSimpleProductMessages.image),
      field: 'vendorlogoPath' as keyof GetVendorsQueryResult,
      width: 50,
      showInChip: false,
      cellRenderer: (data) => {
        return (
          <Avatar
            sizes="small"
            src={`${process.env.NEXT_PUBLIC_CDN}/${data?.vendorlogoPath}`}
            alt={data?.vendorName || ''}
            variant="circular"
          />
        )
      },
    },
  ]

  const vendor = useMemo(
    () => vendorsData.find((vendor) => vendor.id === vendorId),
    [vendorId, vendorsData],
  )

  useEffect(() => {
    if (!vendorId) {
      setSearchText(undefined)
      setValue(undefined)
    }
    if (!value && vendorId) {
      setValue(vendor)
    } else if (value) {
      setSearchText(value?.vendorName ?? '')
    }
  }, [vendor, value, vendorId])

  return (
    <RootGrid>
      <HBSelectMultiColumnController
        name="vendorId"
        onInputChange={(_, searchValue) => {
          setPage(1)
          setSearchText(searchValue)
        }}
        defaultValue={value || ''}
        value={value || ''}
        pageSize={10}
        readOnly={disabled}
        rowHeight={50}
        formRules={{
          required,
        }}
        noOptionsText={formatMessage(AddSimpleProductMessages.noOptionsText)}
        columnDefs={columnDefs}
        label={formatMessage(AddSimpleProductMessages.vendorId)}
        loadNextPage={() => {
          setPage(page + 1)
        }}
        onChange={(_, value: VendorType) => {
          setValue(value)
          onSelectSeller(value)
        }}
        renderInputProps={{
          defaultValue: value?.vendorName,
          disabled,
          InputLabelProps: {
            required,
          },
        }}
        isOptionEqualToValue={(option, _value) => option.vendorName === _value.vendorName}
        inputValue={searchText}
        items={vendorsData}
        totalItems={vendors.data?.data?.totalItems || 0}
      />
    </RootGrid>
  )
}

export default memo(SellerDataGrid)
