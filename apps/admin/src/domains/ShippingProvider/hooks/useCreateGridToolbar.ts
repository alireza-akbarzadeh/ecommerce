import { DownloadMethodType } from '@hasty-bazar/admin-shared/containers/HBDataGrid/useDataGrid'
import {
  usePostAdminSaleApiShippingProvidersByProviderIdOutOfServiceProgramsDownloadExcelFileMutation,
  usePostAdminSaleApiShippingProvidersDownloadExcelFileCategoryExceptionsByShippingProviderIdMutation,
  usePostAdminSaleApiShippingProvidersDownloadExcelFileMappingCitiesByShippingProviderIdMutation,
  usePostAdminSaleApiShippingProvidersDownloadExcelFileMutation,
} from '@hasty-bazar/admin-shared/services/saleApi.generated'

const useCreateGridToolbar = (id = '') => {
  const [shippingProviderDownloadFile] =
    usePostAdminSaleApiShippingProvidersDownloadExcelFileMutation()
  const [categoryExceptionDownloadFile] =
    usePostAdminSaleApiShippingProvidersDownloadExcelFileCategoryExceptionsByShippingProviderIdMutation()
  const [mappingCitiesDownloadFile] =
    usePostAdminSaleApiShippingProvidersDownloadExcelFileMappingCitiesByShippingProviderIdMutation()
  const [outOfServiceProgramDownloadFile] =
    usePostAdminSaleApiShippingProvidersByProviderIdOutOfServiceProgramsDownloadExcelFileMutation()

  const shippingProviderExcel = () => {
    const handleDownload = async (props: DownloadMethodType) => {
      const { filterFields, ...res } = props
      return await shippingProviderDownloadFile({
        'client-name': 'hasty-bazar-admin',
        'client-version': '1.0.0',
        downloadShippingProvidersExcel: {
          ...res,
          ...filterFields,
        },
      })
    }

    return handleDownload
  }

  const categoryExceptionExcel = () => {
    const handleDownload = async (props: DownloadMethodType) => {
      const { filterFields, ...res } = props
      return await categoryExceptionDownloadFile({
        'client-name': 'hasty-bazar-admin',
        'client-version': '1.0.0',
        shippingProviderId: id,
        downloadCategoryExceptionsExcel: {
          ...res,
          ...filterFields,
        },
      })
    }

    return handleDownload
  }

  const mappingCitiesExcel = () => {
    const handleDownload = async (props: DownloadMethodType) => {
      const { filterFields, ...res } = props
      return await mappingCitiesDownloadFile({
        'client-name': 'hasty-bazar-admin',
        'client-version': '1.0.0',
        shippingProviderId: id,
        downloadProviderCitiesExcel: {
          ...res,
          ...filterFields,
        },
      })
    }

    return handleDownload
  }

  const outOfServiceProgramExcel = () => {
    const handleDownload = async (props: DownloadMethodType) => {
      const { filterFields, ...res } = props
      return await outOfServiceProgramDownloadFile({
        'client-name': 'hasty-bazar-admin',
        'client-version': '1.0.0',
        providerId: id,
        downloadOutofServiceExcel: {
          ...res,
          ...filterFields,
        },
      })
    }

    return handleDownload
  }

  return {
    shippingProviderExcel,
    categoryExceptionExcel,
    mappingCitiesExcel,
    outOfServiceProgramExcel,
  }
}

export default useCreateGridToolbar
