import HBDataGridActionHeader from '@hasty-bazar/admin-shared/components/HBDataGridActionHeader'
import HBGrid from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import Status from '@hasty-bazar-admin/domains/Products/components/status'
import ProductPageMessages from '@hasty-bazar-admin/domains/Products/ProductPage.messages'
import { HBAgGridClasses, HBDataGrigToolbar, HBIconButton } from '@hasty-bazar/core'
import { Avatar } from '@mui/material'
import {
  CheckboxSelectionCallbackParams,
  ColDef,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { ProductRelationTypeCodeEnum } from './RelatedProductsGrid'

const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
  return params.columnApi.getRowGroupColumns().length === 0
}

const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
  return params.columnApi.getRowGroupColumns().length === 0
}
const HEIGHT = '400px'
const classes: HBAgGridClasses = {
  wrapper: {
    height: HEIGHT,
  },
}

export interface ProductDataGridProps {
  onAdd: (data: string[]) => void
  onCancel: () => void
  productRelationTypeCode: ProductRelationTypeCodeEnum
}

export default function ProductsDataGrid({
  onAdd,
  onCancel,
  productRelationTypeCode,
}: ProductDataGridProps) {
  const { formatMessage } = useIntl()
  const gridRef = useRef<AgGridReact>(null)
  const router = useRouter()

  const id = router.query.id! as string
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/Catalog/simple-products/${id}/product-list?ProductRelationType=${productRelationTypeCode}`

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: 'actions',
        headerName: '',
        maxWidth: 50,
        cellStyle: () => ({
          justifyContent: 'center',
          display: 'flex',
        }),
        minWidth: 50,
        resizable: false,

        sortable: false,
        filter: false,
        suppressAutoSize: false,
        suppressMenu: false,
        checkboxSelection,
        headerCheckboxSelection,
        showRowGroup: false,
        cellRenderer: 'agGroupCellRenderer',
        headerComponent: HBDataGridActionHeader,
      },
      {
        field: 'defaultImage',
        headerName: formatMessage(ProductPageMessages.picture),
        filter: 'agNumberColumnFilter',
        minWidth: 100,
        cellRenderer: (params: ICellRendererParams) => {
          return (
            <Avatar
              sizes="small"
              src={`${process.env.NEXT_PUBLIC_CDN}/${params.value}`}
              alt={params.data.name}
              variant="rounded"
            />
          )
        },
      },
      {
        field: 'hsin',
        headerName: formatMessage(ProductPageMessages.HSIN),
        filter: 'agTextColumnFilter',
      },
      {
        field: 'name',
        headerName: formatMessage(ProductPageMessages.productName),
        filter: 'agTextColumnFilter',
      },

      {
        field: 'category',

        headerName: formatMessage(ProductPageMessages.mainGroup),
        filter: 'agTextColumnFilter',
      },

      {
        field: 'vendor',
        headerName: formatMessage(ProductPageMessages.seller),
        filter: 'agTextColumnFilter',
      },
      {
        field: 'productStatus',
        headerName: formatMessage(ProductPageMessages.level),
        filter: 'agDateColumnFilter',
        cellRenderer: (params: ICellRendererParams) => {
          return <Status status={Number(params.value)} />
        },
      },
    ],
    [],
  )

  const refreshGridData = useCallback((route?: string[]) => {
    gridRef.current!.api.refreshServerSideStore({
      route,
    })
    gridRef.current!.api.deselectAll()
  }, [])

  const handleChangedSelectedRows = (selectedRows: any[]) => {
    setSelectedRows(selectedRows)
  }

  const handleAddProduct = () => {
    onAdd(selectedRows.map((row) => row.id))
    refreshGridData()
  }

  const handleChangedGridActions = (value: number | string, type: 'search' | 'status') => {
    if (type === 'status') {
      let filterComponent = gridRef.current!.api.getFilterInstance('productStatus')
      filterComponent &&
        filterComponent.setModel({
          type: 'equals',
          filter: value !== -1 ? value : null,
        })
      gridRef.current!.api.onFilterChanged()
    } else if (type === 'search') {
      let filterFirstComponent = gridRef.current!.api.getFilterInstance('name')
      filterFirstComponent &&
        filterFirstComponent.setModel({
          type: 'contains',
          filter: value ?? null,
        })
      gridRef.current!.api.onFilterChanged()
    }
  }

  return (
    <HBGrid
      actionUrl={actionUrl}
      columnDefs={columnDefs}
      pagination
      animateRows
      paginationPageSize={25}
      cacheBlockSize={25}
      rowModelType={'serverSide'}
      serverSideStoreType={'partial'}
      rowSelection="multiple"
      enableRtl
      classes={classes}
      onSelectedChanged={handleChangedSelectedRows}
      ref={gridRef}
      GridToolbar={(props) => (
        <HBDataGrigToolbar
          onChange={handleChangedGridActions}
          addProps={{
            show: false,
          }}
          deleteProps={{
            show: false,
          }}
          moreProps={{
            show: false,
          }}
          statusProps={{
            show: false,
          }}
          searchProps={{
            openPosition: 'right',
            show: true,
          }}
          editProps={{ show: false }}
          refreshProps={{ onClick: () => refreshGridData() }}
          {...props}
        >
          <HBIconButton
            disabled={selectedRows.length === 0}
            onClick={handleAddProduct}
            icon="check"
          ></HBIconButton>
        </HBDataGrigToolbar>
      )}
    />
  )
}
