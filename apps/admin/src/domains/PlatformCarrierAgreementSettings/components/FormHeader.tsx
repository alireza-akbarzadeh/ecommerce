import { HBWorkflow } from '@hasty-bazar/admin-shared/containers'
import { PlatformState, StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import {
  useGetAdminSaleApiPlatformShippingContractGetStateInfoByStateCodeAndStateMachineCodeFactorQuery as useGetStateInfo,
  useGetAdminSaleApiPlatformShippingContractGetTransitionByEntityIdAndStateMachineCodeFactorQuery as useGetStateList,
  usePostAdminSaleApiPlatformShippingContractChangeStateMutation as useChangeState,
} from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { Box, Typography } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { classes } from '../formConfig'
import PlatformCarrierAgrrementsMessages from '../PlatformCarrierAgreementSettings.message'
import { FormHeaderPropsModel } from '../types'

const FormHeader = ({ id, refetch }: FormHeaderPropsModel) => {
  const { formatMessage } = useIntl()
  const { getValues } = useFormContext()

  return (
    <>
      <Box>
        {id && (
          <Typography sx={{ color: 'grey.500' }}>
            {formatMessage(PlatformCarrierAgrrementsMessages.formDescription)}
          </Typography>
        )}
      </Box>
      <Box sx={classes.currentState}>
        <HBWorkflow
          entityId={id!}
          machineCode={StateMachineCode.PlatformCarrierAgreementSettings}
          {...{ useGetStateList }}
          useGetState={useGetStateInfo}
          {...{ useChangeState }}
          stateCode={id ? getValues('contractStateCode') : PlatformState.Draft}
          onChangeState={refetch}
          factor={'1'}
        />
      </Box>
    </>
  )
}

export default FormHeader
