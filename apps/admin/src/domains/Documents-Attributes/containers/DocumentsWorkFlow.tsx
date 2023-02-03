import { HBWorkflow } from '@hasty-bazar/admin-shared/containers'
import { StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import {
  useGetAdminCmsDocumentsGetStateInfoByStateCodeAndStateMachineCodeFactorQuery,
  useGetAdminCmsDocumentsGetTransitionByEntityIdAndStateMachineCodeFactorQuery,
  usePostAdminCmsDocumentsChangeStateMutation,
} from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import { Box } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { DocumentsFormType } from '../DocumentEditAddPage'

export default function DocumentsWorkFlow({ refetch }: { refetch: () => void }) {
  const { watch } = useFormContext<DocumentsFormType>()

  return (
    <Box display="flex" justifyContent="flex-end">
      {watch('id') && (
        <HBWorkflow
          entityId={watch('id')!}
          machineCode={StateMachineCode.Documents}
          useGetStateList={
            useGetAdminCmsDocumentsGetTransitionByEntityIdAndStateMachineCodeFactorQuery
          }
          useGetState={useGetAdminCmsDocumentsGetStateInfoByStateCodeAndStateMachineCodeFactorQuery}
          useChangeState={usePostAdminCmsDocumentsChangeStateMutation}
          stateCode={watch('stateCode')!}
          onChangeState={refetch}
          factor={'1'}
        />
      )}
    </Box>
  )
}
