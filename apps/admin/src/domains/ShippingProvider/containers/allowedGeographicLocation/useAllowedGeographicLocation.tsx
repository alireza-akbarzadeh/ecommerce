import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { HBSelect, HBTextField } from '@hasty-bazar/core'
import { Box, styled } from '@mui/material'
import {
  CheckboxSelectionCallbackParams,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { useMemo } from 'react'
import { useIntl } from 'react-intl'
import useDataItemsQuery from '../../hooks/useDataItemsQuery'
import ShippingProviderMessages from '../../shippingProvider.message'

const CellBoxStyle = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
}))

const useAllowedGeographicLocation = (
  gridRef: HBDataGridClientRef,
  geographicLocationId: string,
  id: string,
) => {
  const { formatMessage } = useIntl()
  const { geo } = useDataItemsQuery()
  const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/sale/api/ShippingProviders/${id}/MappingCities`

  const columnDefs = useMemo(
    () => [
      {
        field: '_actions',
        headerName: '',
        maxWidth: 110,
        minWidth: 110,
        resizable: false,
        sortable: false,
        filter: false,
        suppressAutoSize: true,
        suppressMenu: true,
        checkboxSelection,
        headerCheckboxSelection,
        showRowGroup: true,
        cellRenderer: 'agGroupCellRenderer',
        cellRendererParams: {
          suppressCount: true,
          suppressDoubleClickExpand: true,
          innerRenderer: () => {},
        },
      },
      {
        field: 'id',
        headerName: formatMessage(phrasesMessages.id),
        hide: true,
        filter: 'agTextColumnFilter',
      },
      {
        field: 'platformCityId',
        headerName: formatMessage(ShippingProviderMessages.platformCity),
        filter: 'agTextColumnFilter',
        maxWidth: 200,
        cellRenderer: ({ setValue, data }: ICellRendererParams) =>
          data?.isAdd || geographicLocationId === data.id ? (
            <CellBoxStyle>
              <HBSelect
                required={false}
                label={formatMessage(ShippingProviderMessages.platformCity)}
                onChange={(e) => setValue!(e.target.value)}
                menuItem={
                  geo?.map(({ title, id }) => ({
                    title: title ?? '',
                    value: id ?? '',
                  })) as { title: string; value: string | number }[]
                }
              />
            </CellBoxStyle>
          ) : (
            data.platformCityName
          ),
      },
      {
        field: 'providerCityId',
        headerName: formatMessage(ShippingProviderMessages.providerCity),
        filter: 'agTextColumnFilter',
        cellRenderer: ({ setValue, data }: ICellRendererParams) =>
          data?.isAdd || geographicLocationId === data.id ? (
            <CellBoxStyle>
              <HBTextField type="number" onChange={(e) => setValue!(e.target.value)} />
            </CellBoxStyle>
          ) : (
            data.providerCityId
          ),
      },
    ],
    [gridRef?.api?.getSelectedRows()],
  )

  return { columnDefs, actionUrl }
}

export default useAllowedGeographicLocation
