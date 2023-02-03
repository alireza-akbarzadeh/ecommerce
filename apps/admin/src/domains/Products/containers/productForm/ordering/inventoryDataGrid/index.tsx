import { GridActionColumn } from '@hasty-bazar/admin-shared/components'
import {
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import HBDateTimePicker from '@hasty-bazar/admin-shared/containers/HBDateTimePicker'
import RecordChangeHistory from '@hasty-bazar/admin-shared/containers/recordChangeHistory'
import WorkflowHistory from '@hasty-bazar/admin-shared/containers/workflowHistory'
import { ProductExplanation } from '@hasty-bazar-admin/domains/Products/components'
import { getProductType } from '@hasty-bazar-admin/domains/Products/utils'
import {
  useDeleteAdminCatalogConfigurableProductsByIdInventoryItemAdjustmentRequestAndInventoryItemAdjustmentRequestIdMutation,
  useDeleteAdminCatalogSimpleProductsByIdInventoryItemAdjustmentRequestAndInventoryItemAdjustmentRequestIdMutation,
  useGetAdminCatalogConfigurableProductsByIdQuery,
  useGetAdminCatalogConfigurableProductsByProductIdInventoryItemAdjustmentRequestQuery,
  useGetAdminCatalogSimpleProductsByIdQuery,
  useGetAdminCatalogSimpleProductsByProductIdInventoryItemAdjustmentRequestQuery,
  usePostAdminCatalogConfigurableProductsByIdInventoryItemAdjustmentRequestMutation,
  usePostAdminCatalogSimpleProductsByIdInventoryItemAdjustmentRequestMutation,
  usePutAdminCatalogConfigurableProductsByIdInventoryItemAdjustmentRequestAndInventoryItemAdjustmentRequestIdMutation,
  usePutAdminCatalogSimpleProductsByIdInventoryItemAdjustmentRequestAndInventoryItemAdjustmentRequestIdMutation,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { HBAgGridClasses, HBDataGrigToolbar, HBIconButton, openToast } from '@hasty-bazar/core'
import { Box, useTheme } from '@mui/material'
import {
  CellKeyDownEvent,
  ColDef,
  FullWidthCellKeyDownEvent,
  ICellRendererParams,
  RowEditingStoppedEvent,
} from 'ag-grid-community'
import { format } from 'date-fns-jalali'
import { useRouter } from 'next/router'
import { isNil } from 'ramda'
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useIntl } from 'react-intl'
import OrderingMessages from '../Ordering.messages'
import Status, { StatusEnum } from './status'
import StockMessages from './Stock.messages'

function InventoryDataGrid() {
  const [recordChangeHistoryModalState, setRecordChangeHistoryModalState] = useState<{
    show: boolean
    id?: string
    type: string
  }>({
    show: false,
    type: '',
  })
  const [workflowHistoryModalState, setWorkflowHistoryModalState] = useState<{
    show: boolean
    id?: string
    type: string
  }>({
    show: false,
    type: '',
  })

  const { query: { id: slugId } = {} } = useRouter()
  const router = useRouter()
  const defaultProductType = getProductType(router.pathname)
  const productType = getProductType(router.asPath) || defaultProductType
  const queryArgs = {
    'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
    'client-version': '1.0.1.100',
    productId: String(slugId),
  }
  const {
    data: { data: { items: inventoryItems = [] } = {} } = {},
    isSuccess,
    refetch,
    isFetching,
  } = productType === 'simple'
    ? useGetAdminCatalogSimpleProductsByProductIdInventoryItemAdjustmentRequestQuery(queryArgs)
    : useGetAdminCatalogConfigurableProductsByProductIdInventoryItemAdjustmentRequestQuery(
        queryArgs,
      )

  const [deleteInventory, deleteInventoryOptions] =
    productType === 'simple'
      ? useDeleteAdminCatalogSimpleProductsByIdInventoryItemAdjustmentRequestAndInventoryItemAdjustmentRequestIdMutation()
      : useDeleteAdminCatalogConfigurableProductsByIdInventoryItemAdjustmentRequestAndInventoryItemAdjustmentRequestIdMutation()

  const [putInventory, putInventoryOptions] =
    productType === 'simple'
      ? usePutAdminCatalogSimpleProductsByIdInventoryItemAdjustmentRequestAndInventoryItemAdjustmentRequestIdMutation()
      : usePutAdminCatalogConfigurableProductsByIdInventoryItemAdjustmentRequestAndInventoryItemAdjustmentRequestIdMutation()

  const [postInventory, postInventoryOptions] =
    productType === 'simple'
      ? usePostAdminCatalogSimpleProductsByIdInventoryItemAdjustmentRequestMutation()
      : usePostAdminCatalogConfigurableProductsByIdInventoryItemAdjustmentRequestMutation()

  const theme = useTheme()

  const { formatMessage } = useIntl()

  const actionUrl = ''
  const gridRef = useRef<HBDataGridClientRef>(null)

  const [rowData, setRowData] = useState<
    {
      index: number
      id: string
      date: string
      incrementer: number
      decrementer: number
      level: string
    }[]
  >()

  const newRow = {
    index: 0,
    id: '',
    date: new Date().toISOString(),
    incrementer: 0,
    decrementer: 0,
    level: formatMessage(StockMessages.draft),
  }

  const getLevel = (level: number) => {
    switch (level) {
      case 1:
        return formatMessage(StockMessages.draft)
      case 2:
        return formatMessage(StockMessages.finalized)
      case 3:
        return formatMessage(StockMessages.publish)
      default:
        return formatMessage(StockMessages.draft)
    }
  }

  useEffect(() => {
    const rows = inventoryItems?.map(
      (item: { id: string; applayDate: string; qty: number; inventoryItemState: number }) => ({
        index: inventoryItems.indexOf(item as any),
        id: item.id!,
        date: item.applayDate!,
        incrementer: Math.sign(item.qty as number) === 1 ? item.qty! : 0,
        decrementer:
          Math.sign(item.qty as number) === -1 ? item.qty.toString().replace('-', '')! : 0,
        level: getLevel(item.inventoryItemState as number),
      }),
    )

    const withAddRow = [
      ...(rows as {
        index: number
        id: string
        date: string
        incrementer: number
        decrementer: number
        level: string
      }[]),
    ]

    setRowData(withAddRow)
  }, [isSuccess, isFetching])

  const JALALI_DATE_FORMAT = 'yyyy-MM-dd - HH:mm:ss'

  const GridActions = useCallback((props: ICellRendererParams) => {
    return (
      <GridActionColumn
        {...props}
        menuItems={[
          {
            label: formatMessage(StockMessages.general),
            children: [
              {
                icon: 'pen',
                label: formatMessage(StockMessages.edit),
                onClick: () => {
                  gridRef?.current?.api?.setFocusedCell?.(Number(props.data.index), 'incrementer')

                  gridRef?.current?.api?.startEditingCell?.({
                    rowIndex: Number(props.data.index),
                    colKey: 'incrementer',
                  })
                },
              },
              {
                icon: 'trashAlt',
                label: formatMessage(StockMessages.delete),
                onClick: async () => {
                  try {
                    await deleteInventory({
                      'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
                      'client-version': '1.0.1.100',
                      id: String(slugId),
                      inventoryItemAdjustmentRequestId: String(props.data.id),
                    }).unwrap()

                    openToast({
                      message: formatMessage(StockMessages.successDelete),
                      type: 'success',
                    })
                  } catch {}
                  refetch()
                },
              },
              {
                icon: 'history',
                label: formatMessage(StockMessages.recordChangeHistory),
                onClick: () =>
                  setRecordChangeHistoryModalState({
                    show: true,
                    id: props?.data?.id,
                    type: 'INVENTORY',
                  }),
              },
            ],
          },
          {
            label: formatMessage(StockMessages.workflow),
            children: [
              {
                icon: 'fileEditAlt',
                label: formatMessage(StockMessages.draft),
                onClick: async () => {
                  const data = props.data

                  const updateInventoryItemAdjustmentRequestModel = {
                    applyDate: data.date,
                    qty:
                      Number(data.incrementer) > 0
                        ? Number(data.incrementer)
                        : Number('-' + String(data.decrementer)),
                    itemState: Number(1) as 1 | 2 | 3,
                  }

                  try {
                    await putInventory({
                      'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
                      'client-version': '1.0.1.100',
                      id: String(slugId),
                      inventoryItemAdjustmentRequestId: String(data.id),
                      updateInventoryItemAdjustmentRequestModel,
                    }).unwrap()

                    openToast({
                      message: formatMessage(StockMessages.successPut),
                      type: 'success',
                    })
                  } catch {}
                  refetch()
                },
                disabled:
                  props?.data?.level === formatMessage(StockMessages.draft) ||
                  props?.data?.level === formatMessage(StockMessages.publish),
              },
              {
                icon: 'check',
                label: formatMessage(StockMessages.finalize),
                onClick: async () => {
                  const data = props.data

                  const updateInventoryItemAdjustmentRequestModel = {
                    applyDate: data.date,
                    qty:
                      Number(data.incrementer) > 0
                        ? Number(data.incrementer)
                        : Number('-' + String(data.decrementer)),
                    itemState: Number(2) as 1 | 2 | 3,
                  }

                  try {
                    await putInventory({
                      'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
                      'client-version': '1.0.1.100',
                      id: String(slugId),
                      inventoryItemAdjustmentRequestId: String(data.id),
                      updateInventoryItemAdjustmentRequestModel,
                    }).unwrap()

                    openToast({
                      message: formatMessage(StockMessages.successPut),
                      type: 'success',
                    })
                  } catch {}
                  refetch()
                },
                disabled:
                  props?.data?.level === formatMessage(StockMessages.finalized) ||
                  props?.data?.level === formatMessage(StockMessages.publish),
              },
              {
                icon: 'history',
                label: formatMessage(StockMessages.overflowHistory),
                onClick: () =>
                  setWorkflowHistoryModalState({
                    show: true,
                    id: props?.data?.id,
                    type: 'INVENTORY',
                  }),
              },
            ],
          },
        ]}
      />
    )
  }, [])
  const CustomCellEditor = forwardRef((props: ICellRendererParams, ref) => {
    const [selectedValue, setSelectedValue] = useState(props.value)
    useImperativeHandle(ref, () => {
      return {
        getValue() {
          return selectedValue
        },
      }
    })

    const onChangeHandler = (value: Date) => {
      setSelectedValue(value)
    }
    return (
      <HBDateTimePicker
        disablePast
        value={selectedValue}
        inputDisabled
        onChange={onChangeHandler}
      />
    )
  })

  const columnDefs: ColDef[] = [
    {
      field: '_actions',
      headerName: '',
      maxWidth: 60,
      resizable: false,
      sortable: false,
      filter: false,
      suppressAutoSize: true,
      suppressMenu: true,
      showRowGroup: true,
      editable: true,
      cellEditor: () => <></>,
      cellRenderer: (params: ICellRendererParams) => {
        return <GridActions {...params} />
      },
    },
    {
      headerName: formatMessage(StockMessages.date),
      field: 'date',
      cellEditor: CustomCellEditor,
      editable: true,
      cellRenderer: (params: ICellRendererParams) => {
        return format(new Date(params?.value), JALALI_DATE_FORMAT)
      },
    },
    {
      headerName: formatMessage(StockMessages.incrementer),
      field: 'incrementer',

      cellStyle: { color: theme.palette.success.main },
    },
    {
      headerName: formatMessage(StockMessages.decrementer),
      field: 'decrementer',
      cellStyle: { color: theme.palette.error.main },
    },
    {
      headerName: formatMessage(StockMessages.level),
      field: 'level',
      editable: false,

      cellRenderer: (params: ICellRendererParams) => {
        return (
          <Box sx={{ mt: 1 }}>
            <Status status={params.value as unknown as StatusEnum} />
          </Box>
        )
      },
    },
    {
      headerName: '',
      field: 'actionButton',
      maxWidth: 100,
      cellEditor: (params: ICellRendererParams) => {
        return (
          <HBIconButton
            onClick={() => {
              params.api.stopEditing()
            }}
            icon={'check'}
          />
        )
      },
      cellRenderer: (params: ICellRendererParams) => {
        return <></>
      },
    },
  ]

  const classes: HBAgGridClasses = {
    wrapper: {
      backgroundColor: `${theme.palette.common.white} !important`,
      maxHeight: '296px',
      '& .ag-layout-normal .ag-header': {
        backgroundColor: `${theme.palette.grey[100]} !important`,
        border: 'unset',
      },
      '&>div:last-child': {
        padding: theme.spacing(3),
        borderRadius: 2,
        backgroundColor: theme.palette.grey[100],
      },
      '& div.ag-root-wrapper': {
        border: 'unset',
      },
    },
  }
  const onError = (rowIndex: number) => {
    gridRef?.current?.api?.startEditingCell({
      rowIndex,
      colKey: 'incrementer',
    })
  }

  const onRowValueChanged = async (event: RowEditingStoppedEvent) => {
    setActivateNewRow(false)
    if (event?.data?.incrementer > 0 && event?.data?.decrementer > 0) {
      openToast({
        message: formatMessage(StockMessages.incDecBiggerThanZero),
        type: 'error',
      })
      onError(event.rowIndex || 0)
      return
    }
    if (event?.data?.incrementer === 0 && event?.data?.decrementer === 0) {
      onError(event.rowIndex || 0)

      openToast({
        message: formatMessage(StockMessages.incDecAreZero),
        type: 'error',
      })
      return
    }

    if (event?.data?.id !== '') {
      const data = event.data

      const updateInventoryItemAdjustmentRequestModel = {
        applyDate: data.date,
        qty:
          Number(data.incrementer) > 0
            ? Number(data.incrementer)
            : Number('-' + String(data.decrementer)),
        itemState: Number(1) as 1 | 2 | 3,
      }

      try {
        await putInventory({
          'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
          'client-version': '1.0.1.100',
          id: String(slugId),
          inventoryItemAdjustmentRequestId: String(data.id),
          updateInventoryItemAdjustmentRequestModel,
        }).unwrap()

        openToast({
          message: formatMessage(StockMessages.successPut),
          type: 'success',
        })
        refetch()
      } catch {}
    } else {
      const data = event.data

      const addInventoryItemAdjustmentRequestModel = {
        applyDate: data.date,
        qty:
          Number(data.incrementer) > 0
            ? Number(data.incrementer)
            : Number('-' + String(data.decrementer)),
        itemState: Number(1) as 1 | 2 | 3,
      }

      try {
        await postInventory({
          'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
          'client-version': '1.0.1.100',
          id: String(slugId),
          addInventoryItemAdjustmentRequestModel,
        }).unwrap()

        openToast({
          message: formatMessage(StockMessages.successPost),
          type: 'success',
        })
        refetch()
      } catch {}

      setRowData((prevState) => prevState?.filter((_, i) => i !== 0))
    }
  }
  const onCellKeyDown = (event: CellKeyDownEvent | FullWidthCellKeyDownEvent) => {
    const key = (event?.event as unknown as { key: string })?.key
    if (key === 'Enter' || key === 'Escape') {
      setRowData((prevState) => prevState?.filter((_, i) => i !== 0))
    }
  }

  const defaultColDef = useMemo(() => {
    return {
      editable: true,
    }
  }, [])

  const [activateNewRow, setActivateNewRow] = useState<boolean>(false)

  const handleAddRow = () => {
    setRowData((prevState = []) => {
      return [newRow, ...prevState]
    })
    setActivateNewRow(true)

    setTimeout(() => {
      gridRef?.current?.api?.setFocusedCell(Number(0), 'incrementer')

      gridRef?.current?.api?.startEditingCell({
        rowIndex: Number(0),
        colKey: 'incrementer',
      })
    }, 500)
  }
  const productQuery = {
    'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
    'client-version': '1',
    id: String(slugId),
  }
  const { data: { data: productInfo = {} } = {} } =
    productType === 'simple'
      ? useGetAdminCatalogSimpleProductsByIdQuery(productQuery)
      : useGetAdminCatalogConfigurableProductsByIdQuery(productQuery)

  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    refetch()
    gridRef.current?.refreshGridData(isClearSearch)
  }, [])

  useEffect(() => {
    if (isFetching) {
      gridRef.current?.api?.showLoadingOverlay?.()
    } else {
      gridRef.current?.api?.hideOverlay?.()
    }
  }, [isFetching])

  return (
    <>
      <ProductExplanation
        disabled={isNil(productInfo.onHandQty)}
        summaryProps={{
          title: formatMessage(OrderingMessages.stock),
          icon: 'moneyStack',
          statusLabel: rowData?.length ? '1' : '0',
          submitButton: false,
        }}
      >
        <Box
          sx={{
            pb: 14,
          }}
        >
          <HBDataGridClient
            editType={'fullRow'}
            suppressClickEdit={true}
            onCellKeyDown={onCellKeyDown}
            defaultColDef={defaultColDef}
            actionUrl={actionUrl}
            columnDefs={columnDefs}
            animateRows
            groupDisplayType="singleColumn"
            rowData={rowData}
            rowSelection="single"
            enableRtl
            onRowEditingStopped={onRowValueChanged}
            classes={classes}
            ref={gridRef}
            GridToolbar={() => (
              <HBDataGrigToolbar
                addProps={{
                  onClick: handleAddRow,
                  disabled: activateNewRow,
                }}
                statusProps={{ show: false }}
                editProps={{
                  show: false,
                }}
                deleteProps={{
                  show: false,
                }}
                searchProps={{}}
                refreshProps={{
                  onClick: () => refreshGridData(),
                }}
                moreProps={{
                  show: false,
                }}
              />
            )}
          />
        </Box>
      </ProductExplanation>
      <RecordChangeHistory
        id={recordChangeHistoryModalState.id!}
        open={recordChangeHistoryModalState.show}
        onClose={() => setRecordChangeHistoryModalState({ show: false, id: undefined, type: '' })}
        type={recordChangeHistoryModalState.type}
      />
      <WorkflowHistory
        id={workflowHistoryModalState.id!}
        open={workflowHistoryModalState.show}
        onClose={() => setWorkflowHistoryModalState({ show: false, id: undefined, type: '' })}
        type={workflowHistoryModalState.type}
      />
    </>
  )
}

export default InventoryDataGrid
