import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { usePostAdminReportOrderDetailInfromDateMutation } from '@hasty-bazar/admin-shared/services/reportApi.generated'
import { openToast } from '@hasty-bazar/core'
import { RefObject } from 'react'
import { useIntl } from 'react-intl'
import ReportDailySaleMessages from '../../ReportDailySale.messages'
import { StatusItems } from '../../types/Content'
import { DailyReportRowModal } from '../../types/DailyReportRowModal'
import { DialogType } from '../../types/IDailySaleReportFormModel'

interface IUseHandleInformDate {
  statusItems?: StatusItems
  gridRef: RefObject<HBDataGridClientRef>
  setIsDialog: (val: DialogType) => void
  selectedRows: DailyReportRowModal[]
}

const useHandleInformDate = ({
  gridRef,
  setIsDialog,
  statusItems,
  selectedRows,
}: IUseHandleInformDate) => {
  const { formatMessage } = useIntl()

  const [postAdminReportOrderDetailInfromDate] = usePostAdminReportOrderDetailInfromDateMutation()
  const handleInformDate = async (update?: 'All' | 'Select') => {
    const ids = selectedRows?.map((row) => row?.orderItemId?.toString())
    if (update) {
      await postAdminReportOrderDetailInfromDate({
        'client-name': '',
        'client-version': '',
        setInformModel: {
          ids: update !== 'All' ? ids : [],
          setInformed: update === 'All' ? undefined : true,
        },
      }).then((res: any) => {
        if (res?.error) return
        setIsDialog(false)
        openToast({ message: formatMessage(ReportDailySaleMessages.informate), type: 'success' })
        gridRef?.current!.api.deselectAll()
      })
    } else
      await postAdminReportOrderDetailInfromDate({
        'client-name': '',
        'client-version': '',
        setInformModel: {
          ids: statusItems !== 'All' ? ids : [],
          setInformed: statusItems === 'All' ? undefined : statusItems === 'Notified',
        },
      }).then((res: any) => {
        if (res?.error) return
        setIsDialog(false)
        openToast({ message: formatMessage(ReportDailySaleMessages.informate), type: 'success' })
        gridRef?.current!.api.deselectAll()
      })
  }

  return [handleInformDate]
}

export default useHandleInformDate
