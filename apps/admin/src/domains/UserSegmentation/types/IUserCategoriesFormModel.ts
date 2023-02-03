import {
  CreateUserSegmentationModel,
  GetBusinessTypeValuesByBusinessTypeQueryResult,
  GetPagedCollectionQueryResult,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'

export interface IUserCategoriesFormModel
  extends Omit<
    CreateUserSegmentationModel,
    | 'userTypeCode'
    | 'interValTypeCode'
    | 'dataSaveTypeCode'
    | 'listCreationType'
    | 'queryResultTypeCode'
    | 'collectionId'
  > {
  interValTypeCode: GetBusinessTypeValuesByBusinessTypeQueryResult
  dataSaveTypeCode: GetBusinessTypeValuesByBusinessTypeQueryResult
  listCreationType: GetBusinessTypeValuesByBusinessTypeQueryResult
  userTypeCode: GetBusinessTypeValuesByBusinessTypeQueryResult
  queryResultTypeCode: GetBusinessTypeValuesByBusinessTypeQueryResult
  collectionId: GetPagedCollectionQueryResult
}
