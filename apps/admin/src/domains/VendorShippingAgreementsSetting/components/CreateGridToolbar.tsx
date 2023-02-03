import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { DownloadMethodType } from '@hasty-bazar/admin-shared/containers/HBDataGrid/useDataGrid'
import { ContractState } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import useToast from '@hasty-bazar/admin-shared/hooks/useToast'
import {
  GetAdminSaleApiVendorShippingContractGetAllApiArg,
  usePostAdminSaleApiVendorShippingContractDownloadExcelFileMutation,
} from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { HBDataGrigToolbar, MenuItemProps } from '@hasty-bazar/core'
import { useRouter } from 'next/router'
import { RefObject, useMemo } from 'react'
import { useIntl } from 'react-intl'
import VendorShippingAgrrementsMessages from '../VendorShippingAgreements.message'

export interface CreateToolbarModel {
  selectedRows: GetAdminSaleApiVendorShippingContractGetAllApiArg[]
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
  const vendorShippingAdd = () => router.push('/vendorShippingAgreementSetting/add')

  const toolbarStatus = useMemo(() => {
    const disabledOnSelected = selectedRows.length > 0
    const disabledOnNoSelected = selectedRows.length === 0

    return { disabledOnSelected, disabledOnNoSelected }
  }, [selectedRows])

  const vendorShippingEdit = (id?: string | number) => {
    id = typeof id === 'string' ? id : selectedRows[0]?.id
    router.push(`/vendorShippingAgreementSetting/edit/${id}`)
  }

  const [downloadFile] = usePostAdminSaleApiVendorShippingContractDownloadExcelFileMutation()

  const handleDownload = async (props: DownloadMethodType) => {
    const { filterFields, ...res } = props
    return await downloadFile({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      downloadVendorShippingContractsExcel: {
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

  return (
    <HBDataGrigToolbar
      statusProps={{ show: false }}
      onChange={onGridActionsChange}
      addProps={{
        disabled: toolbarStatus.disabledOnSelected,
        onClick: vendorShippingAdd,
      }}
      editProps={{
        disabled: selectedRows.length !== 1,
        onClick: vendorShippingEdit,
      }}
      deleteProps={{
        disabled: toolbarStatus.disabledOnNoSelected,
        onClick: () => {
          if (
            selectedRows.filter((row) => row?.contractState?.toString() !== ContractState.Draft)
              .length > 0
          ) {
            showToast(
              formatMessage(
                VendorShippingAgrrementsMessages.someSelectedRecordsCannotBeDeletedAccordingToTheState,
              ),
              'error',
            )
            return
          }
          handleSetDeleteDialogState(true)
        },
      }}
      refreshProps={{ onClick: () => onRefreshClick() }}
      items={toolbarMoreItems}
      {...otherProps}
    />
  )
}

export default CreateGridToolbar
