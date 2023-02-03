import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { DataGrigToolbarCallbackProps } from '@hasty-bazar-admin/domains/Geographical/components/DataGrigToolbar'
import { HBDataGrigToolbar, HBDialog, openToast } from '@hasty-bazar/core'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { useDeleteAdminPaymentPaymentProviderByIdMutation } from '../paymentApi.enhanced'
import paymentMethodManagementPageMessages from '../PaymentMethodManagementPage.messages'
import { PaymentMethodManagementFormModel } from './MainContentExplanation'

type SectionContainerDetailsForm = {
  formProvider: UseFormReturn<PaymentMethodManagementFormModel>
}

export default function PageTitleBar({ formProvider }: SectionContainerDetailsForm) {
  const router = useRouter()
  const id = router.query.id?.[0]
  const { formatMessage } = useIntl()
  const [deletePaymentProvider] = useDeleteAdminPaymentPaymentProviderByIdMutation()
  const [deleteDialogState, setDeleteDialogState] = useState<boolean>(false)
  const {
    formState: { isDirty, isValid },
    watch,
  } = formProvider

  const handleDelete = ({ type }: DataGrigToolbarCallbackProps) => {
    if (type === 'delete') {
      setDeleteDialogState(true)
    }
  }

  const handleDeletePaymentMethod = () => {
    deletePaymentProvider({
      'client-name': 'Swagger on HIT.Hastim.Payment.Endpoints.AdminApi',
      'client-version': '1.0.0.0',
      id: id!,
    }).then((res: any) => {
      if (res?.data?.success) {
        openToast({
          type: 'success',
          message: formatMessage(paymentMethodManagementPageMessages.successDelete),
        })
        router.push({
          pathname: `/paymentMethodManagement`,
        })
      }
    })
  }

  return (
    <>
      <HBDataGrigToolbar
        deleteProps={{
          disabled: !id,
        }}
        addProps={{
          type: 'submit',
          form: 'PaymentMethodManagementForm',
          icon: 'check',
          disabled: id ? !isValid || !isDirty : !isValid || !watch('icon'),
        }}
        editProps={{
          show: false,
        }}
        statusProps={{
          show: false,
        }}
        refreshProps={{
          onClick: () =>
            router.push({
              pathname: `/paymentMethodManagement`,
            }),
        }}
        onClick={handleDelete}
        searchProps={{ show: false }}
      ></HBDataGrigToolbar>
      <HBDialog
        content={formatMessage(paymentMethodManagementPageMessages.areYouSure)}
        title={formatMessage(paymentMethodManagementPageMessages.deleteCollection)}
        onAccept={handleDeletePaymentMethod}
        onReject={() => setDeleteDialogState(false)}
        open={deleteDialogState}
        onClose={() => setDeleteDialogState(false)}
        acceptBtn={formatMessage(phrasesMessages.delete)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
    </>
  )
}
