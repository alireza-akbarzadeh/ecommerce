import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { RefObject } from 'react'
import { DailyReportRowModal } from './DailyReportRowModal'
import { DialogType } from './IDailySaleReportFormModel'

type StatusItems = 'Notified' | 'NotNotified' | 'All' | 'Select'

type DownloadExcel = 'All' | 'Select'
type components = 'excel' | 'inform' | 'DownloadAUpdate'

interface IContentChangeInfo {
  statusItems: StatusItems
  handleCheckItem: (val: StatusItems) => void
  setDownload: (val: DownloadExcel) => void
  download: DownloadExcel
  components: components
}

interface IChangeInformationStatus {
  isDialog: DialogType
  setIsDialog: (val: DialogType) => void
  selectedRows: DailyReportRowModal[]
  gridRef: RefObject<HBDataGridClientRef>
  components: components
  handleDownloadPage: (
    isDownloadAll?: boolean,
    isRowSelect?: boolean,
    update?: 'Select' | 'All',
  ) => void
}

export type { DownloadExcel, components, StatusItems, IContentChangeInfo, IChangeInformationStatus }
