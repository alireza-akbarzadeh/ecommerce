import { BusinessTypeEnums } from '@hasty-bazar/admin-shared/core/enums'
import {
  useGetAdminCatalogCategoriesByIdAcceptionsQuery,
  useGetAdminCatalogProductRulesGetallPublishedQuery,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { useGetAdminCmsPagesQuery } from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import {
  GetBusinessTypeValuesQueryResult,
  useGetAdminGeneralDataBusinessTypeValueGetAllValuesByBusinessTypeIdQuery,
  useGetAdminGeneralDataCollectionQuery,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { AutocompleteChangeDetails } from '@mui/material'
import { useMemo } from 'react'
import {
  useDeleteAdminCatalogCategoriesByIdCategoryAcceptionsAndAcceptionValueCodeMutation,
  usePostAdminCatalogCategoriesByIdCategoryAcceptionsMutation,
} from '../catalogApi.enhanced'
import { SelectDataType } from '../ProductFurtherDetails'
import { GetCategoryAcceptionsQueryResult } from '@hasty-bazar/admin-shared/services/catalogApi.generated'

interface SelectData {
  title: string
  value: string | number
  businessTypeCode?: string
  fullCode?: string
}

type ProductFurtherDetailsControlsProps = {
  id?: string
}

function useProductFurtherDetailsControls({ id }: ProductFurtherDetailsControlsProps) {
  const {
    data: { data: { items: businessTypeCodeData = [] } = {} } = {},
    refetch: businessTypeCodeDataRefetch,
  } = useGetAdminGeneralDataBusinessTypeValueGetAllValuesByBusinessTypeIdQuery({
    'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
    'client-version': '1.0.1.100',
    pageSize: 1000,
    pageNumber: 1,
  })

  const {
    data: { data: { items: commissionLawsData = [] } = {} } = {},
    refetch: commissionLawsItemsRefetch,
  } = useGetAdminCatalogProductRulesGetallPublishedQuery({
    'client-name': 'generalData',
    'client-version': '0',
    pageSize: 1000,
    pageNumber: 1,
    processEventName: 'IDS_UserSignUpRule_ViewCommissionRules',
    filter: 'ProcessEventName=@ProcessEventName',
  })

  const commissionLawsItems = useMemo(
    () =>
      commissionLawsData?.map((item: any) => ({
        title: item.name,
        value: item.id,
      })) || [],
    [commissionLawsData],
  )

  const {
    data: { data: { items: returnLawsData = [] } = {} } = {},
    refetch: returnLawsItemsRefetch,
  } = useGetAdminCatalogProductRulesGetallPublishedQuery({
    'client-name': 'generalData',
    'client-version': '0',
    pageSize: 1000,
    pageNumber: 1,
    processEventName: 'Catalog_ReturnRule_ViewReturnRules',
    filter: 'ProcessEventName=@ProcessEventName',
  })

  const returnLawsItems = useMemo(
    () =>
      returnLawsData?.map((item: any) => ({
        title: item.name,
        value: item.id,
      })) || [],
    [returnLawsData],
  )

  const {
    data: { data: { items: categoryAcceptionsItems = [] } = {} } = {},
    isLoading: categoryAcceptionsItemsLoading,
    refetch: categoryAcceptionsItemsRefetch,
  } = useGetAdminCatalogCategoriesByIdAcceptionsQuery(
    {
      'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
      'client-version': '1.0.1.100',
      id: id!,
      pageSize: 1000,
      pageNumber: 1,
    },
    { skip: !id },
  )

  const categoryAcceptionsDataItems = useMemo(
    () =>
      categoryAcceptionsItems?.map((item: any) => ({
        title: item.valueName,
        value: item.valueCode,
      })) || [],
    [categoryAcceptionsItems],
  )

  const [createCategoryAcceptions] = usePostAdminCatalogCategoriesByIdCategoryAcceptionsMutation()
  const [deleteCategoryAcceptions] =
    useDeleteAdminCatalogCategoriesByIdCategoryAcceptionsAndAcceptionValueCodeMutation()

  const { data: { data: { items: displayItems = [] } = {} } = {}, refetch: displayItemsRefetch } =
    useGetAdminCmsPagesQuery(
      {
        'client-name': 'Swagger on Hit.Hastim.CMS.Endpoints.WebApi',
        'client-version': '1.0.1.100',
        pageSize: 1000,
        pageNumber: 1,
      },
      { refetchOnFocus: true },
    )

  const screenDisplayItems = useMemo(
    () =>
      displayItems?.map((item: any) => ({
        title: item.name,
        value: item.id,
        //@ts-ignore
        originName: item?.originName,
      })) || [],
    [displayItems],
  )

  const { data: { data: { items: collectionItems = [] } = {} } = {} } =
    useGetAdminGeneralDataCollectionQuery(
      {
        'client-name': 'admin',
        'client-version': '1.0.0',
        pageSize: 1000,
        pageNumber: 1,
      },
      { refetchOnFocus: true },
    )

  const collectionDataItems = useMemo(
    () =>
      collectionItems?.map((item: any) => ({
        title: item.name,
        value: item.id,
        //@ts-ignore
        originName: item?.originName,
      })) || [],
    [collectionItems],
  )

  const getBusinessTypes = (
    businessTypesValue: GetBusinessTypeValuesQueryResult[] | null,
    businessType: BusinessTypeEnums,
    byId = true,
  ): SelectData[] => {
    return (
      businessTypesValue
        ?.filter((item) => item.businessTypeCode === businessType)
        .map((item) => ({
          title: String(item.title),
          value: byId ? String(item.id) : String(item.code) || 0,
          businessTypeCode: String(item.businessTypeCode),
          fullCode: String(item.fullCode),
        })) || []
    )
  }

  const acceptableProductConditionOnChange = (
    e: React.SyntheticEvent<Element, Event>,
    selected: {
      value?: number | string
    }[],
    reason?: string,
    details?: AutocompleteChangeDetails<any> | undefined,
  ) => {
    if (reason === 'removeOption') {
      deleteCategoryAcceptions({
        'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
        'client-version': '1.0.1.100',
        id: id!,
        acceptionValueCode: String(details?.option?.value),
      })
    }
    if (reason === 'selectOption') {
      const addItems = selected.filter((item) => {
        return (
          categoryAcceptionsItems &&
          categoryAcceptionsItems?.findIndex(
            (i: GetCategoryAcceptionsQueryResult) => String(i.valueCode) == item?.value,
          ) < 0
        )
      })
      createCategoryAcceptions({
        'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
        'client-version': '1.0.1.100',
        id: id!,
        assignCategoryAcceptionModel: {
          acceptableProductConditionCode: String(addItems[0]?.value),
        },
      })
    }
  }

  const refetchAll = () => {
    businessTypeCodeDataRefetch()
    commissionLawsItemsRefetch()
    returnLawsItemsRefetch()
    categoryAcceptionsItemsRefetch()
    displayItemsRefetch()
  }

  const getEnumItems = (enumType: BusinessTypeEnums): SelectDataType[] => {
    return (
      businessTypeCodeData
        ?.filter((item) => item.businessTypeCode === enumType)
        ?.map((i) => {
          return { title: i.title!, value: i.id! }
        }) || []
    )
  }

  return {
    businessTypeCodeData,
    commissionLawsItems,
    returnLawsItems,
    categoryAcceptionsItems,
    displayItems,
    screenDisplayItems,
    getBusinessTypes,
    acceptableProductConditionOnChange,
    refetchAll,
    categoryAcceptionsItemsLoading,
    getEnumItems,
    collectionItems,
    collectionDataItems,
    categoryAcceptionsDataItems,
  }
}
export default useProductFurtherDetailsControls
