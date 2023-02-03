import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { DownloadMethodType } from '@hasty-bazar/admin-shared/containers/HBDataGrid/useDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  GetAdminAccountingApiFinancialTransactionApiArg,
  usePostAdminAccountingApiFinancialTransactionDownloadExcelFileMutation,
} from '@hasty-bazar/admin-shared/services/accountingApi.generated'
import { HBDataGrigToolbar, HBDialog, MenuItemProps } from '@hasty-bazar/core'
import { Popover } from '@mui/material'
import HBGrigToolbarItem from 'libs/core/src/components/HBGrigToolbar/components/HBGrigToolbarItem'
import { RefObject, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import BillModal from '../containers/BillModal'
import WalletModal from '../containers/WalletModal'
import FinancialTransactionMessage from '../financialTransaction.message'
import useCreateGridToolbar from '../hooks/useCreateGridToolbar'
interface CreateToolbarModel {
  selectedRows: GetAdminAccountingApiFinancialTransactionApiArg[]
  onGridActionsChange: (value: number | string, type: 'search' | 'status') => void
  onRefreshClick: () => void
  gridRef: RefObject<HBDataGridClientRef>
}

const CreateGridToolbar = ({
  selectedRows,
  onGridActionsChange,
  onRefreshClick,
  gridRef,
  ...otherProps
}: CreateToolbarModel) => {
  const { formatMessage } = useIntl()
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const [downloadFile] = usePostAdminAccountingApiFinancialTransactionDownloadExcelFileMutation()
  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  const handleDownload = async (props: DownloadMethodType) => {
    const { filterFields, ...res } = props
    return await downloadFile({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      getAllFinancialTransactionExcelQueryFilter: {
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

  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const onClose = () => {
    setAnchorEl(null)
  }

  const handleShowDialog = () => {
    setShowDialog(true)
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

  const createPopover = () => {
    return (
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        {...{ onClose }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        {createPopoverItems()}
      </Popover>
    )
  }

  const { createPopoverItems, excelType } = useCreateGridToolbar({ onClose, handleShowDialog })

  const openModal = (
    excelType: 'generalExcel' | 'vendorsExcel' | 'shippingCompaniesExcel' | 'wallets',
  ) => {
    if (
      excelType === 'generalExcel' ||
      excelType === 'vendorsExcel' ||
      excelType === 'shippingCompaniesExcel'
    ) {
      return <BillModal {...{ gridRef, setShowDialog, excelType }} />
    } else {
      return <WalletModal {...{ gridRef, setShowDialog }} />
    }
  }

  return (
    <>
      <HBDataGrigToolbar
        statusProps={{ show: false }}
        onChange={onGridActionsChange}
        addProps={{ show: false }}
        editProps={{ show: false }}
        deleteProps={{ show: false }}
        refreshProps={{ onClick: onRefreshClick }}
        items={toolbarMoreItems}
        {...otherProps}
      >
        <HBGrigToolbarItem
          icon="fileCopyAlt"
          tooltip={formatMessage(FinancialTransactionMessage.excelDownload)}
          {...{ onClick }}
        />
        {createPopover()}
      </HBDataGrigToolbar>
      <HBDialog
        title={formatMessage(FinancialTransactionMessage.reportFilters)}
        onReject={() => setShowDialog(false)}
        open={showDialog}
        onClose={() => setShowDialog(false)}
        PaperProps={{ sx: { width: 600 } }}
      >
        {openModal(excelType!)}
      </HBDialog>
    </>
  )
}

export default CreateGridToolbar
