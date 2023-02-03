import HBGrid, {
  GridFilterFieldType,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid/HBDataGridClient'
import { DownloadMethodType } from '@hasty-bazar/admin-shared/containers/HBDataGrid/useDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  TimeIntervalType,
  useDeleteAdminGeneralDataProcessesByProcessIdUpdateMessageTemplateSettingsAndIdMutation,
  usePostAdminGeneralDataProcessesByProcessIdAddMessageTemplateSettingsMutation,
  usePostAdminGeneralDataProcessesDownloadExcelFileMutation,
  usePutAdminGeneralDataProcessesByProcessIdUpdateMessageTemplateSettingsAndMessageIdMutation,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { randomString } from '@hasty-bazar/admin-shared/utils/randomString'
import { HBAgGridClasses, HBDataGrigToolbar, HBDialog, openToast } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { ColDef } from 'ag-grid-community'
import { useRouter } from 'next/router'
import { FC, useCallback, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import ProcessPageMessages from '../ProcessPage.messages'
import useProcessRelatedMessage from './hooks/useProcessRelatedMessage'
import ProcessRelatedMessageDetailDialog from './ProcessRelatedMessageComponent/ProcessRelatedMessageDetailDialog'
import { ProcessRelatedMessageDetailFormModel } from './ProcessRelatedMessageComponent/ProcessRelatedMessageDetailForm'

const classes: HBAgGridClasses = {
  wrapper: {
    height: 380,
  },
}

const ProcessRelatedMessage: FC = () => {
  const { formatMessage } = useIntl()
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const [deleteDialogState, setDeleteDialogState] = useState<{ show: boolean; id?: number }>({
    show: false,
  })
  const [openProcessRelatedMessageFormDialog, setOpenProcessRelatedMessageFormDialog] =
    useState<boolean>(false)
  const [isAdd, setIsAdd] = useState<boolean>(false)
  const [reRender, setReRender] = useState<string>('')
  const router = useRouter()
  const id = router.query.id?.[0]
  const gridRef = useRef<HBDataGridClientRef>(null)
  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/GeneralData/Processes/get-process-message-settings/${id}`

  const [addMessageTemplateSettings] =
    usePostAdminGeneralDataProcessesByProcessIdAddMessageTemplateSettingsMutation()
  const [updateMessageTemplateSettings] =
    usePutAdminGeneralDataProcessesByProcessIdUpdateMessageTemplateSettingsAndMessageIdMutation()
  const [deleteMessageTemplateSettings] =
    useDeleteAdminGeneralDataProcessesByProcessIdUpdateMessageTemplateSettingsAndIdMutation()
  const gridLoading = (show: boolean) => {
    if (show) {
      gridRef.current!.api.showLoadingOverlay()
    } else {
      gridRef.current!.api.hideOverlay()
    }
  }

  const handleDeleteCollection = useCallback(async () => {
    try {
      const ids = deleteDialogState?.id
        ? [deleteDialogState?.id]
        : selectedRows.map((row) => row.id)

      ids.map((messageId) => {
        deleteMessageTemplateSettings({
          'client-name': 'Swagger on HIT.Hastim.GeneralData.Endpoints.AdminApi',
          'client-version': '1.0.1.100',
          processId: id!,
          id: messageId,
        }).then((res) => {
          gridLoading(true)
          setDeleteDialogState({ show: false, id: undefined })
          openToast({
            message: formatMessage(ProcessPageMessages.successDelete),
            type: 'success',
          })
          refreshGridData()
          gridLoading(false)
        })
      })
    } catch (e) {
      gridLoading(false)
      openToast({ message: formatMessage(ProcessPageMessages.errorOnDelete), type: 'error' })
    }
  }, [selectedRows, deleteDialogState])

  const onDelete = (show: boolean, id: number) => {
    setDeleteDialogState({ show, id })
  }

  const handleProcessRelatedMessageValue = () => {
    setOpenProcessRelatedMessageFormDialog(true)
    setIsAdd(true)
    setReRender(randomString(6))
  }

  const handleEditProcessRelatedMessage = () => {
    setOpenProcessRelatedMessageFormDialog(true)
    setIsAdd(false)
    setReRender(randomString(6))
  }

  const { columnDefs } = useProcessRelatedMessage(
    gridRef,
    selectedRows,
    onDelete,
    handleEditProcessRelatedMessage,
  )

  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerCheckboxSelection: true,
      cellRenderer: 'agGroupCellRenderer',
    }
  }, [])

  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    gridRef?.current?.refreshGridData(isClearSearch)
    gridRef?.current!.api?.deselectAll()
  }, [])

  const handleChangedSelectedRows = (selectedRows: any[]) => {
    setSelectedRows(selectedRows)
  }

  const handleSubmitProcessRelatedMessageValue = (values: ProcessRelatedMessageDetailFormModel) => {
    if (!isAdd) {
      updateMessageTemplateSettings({
        'client-name': 'Swagger on HIT.Hastim.GeneralData.Endpoints.AdminApi',
        'client-version': '1.0.1.100',
        updateProcessMessageTemplateSettingModel: {
          interval: (values.interval as any)?.fullCode as TimeIntervalType,
          isRepeatable: values.isRepeatable,
          sendAfterMinute: values.sendAfterMinute ? values.sendAfterMinute : null,
          sendImmediately: values.sendImmediately ? values.sendImmediately : false,
          startDateTime: values?.startDateTime
            ? new Date(
                values?.startDateTime?.toLocaleDateString() +
                  ' ' +
                  values.sendStartTime?.toLocaleTimeString(),
              ).toISOString()
            : null,
          endDateTime: values?.endDateTime
            ? new Date(
                values?.endDateTime?.toLocaleDateString() +
                  ' ' +
                  values.sendEndTime?.toLocaleTimeString(),
              ).toISOString()
            : null,
          startTime: values.startTime,
          endTime: values.endTime,
        },
        processId: id!,
        messageId: (values?.messageId as any)?.id,
        id: selectedRows[0].id,
      }).then((res: any) => {
        if (res?.data?.success) {
          setOpenProcessRelatedMessageFormDialog(false)
          refreshGridData()
          openToast({ type: 'success', message: formatMessage(phrasesMessages.successUpdate) })
        }
      })
    } else {
      addMessageTemplateSettings({
        'client-name': 'Swagger on HIT.Hastim.GeneralData.Endpoints.AdminApi',
        'client-version': '1.0.1.100',
        addProcessMessageTemplateSettingModel: {
          interval: (values.interval as any)?.fullCode as TimeIntervalType,
          messageId: (values?.messageId as any)?.id,
          isRepeatable: values.isRepeatable,
          sendAfterMinute: values.sendAfterMinute ? values.sendAfterMinute : null,
          sendImmediately: values.sendImmediately ? values.sendImmediately : false,
          startDateTime: values?.startDateTime
            ? new Date(
                values?.startDateTime?.toLocaleDateString() +
                  ' ' +
                  values.sendStartTime?.toLocaleTimeString(),
              ).toISOString()
            : null,
          endDateTime: values?.endDateTime
            ? new Date(
                values?.endDateTime?.toLocaleDateString() +
                  ' ' +
                  values.sendEndTime?.toLocaleTimeString(),
              ).toISOString()
            : null,
          startTime: values.startTime,
          endTime: values.endTime,
        },
        processId: id!,
      }).then((res: any) => {
        if (res?.data?.success) {
          setOpenProcessRelatedMessageFormDialog(false)
          refreshGridData()
          openToast({ type: 'success', message: formatMessage(phrasesMessages.successAdd) })
        }
      })
    }
  }

  const toolbarStatus = useMemo(() => {
    const disabledOnSelected = selectedRows.length > 0
    const disabledOnNoSelected = selectedRows.length === 0

    return { disabledOnSelected, disabledOnNoSelected }
  }, [selectedRows])

  const handleChangedGridActions = (value: number | string, type: 'search' | 'status') => {
    if (type === 'status') {
      let filterComponent = gridRef.current!.api.getFilterInstance('status')
      filterComponent &&
        filterComponent.setModel({
          type: 'equals',
          filter: value !== -1 ? value : null,
        })
      gridRef.current!.api.onFilterChanged()
    } else if (type === 'search') {
      if (value) {
        const searchFields: GridFilterFieldType[] = [
          { field: 'MessageName', operator: 'contains', value: String(value) },
        ]
        gridRef.current!.addFilter({
          id: 'searchProcessRelatedMessage',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef.current!.removeFilter('searchProcessRelatedMessage')
      }
    }
  }

  const [downloadFile] = usePostAdminGeneralDataProcessesDownloadExcelFileMutation()

  const handleDownload = async (props: DownloadMethodType) => {
    const { filterFields, ...res } = props
    return await downloadFile({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      getProcessExcelQueryFilter: {
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

  return (
    <>
      <Box sx={{ height: 500 }} key={id}>
        {id && (
          <HBGrid
            actionUrl={actionUrl}
            columnDefs={columnDefs}
            rowSelection="multiple"
            pagination
            paginationPageSize={25}
            enableRtl
            sideBar
            classes={classes}
            autoGroupColumnDef={autoGroupColumnDef}
            detailRowAutoHeight
            ref={gridRef}
            onDoubleClick={() => {
              handleEditProcessRelatedMessage()
            }}
            onSelectedChanged={handleChangedSelectedRows}
            GridToolbar={(props) => (
              <HBDataGrigToolbar
                onChange={handleChangedGridActions}
                addProps={{
                  disabled: toolbarStatus.disabledOnSelected,
                  onClick: handleProcessRelatedMessageValue,
                }}
                deleteProps={{
                  disabled: toolbarStatus.disabledOnNoSelected,
                  onClick: () => {
                    setDeleteDialogState({ show: true })
                  },
                }}
                editProps={{
                  disabled: selectedRows.length !== 1,
                  onClick: handleEditProcessRelatedMessage,
                }}
                refreshProps={{ onClick: () => refreshGridData(true) }}
                searchProps={{ show: true }}
                moreProps={{ show: true }}
                items={[
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
                ]}
                {...props}
              />
            )}
          />
        )}
      </Box>
      <ProcessRelatedMessageDetailDialog
        open={openProcessRelatedMessageFormDialog}
        onClose={() => {
          setOpenProcessRelatedMessageFormDialog(false)
        }}
        onSubmit={handleSubmitProcessRelatedMessageValue}
        processRelatedMessageDetailFormModel={selectedRows.length > 0 ? selectedRows[0] : {}}
        isAdd={isAdd}
        key={reRender}
      />
      <HBDialog
        content={formatMessage(ProcessPageMessages.areYouSure).replace(
          'count',
          String(deleteDialogState?.id ? 1 : selectedRows.length),
        )}
        title={formatMessage(ProcessPageMessages.deleteProcessRelatedMessage)}
        onAccept={handleDeleteCollection}
        onReject={() => setDeleteDialogState({ show: false, id: undefined })}
        open={deleteDialogState.show}
        onClose={() => setDeleteDialogState({ show: false, id: undefined })}
        acceptBtn={formatMessage(phrasesMessages.delete)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
    </>
  )
}

export default ProcessRelatedMessage
