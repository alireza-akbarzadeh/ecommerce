import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  DailyReportDataType,
  DailyReportDateType,
  DailyReportInformingType,
  GetDailyReportQueryFilter,
  usePostAdminReportOrderDetailDailyReportMutation,
} from '@hasty-bazar/admin-shared/services/reportApi.generated'
import { useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useIntl } from 'react-intl'
import DailySaleReportMessage from '../../ReportDailySale.messages'
import { IDailySaleReportFormModel } from '../../types/IDailySaleReportFormModel'
import { IUseReportDetailedDailySaleController } from '../../types/IReportDetailedDailySaleGrid'

const useDailySaleReportPageController = ({
  setSaleReport,
}: IUseReportDetailedDailySaleController) => {
  const [listenForm, setListenForm] = useState<boolean>(false)
  const [expandable, setIsExpandable] = useState<boolean>(true)
  const [pagination, setPagination] = useState<{ pageSize: number; pageNumber: number }>({
    pageSize: 15,
    pageNumber: 1,
  })
  const { formatMessage } = useIntl()

  const breadcrumbs = [
    {
      url: '/',
      title: formatMessage(phrasesMessages.admin),
    },
    {
      url: '/dailySaleReport',
      title: formatMessage(DailySaleReportMessage.dailySaleReport),
    },
  ]

  const formProvider = useForm<IDailySaleReportFormModel>({ mode: 'all' })
  const { control, setValue, reset } = formProvider
  const formWatch = useWatch<IDailySaleReportFormModel>({
    control,
  })

  const [postAdminReportOrderDetailDailyReport] = usePostAdminReportOrderDetailDailyReportMutation()

  const fromValues = useRef<IDailySaleReportFormModel | null>()

  const handleSubmit = (values: IDailySaleReportFormModel) => {
    fromValues.current = values
    const createStatus = values?.statusCodes?.map((item) => item.code) as []
    const data: GetDailyReportQueryFilter = {
      dateType: Number(values?.dateType?.id) as DailyReportDateType,
      dataType: Number(values?.dataType?.id) as DailyReportDataType,
      informingType: Number(values?.informingType?.id) as DailyReportInformingType,
      statusCodes: createStatus?.length > 0 ? createStatus : undefined,
      startDate: values.startDate,
      endDate: values.endDate,
      pageNumber: pagination.pageNumber,
      pageSize: pagination.pageSize,
    }

    postAdminReportOrderDetailDailyReport({
      'client-name': '',
      'client-version': '',
      getDailyReportQueryFilter: data,
    }).then((res: any) => {
      if (res?.error) return
      setSaleReport(res?.data?.data)
      setListenForm(res?.data?.success)
      setIsExpandable(false)
    })
  }
  return {
    breadcrumbs,
    handleSubmit,
    formatMessage,
    formProvider,
    formWatch,
    listenForm,
    setListenForm,
    setValue,
    expandable,
    setIsExpandable,
    reset,
    setPagination,
    fromValues,
  }
}

export default useDailySaleReportPageController
