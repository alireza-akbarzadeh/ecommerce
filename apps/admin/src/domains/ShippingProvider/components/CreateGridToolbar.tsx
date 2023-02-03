import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { ShippingProviderState } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import useToast from '@hasty-bazar/admin-shared/hooks/useToast'
import { HBDataGrigToolbar, MenuItemProps } from '@hasty-bazar/core'
import { useRouter } from 'next/router'
import { RefObject, useMemo } from 'react'
import { useIntl } from 'react-intl'
import useCreateGridToolbar from '../hooks/useCreateGridToolbar'
import ShgippingProviderPage from '../shippingProvider.message'
import { SelectRowModel } from '../types'

export interface CreateToolbarModel {
  selectedRows: SelectRowModel[]
  handleSetDeleteDialogState: (show: boolean, id?: number) => void
  onGridActionsChange: (value: number | string, type: 'search' | 'status') => void
  onRefreshClick: () => void
  gridRef: RefObject<HBDataGridClientRef>
}

const CreateGridToolbar = ({
  selectedRows,
  handleSetDeleteDialogState,
  onGridActionsChange,
  onRefreshClick,
  gridRef,
  ...otherProps
}: CreateToolbarModel) => {
  const router = useRouter()
  const { showToast } = useToast()
  const { formatMessage } = useIntl()
  const shippingProviderAdd = () => router.push('/shippingProvider/add')
  const { shippingProviderExcel } = useCreateGridToolbar()

  const toolbarStatus = useMemo(() => {
    const disabledOnSelected = selectedRows.length > 0
    const disabledOnNoSelected = selectedRows.length === 0

    return { disabledOnSelected, disabledOnNoSelected }
  }, [selectedRows])

  const shippingProviderEdit = (id?: string | number) => {
    id = typeof id === 'string' ? id : selectedRows[0]?.id
    router.push(`/shippingProvider/edit/${id}`)
  }

  const handleDownloadPage = (isDownloadAll?: boolean) => {
    gridRef.current?.downloadGridData({
      downloadFileMethod: shippingProviderExcel(),
      downloadAll: isDownloadAll,
    })
  }

  const toolbarMoreItems = useMemo<MenuItemProps[]>(() => {
    return [
      {
        label: formatMessage(phrasesMessages.download),
        icon: 'fileDownload',
        onClick: handleDownloadPage,
      },
      {
        label: formatMessage(phrasesMessages.downloadAll),
        icon: 'fileDownloadAlt',
        onClick: () => handleDownloadPage(true),
      },
    ]
  }, [selectedRows])

  return (
    <HBDataGrigToolbar
      statusProps={{ show: false }}
      onChange={onGridActionsChange}
      addProps={{
        disabled: toolbarStatus.disabledOnSelected,
        onClick: shippingProviderAdd,
      }}
      editProps={{
        disabled: selectedRows.length !== 1,
        onClick: shippingProviderEdit,
      }}
      deleteProps={{
        disabled: toolbarStatus.disabledOnNoSelected,
        onClick: () => {
          if (
            selectedRows.filter(
              (row) => row.providerShippingState.toString() !== ShippingProviderState.Draft,
            ).length > 0
          ) {
            showToast(
              formatMessage(
                ShgippingProviderPage.someSelectedRecordsCannotBeDeletedAccordingToTheState,
              ),
              'error',
            )
            return
          }
          handleSetDeleteDialogState(true)
        },
      }}
      refreshProps={{ onClick: onRefreshClick }}
      items={toolbarMoreItems}
      {...otherProps}
    />
  )
}

export default CreateGridToolbar
