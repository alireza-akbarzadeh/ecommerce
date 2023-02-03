import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { GetAdminIdrPartiesByPartyIdAddressesApiArg } from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { ColDef, ICellRendererParams } from 'ag-grid-community'
import { useIntl } from 'react-intl'
import GridIsDefaultColumn from '../components/GridIsDefaultColumn'
import userPageMessages from '../UserPage.messages'

export type ParamsValueType = ICellRendererParams & {
  data: GetAdminIdrPartiesByPartyIdAddressesApiArg
}

export function userAddressGridColumns(): ColDef[] {
  const { formatMessage } = useIntl()

  return [
    {
      field: 'country',
      headerName: formatMessage(phrasesMessages.country),
      filter: 'agTextColumnFilter',
      minWidth: 200,
    },
    {
      field: 'provinceTitle',
      headerName: formatMessage(phrasesMessages.province),
      filter: 'agTextColumnFilter',
      minWidth: 200,
    },
    {
      field: 'cityId',
      headerName: formatMessage(phrasesMessages.city),
      filter: 'agTextColumnFilter',
      minWidth: 200,
      hide: false,
      cellRenderer: ({ data }: ParamsValueType) => {
        return data.cityTitle
      },
    },
    {
      field: 'district',
      headerName: formatMessage(phrasesMessages.district),
      filter: 'agTextColumnFilter',
      minWidth: 200,
      hide: false,
    },
    {
      field: 'title',
      headerName: formatMessage(phrasesMessages.title),
      filter: 'agTextColumnFilter',
      minWidth: 200,
      hide: false,
    },
    {
      field: 'streetLine',
      headerName: formatMessage(phrasesMessages.address),
      filter: 'agTextColumnFilter',
      minWidth: 200,
      hide: false,
      tooltipField: 'streetLine',
    },
    {
      field: 'plaque',
      headerName: formatMessage(phrasesMessages.plaque),
      filter: 'agTextColumnFilter',
      minWidth: 200,
      hide: false,
    },
    {
      field: 'unit',
      headerName: formatMessage(phrasesMessages.unit),
      filter: 'agTextColumnFilter',
      minWidth: 200,
      hide: false,
    },
    {
      field: 'postalCode',
      headerName: formatMessage(phrasesMessages.postalCode),
      filter: 'agTextColumnFilter',
      minWidth: 200,
      hide: false,
    },
    {
      field: 'recipientName',
      headerName: formatMessage(userPageMessages.recipientName),
      filter: 'agTextColumnFilter',
      minWidth: 200,
      hide: false,
    },
    {
      field: 'recipientMobileNo',
      headerName: formatMessage(userPageMessages.recipientMobileNo),
      filter: 'agTextColumnFilter',
      minWidth: 200,
      hide: false,
    },
    {
      field: 'typeTitle',
      headerName: formatMessage(phrasesMessages.role),
      filter: 'agTextColumnFilter',
      minWidth: 150,
      hide: false,
    },
    {
      field: 'isDefault',
      headerName: formatMessage(phrasesMessages.isDefault),
      filter: 'agTextColumnFilter',
      minWidth: 120,
      hide: false,
      cellRenderer: GridIsDefaultColumn,
    },
  ]
}

export function userSocialGridColumns(): ColDef[] {
  const { formatMessage } = useIntl()

  return [
    {
      field: 'partyRoleId',
      headerName: formatMessage(phrasesMessages.role),
      filter: 'agTextColumnFilter',
      minWidth: 200,
      hide: true,
    },
    {
      field: 'roleTypeTilte',
      headerName: formatMessage(phrasesMessages.role),
      filter: 'agTextColumnFilter',
      minWidth: 200,
    },
    {
      field: 'whatsApp',
      headerName: formatMessage(phrasesMessages.whatsapp),
      filter: 'agTextColumnFilter',
      minWidth: 200,
    },
    {
      field: 'instagram',
      headerName: formatMessage(phrasesMessages.instagram),
      filter: 'agTextColumnFilter',
      minWidth: 200,
    },
    {
      field: 'linkedIn',
      headerName: formatMessage(phrasesMessages.linkedin),
      filter: 'agTextColumnFilter',
      minWidth: 200,
    },
  ]
}
