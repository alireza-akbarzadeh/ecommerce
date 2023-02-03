import { GridActionColumn } from '@hasty-bazar/admin-shared/components'
import { ICellRendererParams } from 'ag-grid-community'
import { useCallback } from 'react'
import { IUseReportDetailedDailySaleColumns } from '../../types/IDailySaleReportFormModel'
const useGridActions = ({ selectedRows }: IUseReportDetailedDailySaleColumns) => {
  const GridActions = useCallback(
    (props: ICellRendererParams) => {
      return <GridActionColumn {...props} menuItems={[]} />
    },
    [selectedRows],
  )
  return { GridActions }
}
export default useGridActions
