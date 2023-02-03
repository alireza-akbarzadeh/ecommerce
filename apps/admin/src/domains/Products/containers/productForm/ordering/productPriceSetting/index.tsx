import {
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import HBDateTimePicker from '@hasty-bazar/admin-shared/containers/HBDateTimePicker'
import HBDateTimePickerController from '@hasty-bazar/admin-shared/containers/HBDateTimePickerController'
import HBNumericFormatController from '@hasty-bazar/admin-shared/containers/HBNumericFormatController'
import { useAppSelector } from '@hasty-bazar/admin-shared/core/redux/hooks'
import { useGetAdminCatalogSimpleProductsByIdProductPriceAdjustmentQuery } from '@hasty-bazar-admin/domains/Products/catalogApi.enhanced'
import { ProductExplanation } from '@hasty-bazar-admin/domains/Products/components'
import { getProductType } from '@hasty-bazar-admin/domains/Products/utils'
import useToast from '@hasty-bazar/admin-shared/hooks/useToast'
import {
  GetProductQueryResult,
  useGetAdminCatalogConfigurableProductsByIdProductPriceAdjustmentAndProductPriceAdjustmentIdQuery,
  useGetAdminCatalogConfigurableProductsByIdProductPriceAdjustmentQuery,
  useGetAdminCatalogConfigurableProductsByIdQuery,
  useGetAdminCatalogSimpleProductsByIdProductPriceAdjustmentAndProductPriceAdjustmentIdQuery,
  useGetAdminCatalogSimpleProductsByIdQuery,
  usePostAdminCatalogConfigurableProductsByIdProductPriceAdjustmentMutation,
  usePostAdminCatalogSimpleProductsByIdProductPriceAdjustmentMutation,
  usePutAdminCatalogConfigurableProductsByIdProductPriceAdjustmentAndProductPriceAdjustmentIdMutation,
  usePutAdminCatalogConfigurableProductsByIdProductPriceAdjustmentMutation,
  usePutAdminCatalogSimpleProductsByIdProductPriceAdjustmentAndProductPriceAdjustmentIdMutation,
  usePutAdminCatalogSimpleProductsByIdProductPriceAdjustmentMutation,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { useGetAdminGeneralDataSystemSettingByKeyByKeyQuery } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { commafy } from '@hasty-bazar/admin-shared/utils'
import { getFilterFromOnFilterChanged } from '@hasty-bazar/admin-shared/utils/gridUtil'
import {
  HBAgGridClasses,
  HBButton,
  HBDataGrigToolbar,
  HBDialog,
  HBForm,
  HBFormItemTextField,
} from '@hasty-bazar/core'
import { Box, Grid, useTheme } from '@mui/material'
import {
  CheckboxSelectionCallbackParams,
  ColDef,
  FilterChangedEvent,
  ICellRendererParams,
  RowEditingStoppedEvent,
  SortChangedEvent,
} from 'ag-grid-community'
import { format } from 'date-fns-jalali'
import { useRouter } from 'next/router'
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import OrderingMessages from '../Ordering.messages'
import ProductPriceSettingMessages from './ProductPriceSetting.messages'

interface ProductPriceSettingInterface {
  fromDate: string
  toDate: string
  count: number
  price: string
  description: string
  originalPrice: string
  priceChangePercent: string
}

function ProductPriceSetting() {
  const defaultCurrency = useAppSelector((state) => String(state.app.defaultCurrencyTitle))
  const theme = useTheme()
  const router = useRouter()
  const defaultProductType = getProductType(router.pathname)
  const productType = getProductType(router.asPath) || defaultProductType
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [filter, setFilter] = useState<string>()
  const [ordering, setOrdering] = useState<string>()
  const [openModal, setOpenModal] = useState(false)
  const handleOpenModal = () => {
    formProviderProps.setValue(
      'originalPrice',
      (productInfo as GetProductQueryResult)?.originalPrice as unknown as string,
    )
    if (!isEdit) formProviderProps.setValue('price', '0')
    setOpenModal(true)
  }
  const handleCloseModal = () => {
    setOpenModal(false)
    formProviderProps.reset({})
    setIsEdit(false)
  }

  const { formatMessage } = useIntl()

  const { query: { id: slugId } = {} } = useRouter()

  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/Catalog/${productType}-products/${slugId}/product-price-adjustment`
  const queryArgs = {
    'client-name': 'hasty-bazar-admin',
    productId: String(slugId),
    'client-version': '1.0.0',
    filter,
    pageSize,
    pageNumber: page,
    ordering,
    id: String(slugId),
  }
  const productPriceAdjustment =
    productType === 'simple'
      ? useGetAdminCatalogSimpleProductsByIdProductPriceAdjustmentQuery(queryArgs)
      : useGetAdminCatalogConfigurableProductsByIdProductPriceAdjustmentQuery(queryArgs)
  const gridRef = useRef<HBDataGridClientRef>(null)

  const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const JALALI_DATE_FORMAT = 'yyyy-MM-dd - HH:mm:ss'

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
        disableHighlightToday={props?.colDef?.field === 'toDate'}
        shouldDisableDate={(date: any) => {
          return props?.colDef?.field === 'toDate' && date.getDate() === new Date().getDate()
        }}
        inputDisabled
        value={selectedValue}
        onChange={onChangeHandler}
      />
    )
  })

  const columnDefs: ColDef[] = [
    {
      headerName: '',
      maxWidth: 65,
      resizable: false,
      sortable: false,
      filter: false,
      suppressAutoSize: true,
      suppressMenu: false,
      field: 'checkbox',
      checkboxSelection,
      editable: false,
    },
    {
      headerName: formatMessage(ProductPriceSettingMessages.fromDate),
      field: 'fromDate',
      cellRenderer: (params: ICellRendererParams) => {
        return format(new Date(params?.value), JALALI_DATE_FORMAT)
      },
      cellEditor: CustomCellEditor,
    },
    {
      headerName: formatMessage(ProductPriceSettingMessages.toDate),
      field: 'toDate',
      cellRenderer: (params: ICellRendererParams) => {
        if (params?.value) {
          return format(new Date(params?.value), JALALI_DATE_FORMAT)
        }
      },
      cellEditor: CustomCellEditor,
    },
    {
      headerName: formatMessage(ProductPriceSettingMessages.count),
      field: 'count',
    },
    {
      headerName: formatMessage(ProductPriceSettingMessages.price),
      field: 'price',
      cellRenderer(params: ICellRendererParams) {
        return commafy(params.value)
      },
    },
    {
      headerName: formatMessage(ProductPriceSettingMessages.description),
      field: 'description',
    },
  ]

  const classes: HBAgGridClasses = {
    wrapper: {
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

  const formProviderProps = useForm<ProductPriceSettingInterface>({
    mode: 'onChange',
  })

  const [postPriceAdjustment, postPriceAdjustmentOptions] =
    productType === 'simple'
      ? usePostAdminCatalogSimpleProductsByIdProductPriceAdjustmentMutation()
      : usePostAdminCatalogConfigurableProductsByIdProductPriceAdjustmentMutation()

  const { showToast } = useToast()

  const [selectedRow, setSelectedRow] = useState<any | undefined>(undefined)

  const [isEdit, setIsEdit] = useState<boolean>(false)
  const args = {
    'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
    'client-version': '1.0.1.100',
    id: String(slugId),
    productPriceAdjustmentId: String(selectedRow?.id),
  }

  const options = {
    skip: !selectedRow?.id,
  }
  const {
    data: { data: editableRow } = {},
    refetch,
    isFetching,
  } = productType === 'simple'
    ? useGetAdminCatalogSimpleProductsByIdProductPriceAdjustmentAndProductPriceAdjustmentIdQuery(
        args,
        options,
      )
    : useGetAdminCatalogConfigurableProductsByIdProductPriceAdjustmentAndProductPriceAdjustmentIdQuery(
        args,
        options,
      )

  useEffect(() => {
    if (isEdit) {
      refetch()
    }
  }, [isEdit])

  useEffect(() => {
    if (isEdit) {
      if (editableRow) formProviderProps.reset(editableRow as any)
      handleOpenModal()
    }
  }, [editableRow, isFetching])

  const [editPriceAdjustment, editPriceAdjustmentOptions] =
    productType === 'simple'
      ? usePutAdminCatalogSimpleProductsByIdProductPriceAdjustmentAndProductPriceAdjustmentIdMutation()
      : usePutAdminCatalogConfigurableProductsByIdProductPriceAdjustmentAndProductPriceAdjustmentIdMutation()

  const [deletePriceAdjustment, deletePriceAdjustmentOptions] =
    productType === 'simple'
      ? usePutAdminCatalogSimpleProductsByIdProductPriceAdjustmentMutation()
      : usePutAdminCatalogConfigurableProductsByIdProductPriceAdjustmentMutation()

  const refreshTable = () => {
    productPriceAdjustment.refetch()
    gridRef.current?.api?.deselectAll()
  }

  const productQueryArgs = {
    'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
    'client-version': '1.0.1.100',
    id: String(slugId),
  }
  const { data: { data: productInfo = {} } = {} } =
    productType === 'simple'
      ? useGetAdminCatalogSimpleProductsByIdQuery(productQueryArgs)
      : useGetAdminCatalogConfigurableProductsByIdQuery(productQueryArgs)

  const calculatePercent = (originalPrice = 0, price = 0): string => {
    if (!price || price === 0) return '0%'
    const calculationResult = (originalPrice / price - 1) * 100
    if (originalPrice > price) return '+' + calculationResult.toFixed(2).toString() + '%'
    return `${calculationResult.toFixed(2).toString() || 0} %`
  }
  const handleChangedGridActions = (value: number | string, type: 'search' | 'status') => {
    if (type === 'status') {
      let filterComponent = gridRef.current!.api.getFilterInstance('count')
      filterComponent &&
        filterComponent.setModel({
          type: 'equals',
          filter: value !== -1 ? value : null,
        })
      gridRef.current!.api.onFilterChanged()
    }
  }
  const onSortChange = (event: SortChangedEvent) => {
    const { colId, sort } = event.columnApi.getColumnState().find((col) => col.sort !== null) || {}
    if (colId) {
      setOrdering(`${colId} ${sort}`)
    }
  }
  const onFilterChanged = (event: FilterChangedEvent) => {
    const { serializedFilter } = getFilterFromOnFilterChanged(event)

    setFilter(serializedFilter)
  }

  useEffect(() => {
    const calculationResult = calculatePercent(
      formProviderProps.getValues('price') as unknown as number,
      formProviderProps.getValues('originalPrice') as unknown as number,
    )

    formProviderProps.setValue('priceChangePercent', calculationResult)
  }, [formProviderProps.watch('price')])

  useEffect(() => {
    if (productPriceAdjustment.isFetching) {
      gridRef.current?.api?.showLoadingOverlay?.()
    } else {
      gridRef.current?.api?.hideOverlay?.()
    }
  }, [productPriceAdjustment.isFetching])

  const defaultColDef = useMemo(() => {
    return {
      editable: false,
    }
  }, [])

  const handleInGridUpdate = async (event: RowEditingStoppedEvent) => {
    const values = event?.data
    const updateProductPriceAdjustmentModel = {
      description: values?.description || undefined,
      fromDate: values?.fromDate,
      toDate: values?.toDate || undefined,
      count: Number(values?.count),
      price: Number(values?.price),
    }

    try {
      await editPriceAdjustment({
        'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
        'client-version': '1.0.1.100',
        id: String(slugId),
        productPriceAdjustmentId: String(values?.id),
        updateProductPriceAdjustmentModel,
      }).unwrap()

      showToast(formatMessage(ProductPriceSettingMessages.successPut), 'success')

      refreshTable()
    } catch {}
  }

  const handleSubmit = async (values: {
    fromDate: string
    toDate: string
    count: number
    price: string
    description: string
    originalPrice: string
    priceChangePercent: string
  }) => {
    if (!isEdit) {
      const addProductPriceAdjustmentModel = {
        description: values.description || undefined,
        fromDate: values.fromDate,
        toDate: values.toDate || undefined,
        count: Number(values.count),
        price: Number(values.price),
      }

      try {
        await postPriceAdjustment({
          'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
          'client-version': '1.0.1.100',
          id: String(slugId),
          addProductPriceAdjustmentModel,
        }).unwrap()

        showToast(formatMessage(ProductPriceSettingMessages.successPost), 'success')
        handleCloseModal()
        refreshTable()
      } catch {}
    } else if (isEdit) {
      const updateProductPriceAdjustmentModel = {
        description: values.description || undefined,
        fromDate: values.fromDate,
        toDate: values.toDate || undefined,
        count: Number(values.count),
        price: Number(values.price),
      }

      try {
        await editPriceAdjustment({
          'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
          'client-version': '1.0.1.100',
          id: String(slugId),
          productPriceAdjustmentId: String(selectedRow?.id),
          updateProductPriceAdjustmentModel,
        }).unwrap()

        showToast(formatMessage(ProductPriceSettingMessages.successPut), 'success')
        handleCloseModal()
        refreshTable()
      } catch {}
    }
  }

  return (
    <ProductExplanation
      disabled={!productInfo?.vendorId || !productInfo?.originalPrice || productType !== 'simple'}
      summaryProps={{
        title: formatMessage(OrderingMessages.productPriceSetting),
        icon: 'pricetagAlt',
        statusLabel: productPriceAdjustment.data?.data?.totalItems ? '1' : '0',
      }}
    >
      <Box sx={{ pb: 34 }}>
        <HBDataGridClient
          onDoubleClick={(event) => {
            setSelectedRow(event?.data)
            setIsEdit(true)
          }}
          editType={'fullRow'}
          defaultColDef={defaultColDef}
          onRowEditingStopped={(event) => handleInGridUpdate(event)}
          rowData={
            productPriceAdjustment?.data?.data?.items?.length
              ? [
                  ...productPriceAdjustment.data?.data?.items.map((item) => {
                    return {
                      ...item,
                    }
                  }),
                ]
              : []
          }
          actionUrl={actionUrl}
          columnDefs={columnDefs}
          pagination
          animateRows
          totalRows={productPriceAdjustment.data?.data?.totalItems}
          onSortChanged={onSortChange}
          onFilterChanged={onFilterChanged}
          paginationPageNumber={page}
          paginationPageSize={pageSize}
          onPageChange={(pageNumber) => setPage(pageNumber)}
          onPageSizeChange={(pageSize) => setPageSize(pageSize)}
          enableRtl
          classes={classes}
          onSelectedChanged={(selectedRows: any) => {
            const priceSetting = selectedRows[0]

            setSelectedRow(priceSetting)
          }}
          ref={gridRef}
          GridToolbar={() => (
            <HBDataGrigToolbar
              addProps={{
                onClick: () => handleOpenModal(),
              }}
              statusProps={{ show: false }}
              editProps={{
                disabled: selectedRow === undefined,
                onClick: () => {
                  setIsEdit(true)
                },
              }}
              onChange={handleChangedGridActions}
              deleteProps={{
                disabled: selectedRow === undefined,
                onClick: async () => {
                  try {
                    await deletePriceAdjustment({
                      'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
                      'client-version': '1.0.1.100',
                      id: String(slugId),
                      deleteProductPriceAdjustmentModel: {
                        productPriceAdjustmentIds: [String(selectedRow?.id)],
                      },
                    })

                    showToast(formatMessage(ProductPriceSettingMessages.successDelete), 'success')
                    refreshTable()
                  } catch {}
                },
              }}
            />
          )}
        />

        <HBDialog
          open={openModal}
          onClose={() => {
            handleCloseModal()
          }}
          onReject={() => {
            handleCloseModal()
          }}
          title={formatMessage(ProductPriceSettingMessages.modalTitle)}
        >
          <Box>
            <HBForm<ProductPriceSettingInterface>
              formProviderProps={formProviderProps}
              onSubmit={(values) => handleSubmit(values)}
              criteriaMode="all"
              mode="onSubmit"
            >
              <Grid container spacing={6} sx={{ mt: 4 }}>
                <Grid item xs={4}>
                  <HBDateTimePickerController
                    name={'fromDate'}
                    inputDisabled
                    label={formatMessage(ProductPriceSettingMessages.fromDateField)}
                    disablePast
                    formRules={{
                      required: true,
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <HBDateTimePickerController
                    name={'toDate'}
                    inputDisabled
                    label={formatMessage(ProductPriceSettingMessages.toDateField)}
                    disablePast
                    disableHighlightToday
                  />
                </Grid>
                <Grid item xs={4}>
                  <HBFormItemTextField
                    formName={'count'}
                    InputLabelProps={{
                      required: true,
                    }}
                    label={formatMessage(ProductPriceSettingMessages.countField)}
                    rules={{
                      required: {
                        value: true,
                        message: formatMessage(ProductPriceSettingMessages.requiredField),
                      },
                    }}
                    helperTextType="helperText"
                    maskOptions={{ mask: Number }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <HBFormItemTextField
                    formName={'originalPrice'}
                    label={formatMessage(ProductPriceSettingMessages.originalPriceField, {
                      currency: defaultCurrency,
                    })}
                    disabled
                  />
                </Grid>
                <Grid item xs={4}>
                  <HBNumericFormatController
                    name={'price'}
                    label={formatMessage(ProductPriceSettingMessages.priceField, {
                      currency: defaultCurrency,
                    })}
                    formRules={{
                      min: {
                        value: 1,
                        message: formatMessage(ProductPriceSettingMessages.minimumPrice, {
                          min: 1,
                        }),
                      },
                      required: {
                        value: true,
                        message: formatMessage(ProductPriceSettingMessages.requiredField),
                      },
                    }}
                    thousandSeparator=","
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4}>
                  <HBFormItemTextField
                    formName={'priceChangePercent'}
                    label={formatMessage(ProductPriceSettingMessages.priceChangePercentField)}
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <HBFormItemTextField
                    formName={'description'}
                    label={formatMessage(ProductPriceSettingMessages.descriptionField)}
                  />
                </Grid>
              </Grid>

              <Box
                sx={{ mt: 4, display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}
              >
                <HBButton disabled={!formProviderProps.formState.isValid} type="submit">
                  {formatMessage(ProductPriceSettingMessages.modalSubmitButton)}
                </HBButton>
              </Box>
            </HBForm>
          </Box>
        </HBDialog>
      </Box>
    </ProductExplanation>
  )
}

export default ProductPriceSetting
