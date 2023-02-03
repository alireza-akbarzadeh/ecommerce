import { HBWorkflow } from '@hasty-bazar/admin-shared/containers'
import { ContractState, StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import {
  useGetAdminSaleApiVendorShippingContractGetStateInfoByStateCodeAndStateMachineCodeFactorQuery as useGetStateInfo,
  useGetAdminSaleApiVendorShippingContractGetTransitionByEntityIdAndStateMachineCodeFactorQuery as useGetStateList,
  usePostAdminSaleApiVendorShippingContractChangeStateMutation as useChangeState,
} from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { Box, Typography } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { classes } from '../formConfig'
import { FormHeaderProps } from '../types'
import VendorShippingAgrrementsMessages from '../VendorShippingAgreements.message'

const FormHeader = ({ id, refetch }: FormHeaderProps) => {
  const { formatMessage } = useIntl()
  const { getValues } = useFormContext()

  return (
    <>
      <Box>
        {id && (
          <Typography sx={{ color: 'grey.500' }}>
            {`${formatMessage(VendorShippingAgrrementsMessages.code)} : ${getValues('code')}`}
          </Typography>
        )}
      </Box>
      <Box sx={classes.currentState}>
        <HBWorkflow
          entityId={id!}
          machineCode={StateMachineCode.VendorShippingAgreementsSetting}
          {...{ useGetStateList }}
          useGetState={useGetStateInfo}
          {...{ useChangeState }}
          stateCode={id ? getValues('contractState') : ContractState.Draft}
          onChangeState={refetch}
          factor={'1'}
        />
      </Box>
    </>
  )
}

export default FormHeader
