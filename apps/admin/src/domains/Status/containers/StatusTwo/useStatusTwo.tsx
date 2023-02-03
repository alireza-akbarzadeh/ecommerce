import { Status } from '@hasty-bazar/admin-shared/components'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { HBIcon, HBIconType } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import {
  CheckboxSelectionCallbackParams,
  ColDef,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { RefObject, useMemo } from 'react'
import { useIntl } from 'react-intl'
import GridAction from '../../components/GridAction'
import statusMessage from '../../status.message'
import { SelectRowModelTwo } from '../../types'
import { Color } from './components'

export type PeriodFilterOneModel = {
  gridRef: RefObject<AgGridReact>
  selectedRows: SelectRowModelTwo[]
  onDelete: (show: boolean, id: string) => void
  onEditClick: (id: string) => void
  attributeId: string
  editId?: string
}

const usePeriodFilterTwo = ({
  gridRef,
  attributeId,
  onDelete,
  onEditClick,
  selectedRows,
  editId,
}: PeriodFilterOneModel) => {
  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Workflow/stateMachine/${attributeId}/state`
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

  const onEdit = (id: string | number) => {
    id = typeof id === 'string' ? id : selectedRows[0]?.id
    onEditClick?.(String(id!))
  }

  const columnDefs = useMemo(
    () =>
      [
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
            innerRenderer: (params: ICellRendererParams) => (
              <GridAction {...params} {...{ onEdit, onDelete }} />
            ),
          },
        },
        {
          field: 'id',
          headerName: formatMessage(phrasesMessages.id),
          hide: true,
          filter: 'agTextColumnFilter',
        },
        {
          field: 'code',
          headerName: formatMessage(statusMessage.grid2Code),
          filter: 'agTextColumnFilter',
          minWidth: 250,
        },
        {
          field: 'title',
          headerName: formatMessage(statusMessage.grid2Name),
          filter: 'agTextColumnFilter',
          minWidth: 250,
        },
        {
          field: 'description',
          headerName: formatMessage(statusMessage.grid2Description),
          filter: 'agTextColumnFilter',
          hide: true,
        },
        {
          field: 'isInitial',
          headerName: formatMessage(statusMessage.grid2StartStatus),
          filter: 'agTextColumnFilter',
          cellRenderer: (params: ICellRendererParams) => (
            <HBIcon type={params?.value ? 'check' : 'times'} />
          ),
        },
        {
          field: 'isFinal',
          headerName: formatMessage(statusMessage.grid2FinalStatus),
          filter: 'agTextColumnFilter',
          hide: true,
          cellRenderer: (params: ICellRendererParams) => (
            <HBIcon type={params?.value ? 'check' : 'times'} />
          ),
        },
        {
          field: 'icon',
          headerName: formatMessage(statusMessage.grid2Icon),
          filter: 'agTextColumnFilter',
          cellRenderer({ value }: ICellRendererParams) {
            return value ? <HBIcon type={value as HBIconType} /> : null
          },
        },
        {
          field: 'color',
          headerName: formatMessage(statusMessage.grid2Color),
          filter: 'agTextColumnFilter',
          cellRenderer({ value }: ICellRendererParams) {
            return value ? (
              <Box width={30} height={30} sx={{ backgroundColor: value, borderRadius: '50%' }} />
            ) : null
          },
        },
        {
          field: 'isActive',
          headerName: formatMessage(statusMessage.gridStatus),
          filter: 'agTextColumnFilter',
          filterParams: {
            readOnly: true,
          },
          minWidth: 120,
          cellRenderer: Status,
          cellRendererParams: {
            active: formatMessage(phrasesMessages.active),
            inActive: formatMessage(phrasesMessages.deActive),
          },
        },
      ] as ColDef[],
    [gridRef.current?.api?.getSelectedRows(), editId],
  )

  const colorData = [
    {
      value: '#D56C0C',
      title: formatMessage(statusMessage.orangeColor),
      iconPath: <Color color="#D56C0C" />,
    },
    {
      value: '#BB2E47',
      title: formatMessage(statusMessage.redColor),
      iconPath: <Color color="#BB2E47" />,
    },
    {
      value: '#2E7D32',
      title: formatMessage(statusMessage.greenColor),
      iconPath: <Color color="#2E7D32" />,
    },
    {
      value: '#2780D2',
      title: formatMessage(statusMessage.blueColor),
      iconPath: <Color color="#2780D2" />,
    },
    {
      value: '#F9A825',
      title: formatMessage(statusMessage.yellowColor),
      iconPath: <Color color="#F9A825" />,
    },
    {
      value: '#9E9E9E',
      title: formatMessage(statusMessage.grayColor),
      iconPath: <Color color="#9E9E9E" />,
    },
  ]

  return {
    actionUrl,
    columnDefs,
    autoGroupColumnDef,
    colorData,
  }
}

export default usePeriodFilterTwo
