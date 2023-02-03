import { HBHistoryExplanation } from '@hasty-bazar/admin-shared/containers/HBHistoryExplanation'
import { CreatePaymentProviderModel } from '@hasty-bazar/admin-shared/services/paymentApi.generated'
import { HBForm, openToast } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useIntl } from 'react-intl'
import {
  usePostAdminPaymentPaymentProviderMutation,
  usePutAdminPaymentPaymentProviderByIdMutation,
} from '../paymentApi.enhanced'
import paymentMethodManagementPageMessages from '../PaymentMethodManagementPage.messages'
import PaymentMethodManagementDetail from './PaymentMethodManagementDetail'

export interface PaymentMethodManagementFormModel extends CreatePaymentProviderModel {
  title: string
  isVisible?: boolean | null
}

type MainContentExplanationProps = {
  formProvider: UseFormReturn<PaymentMethodManagementFormModel>
}
const MainContentExplanation: FC<MainContentExplanationProps> = ({ formProvider }) => {
  const { formatMessage } = useIntl()
  const router = useRouter()
  const id = router.query.id?.[0]
  const paymentMethodIdParam = router.query?.paymentMethodId as string
  const [addPaymentProvider] = usePostAdminPaymentPaymentProviderMutation()
  const [updatePaymentProvider] = usePutAdminPaymentPaymentProviderByIdMutation()

  const handleSubmit = async (values: PaymentMethodManagementFormModel) => {
    if (id) {
      updatePaymentProvider({
        'client-name': 'Swagger on HIT.Hastim.Payment.Endpoints.AdminApi',
        'client-version': '1.0.0.0',
        id,
        updatePaymentProviderModel: {
          name: values.name!,
          icon: values.icon,
          bankId: values.bankId ? values.bankId : null,
          ruleId: values.ruleId ? (values.ruleId as any).id : null,
          sortOrderIndex: values.sortOrderIndex,
          isActive: values.isActive,
          providerType: values.providerType,
          isVisible: !!values.isVisible,
          isDefault: values.isDefault,
          maximumAmount: values.maximumAmount,
          paymentMethodId: paymentMethodIdParam,
        },
      }).then((res: any) => {
        if (res?.data?.success) {
          openToast({
            type: 'success',
            message: formatMessage(paymentMethodManagementPageMessages.successEdit),
          })
        }
      })
    } else {
      addPaymentProvider({
        'client-name': 'Swagger on HIT.Hastim.Payment.Endpoints.AdminApi',
        'client-version': '1.0.0.0',
        createPaymentProviderModel: {
          name: values.name!,
          icon: values.icon,
          bankId: values.bankId ? values.bankId : null,
          ruleId: values.ruleId ? (values.ruleId as any).id : null,
          sortOrderIndex: values.sortOrderIndex ? values.sortOrderIndex : null,
          isActive: values.isActive,
          paymentMethodId: paymentMethodIdParam,
          providerType: values.providerType,
          isDefault: values.isDefault,
          maximumAmount: values.maximumAmount,
        },
      }).then((res: any) => {
        if (res?.data?.success) {
          openToast({
            type: 'success',
            message: formatMessage(paymentMethodManagementPageMessages.successAdd),
          })
          router.push({
            pathname: `/paymentMethodManagement/edit/${res?.data?.data?.id}`,
            query: {
              paymentMethodId: paymentMethodIdParam,
            },
          })
        }
      })
    }
  }

  return (
    <>
      <Box
        bgcolor="common.white"
        px={8}
        pt={6}
        pb={10}
        sx={{
          borderRadius: ({ spacing }) => spacing(4),
          border: (theme) => `1px solid ${theme.palette.grey[200]}`,
          minHeight: 300,
        }}
      >
        <HBForm<PaymentMethodManagementFormModel>
          mode="all"
          onSubmit={handleSubmit}
          formProviderProps={formProvider}
          id="PaymentMethodManagementForm"
        >
          {<PaymentMethodManagementDetail />}
        </HBForm>
      </Box>
      <HBHistoryExplanation detail={<Box />} hidden />
    </>
  )
}
export default MainContentExplanation
