import { GridActionColumn } from '@hasty-bazar/admin-shared/components'
import { EnumFormHeaderStatus } from '@hasty-bazar/admin-shared/containers/formContainer/formHeader'
import {
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  useGetAdminCatalogConfigurableProductsByIdQuery,
  useGetAdminCatalogSimpleProductsByIdQuery,
  usePostAdminCatalogProductsByIdAddOtherRelatedProductGroupsMutation,
} from '@hasty-bazar-admin/domains/Products/catalogApi.enhanced'
import { ProductExplanation } from '@hasty-bazar-admin/domains/Products/components'
import ProductPageMessages from '@hasty-bazar-admin/domains/Products/ProductPage.messages'
import { getProductType } from '@hasty-bazar-admin/domains/Products/utils'
import {
  GetAllOtherRelatedProductGroupsResult,
  useDeleteAdminCatalogProductsByProductIdDeleteOtherRelatedProductGroupsAndIdMutation,
  useGetAdminCatalogProductsByIdOtherRelatedProductGroupsQuery,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import {
  HBAgGridClasses,
  HBDataGrigToolbar,
  HBDialog,
  HBIconButton,
  openToast,
} from '@hasty-bazar/core'
import { Box, useTheme } from '@mui/material'
import {
  CheckboxSelectionCallbackParams,
  ColDef,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
  RowEditingStoppedEvent,
} from 'ag-grid-community'
import { useRouter } from 'next/router'
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { ProductContext } from '../../../contexts/productContext'
import { HBRelatedProductGroupEditor } from './customCellEditors'
import otherRelatedProductGroupsMessages from './otherRelatedProductGroups.messages'

const { log } = console

function OtherRelatedProductGroups() {
  const router = useRouter()

  const gridRef = useRef<HBDataGridClientRef>(null)
  const defaultProductType = getProductType(router.pathname)
  const productType = getProductType(router.asPath) || defaultProductType

  const id = router.query.id as string
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const { productState } = useContext(ProductContext)

  const disabled =
    productState !== EnumFormHeaderStatus.draft && productState !== EnumFormHeaderStatus.published

  const productQueryArgs = {
    'client-name': 'hasty-bazar-admin',
    'client-version': '1.0.0',
    id,
  }

  const options = {
    skip: !id,
  }
  const productData =
    productType === 'simple'
      ? useGetAdminCatalogSimpleProductsByIdQuery(productQueryArgs, options)
      : useGetAdminCatalogConfigurableProductsByIdQuery(productQueryArgs, options)
  const [deleteDialogState, setDeleteDialogState] = useState<{ show: boolean; id?: string }>({
    show: false,
  })

  const [rowData, setRowData] = useState<GetAllOtherRelatedProductGroupsResult[]>([])
  const [selectedRows, setSelectedRows] = useState<GetAllOtherRelatedProductGroupsResult[]>([])

  const productGroups = useGetAdminCatalogProductsByIdOtherRelatedProductGroupsQuery({
    'client-name': '1',
    'client-version': '1',
    id,
  })
  const [deleteProduct, deleteProductGroupStates] =
    useDeleteAdminCatalogProductsByProductIdDeleteOtherRelatedProductGroupsAndIdMutation()

  const theme = useTheme()
  const { formatMessage } = useIntl()

  const actionUrl = ``

  const GridActions = useCallback(
    (props: ICellRendererParams) => {
      return (
        <GridActionColumn
          {...props}
          menuItems={[
            {
              label: formatMessage(ProductPageMessages.public),
              children: [
                {
                  icon: 'trashAlt',
                  label: formatMessage(phrasesMessages.delete),
                  onClick: () => setDeleteDialogState({ show: true, id: props?.data?.id }),
                },
              ],
            },
          ]}
        />
      )
    },
    [selectedRows],
  )

  const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }
  const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }
  const handleChangedSelectedRows = (selectedRows: GetAllOtherRelatedProductGroupsResult[]) => {
    setSelectedRows(selectedRows)
  }
  const columnDefs: ColDef[] = [
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
      editable: false,
      cellRenderer: GridActions,
      checkboxSelection,
      headerCheckboxSelection,
    },

    {
      headerName: formatMessage(otherRelatedProductGroupsMessages.relatedProductGroup),
      editable: true,
      maxWidth: 200,
      field: 'categoryTitle' as keyof GetAllOtherRelatedProductGroupsResult,
      cellEditor: HBRelatedProductGroupEditor,
    },
    {
      editable: false,
      headerName: formatMessage(otherRelatedProductGroupsMessages.theTreePathOfTheCommodityGroup),
      field: 'treePath' as keyof GetAllOtherRelatedProductGroupsResult,
    },
    {
      headerName: '',
      field: 'actionButton',
      maxWidth: 100,
      editable: true,
      cellEditor: (params: ICellRendererParams) => {
        return (
          <HBIconButton
            onClick={() => {
              params?.api?.stopEditing()
            }}
            icon={'check'}
          />
        )
      },
    },
  ]

  const classes: HBAgGridClasses = {
    wrapper: {
      pb: 5,
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
  const onEdit = (rowIndex: number) => {
    gridRef?.current?.api?.startEditingCell({
      rowIndex,
      colKey: 'categoryTitle' as keyof GetAllOtherRelatedProductGroupsResult,
    })
  }
  const [postProductGroup, postProductGroupStates] =
    usePostAdminCatalogProductsByIdAddOtherRelatedProductGroupsMutation()
  function handleAdd() {
    setRowData((prev) => [
      {
        id: '',
        categoryTitle: '',
        treePath: '',
      },
      ...prev,
    ])
    setTimeout(() => {
      onEdit(0)
    }, 500)
  }

  const onRowEditingStopped = async (event: RowEditingStoppedEvent) => {
    const data = event.data as GetAllOtherRelatedProductGroupsResult
    try {
      deleteProductGroupStates.reset()
      await postProductGroup({
        'client-name': '1',
        'client-version': '1',
        id,
        addOtherRelatedProductGroups: {
          categoryId: String(data.categoryTitle),
          productId: id,
          treePath: data.treePath,
        },
      }).unwrap()
      productGroups.refetch()
    } catch (error) {
      onEdit(event.rowIndex || 0)
    }
  }

  const defaultColDef = useMemo(() => {
    return {
      editable: true,
    }
  }, [])

  const handleDelete = useCallback(async () => {
    try {
      postProductGroupStates.reset()
      if (selectedRows.length === 1) {
        await deleteProduct({
          'client-name': '1',
          'client-version': '2',
          id: String(selectedRows[0].id),
          productId: id,
        }).unwrap()
        productGroups.refetch()
      }

      Promise.all(
        selectedRows.map((row) =>
          deleteProduct({
            'client-name': '1',
            'client-version': '2',
            id: String(row.id),
            productId: id,
          }).unwrap(),
        ),
      ).then(() => {
        productGroups.refetch()
      })

      setDeleteDialogState({ show: false, id: undefined })
    } catch (e) {
      log(e)
    }
  }, [selectedRows, deleteDialogState])

  useEffect(() => {
    if (deleteProductGroupStates.isSuccess || postProductGroupStates.isSuccess) {
      openToast({
        message: formatMessage(otherRelatedProductGroupsMessages.successfullyMessage),
        type: 'success',
      })
    }
    setSelectedRows([])
  }, [deleteProductGroupStates.isSuccess, postProductGroupStates.isSuccess])

  useEffect(() => {
    if (productGroups.isFetching || postProductGroupStates.isLoading) {
      gridRef.current?.api?.showLoadingOverlay?.()
    } else {
      gridRef.current?.api?.hideOverlay?.()
    }
  }, [productGroups.isFetching, postProductGroupStates.isLoading])

  useEffect(() => {
    if (productGroups.isSuccess) {
      setRowData(productGroups.data?.data || [])
    }
  }, [productGroups.isFetching])

  useEffect(() => {
    productGroups.refetch()
  }, [id])

  return (
    <>
      <ProductExplanation
        summaryProps={{
          title: formatMessage(otherRelatedProductGroupsMessages.otherRelatedProductGroups),
          icon: 'sitemap',
          statusLabel: productGroups.data?.data?.length ? '1' : '0',
        }}
      >
        <Box sx={{ p: 6, pb: 24 }}>
          <HBDataGridClient
            editType={'fullRow'}
            onRowEditingStopped={onRowEditingStopped}
            defaultColDef={defaultColDef}
            actionUrl={actionUrl}
            suppressClickEdit={true}
            columnDefs={columnDefs}
            animateRows
            pagination
            totalRows={productGroups.data?.data?.length || 0}
            paginationPageNumber={page}
            paginationPageSize={pageSize}
            onPageChange={(pageNumber) => setPage(pageNumber)}
            onPageSizeChange={(pageSize) => setPageSize(pageSize)}
            groupDisplayType="singleColumn"
            rowData={rowData}
            rowModelType={'clientSide'}
            rowSelection="multiple"
            serverSideStoreType={'partial'}
            enableRtl
            classes={classes}
            onSelectedChanged={handleChangedSelectedRows}
            detailRowAutoHeight
            ref={gridRef}
            GridToolbar={useCallback(
              () => (
                <HBDataGrigToolbar
                  addProps={{
                    show: true,
                    disabled: disabled || !!rowData.find((item) => item.id === ''),
                    onClick: handleAdd,
                  }}
                  statusProps={{
                    show: false,
                  }}
                  editProps={{
                    show: false,
                  }}
                  deleteProps={{
                    onClick: () => setDeleteDialogState({ show: true, id: undefined }),
                    show: selectedRows.length !== 0,
                    disabled,
                  }}
                  searchProps={{
                    show: false,
                  }}
                  refreshProps={{
                    onClick: productGroups.refetch,
                    show: true,
                  }}
                  moreProps={{
                    show: false,
                  }}
                ></HBDataGrigToolbar>
              ),
              [selectedRows.length, disabled, rowData],
            )}
          />
        </Box>
      </ProductExplanation>
      <HBDialog
        content={formatMessage(ProductPageMessages.deleteConfirmation, {
          count: selectedRows.length,
        })}
        title={formatMessage(ProductPageMessages.deleteProduct)}
        acceptBtn={formatMessage(ProductPageMessages.confirm)}
        rejectBtn={formatMessage(ProductPageMessages.cancel)}
        onReject={() => setDeleteDialogState({ show: false, id: undefined })}
        open={deleteDialogState.show}
        onAccept={handleDelete}
        onClose={() => setDeleteDialogState({ show: false, id: undefined })}
      />
    </>
  )
}

export default OtherRelatedProductGroups
