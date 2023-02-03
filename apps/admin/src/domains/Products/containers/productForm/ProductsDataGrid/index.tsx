import HBGrid from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { useGetAdminCatalogConfigurableProductsByIdProductItemsQuery } from '@hasty-bazar-admin/domains/Products/catalogApi.enhanced'
import Status from '@hasty-bazar-admin/domains/Products/components/status'
import ProductPageMessages from '@hasty-bazar-admin/domains/Products/ProductPage.messages'
import { SimpleProductItem } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { HBAgGridClasses, HBRadioButton } from '@hasty-bazar/core'
import { Stack } from '@mui/material'
import { ColDef, ICellRendererParams } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useRouter } from 'next/router'
import { useMemo, useRef } from 'react'
import { useIntl } from 'react-intl'

const classes: HBAgGridClasses = {
  wrapper: {
    height: '200px',
  },
}

const SIMPLE_PRODUCT_TYPE_ID = 1034001

export default function ProductsDataGrid() {
  const { formatMessage } = useIntl()
  const gridRef = useRef<AgGridReact>(null)
  const router = useRouter()
  const action = router.query.action as string
  const id = (router.query.parentId as string) || (router.query.id! as string)
  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/Catalog/configurable-products/${id}/product-items`

  const products = useGetAdminCatalogConfigurableProductsByIdProductItemsQuery({
    'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
    'client-version': '',
    id,
  })

  const handleChange = (productId: string, type: 'simple' | 'configurable') => {
    const route = router.pathname.replace('[action]', action).replace('[id]', productId)

    router.push({
      pathname: route,
      query: {
        type,
        parentId: id,
      },
    })
  }

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: 'actions',
        headerName: '',
        suppressMovable: true,
        maxWidth: 50,
        cellStyle: () => ({
          justifyContent: 'center',
          display: 'flex',
        }),
        minWidth: 50,
        resizable: false,

        sortable: false,
        filter: false,
        cellRenderer: (params: ICellRendererParams) => {
          const type =
            params.data.productTypeId === SIMPLE_PRODUCT_TYPE_ID ? 'simple' : 'configurable'

          return (
            <HBRadioButton
              onChange={() => handleChange(params.data.id as string, type)}
              name="product"
              checked={params.data.checked}
            />
          )
        },
      },

      {
        field: 'hsin' as keyof SimpleProductItem,
        headerName: formatMessage(ProductPageMessages.HSIN),
        sortable: false,
        suppressMovable: true,
        filter: false,
      },

      {
        field: 'dna',
        headerName: formatMessage(ProductPageMessages.DNA),
        sortable: false,
        suppressMovable: true,
        filter: false,
      },

      {
        field: 'name' as keyof SimpleProductItem,
        headerName: formatMessage(ProductPageMessages.productName),
        sortable: false,
        filter: false,
        suppressMovable: true,
      },
      {
        field: 'sku' as keyof SimpleProductItem,
        headerName: formatMessage(ProductPageMessages.sku),
        sortable: false,
        filter: false,
        suppressMovable: true,
      },

      {
        field: 'productTypeTitle' as keyof SimpleProductItem,
        headerName: formatMessage(ProductPageMessages.productType),
        sortable: false,
        filter: false,
        suppressMovable: true,
      },
      {
        field: 'systemName' as keyof SimpleProductItem,
        headerName: formatMessage(ProductPageMessages.systemName),
        sortable: false,
        filter: false,
        suppressMovable: true,
      },

      {
        field: 'statusId' as keyof SimpleProductItem,
        headerName: formatMessage(ProductPageMessages.level),
        suppressMovable: true,
        sortable: false,
        filter: false,
        cellRenderer: (params: ICellRendererParams) => {
          return <Status status={Number(params.value)} />
        },
      },
    ],
    [],
  )

  const tableData = useMemo(() => {
    return products.data?.data?.productItems?.map((item) => ({
      ...item,
      checked: item.id === router.query.id,
    }))
  }, [products.data?.data?.productItems, router.query.id])

  return (
    <Stack py={4} mb={7}>
      <HBGrid
        actionUrl={actionUrl}
        columnDefs={columnDefs}
        rowData={tableData || []}
        rowModelType={'clientSide'}
        rowSelection="single"
        enableRtl
        classes={classes}
        ref={gridRef}
        GridToolbar={() => <></>}
      />
    </Stack>
  )
}
