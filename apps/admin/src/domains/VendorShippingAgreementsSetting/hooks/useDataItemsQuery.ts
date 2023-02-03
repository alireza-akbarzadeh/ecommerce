import {
  useGetAdminCatalogCategoriesQuery,
  useGetAdminCatalogSimpleProductsQuery,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { useGetAdminIdrVendorsQuery } from '@hasty-bazar/admin-shared/services/idrApi.generated'

const useDataItemsQuery = () => {
  const { data: { data: { items: vendors = [] } = {} } = {} } = useGetAdminIdrVendorsQuery({
    'client-name': '',
    'client-version': '',
    stateCode: 3,
    pageNumber: 0,
    pageSize: 10000,
    filter: 'StateCode==@StateCode',
  })
  const { data: { data: { items: categories = [] } = {} } = {}, isLoading: categoriesIsLoading } =
    useGetAdminCatalogCategoriesQuery({
      'client-name': '',
      'client-version': '',
      pageNumber: 0,
      pageSize: 10000,
      stateCode: '2',
      filter: 'StateCode==@StateCode',
    })
  const { data: { data: { items: products = [] } = {} } = {}, isLoading: productsIsLoading } =
    useGetAdminCatalogSimpleProductsQuery({
      'client-name': '',
      'client-version': '',
      pageNumber: 0,
      pageSize: 10000,
    })
  return {
    vendors,
    categories,
    products,
    productsIsLoading,
    categoriesIsLoading,
  }
}
export default useDataItemsQuery
