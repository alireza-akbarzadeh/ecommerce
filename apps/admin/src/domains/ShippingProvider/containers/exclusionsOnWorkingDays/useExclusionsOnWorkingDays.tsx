import { default as AdapterDateFns, default as AdapterDayjs } from '@date-io/date-fns-jalali'
import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { Box, styled, TextField } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import {
  CheckboxSelectionCallbackParams,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { format } from 'date-fns-jalali'
import { useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import ShippingProviderMessages from '../../shippingProvider.message'

const CellBoxStyle = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
}))

const useExclusionsOnWorkingDays = (
  gridRef: HBDataGridClientRef,
  workingDaysId: string,
  id: string,
) => {
  const { formatMessage } = useIntl()
  const [dateValue, setDateValue] = useState(null)
  const [fromHourValue, setFromHourValue] = useState(null)
  const [toHourValue, setToHourValue] = useState(null)
  const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/sale/api/ShippingProviders/${id}/outOfServicePrograms`

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
        field: 'date',
        headerName: formatMessage(ShippingProviderMessages.date),
        filter: 'agTextColumnFilter',
        maxWidth: 200,
        cellRenderer: ({ setValue, data }: ICellRendererParams) =>
          data?.isAdd || workingDaysId === data.id ? (
            <CellBoxStyle>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={dateValue}
                  onChange={(newValue: any) => {
                    setDateValue(newValue)
                    setValue!(newValue)
                  }}
                  renderInput={(params: any) => (
                    <TextField fullWidth size="small" {...params} label="" />
                  )}
                />
              </LocalizationProvider>
            </CellBoxStyle>
          ) : data.date ? (
            new Date(data.date).toLocaleDateString('fa-IR', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric',
            })
          ) : (
            '-'
          ),
      },
      {
        field: 'fromHour',
        headerName: formatMessage(ShippingProviderMessages.fromTheHour),
        filter: 'agTextColumnFilter',
        maxWidth: 200,
        cellRenderer: ({ setValue, data }: ICellRendererParams) =>
          data?.isAdd || workingDaysId === data.id ? (
            <CellBoxStyle>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  label=""
                  value={fromHourValue}
                  onChange={(newValue: any) => {
                    setFromHourValue(newValue)
                    setValue!(newValue)
                  }}
                  renderInput={(params: any) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </CellBoxStyle>
          ) : data.fromHour ? (
            format(new Date(data.fromHour + 'Z'), 'HH:mm:ss')
          ) : (
            '-'
          ),
      },
      {
        field: 'toHour',
        headerName: formatMessage(ShippingProviderMessages.toTheHour),
        filter: 'agTextColumnFilter',
        maxWidth: 200,
        cellRenderer: ({ setValue, data }: ICellRendererParams) =>
          data?.isAdd || workingDaysId === data.id ? (
            <CellBoxStyle>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  ampm
                  label=""
                  value={toHourValue}
                  onChange={(newValue: any) => {
                    setToHourValue(newValue)
                    setValue!(newValue)
                  }}
                  renderInput={(params: any) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </CellBoxStyle>
          ) : data.toHour ? (
            format(new Date(data.toHour + 'Z'), 'HH:mm:ss')
          ) : (
            '-'
          ),
      },
    ],
    [gridRef?.api?.getSelectedRows()],
  )

  return { columnDefs, actionUrl }
}

export default useExclusionsOnWorkingDays
