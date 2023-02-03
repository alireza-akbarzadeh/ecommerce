import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { HBDataGrigToolbar, MenuItemProps } from '@hasty-bazar/core'
import { RefObject, useMemo } from 'react'

export interface CreateToolbarModel<T> {
  selectedRows: T[]
  handleSetDeleteDialogState: (show: boolean, id?: string) => void
  onGridActionsChange: (value: number | string, type: 'search' | 'status') => void
  onRefreshClick: () => void
  onAddClick?: () => void
  onEditClick?: (id: string) => void
  onCancelClick?: () => void
  onSubmit?: () => void
  isEditOrAdd?: boolean
  isLoading?: boolean
  gridRef: RefObject<HBDataGridClientRef>
  menuItems?: MenuItemProps[]
}

const CreateGridToolbar = <T,>({
  selectedRows,
  handleSetDeleteDialogState,
  onGridActionsChange,
  onRefreshClick,
  onAddClick,
  onEditClick,
  onCancelClick,
  onSubmit,
  isEditOrAdd = false,
  isLoading,
  gridRef,
  menuItems,
  ...otherProps
}: CreateToolbarModel<T>) => {
  const addFilter = () => {
    onAddClick?.()
  }

  const toolbarStatus = useMemo(() => {
    const disabledOnSelected = selectedRows.length > 0
    const disabledOnNoSelected = selectedRows.length === 0

    return { disabledOnSelected, disabledOnNoSelected }
  }, [selectedRows])

  const filterEdit = (id?: string | number) => {
    //@ts-ignore
    id = typeof id === 'string' ? id : selectedRows[0]?.attributeId
    onEditClick?.(String(id!))
  }

  const toolbarMoreItems = useMemo<MenuItemProps[]>(() => {
    return menuItems || []
  }, [selectedRows])

  const handleCancel = () => {
    onCancelClick?.()
  }

  return (
    <HBDataGrigToolbar
      onChange={onGridActionsChange}
      addProps={{
        disabled: toolbarStatus.disabledOnSelected || isEditOrAdd,
        onClick: addFilter,
      }}
      editProps={{
        disabled: selectedRows.length !== 1,
        onClick: (props) => filterEdit(props),
      }}
      deleteProps={{
        disabled: toolbarStatus.disabledOnNoSelected,
        onClick: () => {
          //@ts-ignore
          handleSetDeleteDialogState(true, selectedRows[0]?.attributeId)
        },
      }}
      refreshProps={{ onClick: onRefreshClick }}
      items={toolbarMoreItems}
      {...otherProps}
    />
  )
}

export default CreateGridToolbar
