import { GridActionColumn, HBAdminAccordion } from '@hasty-bazar/admin-shared/components'
import {
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  useDeleteAdminCatalogBrandsByIdCategoriesAndCategoryIdMutation,
  useGetAdminCatalogCategoriesMainPropertiesOfCategoriesQuery,
  usePostAdminCatalogBrandsByIdCategoriesMutation,
  usePutAdminCatalogBrandsByIdCategoriesAndCategoryIdMutation,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import {
  HBAgGridClasses,
  HBDataGrigToolbar,
  HBDialog,
  HBSelectTree,
  HBSwitch,
  MenuItemProps,
  openToast,
} from '@hasty-bazar/core'
import { Box, styled } from '@mui/material'
import {
  CheckboxSelectionCallbackParams,
  ColDef,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import HBGrigToolbarItem from 'libs/core/src/components/HBGrigToolbar/components/HBGrigToolbarItem'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import brandsPageMessages from '../BrandsPage.messages'
import useProductGroupBrandGrid from '../hooks/useProductGroupBrandGrid'

const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
  return params.columnApi.getRowGroupColumns().length === 0
}

const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
  return params.columnApi.getRowGroupColumns().length === 0
}

const classes: HBAgGridClasses = {
  wrapper: {
    height: 600,
  },
}

export type CategoriesDataGridProps = {
  categoryId: string
  categoryName: string
  id: string
  isActive: boolean
}

const CellBoxStyle = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  height: '100%',
}))

const RelatedProductGroupByBrand = () => {
  const { query } = useRouter()
  const { formatMessage } = useIntl()
  const id = query?.id?.[0] ?? ('' as string)

  const gridRef = useRef<HBDataGridClientRef>(null)
  const {
    getToolbarMoreItems,
    changeStatus,
    gridLoading,
    handleChangedGridActions,
    refreshGridData,
  } = useProductGroupBrandGrid(gridRef)

  const [openActive, setOpenActive] = useState(false)
  const [status, setStatus] = useState<boolean>()
  const [isAddOrEdit, setIsAddOrEdit] = useState(false)
  const [selectedRows, setSelectedRows] = useState<CategoriesDataGridProps[]>([])
  const [deleteDialogState, setDeleteDialogState] = useState<{ show: boolean; id?: string }>({
    show: false,
  })

  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/Catalog/brands/${id}/categories`

  const [createCategory] = usePostAdminCatalogBrandsByIdCategoriesMutation()
  const [editCategory] = usePutAdminCatalogBrandsByIdCategoriesAndCategoryIdMutation()
  const [deleteCategory] = useDeleteAdminCatalogBrandsByIdCategoriesAndCategoryIdMutation()

  const { data: { data: { items: categories = [] } = {} } = {} } =
    useGetAdminCatalogCategoriesMainPropertiesOfCategoriesQuery({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      pageSize: 10000,
      pageNumber: 1,
      stateCode: '2',
      filter: 'StateCode==@StateCode',
    })

  const toolbarStatus = useMemo(() => {
    const disabledOnSelected = selectedRows.length > 0
    const disabledOnNoSelected = selectedRows.length === 0

    return { disabledOnSelected, disabledOnNoSelected }
  }, [selectedRows])

  const getAllRows = () => {
    let categoryData: CategoriesDataGridProps[] = []
    gridRef.current!.api.forEachNode((node) => categoryData.push(node.data))
    return categoryData
  }

  const cancelAddProductGroupSubmission = () => {
    let categoryData = gridRef.current!.api.getModel().getRow(0)
    gridRef.current!.api.applyTransaction({
      remove: [categoryData?.data],
    })!
    setIsAddOrEdit(false)
  }

  const addProductGroupSubmission = async () => {
    const newRow = gridRef.current!.api.getModel().getRow(0)

    let categoryData = getAllRows()

    if (
      categoryData.filter(
        (category) => category?.categoryId === newRow?.data.categoryId && category?.id,
      ).length > 0
    ) {
      openToast({
        message: formatMessage(brandsPageMessages.usableBrandsAddError),
        type: 'error',
      })
      return
    }
    gridLoading(true)
    createCategory({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      id,
      assignBrandCategoryModel: {
        categoryId: newRow?.data.categoryName,
        isActive: newRow?.data.isActive,
      },
    })
      .unwrap()
      .then(() => {
        refreshGridData()
        setIsAddOrEdit(false)
      })
      .finally(() => {
        gridLoading(false)
      })
  }

  const handleDeleteProductGroup = useCallback(async () => {
    const categoryIds = selectedRows.map((item) => item.categoryId)
    for (const [index, categoryId] of categoryIds.entries()) {
      gridLoading(true)
      await deleteCategory({
        'client-name': 'hasty-bazar-admin',
        'client-version': '1.0.0',
        categoryId,
        id,
      })
        .unwrap()
        .then((res) => {
          if (res?.success) {
            openToast({
              message: formatMessage(brandsPageMessages.successfullyDeleted),
              type: 'success',
            })
          }
        })
        .finally(() => {
          setDeleteDialogState({ show: false })
          if (index === categoryIds.length - 1) {
            gridLoading(false)
            refreshGridData(true)
          }
        })
    }
  }, [selectedRows, deleteDialogState])

  const GridActions = useCallback(
    (props: ICellRendererParams) => {
      return (
        <GridActionColumn
          {...props}
          menuItems={[
            {
              label: formatMessage(phrasesMessages.public),
              children: [
                {
                  icon: 'trashAlt',
                  label: formatMessage(phrasesMessages.delete),
                  onClick: () => setDeleteDialogState({ show: true, id: props.data.categoryId }),
                },
              ],
            },
          ]}
        />
      )
    },
    [selectedRows],
  )

  const columnDefs = useMemo(
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
        checkboxSelection,
        headerCheckboxSelection,
        showRowGroup: true,
        cellRenderer: 'agGroupCellRenderer',
        cellRendererParams: {
          suppressCount: true,
          suppressDoubleClickExpand: true,
          innerRenderer: GridActions,
        },
      },
      {
        field: 'id',
        headerName: formatMessage(brandsPageMessages.usableBrandsGridId),
        filter: 'agNumberColumnFilter',
        mixWidth: 100,
        hide: true,
      },
      {
        field: 'categoryName',
        headerName: formatMessage(brandsPageMessages.relatedGroup),
        filter: 'agTextColumnFilter',
        maxWidth: 300,
        cellRenderer: ({ setValue, data, value }: ICellRendererParams) =>
          data?.isAdd ? (
            <CellBoxStyle>
              <HBSelectTree
                size="small"
                sx={{ width: 280, height: 30, '& > label': { lineHeight: 1 } }}
                label=""
                rootParentValue={null}
                data={
                  categories?.map((item) => {
                    return {
                      id: item.id!,
                      label: item.name!,
                      parentId: item.parentId!,
                      value: item.id!,
                      isAllocatableToProduct: item.isAllocatableToProduct!,
                    }
                  }) || []
                }
                onChange={(value: string | string[]) => {
                  setValue!(value)
                }}
              />
            </CellBoxStyle>
          ) : (
            data.categoryName
          ),
      },
      {
        field: 'brandName',
        headerName: formatMessage(brandsPageMessages.usableBrandsGridCategoryName),
        filter: 'agTextColumnFilter',
        hide: true,
      },
      {
        field: 'isActive',
        headerName: formatMessage(brandsPageMessages.usableBrandsGridIsActive),
        filter: 'agTextColumnFilter',
        cellRenderer: ({ value, data, setValue }: ICellRendererParams) =>
          data?.isAdd ? (
            <HBSwitch defaultChecked value={value} onChange={(e, checked) => setValue!(checked)} />
          ) : (
            <HBSwitch
              checked={value}
              onChange={(e, checked) => {
                editCategory({
                  id,
                  categoryId: data.categoryId,
                  'client-name': 'hasty-bazar-admin',
                  'client-version': '1.0.0',
                  updateAssignedBrandCategoryModel: {
                    isActive: checked,
                  },
                })
                  .unwrap()
                  .then((res) => {
                    if (res?.success) {
                      openToast({
                        message: formatMessage(brandsPageMessages.usableBrandsEditSuccess),
                        type: 'success',
                      })
                      refreshGridData()
                    }
                  })
              }}
            />
          ),
      },
    ],
    [gridRef.current?.api?.getSelectedRows()],
  )

  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerCheckboxSelection: true,
      cellRenderer: 'agGroupCellRenderer',
    }
  }, [])

  const handleChangedSelectedRows = (selectedRows: CategoriesDataGridProps[]) => {
    setSelectedRows(selectedRows)
  }

  const handleAddCategory = () => {
    try {
      const row = { isActive: true, isAdd: true, categoryId: 0 }
      gridRef.current!.api.applyTransaction({ add: [row], addIndex: 0 })
      setIsAddOrEdit(true)
    } catch (e) {}
  }

  const handleChangeStatus = (status: boolean) => {
    setStatus(status)
    setOpenActive(true)
  }

  const handleChangeActive = useCallback(async () => {
    changeStatus(
      status!,
      () => {
        refreshGridData()
        setStatus(undefined)
        setOpenActive(false)
      },
      id,
    )
  }, [status])

  const toolbarMoreItems = useMemo<MenuItemProps[]>(
    () => getToolbarMoreItems(handleChangeStatus),
    [selectedRows],
  )

  return (
    <HBAdminAccordion title={formatMessage(brandsPageMessages.relatedGroupToBrand)} icon="award">
      <Box sx={{ height: 730 }}>
        <HBDataGridClient
          id="related-product-group-by-brand-grid"
          serverSideFilteringAlwaysResets
          serverSideSortingAlwaysResets
          actionUrl={actionUrl}
          columnDefs={columnDefs}
          pagination
          paginationPageSize={25}
          rowSelection="multiple"
          enableRtl
          sideBar
          classes={classes}
          autoGroupColumnDef={autoGroupColumnDef}
          onSelectedChanged={handleChangedSelectedRows}
          detailRowAutoHeight
          ref={gridRef}
          GridToolbar={(props) => (
            <HBDataGrigToolbar
              onChange={handleChangedGridActions}
              addProps={{
                disabled: toolbarStatus.disabledOnSelected || isAddOrEdit,
                onClick: handleAddCategory,
              }}
              deleteProps={{
                disabled: toolbarStatus.disabledOnNoSelected,
                onClick: () => setDeleteDialogState({ show: true }),
              }}
              editProps={{
                show: false,
              }}
              moreProps={{ disabled: isAddOrEdit }}
              refreshProps={{ onClick: () => refreshGridData() }}
              items={toolbarMoreItems}
              {...props}
            >
              <HBGrigToolbarItem
                icon="times"
                tooltip={formatMessage(phrasesMessages.cancel)}
                disabled={!isAddOrEdit}
                show={isAddOrEdit}
                onClick={cancelAddProductGroupSubmission}
              />
              <HBGrigToolbarItem
                icon="check"
                tooltip={formatMessage(phrasesMessages.confirm)}
                disabled={!isAddOrEdit}
                onClick={addProductGroupSubmission}
              />
            </HBDataGrigToolbar>
          )}
        />
        <HBDialog
          content={formatMessage(brandsPageMessages.usableBrandsDeleteDialogContent, {
            msg: deleteDialogState?.id ? 1 : selectedRows.length,
          })}
          title={formatMessage(brandsPageMessages.usableBrandsDeleteDialogTitle)}
          onAccept={handleDeleteProductGroup}
          onReject={() => setDeleteDialogState({ show: false, id: undefined })}
          open={deleteDialogState.show}
          onClose={() => setDeleteDialogState({ show: false, id: undefined })}
          acceptBtn={formatMessage(phrasesMessages.delete)}
          rejectBtn={formatMessage(phrasesMessages.cancel)}
        />
        <HBDialog
          content={formatMessage(brandsPageMessages.usableBrandsChangeStatusDialogContent, {
            msg: selectedRows.length,
          })}
          title={formatMessage(brandsPageMessages.usableBrandsChangeStatusDialogTitle)}
          onAccept={handleChangeActive}
          onReject={() => setOpenActive(false)}
          open={openActive}
          onClose={() => setOpenActive(false)}
          acceptBtn={formatMessage(phrasesMessages.confirm)}
          rejectBtn={formatMessage(phrasesMessages.cancel)}
        />
      </Box>
    </HBAdminAccordion>
  )
}

export default RelatedProductGroupByBrand
