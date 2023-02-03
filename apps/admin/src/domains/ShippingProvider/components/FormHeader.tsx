import { HBWorkflow } from '@hasty-bazar/admin-shared/containers'
import { ShippingProviderState, StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import {
  useGetAdminSaleApiShippingProvidersGetStateInfoByStateCodeAndStateMachineCodeFactorQuery as useGetStateInfo,
  useGetAdminSaleApiShippingProvidersGetTransitionByEntityIdAndStateMachineCodeFactorQuery as useGetStateList,
  usePostAdminSaleApiShippingProvidersChangeStateMutation as useChangeState,
} from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { Box, Typography } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import ShippingProviderMessages from '../shippingProvider.message'
interface FormHeaderPropsModel {
  id?: string
  refetch: () => void
}

const FormHeader = ({ id, refetch }: FormHeaderPropsModel) => {
  const { formatMessage } = useIntl()
  const { getValues } = useFormContext()

  return (
    <>
      <Box>
        {id && (
          <Typography sx={{ color: 'grey.500' }}>
            {formatMessage(ShippingProviderMessages.formDescription)}
          </Typography>
        )}
      </Box>
      <HBWorkflow
        entityId={id!}
        machineCode={StateMachineCode.ShippingProvider}
        {...{ useGetStateList }}
        useGetState={useGetStateInfo}
        {...{ useChangeState }}
        stateCode={id ? getValues('providerShippingState') : ShippingProviderState.Draft}
        onChangeState={refetch}
        factor={'1'}
      />
    </>
  )
}

export default FormHeader
