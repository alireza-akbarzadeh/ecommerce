import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { HBDataGrigToolbar, MenuItemProps } from '@hasty-bazar/core'
import HBGrigToolbarItem from 'libs/core/src/components/HBGrigToolbar/components/HBGrigToolbarItem'
import { useRouter } from 'next/router'
import { RefObject, useMemo } from 'react'
import { useIntl } from 'react-intl'
import { SelectRowModel } from '../types'

export interface CreateToolbarModel {
  selectedRows: SelectRowModel[]
  handleSetDeleteDialogState: (show?: boolean, id?: string) => void
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

const CreateGridToolbar = ({
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
}: CreateToolbarModel) => {
  const router = useRouter()
  const { formatMessage } = useIntl()

  const addFilter = () => {
    try {
      const row = {
        name: '',
        isActive: true,
        isAdd: true,
      }
      gridRef.current!.api.applyTransaction({
        add: [row],
        addIndex: 0,
      })
      onAddClick?.()
    } catch (e) {}
  }

  const toolbarStatus = useMemo(() => {
    const disabledOnSelected = selectedRows.length > 0
    const disabledOnNoSelected = selectedRows.length === 0

    return { disabledOnSelected, disabledOnNoSelected }
  }, [selectedRows])

  const filterEdit = (id?: string | number) => {
    id = typeof id === 'string' ? id : selectedRows[0]?.id
    onEditClick?.(String(id!))
  }

  const toolbarMoreItems = useMemo<MenuItemProps[]>(() => {
    const disabledOnNoSelected = selectedRows.length === 0
    return []
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
          handleSetDeleteDialogState()
        },
      }}
      refreshProps={{ onClick: onRefreshClick }}
      items={toolbarMoreItems}
      {...otherProps}
    >
      <HBGrigToolbarItem
        icon="times"
        tooltip={formatMessage(phrasesMessages.confirm)}
        disabled={!isEditOrAdd || isLoading}
        show={isEditOrAdd}
        onClick={() => handleCancel()}
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
