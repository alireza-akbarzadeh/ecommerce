import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { HBDialog } from '@hasty-bazar/core'
import { FC, useState } from 'react'
import { useIntl } from 'react-intl'
import { useHandleInformDate } from '../../hooks'
import ReportDailySaleMessages from '../../ReportDailySale.messages'
import { DownloadExcel, IChangeInformationStatus, StatusItems } from '../../types/Content'
import ContentChangeInfo from '../ContentChangeInfo'

const ChangeInformationStatus: FC<IChangeInformationStatus> = ({
  isDialog,
  setIsDialog,
  selectedRows,
  gridRef,
  components,
  handleDownloadPage,
}) => {
  const [statusItems, setStatusItems] = useState<StatusItems>('All')
  const [download, setDownload] = useState<DownloadExcel>('All')
  const { formatMessage } = useIntl()
  const handleCheckItem = (value: StatusItems) => {
    setStatusItems(value)
  }

  const [handleInformDate] = useHandleInformDate({
    gridRef,
    selectedRows,
    setIsDialog,
    statusItems,
  })

  return (
    <HBDialog
      title={formatMessage(
        isDialog === 'inform'
          ? ReportDailySaleMessages.changeStateStatus
          : isDialog === 'excel'
          ? ReportDailySaleMessages.downloadExcel
          : ReportDailySaleMessages.reporting,
      )}
      onAccept={
        isDialog === 'inform'
          ? () => handleInformDate()
          : isDialog === 'excel'
          ? () => handleDownloadPage(download === 'All', download === 'Select')
          : () => handleDownloadPage(download === 'All', download === 'Select', download)
      }
      onClose={() => setIsDialog(false)}
      onReject={() => setIsDialog(false)}
      open={isDialog === 'excel' || isDialog === 'inform' || isDialog === 'DownloadAUpdate'}
      acceptBtn={formatMessage(phrasesMessages.save)}
      rejectBtn={formatMessage(phrasesMessages.cancel)}
    >
      <ContentChangeInfo
        {...{ download, handleCheckItem, setDownload, statusItems, components, selectedRows }}
      />
    </HBDialog>
  )
}

export default ChangeInformationStatus
