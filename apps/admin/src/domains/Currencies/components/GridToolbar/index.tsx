import useAttributesGrid from '@hasty-bazar-admin/domains/Attributes/containers/hooks/useAttributesGrid'
import { HBDataGrigToolbar, MenuItemProps } from '@hasty-bazar/core'
import { useMemo } from 'react'
import { CreateToolbarModel } from '../../types/types'

const CreateGridToolbar = <T extends { id?: string }>(props: CreateToolbarModel<T>) => {
  const {
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
    handleChangeStatus,
    ...otherProps
  } = props

  const addFilter = () => {
    onAddClick?.()
  }

  const { getToolbarMoreItems } = useAttributesGrid(gridRef)

  const toolbarStatus = useMemo(() => {
    const disabledOnSelected = selectedRows.length > 0
    const disabledOnNoSelected = selectedRows.length === 0

    return { disabledOnSelected, disabledOnNoSelected }
  }, [selectedRows])

  const filterEdit = (id?: string | number) => {
    id = typeof id === 'string' ? id : selectedRows[0]?.id
    onEditClick?.(String(id!))
  }

  const toolbarMoreItems = useMemo<MenuItemProps[]>(
    //@ts-ignore
    () => getToolbarMoreItems(handleChangeStatus),
    [selectedRows],
  )

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
          handleSetDeleteDialogState(true, selectedRows[0]?.id)
        },
      }}
      refreshProps={{ onClick: onRefreshClick }}
      items={toolbarMoreItems}
      {...otherProps}
    />
  )
}

export default CreateGridToolbar
