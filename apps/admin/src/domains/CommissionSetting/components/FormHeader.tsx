import { HBWorkflow } from '@hasty-bazar/admin-shared/containers'
import {
  CommissionFactor,
  CommissionStatus,
  CommissionType,
  StateMachineCode,
} from '@hasty-bazar/admin-shared/core/enums'
import {
  useGetAdminCatalogCommissionGetStateInfoByStateCodeAndStateMachineCodeFactorQuery as useGetStateInfo,
  useGetAdminCatalogCommissionGetTransitionByEntityIdAndStateMachineCodeFactorQuery as useGetStateList,
  usePostAdminCatalogCommissionChangeStateMutation as useChangeState,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { HBIcon } from '@hasty-bazar/core'
import { Grid, Typography } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import ComissionSettingMessages from '../CommissionSetting.message'

interface FormHeaderPropsModel {
  id?: string
  refetch: () => void
}

const FormHeader = ({ id, refetch }: FormHeaderPropsModel) => {
  const { formatMessage } = useIntl()
  const { getValues, watch } = useFormContext()

  return (
    <Grid container xs={12} justifyContent="space-between" alignItems="center" mb={6}>
      <Grid item>
        <Typography variant="h4" color="text.primary">
          <HBIcon type="documentInfo" />
          {formatMessage(ComissionSettingMessages.commissionSettingInfo)}
        </Typography>
      </Grid>
      {!!watch('commissionType') && id && (
        <HBWorkflow
          entityId={id!}
          machineCode={
            watch('commissionType') == CommissionType.Seller
              ? StateMachineCode.SellerCommissionSetting
              : StateMachineCode.OtherCommissionSetting
          }
          {...{ useGetStateList }}
          useGetState={useGetStateInfo}
          {...{ useChangeState }}
          stateCode={id ? getValues('stateCode') : CommissionStatus.Draft}
          onChangeState={refetch}
          factor={
            watch('commissionType') == CommissionType.Seller
              ? CommissionFactor.Seller.toString()
              : CommissionFactor.Other.toString()
          }
        />
      )}
    </Grid>
  )
}

export default FormHeader
