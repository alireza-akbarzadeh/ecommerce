import {
  GridFilterFieldType,
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { HBAgGridClasses, HBDataGrigToolbar, HBDialog } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { useRef } from 'react'
import { useIntl } from 'react-intl'
import workflowMessages from '../../HBWorkflow.messages'
import useWorkflowHistoryGridColumn from './useWorkflowHistoryGridColumn'

export type HBWorkflowHistoryProps = {
  entityId: string
  open: boolean
  onClose: () => void
}

const classes: HBAgGridClasses = {
  wrapper: {
    height: 500,
  },
}

export default function HBWorkflowHistory({ entityId, open, onClose }: HBWorkflowHistoryProps) {
  const { formatMessage } = useIntl()
  const actionUrl = `${process.env['NEXT_PUBLIC_GATEWAY']}/Admin/Audit/workflows?EntityId=${entityId}`
  const { columnDefs } = useWorkflowHistoryGridColumn()
  const gridRef = useRef<HBDataGridClientRef>(null)

  const handleChangedGridActions = (
    value: number | string | unknown,
    type: 'search' | 'status',
  ) => {
    if (type === 'search') {
      if (value) {
        const searchFields: GridFilterFieldType[] = [
          { field: 'ByUser', value: String(value), operator: 'contains' },
          { field: 'PostScript', value: String(value), operator: 'contains' },
          { field: 'Reason', value: String(value), operator: 'contains' },
        ]
        gridRef.current!.addFilter({
          id: 'searchWorkflowHistory',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef.current!.removeFilter('searchWorkflowHistory')
      }
    }
  }

  if (!open) return null

  return (
    <HBDialog
      open={open}
      title={formatMessage(workflowMessages.workflowHistoryTitle)}
      onClose={onClose}
      onReject={onClose}
    >
      <Box width={1000} sx={{ maxWidth: '100%' }} height={600}>
        <HBDataGridClient
          actionUrl={entityId ? actionUrl : ''}
          columnDefs={columnDefs}
          pagination
          paginationPageSize={25}
          rowGroupPanelShow={'always'}
          enableRtl
          classes={classes}
          ref={gridRef}
          GridToolbar={() => (
            <HBDataGrigToolbar
              onChange={handleChangedGridActions}
              addProps={{ show: false }}
              deleteProps={{
                show: false,
              }}
              editProps={{ show: false }}
              moreProps={{ show: false }}
              statusProps={{ show: false }}
              searchProps={{ show: true, openPosition: 'right' }}
            ></HBDataGrigToolbar>
          )}
        />
      </Box>
    </HBDialog>
  )
}
