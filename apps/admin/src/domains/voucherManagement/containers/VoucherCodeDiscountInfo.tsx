import { HBWorkflow } from '@hasty-bazar/admin-shared/containers'
import { StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import { VoucherWorkFlow } from '@hasty-bazar/admin-shared/core/enums/VoucherDataType'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import useVoucherCodeDiscountInfoController from '@hasty-bazar-admin/domains/voucherManagement/Hook/useVoucherCodeDiscountInfoController'
import {
  useGetAdminSaleVoucherGetStateInfoByStateCodeAndStateMachineCodeFactorQuery as useGetStateInfo,
  useGetAdminSaleVoucherGetTransitionByEntityIdAndStateMachineCodeFactorQuery as useGetStateList,
  usePostAdminSaleVoucherChangeStateMutation as useChangeState,
} from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { HBButton, HBDialog, HBForm } from '@hasty-bazar/core'
import { Box, Stack, Typography } from '@mui/material'
import { VoucherAddEditForm } from '../components'
import { IUseReasonFormController } from '../types/IUseReasonFormController'
import VoucherManagementPage from '../VoucherManagementPage.messages'
interface VoucherCodeDiscountInfoType {
  id: string
}

const VoucherCodeDiscountInfo = ({ id }: VoucherCodeDiscountInfoType) => {
  const {
    updateILoading,
    createIsLoading,
    formatMessage,
    handleSubmit,
    vendor,
    formProvider,
    setValue,
    getValues,
    isDirty,
    setOpenDialog,
    openDialog,
    handleBackApprove,
    handleBack,
    stateCode,
    refetch,
    isValid,
    formWatch,
  } = useVoucherCodeDiscountInfoController({ id })

  return (
    <>
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
            {formatMessage(VoucherManagementPage.VoucherCodeDiscountInfo)}
          </Typography>
          {id && stateCode && (
            <HBWorkflow
              entityId={id!}
              machineCode={StateMachineCode.Voucher}
              useGetStateList={useGetStateList}
              useGetState={useGetStateInfo}
              useChangeState={useChangeState}
              onChangeState={refetch}
              stateCode={String(stateCode)}
              factor={String(VoucherWorkFlow.Factor)}
            />
          )}
        </Stack>
        <Typography sx={{ mt: 8 }} variant={'body1'}>
          {formatMessage(VoucherManagementPage.enterInfoRelatedToVoucher)}
        </Typography>
        <HBForm<IUseReasonFormController>
          formProviderProps={formProvider}
          onSubmit={handleSubmit}
          mode="all"
        >
          <VoucherAddEditForm
            id={id}
            getValues={getValues}
            setValue={setValue}
            watchIsActive={Boolean(formWatch.isActive)}
            watchVoucherValue={Number(formWatch.voucherValue)}
            watchProviderType={String(formWatch.providerType?.id)}
            watchPriceValueType={String(formWatch.priceValueType?.id)}
            watchVoucherUsageType={String(formWatch.voucherUsageType?.id)}
            watchMaxPriceValue={formWatch.maxPriceValue as number}
            vendor={String(vendor)}
          />
          <Stack
            gap={1}
            sx={{ mt: 15 }}
            flexDirection={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <HBButton onClick={isDirty ? handleBackApprove : handleBack} variant={'outlined'}>
              {formatMessage(phrasesMessages.back)}
            </HBButton>
            <HBButton
              disabled={!isValid || !isDirty}
              loading={createIsLoading || updateILoading}
              type={'submit'}
            >
              {formatMessage(id ? phrasesMessages.edit : phrasesMessages.save)}
            </HBButton>
          </Stack>
        </HBForm>
      </Box>
      <HBDialog
        title={formatMessage(VoucherManagementPage.back)}
        content={formatMessage(VoucherManagementPage.approveMessageBack)}
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onReject={() => handleBack()}
        onAccept={() => setOpenDialog(false)}
        acceptBtn={formatMessage(phrasesMessages.yes)}
        rejectBtn={formatMessage(phrasesMessages.no)}
      />
    </>
  )
}
export default VoucherCodeDiscountInfo
