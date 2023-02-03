import { GridActionColumn, Status } from '@hasty-bazar/admin-shared/components'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { GetBusinessTypeValuesQueryResult } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBIcon } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import {
  CheckboxSelectionCallbackParams,
  ColDef,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { RefObject, useCallback, useMemo } from 'react'
import { useIntl } from 'react-intl'
import enumsMessage from '../enums.message'

type useEnumValueGridProps = {
  gridRef: RefObject<AgGridReact>
  enumTypeId?: string | null
  handleEdit: (props: GetBusinessTypeValuesQueryResult) => void
}

const useEnumValueGrid = ({ gridRef, enumTypeId, handleEdit }: useEnumValueGridProps) => {
  const { formatMessage } = useIntl()
  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/GeneralData/BusinessTypeValue/GetAll?BusinessTypeId=${enumTypeId}`

  const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerCheckboxSelection: true,
      cellRenderer: 'agGroupCellRenderer',
    }
  }, [])

  const GridActions = useCallback(
    (props: ICellRendererParams) => {
      return (
        <GridActionColumn
          {...props}
          menuItems={[
            {
              label: formatMessage(phrasesMessages.public),
              children: [
                {
                  icon: 'pen',
                  label: formatMessage(phrasesMessages.edit),
                  onClick: () => handleEdit(props.data),
                },
              ],
            },
          ]}
        />
      )
    },
    [gridRef.current?.api?.getSelectedRows()],
  )

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
            innerRenderer: GridActions,
          },
        },
        {
          field: 'id',
          headerName: formatMessage(phrasesMessages.id),
          hide: true,
          filter: 'agTextColumnFilter',
        },
        {
          field: 'title',
          headerName: formatMessage(enumsMessage.PersianNameValue),
          filter: 'agTextColumnFilter',
          minWidth: 150,
        },
        {
          field: 'name',
          headerName: formatMessage(enumsMessage.latinNameValue),
          filter: 'agTextColumnFilter',
          minWidth: 150,
        },
        {
          field: 'code',
          headerName: formatMessage(enumsMessage.codeValue),
          filter: 'agTextColumnFilter',
          minWidth: 150,
        },
        {
          field: 'fullCode',
          headerName: formatMessage(enumsMessage.completeCodeValue),
          filter: 'agTextColumnFilter',
          minWidth: 150,
        },
        {
          field: 'displayOrder',
          headerName: formatMessage(enumsMessage.sortOrderValue),
          filter: 'agTextColumnFilter',
          minWidth: 100,
        },
        {
          field: 'iconName',
          headerName: formatMessage(enumsMessage.iconValue),
          filter: 'agTextColumnFilter',
          minWidth: 100,
          maxWidth: 100,
          cellRenderer: (params: ICellRendererParams) => {
            return params.value ? <HBIcon type={params.value} /> : ''
          },
        },
        {
          field: 'colorName',
          headerName: formatMessage(enumsMessage.colorValue),
          filter: 'agTextColumnFilter',
          minWidth: 100,
          cellRenderer: (props: ICellRendererParams) =>
            props?.value! ? (
              <Box
                sx={{ backgroundColor: props.value, width: 22, height: 22, borderRadius: '50%' }}
                mt={2}
              />
            ) : (
              ''
            ),
        },
        {
          field: 'isActive',
          headerName: formatMessage(enumsMessage.isActiveValue),
          filter: 'agTextColumnFilter',
          minWidth: 100,
          cellRenderer: Status,
          cellRendererParams: {
            active: formatMessage(phrasesMessages.active),
            inActive: formatMessage(phrasesMessages.deActive),
          },
        },
      ] as ColDef[],
    [gridRef.current?.api?.getSelectedRows()],
  )

  return {
    actionUrl,
    autoGroupColumnDef,
    columnDefs,
  }
}
export default useEnumValueGrid
