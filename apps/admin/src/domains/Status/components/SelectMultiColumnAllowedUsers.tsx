import HBSelectMultiColumnController from '@hasty-bazar/admin-shared/containers/HBSelectMultiColumnController'
import { GetVendorsQueryResult } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import {
  GetPartiesQueryResult,
  useGetAdminIdrPartiesQuery,
} from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { memo, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import statusMessage from '../status.message'

export type VendorType = GetVendorsQueryResult

function SelectMultiColumnAllowedUsers() {
  const { watch } = useFormContext()
  const [searchText, setSearchText] = useState<string>()
  const [page, setPage] = useState(1)
  const [data, setData] = useState<GetPartiesQueryResult[]>([])

  const { data: parties, refetch: refetchParties } = useGetAdminIdrPartiesQuery({
    'client-name': 'Swagger on HIT.Hastim.IDR.Endpoints.AdminApi',
    'client-version': '1.0.0',
    pageNumber: page,
    pageSize: 20,
    isActive: true,
    roleAccountParty: 1001001,
    firstName: searchText,
    lastName: searchText,
    mobile: searchText,
    email: searchText,
    filter:
      'IsActive_Equal_--IsActive And (FirstName.Contains(--FirstName) Or LastName.Contains(--LastName) Or Mobile.Contains(--Mobile) Or Email.Contains(--Email))',
  })

  const { formatMessage } = useIntl()

  const columnDefs = [
    {
      headerName: '',
      field: 'id',
      width: 100,
      showInChip: false,
      isIdField: true,
      hidden: true,
    },
    {
      headerName: formatMessage(statusMessage.allowedUserName),
      field: 'name',
      width: 200,
      showInChip: true,
    },
    {
      headerName: formatMessage(statusMessage.phoneNumber),
      field: 'mobile',
      width: 140,
      showInChip: false,
    },
    {
      headerName: formatMessage(statusMessage.email),
      field: 'email',
      width: 230,
      showInChip: false,
    },
  ]

  useEffect(() => {
    if (parties?.data?.items) {
      const customData = parties.data.items.map(({ id, fullName, email, mobile }) => ({
        id,
        name: fullName,
        email,
        mobile,
      }))
      setData((prev) => [...prev, ...customData])
    }
  }, [parties?.data?.items])

  return (
    <HBSelectMultiColumnController
      name="users"
      label={formatMessage(statusMessage.grid3AllowedUsers)}
      items={data}
      onInputChange={(_, searchValue) => {
        setData([])
        setSearchText(searchValue)
        setPage(1)
        refetchParties()
      }}
      size="small"
      columnDefs={columnDefs}
      pageSize={20}
      totalItems={parties?.data?.totalItems || 0}
      loadNextPage={() => {
        setPage(page + 1)
      }}
      isOptionEqualToValue={(option, _value) => option.id === _value.id}
      multiple
      autoComplete={false}
      formRules={{ required: false, disabled: !watch('isAnyRestriction') }}
      disabled={!watch('isAnyRestriction')}
    />
  )
}

export default memo(SelectMultiColumnAllowedUsers)
