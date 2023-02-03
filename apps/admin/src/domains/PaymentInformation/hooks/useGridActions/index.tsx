import { GridActionColumn } from '@hasty-bazar/admin-shared/components'
import { ICellRendererParams } from 'ag-grid-community'
import { useCallback } from 'react'
import { IUsePaymentInfoGridColumns } from '../../types/IUsePaymentInfoGridColumns'

const useGridActions = ({ selectedRows }: IUsePaymentInfoGridColumns) => {
  const GridActions = useCallback(
    (props: ICellRendererParams) => {
      return <GridActionColumn {...props} menuItems={[]} />
    },
    [selectedRows],
  )
  return { GridActions }
}

export default useGridActions
