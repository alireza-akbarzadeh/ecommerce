import { GridActionColumn } from '@hasty-bazar/admin-shared/components'
import {
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { useAppSelector } from '@hasty-bazar/admin-shared/core/redux/hooks'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  useDeleteAdminCatalogConfigurableProductsByIdChildProductMutation,
  useGetAdminCatalogConfigurableProductsByIdVariantProductItemsQuery,
  usePutAdminCatalogConfigurableProductsByIdChildProductAndChildProductIdMutation,
  usePutAdminCatalogConfigurableProductsByIdRemoveChildProductMutation,
} from '@hasty-bazar-admin/domains/Products/catalogApi.enhanced'
import { ProductExplanation } from '@hasty-bazar-admin/domains/Products/components'
import ProductPageMessages from '@hasty-bazar-admin/domains/Products/ProductPage.messages'
import {
  ProductVariantItem,
  UpdateChildProductModel,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { useGetAdminGeneralDataSystemSettingByKeyByKeyQuery } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import {
  HBAgGridClasses,
  HBButton,
  HBDataGrigToolbar,
  HBDialog,
  HBIconButton,
  openToast,
} from '@hasty-bazar/core'
import { Box, Typography, useTheme } from '@mui/material'
import {
  CheckboxSelectionCallbackParams,
  ColDef,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
  RowEditingStoppedEvent,
} from 'ag-grid-community'
import { useRouter } from 'next/router'
import { isNil } from 'ramda'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { DuplicationSectionProps, ExpandedSteps } from '..'
import {
  default as duplicationSettings,
  default as DuplicationSettingsMessages,
} from '../duplicationSettings.messages'
import ChangeDialogEffective from './changeEffectiveDiaolog'
import { HBInventoryTextFieldEditor, HBPriceTextFieldEditor } from './customCellEditors'
import Status, { StatusEnum } from './status'

function CreateReadyDuplicationProducts({ expanded, onNext, onPrev }: DuplicationSectionProps) {
  const router = useRouter()

  const defaultCurrency = useAppSelector((state) => String(state.app.defaultCurrencyTitle))

  const id = router.query.id as string
  const [deleteDialogState, setDeleteDialogState] = useState<{ show: boolean; id?: string }>({
    show: false,
  })
  const [changeEffectiveDialogState, setChangeEffectiveDialogState] = useState<{
    show: boolean
    id?: string
  }>({
    show: false,
  })

  const [selectedRows, setSelectedRows] = useState<ProductVariantItem[]>([])
  const products = useGetAdminCatalogConfigurableProductsByIdVariantProductItemsQuery({
    'client-name': '1',
    'client-version': '1',
    id,
  })

  const [updateProduct, updateProductStates] =
    usePutAdminCatalogConfigurableProductsByIdChildProductAndChildProductIdMutation()

  const [deleteProduct, deleteProductStates] =
    usePutAdminCatalogConfigurableProductsByIdRemoveChildProductMutation()

  const theme = useTheme()
  const { formatMessage } = useIntl()

  const actionUrl = ``
  const gridRef = useRef<HBDataGridClientRef>(null)

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
                  icon: 'pen',
                  label: formatMessage(phrasesMessages.edit),
                  onClick: () => {
                    onEdit(props?.rowIndex)
                  },
                },
                {
                  icon: 'trashAlt',
                  label: formatMessage(phrasesMessages.delete),
                  onClick: () => setDeleteDialogState({ show: true, id: props?.data?.id }),
                },
                { icon: 'historyAlt', label: formatMessage(phrasesMessages.history) },
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
  const handleChangedSelectedRows = (selectedRows: ProductVariantItem[]) => {
    setSelectedRows(selectedRows)
  }
  const columnDefs: ColDef[] = useMemo(
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
        editable: false,
        cellRenderer: GridActions,
        checkboxSelection,
        headerCheckboxSelection,
      },

      {
        headerName: formatMessage(DuplicationSettingsMessages.hsin),
        field: 'hsin' as keyof ProductVariantItem,
        editable: false,
      },
      {
        headerName: formatMessage(DuplicationSettingsMessages.productTitle),
        field: 'name' as keyof ProductVariantItem,
      },
      {
        headerName: formatMessage(DuplicationSettingsMessages.sku),
        field: 'sku' as keyof ProductVariantItem,
      },
      {
        headerName: formatMessage(DuplicationSettingsMessages.originalPrice, {
          currency: defaultCurrency,
        }),
        field: 'originalPrice' as keyof ProductVariantItem,
        cellEditor: HBPriceTextFieldEditor,
      },
      {
        headerName: formatMessage(DuplicationSettingsMessages.offPrice, {
          currency: defaultCurrency,
        }),
        field: 'finalPrice' as keyof ProductVariantItem,
        cellEditor: HBPriceTextFieldEditor,
      },

      {
        headerName: formatMessage(DuplicationSettingsMessages.qty),
        field: 'qty' as keyof ProductVariantItem,
        cellEditor: HBInventoryTextFieldEditor,
      },

      {
        headerName: formatMessage(DuplicationSettingsMessages.status),
        field: 'productStatus' as keyof ProductVariantItem,
        editable: false,
        cellRenderer: (params: ICellRendererParams) => {
          return (
            <Box sx={{ mt: 2 }}>
              <Status status={params.value as unknown as StatusEnum} />
            </Box>
          )
        },
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
    ],
    [defaultCurrency],
  )

  const classes: HBAgGridClasses = {
    wrapper: {
      paddingBottom: '20px',
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
      colKey: 'name',
    })
  }

  const [deleteAllDuplications, deleteAllDuplicationsStates] =
    useDeleteAdminCatalogConfigurableProductsByIdChildProductMutation()
  const onRowEditingStopped = async (event: RowEditingStoppedEvent) => {
    const data = event.data

    const hasPriceError =
      (!isNil(data.originalPrice) && data!.originalPrice! !== '' && data!.originalPrice! <= 0) ||
      (!isNil(data.finalPrice) && data!.finalPrice! !== '' && data!.finalPrice! <= 0)
    if (hasPriceError) {
      onEdit(event.rowIndex || 0)
      openToast({
        message: formatMessage(DuplicationSettingsMessages.zeroPriceError),
        type: 'error',
      })
      return
    }
    const invalidPrice =
      data.originalPrice &&
      data.originalPrice &&
      Number(data.finalPrice) > Number(data.originalPrice)
    if (invalidPrice) {
      onEdit(event.rowIndex || 0)
      openToast({
        message: formatMessage(DuplicationSettingsMessages.discountPriceError),
        type: 'error',
      })
      return
    }

    const { id: childProductId, ...updateChildProductModel } = data
    try {
      await updateProduct({
        'client-name': '1',
        childProductId: String(childProductId),
        id,
        'client-version': '1',
        updateChildProductModel: updateChildProductModel as UpdateChildProductModel,
      })
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
      if (deleteDialogState.id === 'all') {
        deleteAllDuplications({
          'client-name': '1',
          'client-version': '2',
          id,
        })
        setDeleteDialogState({ show: false, id: undefined })
        return
      }

      if (selectedRows.length) {
        deleteProduct({
          'client-name': '1',
          'client-version': '2',
          id,
          removeChildProductModel: {
            productIds: selectedRows.map((product) => String(product.id)) || [''],
          },
        })
      } else {
        deleteProduct({
          'client-name': '1',
          'client-version': '2',
          id,
          removeChildProductModel: {
            productIds: [String(deleteDialogState.id)],
          },
        })
      }
      setDeleteDialogState({ show: false, id: undefined })
    } catch (e) {}
  }, [selectedRows, deleteDialogState])

  useEffect(() => {
    if (
      deleteAllDuplicationsStates.isSuccess ||
      deleteProductStates.isSuccess ||
      updateProductStates.isSuccess
    ) {
      openToast({
        message: formatMessage(duplicationSettings.successfullyMessage),
        type: 'success',
      })
      if (deleteAllDuplicationsStates.isSuccess) {
        const event: any = {}
        onPrev(event, ExpandedSteps.DuplicationFactors)
      }
    }
    setSelectedRows([])
  }, [
    deleteAllDuplicationsStates.isSuccess,
    deleteProductStates.isSuccess,
    updateProductStates.isSuccess,
  ])

  useEffect(() => {
    if (products.isFetching || updateProductStates.isLoading) {
      gridRef?.current?.api?.showLoadingOverlay()
    } else {
      gridRef?.current?.api?.hideOverlay()
    }
  }, [products.isFetching, updateProductStates.isLoading])

  const handleChangedGridActions = (value: number | string, type: 'search' | 'status') => {
    if (type === 'status') {
      let filterComponent = gridRef.current!.api.getFilterInstance('')
      filterComponent &&
        filterComponent.setModel({
          type: 'equals',
          filter: value !== -1 ? value : null,
        })
      gridRef.current!.api.onFilterChanged()
    }
  }

  const productList = useMemo(
    () =>
      products.isFetching
        ? []
        : products.data?.data?.items?.length
        ? [...products.data?.data?.items.map((item) => ({ ...item }))]
        : [],
    [products.data?.data?.items?.length, products.isFetching],
  )
  return (
    <>
      <ProductExplanation
        summaryProps={{
          title: formatMessage(duplicationSettings.createReadyDuplicationProducts),
          icon: 'plusCircle',
          statusLabel: products.data?.data?.items?.length ? '1' : '0',
        }}
        nextStepButtonProps={{
          text: formatMessage(phrasesMessages.next),
          onClick: () => router.push(`/products/configurable-product/edit/content-settings/${id}`),
        }}
        expanded={expanded}
      >
        <Box sx={{ p: 6 }}>
          <HBDataGridClient
            editType={'fullRow'}
            onRowEditingStopped={onRowEditingStopped}
            defaultColDef={defaultColDef}
            actionUrl={actionUrl}
            columnDefs={columnDefs}
            animateRows
            groupDisplayType="singleColumn"
            rowData={productList}
            rowSelection="single"
            enableRtl
            classes={classes}
            onSelectedChanged={handleChangedSelectedRows}
            detailRowAutoHeight
            ref={gridRef}
            rightHeader={
              <Typography sx={{ fontWeight: 'medium' }}>
                {formatMessage(DuplicationSettingsMessages.tableTitle)}
              </Typography>
            }
            GridToolbar={() => (
              <HBDataGrigToolbar
                onChange={handleChangedGridActions}
                addProps={{
                  show: false,
                }}
                statusProps={{
                  show: false,
                }}
                editProps={{
                  show: selectedRows.length === 1,
                  onClick: () => {
                    const activeIndex = products.data?.data?.items?.findIndex(
                      (item) => item.id === selectedRows[0]?.id,
                    )

                    onEdit(activeIndex!)
                  },
                }}
                deleteProps={{
                  onClick: () => setDeleteDialogState({ show: true, id: undefined }),
                  show: selectedRows.length !== 0,
                }}
                searchProps={{
                  show: false,
                }}
                refreshProps={{
                  onClick: products.refetch,
                }}
                moreProps={{
                  show: false,
                }}
              >
                <HBButton
                  onClick={(event) => {
                    setChangeEffectiveDialogState({ show: true, id: undefined })
                  }}
                  size="small"
                  variant="outlined"
                >
                  {formatMessage(DuplicationSettingsMessages.changeEffective)}
                </HBButton>
                <HBButton
                  size="small"
                  onClick={(event) =>
                    setDeleteDialogState({
                      show: true,
                      id: 'all',
                    })
                  }
                  variant="outlined"
                >
                  {formatMessage(DuplicationSettingsMessages.resubmitDuplication)}
                </HBButton>
                <HBButton
                  onClick={(event) => {
                    onPrev(event, ExpandedSteps.DuplicationFactors)
                  }}
                  size="small"
                >
                  {formatMessage(DuplicationSettingsMessages.createDuplication)}
                </HBButton>
              </HBDataGrigToolbar>
            )}
          />
        </Box>
      </ProductExplanation>
      <HBDialog
        content={formatMessage(ProductPageMessages.deleteConfirmation, {
          count:
            deleteDialogState.id === 'all'
              ? products.data?.data?.items?.length
              : selectedRows.length,
        })}
        title={formatMessage(ProductPageMessages.deleteProduct)}
        acceptBtn={formatMessage(ProductPageMessages.confirm)}
        rejectBtn={formatMessage(ProductPageMessages.cancel)}
        onReject={() => setDeleteDialogState({ show: false, id: undefined })}
        open={deleteDialogState.show}
        onAccept={handleDelete}
        onClose={() => setDeleteDialogState({ show: false, id: undefined })}
      />
      <ChangeDialogEffective
        open={changeEffectiveDialogState.show}
        onClose={() => setChangeEffectiveDialogState({ show: false, id: undefined })}
      />
    </>
  )
}

export default CreateReadyDuplicationProducts
