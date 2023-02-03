import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid/HBDataGridClient'
import { DownloadMethodType } from '@hasty-bazar/admin-shared/containers/HBDataGrid/useDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { usePostAdminSaleApiPlatformShippingContractDownloadExcelFileHeaderMutation } from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { MenuItemProps } from '@hasty-bazar/core'
import { RefObject, useMemo } from 'react'
import { useIntl } from 'react-intl'
import { SelectRowModel } from '../types'

interface useExcelDownloadProps {
  gridRef: RefObject<HBDataGridClientRef>
  selectedRows: SelectRowModel[]
}

const useExcelDownload = ({ gridRef, selectedRows }: useExcelDownloadProps) => {
  const { formatMessage } = useIntl()

  const [downloadFile] =
    usePostAdminSaleApiPlatformShippingContractDownloadExcelFileHeaderMutation()

  const handleDownload = async (props: DownloadMethodType) => {
    const { filterFields, ...res } = props
    return await downloadFile({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      downloadAllShippingContractsExcel: {
        ...res,
        ...filterFields,
      },
    })
  }

  const handleDownloadPage = (isDownloadAll?: boolean) => {
    gridRef.current?.downloadGridData({
      downloadFileMethod: handleDownload,
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

  return {
    toolbarMoreItems,
  }
}

export default useExcelDownload
