import {
  useGetAdminSaleApiShippingProvidersByProviderIdCategoryExceptionsQuery,
  useGetAdminSaleApiShippingProvidersByProviderIdMappingCitiesQuery,
  useGetAdminSaleApiShippingProvidersByProviderIdOutOfServiceProgramsQuery,
} from '@hasty-bazar/admin-shared/services/saleApi.generated'

const useGetGridsTotalCount = (id: string) => {
  const { data: { data: categoryExceptions = {} } = {} } =
    useGetAdminSaleApiShippingProvidersByProviderIdCategoryExceptionsQuery(
      {
        'client-name': '',
        'client-version': '',
        providerId: id,
      },
      { skip: !id },
    )
  const { data: { data: mappingCities = {} } = {} } =
    useGetAdminSaleApiShippingProvidersByProviderIdMappingCitiesQuery(
      {
        'client-name': '',
        'client-version': '',
        providerId: id,
      },
      { skip: !id },
    )
  const { data: { data: outOfService = {} } = {} } =
    useGetAdminSaleApiShippingProvidersByProviderIdOutOfServiceProgramsQuery(
      {
        'client-name': '',
        'client-version': '',
        providerId: id,
      },
      { skip: !id },
    )
  return {
    categoryExceptionsTotalItems: categoryExceptions.totalItems,
    mappingCitiesTotalItems: mappingCities.totalItems,
    outOfServiceTotalItems: outOfService.totalItems,
  }
}

export default useGetGridsTotalCount
