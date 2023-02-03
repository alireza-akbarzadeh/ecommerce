import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import { HBWorkflow } from '@hasty-bazar/admin-shared/containers'
import { StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import { ReasonWorkFlow } from '@hasty-bazar/admin-shared/core/enums/ReasonMangementType'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { IUseReasonFormController } from '@hasty-bazar-admin/domains/reasonManagement/types/IUseReasonFormController'
import {
  useGetAdminGeneralDataReasonsSettingGetStateInfoByStateCodeAndStateMachineCodeFactorQuery as useGetStateInfo,
  useGetAdminGeneralDataReasonsSettingGetTransitionByEntityIdAndStateMachineCodeFactorQuery as useGetStateList,
  usePostAdminGeneralDataReasonsSettingChangeStateMutation as useChangeState,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBButton, HBDialog, HBForm } from '@hasty-bazar/core'
import { Box, Stack, Typography } from '@mui/material'
import { useReasonFormController } from '../../hooks'
import ReasonManageMentMessages from '../../ReasonManageMent.messages'
import ReasonFields from '../ReasonForm/ReasonFields'

const ReasonForm = () => {
  const {
    formatMessage,
    breadcrumbs,
    formProvider,
    handleSubmit,
    isDirty,
    id,
    handleBackApprove,
    handleBack,
    openDialog,
    setOpenDialog,
    data,
    refetch,
    isValid,
    handleOpenDialog,
    formRef,
  } = useReasonFormController()

  return (
    <>
      <BreadCrumbSection
        title={formatMessage(ReasonManageMentMessages.reasonsSettingsManagement)}
        breadItems={breadcrumbs}
      />
      <Box
        bgcolor="common.white"
        px={8}
        pt={6}
        pb={10}
        sx={{
          borderRadius: (theme) => theme.spacing(4),
          border: (theme) => `1px solid ${theme.palette.grey[200]}`,
        }}
      >
        <Stack direction="row" justifyContent={'space-between'} alignItems="center" ml={2}>
          <Box>
            <Typography variant="h4">
              {formatMessage(ReasonManageMentMessages.reasonSetting)}
            </Typography>
            <Typography variant="body1" my={4}>
              {formatMessage(ReasonManageMentMessages.pleaseInsertReason)}
            </Typography>
          </Box>
          {id && (
            <HBWorkflow
              entityId={id!}
              machineCode={StateMachineCode.ReasonManagement}
              useGetStateList={useGetStateList}
              useGetState={useGetStateInfo}
              useChangeState={useChangeState}
              onChangeState={refetch}
              stateCode={(data?.data as any)?.stateCode}
              factor={String(ReasonWorkFlow.Factor)}
            />
          )}
        </Stack>
        <HBForm<IUseReasonFormController>
          formProviderProps={formProvider}
          onSubmit={handleSubmit}
          mode="all"
        >
          <Box>
            <ReasonFields />
            <Stack
              gap={1}
              sx={{ mt: 15 }}
              flexDirection={'row'}
              justifyContent={'space-between'}
              alignItems={'center'}
            >
              <HBButton onClick={isDirty ? handleOpenDialog : handleBack} variant={'outlined'}>
                {formatMessage(phrasesMessages.back)}
              </HBButton>
              <HBButton ref={formRef} disabled={!isValid || !isDirty} type={'submit'}>
                {formatMessage(id ? phrasesMessages.edit : phrasesMessages.save)}
              </HBButton>
            </Stack>
          </Box>
        </HBForm>
      </Box>
      <HBDialog
        title={formatMessage(phrasesMessages.back)}
        content={formatMessage(ReasonManageMentMessages.approveBack)}
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onReject={() => handleBack()}
        onAccept={() => handleBackApprove()}
        acceptBtn={formatMessage(phrasesMessages.yes)}
        rejectBtn={formatMessage(phrasesMessages.no)}
      />
    </>
  )
}

export default ReasonForm
