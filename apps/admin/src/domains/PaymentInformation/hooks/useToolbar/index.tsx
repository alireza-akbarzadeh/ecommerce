import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { DownloadMethodType } from '@hasty-bazar/admin-shared/containers/HBDataGrid/useDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { usePostAdminPaymentPaymentExcelFileMutation } from '@hasty-bazar/admin-shared/services/paymentApi.generated'
import { HBDataGridToolbarProps, HBDataGrigToolbar, MenuItemProps } from '@hasty-bazar/core'
import { FC, RefObject, useCallback, useMemo } from 'react'
import { useIntl } from 'react-intl'
import { IUsePaymentInfoGridColumns } from '../../types/IUsePaymentInfoGridColumns'

interface IUseToolbar extends IUsePaymentInfoGridColumns {
  selectedRows: any[]
  handleRefresh: () => void
  gridRef: RefObject<HBDataGridClientRef>
}

const useToolbar = ({ selectedRows, handleRefresh, gridRef }: IUseToolbar) => {
  const { formatMessage } = useIntl()

  const [postAdminPaymentPaymentExcelFile] = usePostAdminPaymentPaymentExcelFileMutation()

  const handleDownload = async (props: DownloadMethodType) => {
    const { filterFields, ...res } = props
    return await postAdminPaymentPaymentExcelFile({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      getAllPaymentExcelFileQueryFilter: {
        ...res,
        ...filterFields,
      },
    })
  }

  const handleDownloadPage = (isDownloadAll?: boolean) => {
    gridRef?.current?.downloadGridData({
      downloadFileMethod: handleDownload,
      downloadAll: isDownloadAll,
    })
  }

  const userGridToolbarMenu = (): MenuItemProps[] => {
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
  }

  const toolbarMoreItems = useMemo<MenuItemProps[]>(() => {
    const activeCount = selectedRows.filter((row) => row.isActive).length
    const unActiveCount = selectedRows.filter((row) => !row.isActive).length
    const disabledActive = unActiveCount === 0
    const disabledUnActive = activeCount === 0
    const disabledOnNoSelected = selectedRows.length === 0
    return userGridToolbarMenu()
  }, [selectedRows])
  const toolBar = useCallback<FC<HBDataGridToolbarProps>>(
    (props) => {
      return (
        <HBDataGrigToolbar
          addProps={{
            show: false,
          }}
          deleteProps={{
            show: false,
          }}
          editProps={{
            show: false,
          }}
          statusProps={{ show: false }}
          items={toolbarMoreItems}
          searchProps={{
            inputWidth: 180,
            openPosition: 'right',
            show: false,
          }}
          refreshProps={{ onClick: () => handleRefresh() }}
          {...props}
        ></HBDataGrigToolbar>
      )
    },
    [selectedRows],
  )

  return { toolBar }
}

export default useToolbar
