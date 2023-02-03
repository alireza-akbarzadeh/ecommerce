import { HBChangeRecordHistory } from '@hasty-bazar/admin-shared/containers/HBChangeRecordHistory'
import {
  GridFilterFieldType,
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { DownloadMethodType } from '@hasty-bazar/admin-shared/containers/HBDataGrid/useDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  ApiResult,
  GetQuestionsQueryResult,
  useDeleteAdminCatalogFaqsQuestionByIdMutation,
  usePostAdminCatalogFaqsDownloadExcelFileMutation,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { HBDataGrigToolbar, HBDialog, MenuItemProps, openToast } from '@hasty-bazar/core'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import FaqPageMessages from '../FaqPage.messages'
import useGridData from '../hooks/useFaqGridData'

export default function FaqGrid() {
  const [selectedRows, setSelectedRows] = useState<GetQuestionsQueryResult[]>([])
  const [recordChangeHistory, setRecordChangeHistory] = useState({
    show: false,
    entityId: '',
  })
  const { formatMessage } = useIntl()
  const router = useRouter()
  const gridRef = useRef<HBDataGridClientRef>(null)
  const questionCategoryId = router.query.questionCategoryId

  const [deleteDialogState, setDeleteDialogState] = useState<{ show: boolean; id?: string }>({
    show: false,
  })

  const actionUrl = `${
    process.env.NEXT_PUBLIC_GATEWAY
  }/Admin/Catalog/Faqs/question?QuestionCategoryId=${questionCategoryId ?? ''}`

  const handleEditFAQ = (id?: string) => {
    id = typeof id === 'string' ? id : selectedRows[0]?.id
    router.push(`/faq/edit/?questionCategoryId=${questionCategoryId}&id=${id}`)
  }
  const handleChangedSelectedRows = (selectedRows: GetQuestionsQueryResult[]) =>
    setSelectedRows(selectedRows)

  const handleAddFAQ = () => router.push(`/faq/create/?questionCategoryId=${questionCategoryId}`)

  const { gridLoading, refreshGridData, classes, columnDefs, autoGroupColumnDef } = useGridData({
    gridRef,
    handleEditFAQ,
    setDeleteDialogState,
    selectedRows,
    setRecordChangeHistory,
  })
  const [deleteFaq] = useDeleteAdminCatalogFaqsQuestionByIdMutation()
  const handleDeleteFaqs = useCallback(async () => {
    try {
      const ids = deleteDialogState?.id
        ? [deleteDialogState?.id]
        : selectedRows.map((row) => row.id)
      let responses = []
      const requests = ids.map((id) => {
        return deleteFaq({
          'client-name': 'hasty-bazar-admin',
          'client-version': '1.0.0',
          id: id as string,
        }).then((res) => res)
      })
      gridLoading(true)
      setDeleteDialogState({ show: false, id: undefined })
      refreshGridData()
      gridLoading(false)
      responses = await Promise.all(requests)
      const success = responses.filter((res: { data: ApiResult }) => res?.data?.success).length

      if (success > 0) {
        openToast({
          message: formatMessage(FaqPageMessages.successDelete, {
            count: selectedRows.length,
          }),
          type: 'success',
        })
      }
    } catch (e) {}
  }, [selectedRows, deleteDialogState])

  const handleChangedGridActions = (
    value: number | string | unknown,
    type: 'search' | 'status',
  ) => {
    if (type === 'search') {
      if (value) {
        const searchFields: GridFilterFieldType[] = [
          { field: 'QuestionText', operator: 'contains', value: String(value) },
          { field: 'ShortAnswer', operator: 'contains', value: String(value) },
          { field: 'QuestionUsageTypeCodeTitle', operator: 'contains', value: String(value) },
        ]
        gridRef.current!.addFilter({
          id: 'searchFAQ',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef.current!.removeFilter('searchFAQ')
      }
    }
  }
  const [downloadFile] = usePostAdminCatalogFaqsDownloadExcelFileMutation()

  const handleDownload = async (props: DownloadMethodType) => {
    const { filterFields, ...res } = props
    return await downloadFile({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      getExcelQuestionsQueryFilter: {
        ...res,
        ...filterFields,
        questionCategoryId: questionCategoryId as string,
      },
    })
  }

  const handleDownloadPage = (isDownloadAll?: boolean) => {
    gridRef.current?.downloadGridData({
      downloadFileMethod: handleDownload,
      downloadAll: isDownloadAll,
    })
  }
  const toolbarMoreItems = useMemo((): MenuItemProps[] => {
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
    <>
      <HBDataGridClient
        actionUrl={actionUrl}
        editUrl={`/faq/edit/?questionCategoryId=${questionCategoryId}&id=`}
        columnDefs={columnDefs}
        classes={classes}
        pagination
        paginationPageSize={25}
        enableRtl
        detailRowAutoHeight
        sideBar
        rowSelection="multiple"
        autoGroupColumnDef={autoGroupColumnDef}
        onSelectedChanged={handleChangedSelectedRows}
        rowGroupPanelShow={'always'}
        ref={gridRef}
        GridToolbar={(props) => (
          <HBDataGrigToolbar
            onChange={handleChangedGridActions}
            statusProps={{ show: false }}
            addProps={{
              disabled: selectedRows.length > 0 || !questionCategoryId,
              onClick: handleAddFAQ,
            }}
            deleteProps={{
              disabled: selectedRows.length === 0 || !questionCategoryId,
              onClick: () => setDeleteDialogState({ show: true }),
            }}
            editProps={{
              disabled: selectedRows.length !== 1 || !questionCategoryId,
              onClick: handleEditFAQ,
            }}
            moreProps={{ show: true, disabled: !questionCategoryId }}
            searchProps={{ show: true, disabled: !questionCategoryId }}
            refreshProps={{ onClick: () => refreshGridData(), disabled: !questionCategoryId }}
            {...props}
            items={toolbarMoreItems}
          />
        )}
      />

      <HBDialog
        content={formatMessage(FaqPageMessages.confirmDelete, {
          count: String(deleteDialogState?.id ? 1 : selectedRows.length),
        })}
        title={formatMessage(FaqPageMessages.deleteFaq)}
        onAccept={handleDeleteFaqs}
        onReject={() => setDeleteDialogState({ show: false, id: undefined })}
        open={deleteDialogState.show}
        onClose={() => setDeleteDialogState({ show: false, id: undefined })}
        acceptBtn={formatMessage(phrasesMessages.delete)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
      <HBChangeRecordHistory
        open={recordChangeHistory.show}
        entityId={recordChangeHistory.entityId!}
        onClose={() => setRecordChangeHistory({ show: false, entityId: '' })}
        tableName="Question"
      />
    </>
  )
}
