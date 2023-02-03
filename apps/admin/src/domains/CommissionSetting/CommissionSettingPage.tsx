import HBDataGridClient, {
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid/HBDataGridClient'
import { DownloadMethodType } from '@hasty-bazar/admin-shared/containers/HBDataGrid/useDataGrid'
import { CommissionStatus } from '@hasty-bazar/admin-shared/core/enums/'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import useToast from '@hasty-bazar/admin-shared/hooks/useToast'
import {
  useDeleteAdminCatalogCommissionMutation,
  usePostAdminCatalogCommissionDownloadExcelFileMutation,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { HBDataGrigToolbar, HBDialog, MenuItemProps } from '@hasty-bazar/core'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import CommissionSettingMessages from './CommissionSetting.message'
import { classes, createBreadcrumbs } from './grid'
import useCommissionGridData from './hooks/useCommissionGridData'

export default function CommissioSetting() {
  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/Catalog/commission/GetAll?&Filter=CommissionType!=1038005`
  const { formatMessage } = useIntl()
  const { showToast } = useToast()
  const router = useRouter()
  const gridRef = useRef<HBDataGridClientRef>(null)
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const [deleteDialogState, setDeleteDialogState] = useState<{ show: boolean; id?: number }>({
    show: false,
  })
  const [deleteCommission] = useDeleteAdminCatalogCommissionMutation()
  const handleAddCommission = () => router.push('/commissionSetting/add')

  const handleEditCommission = (id?: string) => {
    if (selectedRows.filter((row) => +row.stateCode !== CommissionStatus.Draft).length > 0) {
      showToast(
        formatMessage(CommissionSettingMessages.selectedRecordCannotBeEditAccordingToTheState),
        'error',
      )
      return
    }
    id = typeof id === 'string' ? id : selectedRows[0]?.id
    router.push(`/commissionSetting/edit/${id}`)
  }
  const { autoGroupColumnDef, gridLoading, refreshGridData, columnDefs, handleChangedGridActions } =
    useCommissionGridData({
      gridRef,
      handleEditCommission,
      setDeleteDialogState,
      selectedRows,
    })

  const handleDelteCommission = useCallback(async () => {
    try {
      const ids = deleteDialogState?.id
        ? [deleteDialogState?.id]
        : selectedRows.map((row) => row.id)

      gridLoading(true)

      deleteCommission({
        'client-name': 'hasty-bazar-admin',
        'client-version': '1.0.0',
        body: ids,
      }).then((res: any) => {
        if (res?.data?.success) {
          showToast(formatMessage(CommissionSettingMessages.successDelete), 'success')
          refreshGridData()
        }
        setDeleteDialogState({ show: false, id: undefined })
        gridLoading(false)
      })
    } catch (e) {}
  }, [selectedRows, deleteDialogState])

  const toolbarStatus = useMemo(() => {
    const disabledOnSelected = selectedRows.length > 0
    const disabledOnNoSelected = selectedRows.length === 0

    return { disabledOnSelected, disabledOnNoSelected }
  }, [selectedRows])

  const [downloadFile] = usePostAdminCatalogCommissionDownloadExcelFileMutation()

  const handleDownload = async (props: DownloadMethodType) => {
    const { filterFields, ...res } = props
    return await downloadFile({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      downloadCommissionExcel: {
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

  const handleChangedSelectedRows = (selectedRows: any[]) => {
    setSelectedRows(selectedRows)
  }

  return (
    <>
      <HBDataGridClient
        editUrl="/commissionSetting/edit/"
        {...{ actionUrl }}
        rightHeader={
          <BreadCrumbSection
            title={formatMessage(CommissionSettingMessages.commissionSetting)}
            breadItems={createBreadcrumbs(formatMessage)}
          />
        }
        columnDefs={columnDefs}
        pagination
        paginationPageSize={25}
        rowSelection="multiple"
        enableRtl
        sideBar
        {...{ classes }}
        detailRowAutoHeight
        {...{ autoGroupColumnDef }}
        onSelectedChanged={handleChangedSelectedRows}
        ref={gridRef}
        GridToolbar={(props) => (
          <HBDataGrigToolbar
            onChange={handleChangedGridActions}
            addProps={{ disabled: toolbarStatus.disabledOnSelected, onClick: handleAddCommission }}
            statusProps={{ show: false }}
            editProps={{
              disabled: selectedRows.length !== 1,
              onClick: handleEditCommission,
            }}
            deleteProps={{
              disabled: toolbarStatus.disabledOnNoSelected,
              onClick: () => {
                if (
                  selectedRows.filter((row) => +row.stateCode !== CommissionStatus.Draft).length > 0
                ) {
                  showToast(
                    formatMessage(
                      CommissionSettingMessages.someSelectedRecordsCannotBeDeletedAccordingToTheState,
                    ),
                    'error',
                  )
                  return
                }
                setDeleteDialogState({ show: true })
              },
            }}
            refreshProps={{ onClick: () => refreshGridData(true) }}
            items={toolbarMoreItems}
            {...props}
          />
        )}
      />

      <HBDialog
        content={formatMessage(CommissionSettingMessages.areYouSure).replace(
          'count',
          String(deleteDialogState?.id ? 1 : selectedRows.length),
        )}
        title={formatMessage(CommissionSettingMessages.deleteCommission)}
        onAccept={handleDelteCommission}
        onReject={() => setDeleteDialogState({ show: false, id: undefined })}
        open={deleteDialogState.show}
        onClose={() => setDeleteDialogState({ show: false, id: undefined })}
        acceptBtn={formatMessage(phrasesMessages.yes)}
        rejectBtn={formatMessage(phrasesMessages.no)}
      />
    </>
  )
}
