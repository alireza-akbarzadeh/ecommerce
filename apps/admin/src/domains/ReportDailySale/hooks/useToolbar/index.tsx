import { DownloadMethodType } from '@hasty-bazar/admin-shared/containers/HBDataGrid/useDataGrid'
import { DailySaleReport } from '@hasty-bazar-admin/domains/ReportDailySale/enums/DailySaleReportEnums'
import {
  DailyReportDataType,
  DailyReportDateType,
  DailyReportInformingType,
  usePostAdminReportOrderDetailDailyReportExcelFileMutation,
} from '@hasty-bazar/admin-shared/services/reportApi.generated'
import { HBDataGridToolbarProps, HBDataGrigToolbar, MenuItemProps } from '@hasty-bazar/core'
import HBGrigToolbarItem from 'libs/core/src/components/HBGrigToolbar/components/HBGrigToolbarItem'
import { FC, useCallback, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import DailySaleReportMessages from '../../ReportDailySale.messages'
import { DialogType, IUseToolbar } from '../../types/IDailySaleReportFormModel'
import useHandleInformDate from '../useHandleInformDate'

enum ExcelModel {
  orderDateString = 'orderDateString',
  duePickupDateString = 'duePickupDateString',
  dueDeliveryDateString = 'dueDeliveryDateString',
  vendorAddress = 'vendorAddress',
  recipientName = 'recipientName',
  recipientPhoneNumber = 'recipientPhoneNumber',
}
const useToolbar = ({ selectedRows, gridRef, formWatch }: IUseToolbar) => {
  const [isDialog, setIsDialog] = useState<DialogType>(false)
  const { formatMessage } = useIntl()

  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    gridRef.current?.refreshGridData(isClearSearch)
    gridRef.current!.api.deselectAll()
  }, [])

  const [postAdminReportOrderDetailDailyReportExcelFile] =
    usePostAdminReportOrderDetailDailyReportExcelFileMutation()

  const handleDownloadSpecificExcel = async (props: DownloadMethodType, isRowSelect: boolean) => {
    const { filterFields, ...res } = props
    const orderItemsId = selectedRows?.map((item) => item?.orderItemId?.toString())
    const createStatus = formWatch?.statusCodes?.map((item) => item.code) as []
    const data = res?.headers?.filter(
      (x) =>
        ![
          'storeName',
          'shippmentPrice',
          'totalVendorShare',
          'orderDate',
          'duePickupDate',
          'dueDeliveryDate',
        ].includes(String(x?.nativeName)),
    )
    const createData = [
      {
        faName: formatMessage(DailySaleReportMessages.orderDate),
        nativeName: ExcelModel.orderDateString,
      },
      {
        faName: formatMessage(DailySaleReportMessages.productPikUpDate),
        nativeName: ExcelModel.duePickupDateString,
      },
      {
        faName: formatMessage(DailySaleReportMessages.duePickDeliveryDate),
        nativeName: ExcelModel.dueDeliveryDateString,
      },
      {
        faName: formatMessage(DailySaleReportMessages.vendorAddress),
        nativeName: ExcelModel.vendorAddress,
      },
      {
        faName: formatMessage(DailySaleReportMessages.recipientName),
        nativeName: ExcelModel.recipientName,
      },
      {
        faName: formatMessage(DailySaleReportMessages.recipientNameAddress),
        nativeName: ExcelModel.recipientPhoneNumber,
      },
    ]
    const detailed = data && [...data, ...createData]
    const summarize = data && [...data, createData[0]]
    const formData = {
      dateType: Number(formWatch?.dateType?.id) as DailyReportDateType,
      dataType: Number(formWatch?.dataType?.id) as DailyReportDataType,
      informingType: Number(formWatch?.informingType?.id) as DailyReportInformingType,
      startDate: formWatch?.startDate,
      endDate: formWatch?.endDate,
      statusCodes: createStatus?.length > 0 ? createStatus : undefined,
    }

    return await postAdminReportOrderDetailDailyReportExcelFile({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      getDailyReportExcelFileQueryFilter: {
        ...res,
        ...filterFields,
        headers: formWatch?.dataType?.id === DailySaleReport.Summarized ? detailed : summarize,
        ...formData,
        orderItemsId: isRowSelect ? orderItemsId : undefined,
      },
    }).then((res) => {
      setIsDialog(false)
      return res
    })
  }

  const [handleInformDate] = useHandleInformDate({
    gridRef,
    selectedRows,
    setIsDialog,
  })

  const handleDownloadPage = (
    isDownloadAll?: boolean,
    isRowSelect?: boolean,
    update?: 'All' | 'Select',
  ) => {
    if (update) {
      gridRef?.current?.downloadGridData({
        downloadFileMethod: (props) => handleDownloadSpecificExcel(props, Boolean(isRowSelect)),
        downloadAll: isDownloadAll,
      })
      handleInformDate(update)
    } else {
      gridRef?.current?.downloadGridData({
        downloadFileMethod: (props) => handleDownloadSpecificExcel(props, Boolean(isRowSelect)),
        downloadAll: isDownloadAll,
      })
    }
  }

  const handleOpenDialog = (val: DialogType) => {
    setIsDialog(val)
  }

  const userGridToolbarMenu = (): MenuItemProps[] => {
    return []
  }

  const toolbarMoreItems = useMemo<MenuItemProps[]>(() => {
    return userGridToolbarMenu()
  }, [selectedRows])

  const toolBar = useCallback<FC<HBDataGridToolbarProps>>(
    (props) => {
      return (
        <HBDataGrigToolbar
          addProps={{
            show: false,
          }}
          deleteProps={{
            show: false,
          }}
          editProps={{
            show: false,
          }}
          statusProps={{ show: false }}
          items={toolbarMoreItems}
          moreProps={{ show: false }}
          searchProps={{
            show: false,
          }}
          refreshProps={{ onClick: () => refreshGridData() }}
          {...props}
        >
          <HBGrigToolbarItem
            icon="filesLandscapesAlt"
            tooltip={formatMessage(DailySaleReportMessages.downloadExcel)}
            onClick={() => handleOpenDialog('excel')}
          />
          <HBGrigToolbarItem
            icon="repeat"
            tooltip={formatMessage(DailySaleReportMessages.updateInfo)}
            onClick={() => handleOpenDialog('inform')}
          />
          <HBGrigToolbarItem
            icon="arrowDown"
            tooltip={formatMessage(DailySaleReportMessages.reportAndUpdate)}
            onClick={() => handleOpenDialog('DownloadAUpdate')}
          />
        </HBDataGrigToolbar>
      )
    },
    [selectedRows],
  )
  return { toolBar, isDialog, setIsDialog, handleDownloadPage }
}

export default useToolbar
