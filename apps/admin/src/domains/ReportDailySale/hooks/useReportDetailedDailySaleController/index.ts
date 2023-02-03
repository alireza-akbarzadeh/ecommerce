import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import {
  DailyReportDataType,
  DailyReportDateType,
  DailyReportInformingType,
  GetDailyReportQueryFilter,
  usePostAdminReportOrderDetailDailyReportMutation,
} from '@hasty-bazar/admin-shared/services/reportApi.generated'
import { HBAgGridClasses } from '@hasty-bazar/core'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import ReportDailySaleMessages from '../../ReportDailySale.messages'
import { DailyReportRowModal } from '../../types/DailyReportRowModal'
import { IReportDetailedDailySaleGrid } from '../../types/IReportDetailedDailySaleGrid'
import useReportDetailedDailySaleColumns from '../useReportDetailedDailySaleColumns'
import useReportSummarizeDailySaleColumns from '../useReportSummarizeDailySaleColumns'

const classes: HBAgGridClasses = {
  wrapper: {
    height: 630,
  },
}
const useReportDetailedDailySaleController = ({
  saleReport,
  setSaleReport,
  setPagination,
  fromValues,
}: IReportDetailedDailySaleGrid) => {
  const [selectedRows, setSelectedRows] = useState<DailyReportRowModal[]>([])
  const { formatMessage } = useIntl()
  const gridRef = useRef<HBDataGridClientRef>(null)

  const handleChangedSelectedRows = (selectedRows: DailyReportRowModal[]) => {
    setSelectedRows(selectedRows)
  }

  const [postAdminReportOrderDetailDailyReport] = usePostAdminReportOrderDetailDailyReportMutation()

  const handleOnGrigReady = useCallback((params?: any) => {
    const createStatus = fromValues?.current?.statusCodes?.map((item) => item.code) as []
    const data: GetDailyReportQueryFilter = {
      dateType: Number(fromValues?.current?.dateType?.id) as DailyReportDateType,
      dataType: Number(fromValues?.current?.dataType?.id) as DailyReportDataType,
      informingType: Number(fromValues?.current?.informingType?.id) as DailyReportInformingType,
      statusCodes: createStatus?.length > 0 ? createStatus : undefined,
      startDate: fromValues?.current?.startDate,
      endDate: fromValues?.current?.endDate,
      pageNumber: params?.PageNumber,
      pageSize: params?.PageSize,
      ...(params?.Filter ? { filter: params?.Filter } : {}),
      ...(params?.Ordering ? { ordering: params?.Ordering } : {}),
    }
    setPagination({
      pageNumber: params.PageNumber,
      pageSize: params.PageSize,
    })
    postAdminReportOrderDetailDailyReport({
      'client-name': '',
      'client-version': '',
      getDailyReportQueryFilter: data,
    }).then((res: any) => {
      if (res?.error) return
      setSaleReport(res?.data?.data)
    })
  }, [])

  const { columnDefs: detailedDailySaleColumns } = useReportDetailedDailySaleColumns({
    selectedRows,
  })
  const { columnDefs: summarizeDailySaleColumns } = useReportSummarizeDailySaleColumns({
    selectedRows,
  })

  const detailedPin = useMemo(
    () => [
      {
        vendorName: formatMessage(ReportDailySaleMessages.totalOnThePage),
        totalPayablePrice: saleReport?.pageTotalPayablePrice ?? 0,
        vatPrice: saleReport?.pageTotalVatPrice ?? 0,
        commissionPrice: saleReport?.pageTotalCommission ?? 0,
        productTotalPrice: saleReport?.pageTotalFinalPrice ?? 0,
        vendorShippingShare: saleReport?.pageTotalShippingShare ?? 0,
      },
      {
        vendorName: formatMessage(ReportDailySaleMessages.total),
        totalPayablePrice: saleReport?.totalPayablePrice ?? 0,
        vatPrice: saleReport?.totalVatPrice ?? 0,
        commissionPrice: saleReport?.totalCommission ?? 0,
        productTotalPrice: saleReport?.totalFinalPrice ?? 0,
        vendorShippingShare: saleReport?.totalShippingShare ?? 0,
      },
    ],
    [saleReport],
  )
  const summarizePin = useMemo(
    () => [
      {
        vendorName: formatMessage(ReportDailySaleMessages.totalOnThePage),
        totalPayablePrice: saleReport?.pageTotalPayablePrice ?? 0,
        totalCommissionPrice: saleReport?.pageTotalCommission ?? 0,
        totalVATPrice: saleReport?.pageTotalVatPrice ?? 0,
        totalFinalPrice: saleReport?.pageTotalFinalPrice ?? 0,
        totalVendorShare: saleReport?.pageTotalVendorShare ?? 0,
        totalDiscountPrice: saleReport?.pageTotalDiscountPrice ?? 0,
        totalOriginalPrice: saleReport?.pageTotalOriginalPrice ?? 0,
        shippingShare: saleReport?.pageTotalShippingShare ?? 0,
      },
      {
        vendorName: formatMessage(ReportDailySaleMessages.total),
        totalPayablePrice: saleReport?.totalPayablePrice ?? 0,
        totalDiscountPrice: saleReport?.totalDiscountPrice ?? 0,
        totalVATPrice: saleReport?.totalVatPrice ?? 0,
        totalCommissionPrice: saleReport?.totalCommission ?? 0,
        totalFinalPrice: saleReport?.totalFinalPrice ?? 0,
        totalVendorShare: saleReport?.totalVendorShare ?? 0,
        totalOriginalPrice: saleReport?.totalOriginalPrice ?? 0,
        shippingShare: saleReport?.totalShippingShare ?? 0,
      },
    ],
    [saleReport],
  )
  return {
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
  }
}
export default useReportDetailedDailySaleController
