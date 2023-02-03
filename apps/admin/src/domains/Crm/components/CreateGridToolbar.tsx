import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { HBDataGrigToolbar, HBSelectProps, MenuItemProps } from '@hasty-bazar/core'
import { HBDataGridSearchProps } from 'libs/core/src/components/HBGrigToolbar/components/HBGridSearch'
import { HBGrigToolbarItemProps } from 'libs/core/src/components/HBGrigToolbar/components/HBGrigToolbarItem'
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
  isDisableAll?: boolean
  toolbarOptions?: {
    addProps?: HBGrigToolbarItemProps
    editProps?: HBGrigToolbarItemProps
    deleteProps?: HBGrigToolbarItemProps
    refreshProps?: HBGrigToolbarItemProps
    searchProps?: HBDataGridSearchProps
    statusProps?: Partial<HBSelectProps> & {
      show?: boolean
    }
    moreProps?: HBGrigToolbarItemProps
  }
  children?: React.ReactNode
}

const CreateGridToolbar = <T,>({
  selectedRows = [],
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
  isDisableAll,
  toolbarOptions,
  ...otherProps
}: CreateToolbarModel<T>) => {
  const addFilter = () => {
    onAddClick?.()
  }

  const toolbarStatus = useMemo(() => {
    const disabledOnSelected = selectedRows.length > 0
    const disabledOnNoSelected = selectedRows.length === 0
    const disabledOnMultiSelected = selectedRows.length > 1

    return { disabledOnSelected, disabledOnNoSelected, disabledOnMultiSelected }
  }, [selectedRows])

  const toolbarMoreItems = useMemo<MenuItemProps[]>(() => {
    const disabledOnNoSelected = selectedRows.length === 0
    return []
  }, [selectedRows])

  return (
    <HBDataGrigToolbar
      onChange={onGridActionsChange}
      addProps={{
        disabled: toolbarStatus.disabledOnSelected || isEditOrAdd || isDisableAll,
        onClick: addFilter,
        ...toolbarOptions?.addProps,
      }}
      editProps={{
        show: true,
        ...toolbarOptions?.editProps,
        disabled:
          toolbarStatus.disabledOnNoSelected ||
          isEditOrAdd ||
          isDisableAll ||
          toolbarStatus.disabledOnMultiSelected,
        onClick: onEditClick,
      }}
      deleteProps={{
        disabled: toolbarStatus.disabledOnNoSelected || isEditOrAdd || isDisableAll,
        onClick: () => {
          //@ts-ignore
          handleSetDeleteDialogState(true)
        },
        ...toolbarOptions?.deleteProps,
      }}
      refreshProps={{
        onClick: onRefreshClick,
        disabled: isEditOrAdd || isDisableAll,
        ...toolbarOptions?.refreshProps,
      }}
      searchProps={{
        disabled: isEditOrAdd || isDisableAll,
        show: true,
        ...toolbarOptions?.searchProps,
      }}
      moreProps={{
        show: true,
        disabled: isEditOrAdd || isDisableAll,
        ...toolbarOptions?.moreProps,
      }}
      statusProps={{
        disabled: isEditOrAdd || isDisableAll,
        show: true,
        ...toolbarOptions?.statusProps,
      }}
      items={toolbarMoreItems}
      {...otherProps}
    >
      {otherProps.children}
    </HBDataGrigToolbar>
  )
}

export default CreateGridToolbar
