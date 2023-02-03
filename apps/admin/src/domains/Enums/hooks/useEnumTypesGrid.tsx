import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { ColDef } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { RefObject, useMemo } from 'react'
import { useIntl } from 'react-intl'
import enumsMessage from '../enums.message'

type useEnumTypesGridProps = {
  gridRef: RefObject<AgGridReact>
}

const useEnumTypesGrid = ({ gridRef }: useEnumTypesGridProps) => {
  const { formatMessage } = useIntl()
  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/GeneralData/BusinessType/GetAll`

  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerCheckboxSelection: true,
      cellRenderer: 'agGroupCellRenderer',
    }
  }, [])

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
          field: 'title',
          headerName: formatMessage(enumsMessage.persianName),
          filter: 'agTextColumnFilter',
          minWidth: 150,
        },
        {
          field: 'name',
          headerName: formatMessage(enumsMessage.latinName),
          filter: 'agTextColumnFilter',
          minWidth: 150,
        },
        {
          field: 'code',
          headerName: formatMessage(enumsMessage.code),
          filter: 'agTextColumnFilter',
          minWidth: 200,
        },
        {
          field: 'description',
          headerName: formatMessage(enumsMessage.description),
          filter: 'agTextColumnFilter',
          minWidth: 200,
          tooltipField: 'description',
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
export default useEnumTypesGrid
