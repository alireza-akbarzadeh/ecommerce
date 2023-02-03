import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  useDeleteAdminCatalogFeatureDisplayTypeByIdMutation,
  usePostAdminCatalogFeatureDisplayTypeMutation,
  usePutAdminCatalogFeatureDisplayTypeByIdMutation,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { HBSwitch, HBTextField, openToast } from '@hasty-bazar/core'
import {
  CheckboxSelectionCallbackParams,
  ColDef,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { RefObject, useMemo } from 'react'
import { useIntl } from 'react-intl'
import GridAction from './components/GridAction'
import { SelectRowModel } from './types'
import typesFeatureCategoriesMessage from './typesFeatureCategories.message'

export type TypesFeatureCategoriesModel = {
  gridRef: RefObject<AgGridReact>
  selectedRows: SelectRowModel[]
  onDelete: (show: boolean, id: string) => void
  onEditClick: (id: string) => void
  editId?: string
}

const useTypesFeatureCategories = ({
  gridRef,
  onDelete,
  onEditClick,
  selectedRows,
  editId,
}: TypesFeatureCategoriesModel) => {
  const [addTypesFeatureCategories, { isLoading: isLoadingAdd }] =
    usePostAdminCatalogFeatureDisplayTypeMutation()
  const [deleteTypesFeatureCategories, { isLoading: isLoadingDel }] =
    useDeleteAdminCatalogFeatureDisplayTypeByIdMutation()
  const [updateTypesFeatureCategories, { isLoading: isLoadingUpdate }] =
    usePutAdminCatalogFeatureDisplayTypeByIdMutation()
  const isLoading = isLoadingAdd || isLoadingDel || isLoadingUpdate

  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/Catalog/FeatureDisplayType`
  const { formatMessage } = useIntl()
  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerCheckboxSelection: true,
      cellRenderer: 'agGroupCellRenderer',
    }
  }, [])

  const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const onEdit = (id: string | number) => {
    id = typeof id === 'string' ? id : selectedRows[0]?.id!
    onEditClick?.(String(id!))
  }

  const addRowItem = async () => {
    const newRow = gridRef.current!.api.getModel().getRow(0)
    return await addTypesFeatureCategories({
      'client-name': 'admin',
      'client-version': '1.0.0',
      createFeatureDisplayTypeModel: {
        title: newRow?.data?.title,
        isActive: true,
      },
    }).then((res: any) => {
      if (res?.data?.success) {
        openToast({
          message: formatMessage(typesFeatureCategoriesMessage.successfullyAdded),
          type: 'success',
        })
        return true
      }
      return false
    })
  }

  const updateRowItem = async () => {
    const newRow = gridRef.current?.api?.getSelectedNodes()[0]?.data
    if (!newRow) return false
    return await updateTypesFeatureCategories({
      'client-name': 'admin',
      'client-version': '1.0.0',
      id: newRow?.id!,
      updateFeatureDisplayTypeModel: {
        title: newRow?.title,
        isActive: newRow?.isActive,
      },
    }).then((res: any) => {
      if (res?.data?.success) {
        openToast({
          message: formatMessage(typesFeatureCategoriesMessage.successfullyUpdated),
          type: 'success',
        })
        return true
      }
      return false
    })
  }

  const deleteRowItem = async () => {
    const ids = selectedRows.map((item) => item.id)
    for (let id of ids) {
      await deleteTypesFeatureCategories({
        'client-name': 'admin',
        'client-version': '1.0.0',
        id: id!,
      }).then((res: any) => {
        if (res?.data?.success) {
          openToast({
            message: formatMessage(typesFeatureCategoriesMessage.successfullyDeleted),
            type: 'success',
          })
        }
      })
    }
    return true
  }

  const columnDefs = useMemo(
    () =>
      [
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
            innerRenderer: (params: ICellRendererParams) => (
              <GridAction {...params} {...{ onEdit, onDelete }} />
            ),
          },
        },
        {
          field: 'id',
          headerName: formatMessage(phrasesMessages.id),
          hide: true,
          filter: 'agTextColumnFilter',
        },
        {
          field: 'title',
          headerName: formatMessage(typesFeatureCategoriesMessage.gridCategoryName),
          filter: 'agTextColumnFilter',
          minWidth: 450,
          cellRenderer: ({ value, data, setValue }: ICellRendererParams) =>
            data?.isAdd || editId == data.id ? (
              <HBTextField
                sx={{ mt: 1, height: 30, width: '100%' }}
                size="small"
                value={value}
                onChange={(e) => setValue!(e?.target?.value!)}
                autoFocus
              />
            ) : (
              value
            ),
        },
        {
          field: 'isActive',
          headerName: formatMessage(typesFeatureCategoriesMessage.gridStatus),
          filter: 'agTextColumnFilter',
          filterParams: {
            readOnly: true,
          },
          minWidth: 120,
          cellRenderer: ({ value, data, setValue }: ICellRendererParams) =>
            data?.isAdd ? (
              <HBSwitch
                sx={{ mt: 2 }}
                defaultChecked
                value={value}
                onChange={(e, checked) => setValue!(checked)}
              />
            ) : (
              <HBSwitch
                disabled={editId !== data.id}
                sx={{ mt: 2 }}
                checked={value}
                onChange={(e, checked) => {
                  setValue!(checked)
                }}
              />
            ),
        },
      ] as ColDef[],
    [gridRef.current?.api?.getSelectedRows(), editId],
  )

  return {
    actionUrl,
    columnDefs,
    autoGroupColumnDef,
    addRowItem,
    updateRowItem,
    deleteRowItem,
    isLoading,
  }
}

export default useTypesFeatureCategories
