import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { MenuItemProps } from '@hasty-bazar/core'
import { ColDef } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { RefObject, useMemo } from 'react'
import { useIntl } from 'react-intl'
import { SelectRowModelOne } from '../types'
import useGridColumns from './useGridColumns'

export type PeriodFilterOneModel = {
  gridRef: RefObject<AgGridReact>
  selectedRows: SelectRowModelOne[]
  onDelete: (show: boolean, id: string) => void
  onEditClick: (id: string) => void
  attributeId: string
  editId?: string
  changeState?: (state: boolean) => void
}

const usePeriodFilterOne = ({
  gridRef,
  attributeId,
  onDelete,
  onEditClick,
  selectedRows,
  editId,
  changeState,
}: PeriodFilterOneModel) => {
  const { formatMessage } = useIntl()

  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/Catalog/categories/${attributeId}/attributes`

  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerCheckboxSelection: true,
      cellRenderer: 'agGroupCellRenderer',
    }
  }, [])

  const toolbarMoreItems = useMemo<MenuItemProps[]>(() => {
    const activeCount = selectedRows.filter((row) => row.isActive).length
    const unActiveCount = selectedRows.filter((row) => !row.isActive).length
    const disabledActive = unActiveCount === 0
    const disabledUnActive = activeCount === 0
    const disabledOnNoSelected = selectedRows.length === 0

    return [
      {
        label: formatMessage(phrasesMessages.active),
        icon: 'toggleOn',
        disabled: disabledOnNoSelected || disabledActive,
        onClick: () => changeState?.(true),
        show: !disabledActive,
      },
      {
        label: formatMessage(phrasesMessages.deActive),
        icon: 'toggleOff',
        disabled: disabledOnNoSelected || disabledUnActive,
        onClick: () => changeState?.(false),
        show: !disabledUnActive,
      },
      {
        label: formatMessage(phrasesMessages.download),
        icon: 'arrowDown',
        disabled: disabledOnNoSelected,
      },
    ]
  }, [selectedRows])

  const onEdit = (id: string | number) => {
    id = typeof id === 'string' ? id : selectedRows[0]?.id
    onEditClick?.(String(id!))
  }

  const { columnDefs } = useGridColumns({
    gridRef,
    onDelete,
    onEdit,
    editId,
  })

  return {
    actionUrl,
    columnDefs,
    autoGroupColumnDef,
    toolbarMoreItems,
  }
}

export default usePeriodFilterOne
