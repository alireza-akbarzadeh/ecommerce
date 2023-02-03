import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { clearHtmlTags } from '@hasty-bazar/admin-shared/utils/util'
import { Stack, Typography } from '@mui/material'
import {
  CheckboxSelectionCallbackParams,
  ColDef,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { RefObject, useMemo } from 'react'
import { useIntl } from 'react-intl'
import userMessages from '../../userMessages.messages'

export type UserCompaniesModel = {
  gridRef: RefObject<AgGridReact>
  partyId?: string
}

const usePeriodFilterOne = ({ gridRef, partyId }: UserCompaniesModel) => {
  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/IDR/parties`
  const { formatMessage } = useIntl()
  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerCheckboxSelection: true,
      cellRenderer: 'agGroupCellRenderer',
    }
  }, [])

  const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const columnDefs = useMemo(
    () =>
      [
        {
          field: 'id',
          headerName: formatMessage(phrasesMessages.id),
          hide: true,
          filter: 'agTextColumnFilter',
        },
        {
          field: 'sendDateTime',
          headerName: formatMessage(userMessages.gridDate),
          filter: 'agTextColumnFilter',
          minWidth: 150,
          cellRenderer: (params: ICellRendererParams) => {
            if (!params.value) return '-'
            return (
              <Stack spacing={1} direction="row" mt={2}>
                <Typography variant="body2">
                  {new Date(params.value).toLocaleDateString('fa-IR', {
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric',
                  })}
                </Typography>
                <Typography variant="body2">
                  {new Date(params.value).toLocaleTimeString('fa-IR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>
              </Stack>
            )
          },
        },
        {
          field: 'messageTransferTypeTitle',
          headerName: formatMessage(userMessages.formType),
          filter: 'agTextColumnFilter',
          minWidth: 150,
        },
        ...(!partyId
          ? [
              {
                field: 'recipientFullName',
                headerName: formatMessage(userMessages.gridFullName),
                filter: 'agTextColumnFilter',
                minWidth: 350,
              },
              {
                field: 'recipient',
                headerName: formatMessage(userMessages.gridMobileEmail),
                filter: 'agTextColumnFilter',
                minWidth: 150,
              },
            ]
          : []),
        {
          field: 'subject',
          headerName: formatMessage(userMessages.gridTitle),
          filter: 'agTextColumnFilter',
          minWidth: 150,
        },
        {
          field: 'body',
          headerName: formatMessage(userMessages.gridMessage),
          filter: 'agTextColumnFilter',
          minWidth: 450,
          cellRenderer: (params: ICellRendererParams) => {
            return clearHtmlTags(String(params.value))
          },
          tooltipField: 'body',
        },
        {
          field: 'protocolTypeTitle',
          headerName: formatMessage(userMessages.formSendType),
          filter: 'agTextColumnFilter',
          minWidth: 150,
          tooltipField: 'protocolTypeTitle',
        },
        {
          field: 'reason',
          headerName: formatMessage(userMessages.formMessageEvent),
          filter: 'agTextColumnFilter',
          minWidth: 150,
        },
        {
          field: 'panelTypeTitle',
          headerName: formatMessage(userMessages.formSendFromPort),
          filter: 'agTextColumnFilter',
          minWidth: 150,
        },
      ] as ColDef[],
    [gridRef.current?.api?.getSelectedRows()],
  )

  return {
    actionUrl,
    columnDefs,
    autoGroupColumnDef,
  }
}

export default usePeriodFilterOne
