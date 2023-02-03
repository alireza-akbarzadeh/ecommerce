import { HBDataGridClient } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { Box } from '@mui/material'
import { FC } from 'react'
import { ChangeInformationStatus } from '../../components'
import { DailySaleReport } from '../../enums/DailySaleReportEnums'
import { useReportDetailedDailySaleController, useToolbar } from '../../hooks'
import { IReportDetailedDailySaleGrid } from '../../types/IReportDetailedDailySaleGrid'

const ReportDetailedDailySaleGrid: FC<IReportDetailedDailySaleGrid> = ({
  saleReport,
  formWatch,
  setSaleReport,
  setPagination,
  fromValues,
}) => {
  const {
    detailedDailySaleColumns,
    summarizeDailySaleColumns,
    formatMessage,
    classes,
    handleChangedSelectedRows,
    gridRef,
    selectedRows,
    summarizePin,
    detailedPin,
    handleOnGrigReady,
  } = useReportDetailedDailySaleController({ saleReport, setSaleReport, setPagination, fromValues })

  const { toolBar, isDialog, setIsDialog, handleDownloadPage } = useToolbar({
    selectedRows,
    gridRef,
    formWatch,
  })

  return (
    <>
      <Box height={720}>
        <HBDataGridClient
          pagination
          sideBar
          enableRtl
          serverSideSortingAlwaysResets
          serverSideFilteringAlwaysResets
          rowSelection={'multiple'}
          actionUrl={''}
          rowGroupPanelShow={'always'}
          paginationPageSize={10}
          ref={gridRef}
          columnDefs={
            formWatch?.dataType?.id === DailySaleReport.Summarized
              ? detailedDailySaleColumns
              : summarizeDailySaleColumns
          }
          rowData={saleReport?.items || []}
          totalRows={saleReport?.totalItems}
          classes={classes}
          onSelectedChanged={handleChangedSelectedRows}
          detailCellRendererParams={{ title: formatMessage(phrasesMessages.details) }}
          GridToolbar={toolBar}
          onGridReady={handleOnGrigReady}
          pinnedBottomRowData={
            formWatch?.dataType?.id === DailySaleReport.Summarized ? detailedPin : summarizePin
          }
        />
      </Box>
      <ChangeInformationStatus
        components={
          isDialog === 'excel' ? 'excel' : isDialog === 'inform' ? 'inform' : 'DownloadAUpdate'
        }
        {...{ isDialog, selectedRows, setIsDialog, gridRef, handleDownloadPage }}
      />
    </>
  )
}

export default ReportDetailedDailySaleGrid
