import { HBRecordHistory } from '@hasty-bazar/admin-shared/containers'
import { HBSwitchController } from '@hasty-bazar/admin-shared/containers/HBSwitchController'
import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import SelectMultiColumnAllowedUsers from '@hasty-bazar-admin/domains/Status/components/SelectMultiColumnAllowedUsers'
import statusMessage from '@hasty-bazar-admin/domains/Status/status.message'
import { useGetAdminGeneralDataReasonsSettingQuery } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { useGetAdminIdrSecurityRolesQuery } from '@hasty-bazar/admin-shared/services/idrApi.generated'
import {
  GetTransitionsQueryResult,
  useGetWorkflowStateMachineByStateMachineIdStateQuery,
  useGetWorkflowStateMachineByStateMachineIdTransitionQuery,
  usePostWorkflowStateMachineByStateMachineIdTransitionMutation,
  usePutWorkflowStateMachineByStateMachineIdTransitionAndTransitionIdMutation,
} from '@hasty-bazar/admin-shared/services/workflowApi.generated'
import { HBSelectController } from '@hasty-bazar/auth'
import { HBAutocompleteController, HBButton, HBDialog, HBForm, openToast } from '@hasty-bazar/core'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'

export type AddEditStatusThreeProps = {
  open: boolean
  onClose: () => void
  onSave: () => void
  id?: string
  parentId?: string
  stateMachineId?: string
}

type RoleDataType = {
  id: string | undefined
  name: string | null | undefined
}[]

export default function AddEditFormStatus({
  open,
  onClose,
  id,
  onSave,
  stateMachineId,
  parentId,
}: AddEditStatusThreeProps) {
  const { formatMessage } = useIntl()
  const [customRoleData, setCustomRoleData] = useState<RoleDataType>([])
  const contentFormProvider = useForm<GetTransitionsQueryResult>({
    mode: 'all',
  })

  const { data: { data: { items: reasonsData = [] } = {} } = {} } =
    useGetAdminGeneralDataReasonsSettingQuery({
      'client-name': 'admin',
      'client-version': '1.0.0',
      pageSize: 1000,
      stateCode: '2',
      filter: 'StateCode_Equal_--StateCode',
    })

  const { data: { data: { items: rolesData = [] } = {} } = {} } = useGetAdminIdrSecurityRolesQuery({
    'client-name': 'admin',
    'client-version': '1.0.0',
    pageSize: 1000,
  })

  useEffect(() => {
    if (rolesData) {
      const customData = rolesData?.map(({ id, title }) => ({ id, name: title }))
      setCustomRoleData(customData)
    }
  }, [rolesData])

  const {
    data: { data: { items: stateRow = [] } = {} } = {},
    isLoading,
    refetch: refetchRowData,
  } = useGetWorkflowStateMachineByStateMachineIdTransitionQuery(
    {
      'client-name': 'admin',
      'client-version': '1.0.0',
      stateMachineId: stateMachineId!,
      transitionId: id!,
      fromStateId: parentId!,
    },
    { skip: !id || !stateMachineId, refetchOnMountOrArgChange: true, refetchOnFocus: true },
  )

  const { data: { data: { items: stateTwoRows = [] } = {} } = {} } =
    useGetWorkflowStateMachineByStateMachineIdStateQuery(
      {
        'client-name': 'admin',
        'client-version': '1.0.0',
        stateMachineId: stateMachineId!,
      },
      { skip: !stateMachineId, refetchOnMountOrArgChange: true, refetchOnFocus: true },
    )

  const { setValue, watch, reset } = contentFormProvider
  const { isDirty, isValid } = contentFormProvider.formState
  const [addState, { isLoading: isLoadingAdd }] =
    usePostWorkflowStateMachineByStateMachineIdTransitionMutation()
  const [updateState, { isLoading: isLoadingUpdate }] =
    usePutWorkflowStateMachineByStateMachineIdTransitionAndTransitionIdMutation()

  const getReasons = (reasons: string) => {
    if (!reasons) return []
    const reasonsArray = reasons.split('|')
    const reasonsNameArray = (reasonsData || [])
      .filter((reason) => reasonsArray.includes(reason?.title || ''))
      .map((reason) => ({ id: reason.id, title: reason?.title }))
    return reasonsNameArray
  }

  useEffect(() => {
    if (id) {
      reset({
        id: stateRow?.[0]?.id,
        actionTitle: stateRow?.[0]?.actionTitle,
        description: stateRow?.[0]?.description,
        isCommentRequired: stateRow?.[0]?.isCommentRequired,
        //@ts-ignore
        reasons: getReasons(stateRow?.[0]?.reasons),
        isSystemic: stateRow?.[0]?.isSystemic,
        isActive: stateRow?.[0]?.isActive,
        fromStateId: stateRow?.[0]?.fromStateId,
        toStateId: stateRow?.[0]?.toStateId,
        isAnyRestriction: stateRow?.[0]?.isAnyRestriction,
        users: stateRow?.[0]?.users,
        securityRoles: stateRow?.[0]?.securityRoles,
      })
    } else {
      reset({
        isActive: true,
        isSystemic: false,
        isCommentRequired: false,
        isAnyRestriction: false,
      })
    }
  }, [id, isLoading])

  const handleSubmit = (values: GetTransitionsQueryResult) => {
    //@ts-ignore
    values.reasons = (values?.reasons || [])?.map((item: any) => item.title).join('|')

    if (!id) {
      addState({
        'client-name': 'hasty-bazar',
        'client-version': '1.0.0',
        stateMachineId: stateMachineId!,
        addTransitionModel: {
          ...values,
          isActive: true,
          isCommentRequired: values.isCommentRequired,
          isSystemic: values.isSystemic,
        },
      })
        .unwrap()
        .then((res) => {
          if (res?.success) {
            refetchRowData()
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
        transitionId: id!,
        updateTransitionModel: {
          ...values,
          isCommentRequired: values.isCommentRequired,
          isSystemic: values.isSystemic,
        },
      })
        .unwrap()
        .then((res) => {
          if (res?.success) {
            refetchRowData()
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
    reset()
    onClose()
  }

  useEffect(() => {
    if (!id) {
      reset({
        fromStateId: parentId!,
      })
    }
  }, [parentId, stateTwoRows])

  if (id && !stateRow?.[0]?.id) return null

  return (
    <HBDialog
      title={formatMessage(statusMessage.addStatusThreeModalTitle)}
      open={open}
      onReject={handleCancel}
      onClose={handleCancel}
    >
      <Box sx={{ width: 600 }}>
        <HBForm formProviderProps={contentFormProvider} onSubmit={handleSubmit}>
          <Grid container spacing={6}>
            <Grid item container spacing={6} xs={12}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" component="div">
                  {formatMessage(statusMessage.addStatusTwoModalDescription)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                {id && (
                  <Stack spacing={4} direction="row" justifyContent={'space-between'}>
                    <Typography>{formatMessage(statusMessage.statusIsActive)}</Typography>
                    <HBSwitchController name="isActive" />
                  </Stack>
                )}
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              <HBSelectController
                required
                formRules={{
                  required: true,
                }}
                label={formatMessage(statusMessage.grid3FromStateId)}
                name={'fromStateId'}
                disabled
                menuItem={
                  stateTwoRows?.map(({ id, title }) => ({
                    value: id,
                    title,
                  })) || []
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <HBSelectController
                required
                formRules={{
                  required: true,
                }}
                label={formatMessage(statusMessage.grid3ToStateId)}
                name={'toStateId'}
                menuItem={
                  stateTwoRows
                    ?.filter((f) => f.id !== parentId)
                    ?.map(({ id, title }) => ({
                      value: id,
                      title,
                    })) || []
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <HBTextFieldController
                required
                formRules={{
                  required: true,
                }}
                label={formatMessage(statusMessage.grid3ActionTitle)}
                name={'actionTitle'}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <HBTextFieldController
                formRules={{
                  required: false,
                }}
                label={formatMessage(statusMessage.grid3Description)}
                name={'description'}
              />
            </Grid>
            <Grid item xs={12}>
              <HBAutocompleteController
                label={formatMessage(statusMessage.grid3Reasons)}
                fieldName="reasons"
                isOptionEqualToValue={(o, v) => o.title === v.title}
                getOptionLabel={(option) => `${option.title || ''}`}
                options={reasonsData || []}
                formRules={{ required: false }}
                autoCompleteProps={{
                  disabled: isLoading,
                  multiple: true,
                  limitTags: 1,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent={'space-between'}
              >
                <Typography variant="body2">
                  {formatMessage(statusMessage.grid3IsCommentRequired)}
                </Typography>
                <HBSwitchController name={'isCommentRequired'} />
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent={'space-between'}
              >
                <Typography variant="body2" sx={{ opacity: watch('isAnyRestriction') ? 0.5 : 1 }}>
                  {formatMessage(statusMessage.grid3IsSystemic)}
                </Typography>
                <HBSwitchController
                  name={'isSystemic'}
                  disabled={watch('isAnyRestriction')}
                  onChange={(e, checked) => {
                    setValue('isSystemic', checked)
                    watch('isAnyRestriction') && setValue('isAnyRestriction', false)
                    watch('securityRoles') && setValue('securityRoles', [])
                    watch('users') && setValue('users', [])
                  }}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent={'space-between'}
              >
                <Typography variant="body2" sx={{ opacity: watch('isSystemic') ? 0.5 : 1 }}>
                  {formatMessage(statusMessage.grid3IsAnyRestriction)}
                </Typography>
                <HBSwitchController
                  name={'isAnyRestriction'}
                  disabled={!!watch('isSystemic')}
                  onChange={(e, checked) => {
                    setValue('isAnyRestriction', checked)
                    watch('isSystemic') && setValue('isSystemic', false)
                    watch('securityRoles') && setValue('securityRoles', [])
                    watch('users') && setValue('users', [])
                  }}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} spacing={4}>
              <HBAutocompleteController
                label={formatMessage(statusMessage.grid3AllowedRoles)}
                fieldName="securityRoles"
                isOptionEqualToValue={(o, v) => o.id === v.id}
                getOptionLabel={(option) => `${option.name || ''}`}
                options={customRoleData || []}
                formRules={{ required: false }}
                autoCompleteProps={{
                  disabled: isLoading || !watch('isAnyRestriction'),
                  multiple: true,
                  limitTags: 3,
                  fullWidth: true,
                }}
                disabled={isLoading || !watch('isAnyRestriction')}
              />
            </Grid>
            <Grid item xs={12} spacing={4}>
              <SelectMultiColumnAllowedUsers />
            </Grid>
          </Grid>
          <Box mt={14} justifyContent="flex-end" display="flex" width={'100%'}>
            <HBButton
              type="submit"
              variant="contained"
              color="primary"
              loading={isLoadingAdd || isLoadingUpdate}
              disabled={!isDirty || !isValid}
            >
              {formatMessage(statusMessage.addStatusModalSubmit)}
            </HBButton>
          </Box>
        </HBForm>
      </Box>
      <Box sx={{ width: 600 }} mt={4}>
        {stateRow?.[0]?.id && (
          <HBRecordHistory data={stateRow?.[0]} isBorder showInRows isShowAccordion />
        )}
      </Box>
    </HBDialog>
  )
}
