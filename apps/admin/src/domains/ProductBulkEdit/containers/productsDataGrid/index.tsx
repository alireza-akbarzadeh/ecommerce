import {
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import instance from '@hasty-bazar/admin-shared/core/handler'
import {
  BulkUpdateProductListItem,
  PostAdminCatalogProductsBulkUpdateLoadListApiResponse,
  ProductVariantItem,
  useLazyGetAdminCatalogProductsBulkUpdateListQuery,
  usePutAdminCatalogProductsBulkUpdateMutation,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { isServer, removeEmptyFields } from '@hasty-bazar/admin-shared/utils'
import { HBAgGridClasses, HBDataGrigToolbar, HBIconButton, openToast } from '@hasty-bazar/core'
import { Box, Typography, useTheme } from '@mui/material'
import { RowEditingStoppedEvent } from 'ag-grid-community'
import { isNil } from 'ramda'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'

import ProductBulkEditMessages from '../../ProductBulkEdit.messages'
import BulkEditFilterForm, { BulkEditFormType } from '../BulkEditFilterForm'
import ConfirmDialog from './confirmDialog'
import { PossibilityOfEditingProductEnum } from './status'
import UploadDialog from './UploadDialog'

import useBulkEditGridData from './useGridData'

function BulkEditProductsDataGrid() {
  const gridRef = useRef<HBDataGridClientRef>(null)
  const [getProductList, products] = useLazyGetAdminCatalogProductsBulkUpdateListQuery()
  const [productList, setProductList] = useState<BulkUpdateProductListItem[]>([])

  const { columns } = useBulkEditGridData()
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
  const [openUploadDialog, setOpenUploadDialog] = useState(false)

  const excelUrl =
    process.env.NEXT_PUBLIC_GATEWAY + `/Admin/Catalog/products/bulk-update/download-excel`
  const downloadExcelHandler = async () => {
    try {
      const res = await instance.post(
        excelUrl,
        {
          productsHSIN: productList.map((item) => item.hsin),
        },
        {
          params: removeEmptyFields({
            'client-name': 'hasty-bazar-admin',
            'client-version': '1.0.0',
          }),
          responseType: 'blob',
        },
      )

      if (!isServer()) {
        const url = window.URL.createObjectURL(
          new Blob([res.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          }),
        )
        window.open(url, '_blank')
      }
    } catch (error) {}
  }
  const [selectedRows, setSelectedRows] = useState<ProductVariantItem[]>([])

  const [bulkupdateMutate, bulkupdateStates] = usePutAdminCatalogProductsBulkUpdateMutation()
  const theme = useTheme()
  const { formatMessage } = useIntl()

  const actionUrl = ``

  const handleChangedSelectedRows = (selectedRows: ProductVariantItem[]) => {
    setSelectedRows(selectedRows)
  }

  const classes: HBAgGridClasses = {
    wrapper: {
      paddingBottom: 20,
      backgroundColor: `${theme.palette.common.white} !important`,
      maxHeight: 296,

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
  const renderPossibilityOfEditingProductEnumText = (
    status: PossibilityOfEditingProductEnum,
  ): string => {
    switch (status) {
      case PossibilityOfEditingProductEnum.Applicable:
        return formatMessage(ProductBulkEditMessages.applicable)
      case PossibilityOfEditingProductEnum.Unchanged:
        return formatMessage(ProductBulkEditMessages.unchanged)
      case PossibilityOfEditingProductEnum.FailureDataStructure:
        return formatMessage(ProductBulkEditMessages.failureDataStructure)
      case PossibilityOfEditingProductEnum.RecordNotFound:
        return formatMessage(ProductBulkEditMessages.recordNotFound)
      case PossibilityOfEditingProductEnum.InvalidInventory:
        return formatMessage(ProductBulkEditMessages.InvalidInventory)
      default:
        return formatMessage(ProductBulkEditMessages.undefined)
    }
  }

  const onRowEditingStopped = async (event: RowEditingStoppedEvent) => {
    const newRowData = event.data

    const oldRowData =
      products?.data?.data?.items?.find((product) => product.id === newRowData.id) || {}
    const changedFields = Object.keys(newRowData).filter((key) => {
      return Number(newRowData[key]) !== Number(oldRowData[key as keyof typeof oldRowData])
    })

    const _productList = [...productList]
    const index = _productList.findIndex((product) => product.id === newRowData.id)
    const hasPriceError =
      (!isNil(newRowData.originalPrice) &&
        newRowData.originalPrice !== '' &&
        newRowData.originalPrice <= 0) ||
      (!isNil(newRowData.finalPrice) &&
        newRowData?.finalPrice !== '' &&
        newRowData?.finalPrice <= 0) ||
      (!newRowData.originalPrice && newRowData.finalPrice)

    if (hasPriceError) {
      onEdit(event.rowIndex || 0)
      openToast({
        message: formatMessage(ProductBulkEditMessages.zeroPriceError),
        type: 'error',
      })
      return
    }

    const invalidPrice =
      newRowData.originalPrice &&
      newRowData.originalPrice &&
      Number(newRowData.finalPrice) > Number(newRowData.originalPrice)
    if (invalidPrice) {
      onEdit(event.rowIndex || 0)
      openToast({
        message: formatMessage(ProductBulkEditMessages.discountPriceError),
        type: 'error',
      })
      return
    }
    if (index > -1) {
      _productList[index] = {
        ...{
          ...newRowData,
          possibilityOfEditing: invalidPrice
            ? PossibilityOfEditingProductEnum.FailureDataStructure
            : PossibilityOfEditingProductEnum.Applicable,
          possibilityOfEditingTitle: renderPossibilityOfEditingProductEnumText(
            invalidPrice
              ? PossibilityOfEditingProductEnum.FailureDataStructure
              : PossibilityOfEditingProductEnum.Applicable,
          ),
          changedFinalPrice: changedFields.includes('finalPrice'),
          changedOriginalPrice: changedFields.includes('originalPrice'),
          changedInventory: changedFields.includes('inventory'),
        },
      }
    }

    const editedProducts = _productList.filter((product) => {
      return product.changedFinalPrice || product.changedOriginalPrice || product.changedInventory
    })
    const NotEditedProducts = _productList.filter((product) => {
      return (
        !product.changedFinalPrice && !product.changedOriginalPrice && !product.changedInventory
      )
    })

    setProductList([...editedProducts, ...NotEditedProducts])
  }

  const defaultColDef = useMemo(() => {
    return {
      editable: true,
    }
  }, [])

  useEffect(() => {
    if (bulkupdateStates.isSuccess) {
      openToast({
        message: formatMessage(ProductBulkEditMessages.successfullyMessage),
        type: 'success',
      })
      setOpenConfirmDialog(false)
    }
  }, [bulkupdateStates.isSuccess])

  useEffect(() => {
    if (products.isFetching) {
      gridRef?.current?.api?.showLoadingOverlay()
    } else {
      gridRef?.current?.api?.hideOverlay()
    }
  }, [products.isFetching])

  const onFilter = (data: BulkEditFormType) => {
    const filterData = removeEmptyFields<BulkEditFormType>({
      ...data,
      ...(data.fromPublicationDate
        ? { fromPublicationDate: new Date(data.fromPublicationDate).toISOString() }
        : {}),
      ...(data.untilPublicationDate
        ? { untilPublicationDate: new Date(data.untilPublicationDate).toISOString() }
        : {}),
    })

    getProductList({
      'client-name': '1',
      'client-version': '1',
      ...filterData,
    })
  }

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

  const onUpload: (data: {
    data: PostAdminCatalogProductsBulkUpdateLoadListApiResponse
  }) => void = (data) => {
    setProductList(data.data.data?.items || [])
    setOpenUploadDialog(false)
  }

  const onDelete = () => {
    const removedItems = selectedRows.map((item) => item.id)
    const updatedProductList = productList.filter((item) => !removedItems.includes(item.id))
    setProductList(updatedProductList)
    setSelectedRows([])
  }

  useEffect(() => {
    if (products.data?.data?.items?.length) {
      setProductList(products.data?.data.items)
    } else {
      setProductList([])
    }
  }, [products.data?.data?.items?.length])

  const bulkUpdate = () => {
    const _productList = productList.map((item) => {
      return {
        id: item.id,
        finalPrice: String(item.finalPrice),
        originalPrice: String(item.originalPrice),
        inventory: String(item.inventory),
        possibilityOfEditing: item.possibilityOfEditing,
        changedFinalPrice: item.changedFinalPrice,
        changedOriginalPrice: item.changedOriginalPrice,
        changedInventory: item.changedInventory,
      }
    })

    bulkupdateMutate({
      'client-name': '1',
      'client-version': '1',
      bulkUpdateProductInventoryPriceModel: {
        productsInventoryPrice: _productList,
      },
    })
  }
  const changedCounts = useMemo(() => {
    return productList.filter(
      (item) => item.changedFinalPrice || item.changedOriginalPrice || item.changedInventory,
    ).length
  }, [productList])

  const gridToolbar = useCallback(
    () => (
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
          show: selectedRows.length > 0,
          onClick: onDelete,
        }}
        searchProps={{
          show: false,
        }}
        refreshProps={{
          show: false,
        }}
        items={[
          {
            label: formatMessage(ProductBulkEditMessages.downloadExcel),
            icon: 'fileDownload',
            onClick: downloadExcelHandler,
          },
          {
            label: formatMessage(ProductBulkEditMessages.uploadExcel),
            icon: 'uploadAlt',
            onClick: () => setOpenUploadDialog(true),
          },
        ]}
        moreProps={{
          show: true,
        }}
      >
        {!!changedCounts && (
          <HBIconButton icon="check" onClick={() => setOpenConfirmDialog(true)} />
        )}
      </HBDataGrigToolbar>
    ),
    [selectedRows.length, products.data?.data?.items?.length, productList, changedCounts],
  )

  const onResetFilter = () => {
    setProductList([])
    setSelectedRows([])
  }

  return (
    <>
      <BulkEditFilterForm onFilter={onFilter} onResetFilter={onResetFilter} />
      <Box sx={{ p: 6 }}>
        <HBDataGridClient
          editType={'fullRow'}
          onRowEditingStopped={onRowEditingStopped}
          defaultColDef={defaultColDef}
          actionUrl={actionUrl}
          columnDefs={columns}
          animateRows
          rowSelection="multiple"
          sideBar
          rowData={[...productList.map((item) => ({ ...item }))]}
          enableRtl
          classes={classes}
          onSelectedChanged={handleChangedSelectedRows}
          detailRowAutoHeight
          ref={gridRef}
          rightHeader={
            <Box display={'flex'} gap={4} alignItems={'center'}>
              <Typography whiteSpace={'nowrap'} variant="h6">
                {formatMessage(ProductBulkEditMessages.productList)}
              </Typography>
              <Box display={'flex'} alignItems={'center'}>
                <Typography whiteSpace={'nowrap'} variant="body1" display={'flex'} gap={1}>
                  {formatMessage(ProductBulkEditMessages.productsNumber)}
                </Typography>
                <Typography variant="body1" color={'info.main'} component={'span'}>
                  {productList?.length}
                </Typography>
              </Box>
              <Box display={'flex'} alignItems={'center'}>
                <Typography whiteSpace={'nowrap'} variant="body1" display={'flex'} gap={1}>
                  {formatMessage(ProductBulkEditMessages.editedProductsNumber)}
                </Typography>
                <Typography variant="body1" color={'info.main'} component={'span'}>
                  {changedCounts}
                </Typography>
              </Box>
            </Box>
          }
          GridToolbar={gridToolbar}
        />
      </Box>

      <UploadDialog
        open={openUploadDialog}
        onClose={() => {
          setOpenUploadDialog(false)
        }}
        onUpload={onUpload}
      />
      <ConfirmDialog
        count={changedCounts}
        open={openConfirmDialog}
        onClose={() => {
          setOpenConfirmDialog(false)
        }}
        isLoading={bulkupdateStates.isLoading}
        onConfirm={bulkUpdate}
      />
    </>
  )
}

export default BulkEditProductsDataGrid
