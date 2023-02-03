import { Dispatch, RefObject, SetStateAction } from 'react'
import { IDailySaleReportFormModel } from './IDailySaleReportFormModel'

interface IReportDetailedDailySaleGrid {
  saleReport: any
  setSaleReport: (val: any) => void
  formWatch?: IDailySaleReportFormModel
  setPagination: Dispatch<SetStateAction<{ pageSize: number; pageNumber: number }>>
  fromValues: RefObject<IDailySaleReportFormModel | null>
}

type IUseReportDetailedDailySaleController = Omit<
  IReportDetailedDailySaleGrid,
  'saleReport' | 'setPagination' | 'fromValues'
>

export type { IReportDetailedDailySaleGrid, IUseReportDetailedDailySaleController }
