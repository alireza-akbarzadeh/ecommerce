import { BusinessTypeEnums } from '@hasty-bazar/admin-shared/core/enums'
import {
  useDeleteAdminCatalogCategoriesCategoryRelationsMutation,
  useGetAdminCatalogCategoriesByIdRelationsQuery,
  useGetAdminCatalogCategoriesQuery,
  usePostAdminCatalogCategoriesByIdCategoryRelationsMutation,
  usePutAdminCatalogCategoriesByIdRelationsAndRelationTypeMutation,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { openToast } from '@hasty-bazar/core'
import { AgGridReact } from 'ag-grid-react'
import { useIntl } from 'react-intl'
import productGroupMessages from '../../ProductGroup.messages'
import { RelationDataGridProps } from './RelationBetweenGroups'

const useGridActions = (categoryId: string, gridRef: React.RefObject<AgGridReact>) => {
  const { formatMessage } = useIntl()
  const [removeRelation] = useDeleteAdminCatalogCategoriesCategoryRelationsMutation()
  const [createRelation] = usePostAdminCatalogCategoriesByIdCategoryRelationsMutation()
  const [updateRelation] = usePutAdminCatalogCategoriesByIdRelationsAndRelationTypeMutation()
  const {
    data: relationCategories,
    refetch: reloadFetchRelation,
    isLoading: isLoadingRelation,
  } = useGetAdminCatalogCategoriesByIdRelationsQuery(
    {
      'client-name': 'admin',
      'client-version': '0.0.1',
      id: categoryId,
    },
    { skip: !categoryId },
  )
  const {
    data: categoriesData,
    refetch: reloadCategories,
    isLoading: isLoadingCategories,
  } = useGetAdminCatalogCategoriesQuery(
    {
      'client-name': 'admin',
      'client-version': '1.0.0',
      pageSize: 10000,
    },
    { skip: !categoryId },
  )

  const { data: getAllRelations, refetch: reloadAllRelation } =
    useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery({
      'client-name': 'admin',
      'client-version': '1.0.0',
      businessType: BusinessTypeEnums.CategoryRelationType,
    })

  const addRelation = (callback: (value: React.SetStateAction<boolean>) => void) => {
    try {
      const row = {
        categoryId,
        relatedCategoryId: null,
        valueCode: null,
        valueName: null,
        isActive: null,
        isAdd: true,
      }

      gridRef.current!.api.applyTransaction({
        add: [row],
        addIndex: 0,
      })

      callback(true)
    } catch (e) {
      callback(false)
    }
  }

  const getAllRows = () => {
    let rowData: RelationDataGridProps[] = []
    gridRef.current!.api.forEachNode((node) => rowData.push(node.data))
    return rowData
  }

  const handleCreateRelation = async (
    rowData: RelationDataGridProps,
    {
      onSuccess,
      onError,
      onFinally,
    }: {
      onSuccess?: () => void
      onError?: (error: any) => void
      onFinally?: () => void
    },
  ) => {
    rowData.relationTypeEnumTitle =
      getAllRelations?.data?.items?.find((item) => item.fullCode === rowData.relationTypeEnum)
        ?.title || ''
    if (!rowData?.relatedCategoryId)
      return openToast({
        message: formatMessage(productGroupMessages.relatedCategoryIdRequired),
        type: 'error',
      })

    if (!rowData?.relationTypeEnum)
      return openToast({
        message: formatMessage(productGroupMessages.relationTypeEnumRequired),
        type: 'error',
      })

    createRelation({
      'client-name': 'admin',
      'client-version': '0.0.1',
      id: categoryId,
      assignCategoryRelationModel: {
        ...rowData,
        isActive: true,
      },
    })
      .then((res: any) => {
        if (res?.data?.success) onSuccess?.()
        else {
          onError?.(res.error)
        }
      })
      .catch((e) => {
        onError?.(e)
      })
      .finally(() => {
        onFinally?.()
      })
  }
  const handleUpdateRelation = async (
    rowData: RelationDataGridProps,
    valueCode: number,
    {
      onSuccess,
      onError,
      onFinally,
    }: {
      onSuccess?: () => void
      onError?: (error: any) => void
      onFinally?: () => void
    },
  ) => {
    updateRelation({
      'client-name': 'admin',
      'client-version': '0.0.1',
      id: categoryId,
      relationType: valueCode,
      updateAssignedCategoryRelationModel: {
        isActive: rowData.isActive ?? false,
        relatedCategoryId: rowData.relatedCategoryId,
        newRelationTypeEnum: rowData.relationTypeEnum,
      },
    })
      .then((res: any) => {
        if (res?.data?.success) onSuccess?.()
        else {
          onError?.(res.error)
        }
      })
      .catch((e) => {
        onError?.(e)
      })
      .finally(() => {
        onFinally?.()
      })
  }

  return {
    removeRelation,
    createRelation,
    relationCategories,
    categoriesData,
    reloadFetchRelation,
    reloadCategories,
    isLoadingRelation,
    isLoadingCategories,
    addRelation,
    getAllRows,
    getAllRelations,
    reloadAllRelation,
    updateRelation,
    handleCreateRelation,
    handleUpdateRelation,
  }
}

export default useGridActions
