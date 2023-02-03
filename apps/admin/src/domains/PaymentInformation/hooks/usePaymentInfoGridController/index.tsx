import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { GetAllProductsQueryResult } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { useLazyGetAdminPaymentPaymentQuery } from '@hasty-bazar/admin-shared/services/paymentApi.generated'
import { GetPaymentInformationQueryResult } from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { HBAgGridClasses } from '@hasty-bazar/core'
import { ColDef } from 'ag-grid-community'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import usePaymentInfoGridColumns from '../usePaymentInfoGridColumns'
import useToolbar from '../useToolbar'

const classes: HBAgGridClasses = {
  wrapper: {
    height: 516,
  },
}

interface IUsePaymentInfoGridController {
  setPaymentInfo: (val: GetPaymentInformationQueryResult) => void
}

const usePaymentInfoGridController = ({ setPaymentInfo }: IUsePaymentInfoGridController) => {
  const [selectedRows, setSelectedRows] = useState<GetAllProductsQueryResult[]>([])
  const { formatMessage } = useIntl()
  const gridRef = useRef<HBDataGridClientRef>(null)
  const formRef = useRef<HTMLButtonElement>(null)
  const [getAdminPaymentPayment, { isFetching }] = useLazyGetAdminPaymentPaymentQuery()

  const handleRefresh = () => {
    formRef.current?.click()
  }

  const handleOnGrigReady = useCallback((params: any) => {
    getAdminPaymentPayment({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      pageNumber: params?.PageNumber,
      pageSize: params?.PageSize,
      ordering: params?.ordering,
      rowGroupCols: params?.rowGroupCols,
      filter: params?.filter,
    }).then((res: any) => setPaymentInfo(res?.data?.data as GetPaymentInformationQueryResult))
  }, [])

  const handleChangedSelectedRows = (selectedRows: GetAllProductsQueryResult[]) => {
    setSelectedRows(selectedRows)
  }

  useEffect(() => {
    if (isFetching) {
      gridRef.current?.api?.showLoadingOverlay?.()
    } else {
      gridRef.current?.api?.hideOverlay?.()
    }
  }, [isFetching])

  const { columnDefs } = usePaymentInfoGridColumns({ selectedRows })
  const { toolBar } = useToolbar({
    selectedRows,
    gridRef,
    handleRefresh,
  })

  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerCheckboxSelection: true,
      cellRenderer: 'agGroupCellRenderer',
    }
  }, [])
  return {
    columnDefs,
    formatMessage,
    classes,
    handleChangedSelectedRows,
    gridRef,
    selectedRows,
    toolBar,
    handleOnGrigReady,
    formRef,
    autoGroupColumnDef,
  }
}
export default usePaymentInfoGridController
