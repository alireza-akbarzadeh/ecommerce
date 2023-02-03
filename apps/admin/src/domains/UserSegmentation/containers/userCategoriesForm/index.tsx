import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import { HBRecordHistory, HBWorkflow } from '@hasty-bazar/admin-shared/containers'
import { StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  useGetAdminGeneralDataUserSegmentationGetStateInfoByStateCodeAndStateMachineCodeFactorQuery as useGetStateInfo,
  useGetAdminGeneralDataUserSegmentationGetTransitionByEntityIdAndStateMachineCodeFactorQuery as useGetStateList,
  usePostAdminGeneralDataUserSegmentationChangeStateMutation as useChangeState,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBButton, HBDialog, HBForm } from '@hasty-bazar/core'
import { Box, Stack, Typography } from '@mui/material'
import { FC } from 'react'
import { useWatch } from 'react-hook-form'
import { UserCategoriesFormFields } from '../../components'
import { UserCategoriesWorkFLow } from '../../enums/UserCategoriesWorkFLow'
import useUserCategoriesForm from '../../hooks/useUserCategoriesForm'
import UserCategoriesMessage from '../../messages/UserCategoriesMessage'
import { IUserCategories } from '../../types/IUserCategories'
import { IUserCategoriesFormModel } from '../../types/IUserCategoriesFormModel'
import QueryResult from '../queryResult'

const UserCategoriesForm: FC<IUserCategories> = ({ id }) => {
  const {
    formProvider,
    formatMessage,
    getValues,
    handleApproveBack,
    handleConfirm,
    handleSubmit,
    isDirty,
    openDialog,
    setOpenDialog,
    setValue,
    refetch,
    data,
    isValid,
  } = useUserCategoriesForm({ id })

  const breadcrumbs = [
    {
      url: '/',
      title: formatMessage(phrasesMessages.dashboard),
    },
    {
      url: '/userCategories',
      title: formatMessage(UserCategoriesMessage.userCategories),
    },
  ]
  const { listCreationType } = useWatch({
    control: formProvider.control,
  })

  return (
    <>
      <BreadCrumbSection
        breadItems={breadcrumbs}
        title={formatMessage(UserCategoriesMessage.userCategories)}
      />
      <Box
        bgcolor="common.white"
        sx={{
          pb: 8,
          pt: 6,
          px: 8,
          borderRadius: (theme) => theme.spacing(5),
          border: (theme) => `1px solid ${theme.palette.grey[200]}`,
        }}
      >
        <Stack
          flexDirection={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
          flexWrap={'wrap'}
        >
          <Typography variant={'h4'}>
            {formatMessage(UserCategoriesMessage.userCategoriesAttribute)}
          </Typography>
          {id && (
            <HBWorkflow
              entityId={id!}
              machineCode={StateMachineCode.MarketingList}
              useGetStateList={useGetStateList}
              useGetState={useGetStateInfo}
              useChangeState={useChangeState}
              onChangeState={refetch}
              stateCode={(data?.data as any)?.stateCode}
              factor={String(UserCategoriesWorkFLow.Factor)}
            />
          )}
        </Stack>
        <Typography variant={'subtitle1'} mb={6} mt={10}>
          {formatMessage(UserCategoriesMessage.pleaseEnterUserCategoriesAttribute)}
        </Typography>
        <HBForm<IUserCategoriesFormModel>
          formProviderProps={formProvider}
          onSubmit={handleSubmit}
          mode="all"
        >
          <UserCategoriesFormFields
            id={String(id)}
            getValues={getValues}
            control={formProvider.control}
            setValue={setValue}
          />
          <Stack
            gap={1}
            sx={{ mt: 15 }}
            flexDirection={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <HBButton onClick={isDirty ? handleConfirm : handleApproveBack} variant={'outlined'}>
              {formatMessage(phrasesMessages.back)}
            </HBButton>
            <HBButton disabled={!isDirty || !isValid} type={'submit'}>
              {formatMessage(phrasesMessages.save)}
            </HBButton>
          </Stack>
        </HBForm>
        <HBDialog
          title={formatMessage(phrasesMessages.back)}
          content={formatMessage(phrasesMessages.dialogConfirmationContent)}
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onReject={() => handleApproveBack()}
          onAccept={() => setOpenDialog(false)}
          acceptBtn={formatMessage(phrasesMessages.yes)}
          rejectBtn={formatMessage(phrasesMessages.no)}
        />
      </Box>
      {id && <QueryResult {...{ listCreationType }} {...{ isDirty }} data={data} />}
      {id && <HBRecordHistory entityId={id} data={data?.data} isBorder isShowAccordion />}
    </>
  )
}

export default UserCategoriesForm
