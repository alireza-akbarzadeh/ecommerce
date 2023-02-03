import { HBRecordHistory } from '@hasty-bazar/admin-shared/containers'
import { HBSwitchController } from '@hasty-bazar/admin-shared/containers/HBSwitchController'
import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import statusMessage from '@hasty-bazar-admin/domains/Status/status.message'
import {
  GetBusinessEntitiesQueryResult,
  useGetAdminGeneralDataBusinessEntitiesQuery,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import {
  useGetWorkflowStateMachineQuery,
  usePostWorkflowStateMachineMutation,
  usePutWorkflowStateMachineByIdMutation,
} from '@hasty-bazar/admin-shared/services/workflowApi.generated'
import { HBAutocompleteController, HBButton, HBDialog, HBForm, openToast } from '@hasty-bazar/core'
import { Box, Grid, Stack, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'

export type AddEditStatusOneProps = {
  open: boolean
  onClose: () => void
  onSave: () => void
  id?: string
}

export type AddEditFormStatusOneProps = {
  id: string
  code: string
  title: string
  description?: string
  factor?: string
  targetEntityFieldName?: string
  isActive?: boolean
  entityTypeCode?: GetBusinessEntitiesQueryResult
}

export default function AddEditFormStatus({ open, onClose, id, onSave }: AddEditStatusOneProps) {
  const { formatMessage } = useIntl()

  const { data: { data: { items: stateRow = [] } = {} } = {} } = useGetWorkflowStateMachineQuery(
    {
      'client-name': 'admin',
      'client-version': '1.0.0',
      id,
      filter: 'Id_Equal_--Id',
    },
    { skip: !id, refetchOnMountOrArgChange: true, refetchOnFocus: true },
  )

  const contentFormProvider = useForm<AddEditFormStatusOneProps>({
    mode: 'all',
  })

  const { isDirty, isValid } = contentFormProvider.formState
  const [addState, { isLoading: isLoadingAdd }] = usePostWorkflowStateMachineMutation()
  const [updateState, { isLoading: isLoadingUpdate }] = usePutWorkflowStateMachineByIdMutation()
  const { data: { data: { items: generalData = [] } = {} } = {} } =
    useGetAdminGeneralDataBusinessEntitiesQuery({
      'client-name': 'admin',
      'client-version': '1.0.0',
      pageSize: 1000,
    })

  useEffect(() => {
    if (id) {
      contentFormProvider.reset({
        id: stateRow?.[0]?.id!,
        code: stateRow?.[0]?.code!,
        title: stateRow?.[0]?.title!,
        description: stateRow?.[0]?.description!,
        factor: stateRow?.[0]?.factor!,
        targetEntityFieldName: stateRow?.[0]?.targetEntityFieldName!,
        isActive: stateRow?.[0]?.isActive!,
        entityTypeCode: { id: stateRow?.[0]?.entityTypeCode! },
      })
    }
  }, [id, stateRow])

  const handleSubmit = (values: AddEditFormStatusOneProps) => {
    if (!id) {
      addState({
        'client-name': 'hasty-bazar',
        'client-version': '1.0.0',
        createStateMachineModel: {
          ...values,
          entityTypeCode: values?.entityTypeCode?.id!,
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
        id,
        updateStateMachineModel: {
          ...values,
          entityTypeCode: values?.entityTypeCode?.id!,
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

  return (
    <HBDialog
      title={formatMessage(statusMessage.addStatusModalTitle)}
      open={open}
      onReject={handleCancel}
      onClose={handleCancel}
    >
      <Box sx={{ width: 500 }}>
        <HBForm formProviderProps={contentFormProvider} onSubmit={handleSubmit}>
          <Typography variant="body2" sx={{ mb: 8 }} component="div">
            {formatMessage(statusMessage.addStatusModalDescription)}
          </Typography>
          <Grid container spacing={6} direction="row">
            <Grid item xs={12} md={6}>
              <HBTextFieldController
                autoFocus
                maskOptions={{ mask: Number, valueType: 'unmaskedValue' }}
                required
                formRules={{
                  required: true,
                }}
                label={formatMessage(statusMessage.statusCode)}
                name={'code'}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <HBTextFieldController
                required
                formRules={{
                  required: true,
                }}
                label={formatMessage(statusMessage.statusTitle)}
                name={'title'}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <HBAutocompleteController<AddEditFormStatusOneProps, GetBusinessEntitiesQueryResult>
                label={formatMessage(statusMessage.statusTargetEntityTypeCode)}
                fieldName="entityTypeCode"
                isOptionEqualToValue={(o, v) => o?.id == v?.id}
                getOptionLabel={(option) => option.title ?? ''}
                options={generalData || []}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <HBTextFieldController
                required
                formRules={{
                  required: true,
                }}
                label={formatMessage(statusMessage.statusFactor)}
                name={'factor'}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <HBTextFieldController
                required
                formRules={{
                  required: true,
                }}
                label={formatMessage(statusMessage.statusTargetEntityFieldName)}
                name={'targetEntityFieldName'}
              />
            </Grid>
            <Grid item xs={12}>
              <HBTextFieldController
                formRules={{
                  required: false,
                }}
                label={formatMessage(statusMessage.statusDescription)}
                name={'description'}
              />
            </Grid>
            {id && (
              <Grid item xs={12}>
                <Stack spacing={4} direction="row">
                  <Typography>{formatMessage(statusMessage.statusIsActive)}</Typography>
                  <HBSwitchController name="isActive" />
                </Stack>
              </Grid>
            )}
          </Grid>
          <Box mt={14} justifyContent="flex-end" display="flex" width={'100%'}>
            <HBButton
              type="submit"
              variant="contained"
              color="primary"
              disabled={!isDirty || !isValid}
              loading={isLoadingAdd || isLoadingUpdate}
            >
              {formatMessage(statusMessage.addStatusModalSubmit)}
            </HBButton>
          </Box>
        </HBForm>
      </Box>
      <Box mt={4}>{stateRow?.[0]?.id && <HBRecordHistory data={stateRow?.[0]} isBorder />}</Box>
    </HBDialog>
  )
}
