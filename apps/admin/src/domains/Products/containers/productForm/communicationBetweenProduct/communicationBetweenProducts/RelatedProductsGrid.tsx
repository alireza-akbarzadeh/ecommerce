import { GridActionColumn, GridActionMenuProps } from '@hasty-bazar/admin-shared/components'
import { HBWorkflowState } from '@hasty-bazar/admin-shared/containers'
import { EnumFormHeaderStatus } from '@hasty-bazar/admin-shared/containers/formContainer/formHeader'
import {
  GridFilterFieldType,
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { useGetAdminCatalogProductRulesGetStateInfoByStateCodeAndStateMachineCodeFactorQuery } from '@hasty-bazar-admin/domains/Products/catalogApi.enhanced'
import { getProductType } from '@hasty-bazar-admin/domains/Products/utils'
import useToast from '@hasty-bazar/admin-shared/hooks/useToast'
import {
  GetAllRelatedProductsQueryResult,
  usePostAdminCatalogConfigurableProductsByIdRelatedProductMutation,
  usePostAdminCatalogSimpleProductsByIdRelatedProductMutation,
  usePutAdminCatalogConfigurableProductsByIdRelatedProductMutation,
  usePutAdminCatalogSimpleProductsByIdRelatedProductMutation,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { errorsToString } from '@hasty-bazar/admin-shared/utils'
import { getFilterFromOnFilterChanged } from '@hasty-bazar/admin-shared/utils/gridUtil'
import {
  HBAgGridClasses,
  HBDataGridToolbarProps,
  HBDataGrigToolbar,
  HBDialog,
} from '@hasty-bazar/core'
import { Avatar, Box, Link, Typography, useTheme } from '@mui/material'
import {
  CheckboxSelectionCallbackParams,
  ColDef,
  FilterChangedEvent,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { useRouter } from 'next/router'
import { FC, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import ProductPageMessages from '../../../../ProductPage.messages'
import { ProductContext } from '../../../contexts/productContext'
import ProductDataGrid from './productDataGrid'

export enum RoleStateEnum {
  Draft = 0,
  Sent = 1,
  Publish = 2,
  Block = 3,
}
const SIMPLE_PRODUCT_TYPE_CODE = 1034001
export const enum ProductRelationTypeCodeEnum {
  RelatedProducts = 1045001,
  SimilarProducts = 1045002,
  FamilyProducts = 1045003,
}

interface RelatedProductsGridProps {
  title: string
  ProductRelationTypeCode: ProductRelationTypeCodeEnum
  onLoaded: (data: GetAllRelatedProductsQueryResult[]) => void
}

const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
  return params.columnApi.getRowGroupColumns().length === 0
}

const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
  return params.columnApi.getRowGroupColumns().length === 0
}

const PAGE_SIZE = 10000
const RelatedProductsGrid: FC<RelatedProductsGridProps> = ({
  title,
  onLoaded,
  ProductRelationTypeCode,
}) => {
  const router = useRouter()
  const { formatMessage } = useIntl()
  const id = router.query.id as string

  const defaultProductType = getProductType(router.pathname)
  const [filter, setFilter] = useState<string>()
  const productType = getProductType(router.asPath) || defaultProductType
  const theme = useTheme()
  const { productState } = useContext(ProductContext)
  const disabled =
    productState !== EnumFormHeaderStatus.draft && productState !== EnumFormHeaderStatus.published

  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/Catalog/${productType}-products/${id}/related-product?ProductRelationType=${ProductRelationTypeCode}`

  const { showToast } = useToast()
  const [productId, setProductId] = useState<string>()
  const [selectedRows, setSelectedRows] = useState<any[]>([])

  const gridRef = useRef<HBDataGridClientRef>(null)
  const [open, setOpen] = useState(false)
  const [openActive, setOpenActive] = useState(false)

  const getMenuItems = useCallback((props: ICellRendererParams) => {
    let items: GridActionMenuProps[] = [
      {
        label: formatMessage(phrasesMessages.public),
        children: [
          {
            icon: 'trashAlt',
            label: formatMessage(phrasesMessages.delete),
            onClick: () => {
              handleRemoveProduct(props.data?.id, true)
            },
          },
        ],
      },
    ]

    return items
  }, [])

  const GridActions = useCallback(
    (props: ICellRendererParams) => {
      return <GridActionColumn {...props} menuItems={getMenuItems(props)} />
    },
    [selectedRows],
  )
  const handleEditProduct = (id: string, type: number) => {
    const productType = type === SIMPLE_PRODUCT_TYPE_CODE ? 'simple' : 'configurable'
    router.push(`/products/${productType}-product/edit/product-details/${id}`)
  }

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: '_actions',
        headerName: '',
        maxWidth: 110,
        minWidth: 110,
        resizable: false,
        sortable: false,
        filter: false,
        suppressAutoSize: true,
        suppressMenu: true,
        cellRenderer: GridActions,
        checkboxSelection,
        headerCheckboxSelection,
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
        cellRenderer: (params: ICellRendererParams) => {
          return (
            <Link
              sx={(theme) => ({
                color: theme.palette.info.main,
              })}
              onClick={(event) => {
                event.preventDefault()
                handleEditProduct(params.data.id as string, params.data.type as number)
              }}
            >
              {params.value}
            </Link>
          )
        },
      },
      {
        field: 'type',
        headerName: formatMessage(ProductPageMessages.productType),
        filter: 'agTextColumnFilter',
        rowGroup: false,
        enableRowGroup: true,
        cellRenderer: ({ setValue, data }: ICellRendererParams) => data.typeTitle,
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
          return (
            <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
              <HBWorkflowState
                factor="1"
                machineCode={StateMachineCode.Products}
                stateCode={params?.value}
                useGetStateInfo={
                  useGetAdminCatalogProductRulesGetStateInfoByStateCodeAndStateMachineCodeFactorQuery
                }
              />
            </Box>
          )
        },
      },
    ],
    [],
  )

  const classes: HBAgGridClasses = {
    wrapper: {
      backgroundColor: `${theme.palette.common.white} !important`,
      height: 300,
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

  const handleAddProduct = () => {
    setOpen(true)
  }

  const [deleteProduct, deleteProductStates] =
    productType === 'simple'
      ? usePutAdminCatalogSimpleProductsByIdRelatedProductMutation()
      : usePutAdminCatalogConfigurableProductsByIdRelatedProductMutation()

  const handleRemoveProduct = (_id?: string, useModal?: boolean) => {
    postRelatedProductsStates.reset()
    deleteProductStates.reset()
    if (useModal) {
      setProductId(_id)
      return setOpenActive(true)
    }
    setOpenActive(false)
    _id = _id && typeof _id === 'string' ? _id : selectedRows[0].id
    if (!_id) return
    setOpenActive(true)

    deleteProduct({
      'client-name': 'default',
      'client-version': '1.0.0',
      deleteRelatedProductModel: {
        productRelationType: ProductRelationTypeCode,
        productsId: selectedRows.length ? selectedRows.map(({ id }) => id) : [productId],
      },
      id,
    })
  }

  const handleChangedSelectedRows = (selectedRows: any[]) => {
    setSelectedRows(selectedRows)
  }

  const isRowSelectable = useCallback((rowNode: any) => {
    return rowNode.data ? !rowNode.data.isAdd : true
  }, [])

  const toolbarStatus = useMemo(() => {
    const disabledOnSelected = selectedRows.length > 0
    const disabledOnNoSelected = selectedRows.length === 0

    return { disabledOnSelected, disabledOnNoSelected }
  }, [selectedRows])

  const refreshGridData = useCallback((route?: string[]) => {
    gridRef?.current?.refreshGridData()
    gridRef?.current!.api?.deselectAll()
  }, [])

  const [postRelatedProducts, postRelatedProductsStates] =
    productType === 'simple'
      ? usePostAdminCatalogSimpleProductsByIdRelatedProductMutation()
      : usePostAdminCatalogConfigurableProductsByIdRelatedProductMutation()

  const handleAddProducts = (products: string[]) => {
    setOpen(false)
    postRelatedProducts({
      'client-name': 'default',
      'client-version': '1.0.0',
      addRelatedProductModel: {
        productRelationType: ProductRelationTypeCode,
        productsId: products,
      },
      id,
    })
  }

  const handleCancel = () => {
    setOpen(false)
  }
  const handleChangedGridActions = (value: number | string, type: 'search') => {
    if (type === 'search') {
      if (value) {
        const searchFields: GridFilterFieldType[] = [
          { field: 'Name', operator: 'contains', value: String(value) },
        ]
        gridRef.current!.addFilter({
          id: 'searchRelatedProduct',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef.current!.removeFilter('searchRelatedProduct')
      }
    }
  }
  const onFilterChanged = (event: FilterChangedEvent) => {
    const { serializedFilter } = getFilterFromOnFilterChanged(event)

    setFilter(serializedFilter)
  }

  useEffect(() => {
    if (postRelatedProductsStates.isSuccess || deleteProductStates.isSuccess) {
      refreshGridData()
      setOpenActive(false)
      if (postRelatedProductsStates.isSuccess) {
        showToast(formatMessage(ProductPageMessages.relatedProductsSuccessfullyAdded), 'success')
      } else {
        showToast(formatMessage(ProductPageMessages.relatedProductsSuccessfullyDeleted), 'success')
      }
    }
    if (postRelatedProductsStates.error) {
      showToast(errorsToString(postRelatedProductsStates.error), 'error')
    }
  }, [
    postRelatedProductsStates.error,
    postRelatedProductsStates.isSuccess,
    deleteProductStates.isSuccess,
    deleteProductStates.isLoading,
  ])

  return (
    <Box sx={{ height: 362 }}>
      <HBDataGridClient
        actionUrl={actionUrl}
        rightHeader={
          <Typography variant="h6" color="text.primary">
            {title}
          </Typography>
        }
        columnDefs={columnDefs}
        isRowSelectable={isRowSelectable}
        ref={gridRef}
        onFilterChanged={onFilterChanged}
        enableRtl
        onDoubleClick={(event) => {
          if (event?.data?.type === SIMPLE_PRODUCT_TYPE_CODE) {
            router.push(`/products/simple-product/edit/product-details/${event?.data?.id}`)
          } else {
            router.push(`/products/configurable-product/edit/product-details/${event?.data?.id}`)
          }
        }}
        classes={classes}
        onSelectedChanged={handleChangedSelectedRows}
        suppressLoadingOverlay={!id}
        GridToolbar={useCallback<FC<HBDataGridToolbarProps>>(
          (props) => (
            <HBDataGrigToolbar
              statusProps={{
                show: false,
              }}
              addProps={{
                disabled,
                onClick: handleAddProduct,
              }}
              deleteProps={{
                disabled: disabled || selectedRows.length === 0,
                onClick: () => handleRemoveProduct('', true),
              }}
              editProps={{
                disabled:
                  !toolbarStatus.disabledOnSelected || selectedRows.length !== 1 || disabled,
                show: false,
              }}
              moreProps={{
                show: false,
              }}
              refreshProps={{ show: true, onClick: refreshGridData }}
              searchProps={{ inputWidth: 114, show: true, openPosition: 'left' }}
              onChange={handleChangedGridActions}
              {...props}
            />
          ),
          [selectedRows, disabled],
        )}
      />

      <HBDialog
        content={formatMessage(ProductPageMessages.deleteConfirmation, {
          count: selectedRows.length,
        })}
        title={formatMessage(ProductPageMessages.deleteProduct)}
        onAccept={() => handleRemoveProduct(productId, false)}
        onReject={() => setOpenActive(false)}
        open={openActive}
        onClose={() => setOpenActive(false)}
        acceptBtn={formatMessage(ProductPageMessages.confirm)}
        rejectBtn={formatMessage(ProductPageMessages.cancel)}
      />
      <HBDialog
        open={open}
        contentSx={{
          height: 612,
        }}
        title={title}
        onReject={() => setOpen(false)}
        onClose={() => setOpen(false)}
      >
        <ProductDataGrid
          productRelationTypeCode={ProductRelationTypeCode}
          onAdd={handleAddProducts}
          onCancel={handleCancel}
        />
      </HBDialog>
    </Box>
  )
}

export default RelatedProductsGrid
