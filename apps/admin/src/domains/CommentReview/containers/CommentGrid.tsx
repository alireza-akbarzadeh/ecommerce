import {
  GridFilterFieldType,
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { DownloadMethodType } from '@hasty-bazar/admin-shared/containers/HBDataGrid/useDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { usePostAdminSocialCommentsDownloadExcelFileMutation } from '@hasty-bazar/admin-shared/services/socialApi.generated'
import { useGetWorkflowStateMachineByStateMachineIdStateQuery } from '@hasty-bazar/admin-shared/services/workflowApi.generated'
import { HBAutoComplete, HBDataGrigToolbar, HBTextField, MenuItemProps } from '@hasty-bazar/core'
import { Box, inputLabelClasses, outlinedInputClasses } from '@mui/material'
import { useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import CommentMessages from '../CommentPage.messages'
import CommentCard from '../components/CommentCard'
import useGridData from '../hooks/useCommentGridData'

export default function CommentGrid() {
  const { formatMessage } = useIntl()
  const [selectedState, setSelectedState] = useState(-1)
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const handleChangedSelectedRows = (selectedRows: any[]) => setSelectedRows(selectedRows)

  const gridRef = useRef<HBDataGridClientRef>(null)

  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/Social/comments`

  const { refreshGridData, classes, columnDefs, autoGroupColumnDef } = useGridData({
    gridRef,
    selectedRows,
  })

  const handleChangedGridActions = (
    value: number | string | unknown,
    type: 'search' | 'status',
  ) => {
    if (type === 'search') {
      if (value) {
        const searchFields: GridFilterFieldType[] = [
          { field: 'ProductName', operator: 'contains', value: String(value) },
          { field: 'Subject', operator: 'contains', value: String(value) },
          { field: 'PartyFullName', operator: 'contains', value: String(value) },
          { field: 'Body', operator: 'contains', value: String(value) },
        ]
        gridRef.current!.addFilter({
          id: 'searchComments',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef.current!.removeFilter('searchComments')
      }
    } else if (type === 'status') {
      let filterComponent = gridRef.current!.api.getFilterInstance('stateCode')
      filterComponent &&
        filterComponent.setModel({
          type: 'equals',
          filter: value !== '-1' ? value : null,
        })
      gridRef.current!.api.onFilterChanged()
    }
  }

  const [downloadFile] = usePostAdminSocialCommentsDownloadExcelFileMutation()

  const handleDownload = async (props: DownloadMethodType) => {
    const { filterFields, ...res } = props
    return await downloadFile({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      getAllCommentsExcelQueryFilter: {
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

  const { data: { data: { items: workflowItems = [] } = {} } = {} } =
    useGetWorkflowStateMachineByStateMachineIdStateQuery({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      stateMachineId: '1029687454610751488',
    })
  return (
    <Box bgcolor="common.white" p={0} border="unset" borderRadius={4} height={430}>
      <HBDataGridClient
        masterDetail
        detailCellRenderer={CommentCard}
        detailCellRendererParams={{ isDetailsGrid: true }}
        actionUrl={actionUrl}
        columnDefs={columnDefs}
        classes={classes}
        pagination
        paginationPageSize={25}
        enableRtl
        detailRowAutoHeight
        sideBar
        rowSelection={'multiple'}
        autoGroupColumnDef={autoGroupColumnDef}
        onSelectedChanged={handleChangedSelectedRows}
        rowGroupPanelShow={'always'}
        ref={gridRef}
        GridToolbar={(props) => (
          <HBDataGrigToolbar
            onChange={handleChangedGridActions}
            statusProps={{ show: false }}
            addProps={{ show: false }}
            searchProps={{ show: true, openPosition: 'right', inputWidth: 220 }}
            deleteProps={{ show: false }}
            editProps={{ show: false }}
            items={toolbarMoreItems}
            refreshProps={{ onClick: () => refreshGridData(true) }}
            {...props}
          >
            <HBAutoComplete
              value={selectedState}
              onChange={(event, newValue) => {
                setSelectedState(newValue)
                handleChangedGridActions(newValue?.value || '', 'status')
              }}
              options={
                workflowItems?.map((item) => ({
                  title: String(item.title),
                  value: item.code || 0,
                })) || []
              }
              getOptionLabel={(option: any) => option.title || ''}
              renderInput={(params) => (
                <HBTextField
                  {...params}
                  label={formatMessage(CommentMessages.workflowTitle)}
                  sx={{
                    height: 33,
                    minWidth: 150,
                    [`& .${inputLabelClasses.root}`]: {
                      top: -4,
                    },
                    [`& .${outlinedInputClasses.root}`]: {
                      height: 33,
                    },
                    [`& .${outlinedInputClasses.input}`]: {
                      position: 'relative',
                      top: -4,
                    },
                  }}
                />
              )}
              size="small"
              disabled={false}
            />
          </HBDataGrigToolbar>
        )}
      />
    </Box>
  )
}
