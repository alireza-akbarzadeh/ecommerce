import { CollectionTypeEnum } from '@hasty-bazar/admin-shared/core/enums/CollectionType'
import {
  useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery,
  useGetAdminGeneralDataCollectionQuery,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { SxProps } from '@mui/material'
import { UserCategoriesFormEnum } from '../../enums/UserCategoriesFormEnum'

const userCategoriesFormFields = () => {
  const switchClass: SxProps = {
    display: 'inline-flex',
    gap: 2,
    alignItems: 'center',
    mt: 2,
  }

  const { data: UserTypeCodeApi } =
    useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery({
      'client-name': '',
      'client-version': '',
      businessType: UserCategoriesFormEnum.UserTypeCode,
    })

  const { data: ListCreationTypeApi, isLoading: isLoadingCreation } =
    useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery({
      'client-name': '',
      'client-version': '',
      businessType: UserCategoriesFormEnum.ListCreationTypeCode,
    })
  const { data: QueryResultTypeCoeApi } =
    useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery({
      'client-name': '',
      'client-version': '',
      businessType: UserCategoriesFormEnum.QueryResultTypeCode,
    })
  const { data: IntervalTypeCodeApi } =
    useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery({
      'client-name': '',
      'client-version': '',
      businessType: UserCategoriesFormEnum.IntervalTypeCode,
    })
  const { data: DataSaveTypeCodeApi } =
    useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery({
      'client-name': '',
      'client-version': '',
      businessType: UserCategoriesFormEnum.DataSaveTypeCode,
    })

  const { data: RelatedQueryTypeApi } = useGetAdminGeneralDataCollectionQuery({
    'client-name': '',
    'client-version': '',
    collectionType: CollectionTypeEnum.User,
    stateCode: '2',
    filter: 'CollectionType==@CollectionType && StateCode==@StateCode',
    pageSize: 1000,
  })
  return {
    UserTypeCodeItems: UserTypeCodeApi?.data?.items,
    ListCreationTypeItems: ListCreationTypeApi?.data?.items,
    QueryResultTypeItems: QueryResultTypeCoeApi?.data?.items,
    IntervalTypeCodeItems: IntervalTypeCodeApi?.data?.items,
    DataSaveTypeCodeItems: DataSaveTypeCodeApi?.data?.items,
    RelatedQueryTypeItems: RelatedQueryTypeApi?.data?.items,
    switchClass,
    isLoadingCreation,
  }
}

export default userCategoriesFormFields
