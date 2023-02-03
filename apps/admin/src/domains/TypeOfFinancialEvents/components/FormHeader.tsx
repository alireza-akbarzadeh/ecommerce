import { HBWorkflow } from '@hasty-bazar/admin-shared/containers'
import { StateMachineCode, Workflow } from '@hasty-bazar/admin-shared/core/enums'
import {
  useGetAdminAccountingApiTransactionTypeGetStateInfoByStateCodeAndStateMachineCodeFactorQuery as useGetStateInfo,
  useGetAdminAccountingApiTransactionTypeGetTransitionByEntityIdAndStateMachineCodeFactorQuery as useGetStateList,
  usePostAdminAccountingApiTransactionTypeChangeStateMutation as useChangeState,
} from '@hasty-bazar/admin-shared/services/accountingApi.generated'
import { Box, Typography } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import TypeOfFinancialEventsMessages from '../typeOfFinancialEvents.message'
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
            {formatMessage(TypeOfFinancialEventsMessages.formDescription)}
          </Typography>
        )}
      </Box>
      <HBWorkflow
        entityId={id!}
        machineCode={StateMachineCode.TypeOfFinancialEvents}
        {...{ useGetStateList }}
        useGetState={useGetStateInfo}
        {...{ useChangeState }}
        stateCode={id ? getValues('stateCode') : Workflow.Draft}
        onChangeState={refetch}
        factor={'1'}
      />
    </>
  )
}

export default FormHeader
