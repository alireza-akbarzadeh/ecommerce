import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { useGetAdminCatalogApiAttributeValueGetAllQuery } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { HBSelect, HBSwitch } from '@hasty-bazar/core'
import {
  CheckboxSelectionCallbackParams,
  ColDef,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useRouter } from 'next/router'
import { RefObject, useMemo } from 'react'
import { useIntl } from 'react-intl'
import GridAction from '../../components/GridAction'
import periodFilter from '../../periodFilter.message'
import { SelectRowModel } from '../../types'

export type PeriodFilterThreeModel = {
  gridRef: RefObject<AgGridReact>
  selectedRows: SelectRowModel[]
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
}: PeriodFilterThreeModel) => {
  const router = useRouter()
  const id = router.query.id?.[0]

  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/Catalog/api/AttributeFilter/${attributeId}/FilterValue`
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

  const { data: { data: { items: attributeValueData = [] } = {} } = {}, refetch: refetchContent } =
    useGetAdminCatalogApiAttributeValueGetAllQuery(
      {
        'client-name': 'admin',
        'client-version': '1.0.0',
        attributeId: id,
      },
      { skip: !id },
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
          field: 'attributeValueId',
          headerName: formatMessage(periodFilter.filter3Title),
          filter: 'agTextColumnFilter',
          maxWidth: 450,
          cellRenderer: ({ value, data, setValue }: ICellRendererParams) =>
            data?.isAdd || editId == data.id ? (
              <HBSelect
                sx={{ mt: 1, height: 30, '& > label': { lineHeight: 1 } }}
                size="small"
                value={value}
                onChange={(e) => setValue!(e?.target?.value!)}
                label=""
                menuItem={
                  attributeValueData?.map((item) => ({
                    value: item?.id!,
                    title: item?.value!,
                  })) || []
                }
              />
            ) : (
              data?.attributeValue
            ),
        },

        {
          field: 'isActive',
          headerName: formatMessage(periodFilter.filterStatus),
          filter: 'agTextColumnFilter',
          filterParams: {
            readOnly: true,
          },
          maxWidth: 120,
          cellRenderer: ({ value, data, setValue }: ICellRendererParams) =>
            data?.isAdd ? (
              <HBSwitch
                sx={{ mt: 2 }}
                defaultChecked
                value={value}
                onChange={(e, checked) => setValue!(checked)}
              />
            ) : (
              <HBSwitch
                disabled={editId !== data.id}
                sx={{ mt: 2 }}
                checked={value}
                onChange={(e, checked) => {
                  setValue!(checked)
                }}
              />
            ),
        },
      ] as ColDef[],
    [gridRef.current?.api?.getSelectedRows(), editId],
  )

  return {
    actionUrl,
    columnDefs,
    autoGroupColumnDef,
  }
}

export default usePeriodFilterTwo
