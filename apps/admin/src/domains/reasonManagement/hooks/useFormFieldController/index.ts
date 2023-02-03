import { ReasonType } from '@hasty-bazar/admin-shared/core/enums'
import { useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'

const useFormFieldController = () => {
  const { data: UserTypeCodeApi } =
    useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery({
      'client-name': '',
      'client-version': '',
      businessType: ReasonType.userTypeCode,
    })

  return {
    UserTypeCodeItems: UserTypeCodeApi?.data?.items,
  }
}

export default useFormFieldController
