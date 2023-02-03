import statusMessage from '@hasty-bazar-admin/domains/Status/status.message'
import {
  useGetWorkflowStateMachineByStateMachineIdStateQuery,
  usePostWorkflowStateMachineByStateMachineIdStateMutation,
  usePutWorkflowStateMachineByStateMachineIdStateAndStateIdMutation,
} from '@hasty-bazar/admin-shared/services/workflowApi.generated'
import { HBDialog, HBForm, openToast } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import FormItemsTwo from './FormItemsTwo'

export type AddEditStatusTwoProps = {
  open: boolean
  onClose: () => void
  onSave: () => void
  id?: string
  stateMachineId?: string
}

export type AddEditFormStatusTwoProps = {
  id: string
  title: string
  code: string
  isActive: boolean
  isFinal?: boolean
  isInitial?: boolean
  icon?: string
  color?: string
}

export default function AddEditFormStatus({
  open,
  onClose,
  id,
  onSave,
  stateMachineId,
}: AddEditStatusTwoProps) {
  const { formatMessage } = useIntl()

  const { data: { data: { items: stateRow = [] } = {} } = {}, isLoading } =
    useGetWorkflowStateMachineByStateMachineIdStateQuery(
      {
        'client-name': 'admin',
        'client-version': '1.0.0',
        stateMachineId: stateMachineId!,
        stateId: id!,
      },
      { skip: !id || !stateMachineId, refetchOnMountOrArgChange: true, refetchOnFocus: true },
    )

  const contentFormProvider = useForm<AddEditFormStatusTwoProps>({
    mode: 'all',
  })

  const [addState] = usePostWorkflowStateMachineByStateMachineIdStateMutation()
  const [updateState] = usePutWorkflowStateMachineByStateMachineIdStateAndStateIdMutation()

  useEffect(() => {
    if (id) {
      contentFormProvider.reset({
        id: stateRow?.[0]?.id!,
        code: stateRow?.[0]?.code!,
        title: stateRow?.[0]?.title!,
        color: stateRow?.[0]?.color!,
        icon: stateRow?.[0]?.icon!,
        isFinal: stateRow?.[0]?.isFinal!,
        isInitial: stateRow?.[0]?.isInitial!,
        isActive: stateRow?.[0]?.isActive!,
      })
    } else {
      contentFormProvider.setValue('isActive', true)
      contentFormProvider.setValue('isFinal', false)
      contentFormProvider.setValue('isInitial', false)
    }
  }, [id, isLoading])

  const handleSubmit = (values: AddEditFormStatusTwoProps) => {
    if (!id) {
      addState({
        'client-name': 'hasty-bazar',
        'client-version': '1.0.0',
        stateMachineId: stateMachineId!,
        addStateModel: {
          ...values,
          isActive: true,
        },
      })
        .unwrap()
        .then((res) => {
          if (res?.success) {
            openToast({
              message: formatMessage(statusMessage.addStatusSuccess),
              type: 'success',
            })
            onSave()
          }
        })
    } else {
      updateState({
        'client-name': 'hasty-bazar',
        'client-version': '1.0.0',
        stateMachineId: stateMachineId!,
        stateId: id!,
        updateStateModel: {
          ...values,
        },
      })
        .unwrap()
        .then((res) => {
          if (res?.success) {
            openToast({
              message: formatMessage(statusMessage.updateStatusSuccess),
              type: 'success',
            })
            onSave()
          }
        })
    }
  }

  const handleCancel = () => {
    contentFormProvider.reset()
    onClose()
  }

  if (id && !stateRow?.[0]?.id) return null

  return (
    <HBDialog
      title={formatMessage(statusMessage.addStatusTwoModalTitle)}
      open={open}
      onReject={handleCancel}
      onClose={handleCancel}
    >
      <Box sx={{ width: 600 }}>
        <HBForm formProviderProps={contentFormProvider} onSubmit={handleSubmit}>
          <FormItemsTwo id={id} contentFormProvider={contentFormProvider} stateRow={stateRow} />
        </HBForm>
      </Box>
    </HBDialog>
  )
}
