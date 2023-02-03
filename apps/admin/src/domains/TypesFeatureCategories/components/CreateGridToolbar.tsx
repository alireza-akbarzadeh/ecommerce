import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { HBDataGrigToolbar, MenuItemProps } from '@hasty-bazar/core'
import HBGrigToolbarItem from 'libs/core/src/components/HBGrigToolbar/components/HBGrigToolbarItem'
import { RefObject, useMemo } from 'react'
import { useIntl } from 'react-intl'

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
  ...otherProps
}: CreateToolbarModel<T>) => {
  const { formatMessage } = useIntl()

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
    id = typeof id === 'string' ? id : selectedRows[0]?.id
    onEditClick?.(String(id!))
  }

  const toolbarMoreItems = useMemo<MenuItemProps[]>(() => {
    return []
  }, [selectedRows])

  return (
    <HBDataGrigToolbar
      onChange={onGridActionsChange}
      addProps={{
        disabled: toolbarStatus.disabledOnSelected || isEditOrAdd,
        onClick: addFilter,
      }}
      editProps={{
        disabled: selectedRows.length !== 1 || isEditOrAdd,
        onClick: (props) => filterEdit(props),
      }}
      deleteProps={{
        disabled: toolbarStatus.disabledOnNoSelected,
        onClick: () => {
          //@ts-ignore
          handleSetDeleteDialogState(true, selectedRows[0]?.id)
        },
      }}
      refreshProps={{ onClick: onRefreshClick, disabled: isEditOrAdd }}
      items={toolbarMoreItems}
      statusProps={{ show: true, disabled: isEditOrAdd }}
      searchProps={{ show: true, disabled: isEditOrAdd }}
      moreProps={{ show: true, disabled: isEditOrAdd }}
      {...otherProps}
    >
      <HBGrigToolbarItem
        icon="times"
        tooltip={formatMessage(phrasesMessages.cancel)}
        disabled={!isEditOrAdd || isLoading}
        show={isEditOrAdd}
        onClick={onCancelClick}
      />
      <HBGrigToolbarItem
        icon="check"
        tooltip={formatMessage(phrasesMessages.confirm)}
        disabled={!isEditOrAdd || isLoading}
        onClick={onSubmit}
        show={isEditOrAdd}
      />
    </HBDataGrigToolbar>
  )
}

export default CreateGridToolbar
