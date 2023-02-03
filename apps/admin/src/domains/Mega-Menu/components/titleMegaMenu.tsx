import { HBWorkflow } from '@hasty-bazar/admin-shared/containers'
import { StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import {
  useGetAdminCmsMenugroupsGetStateInfoByStateCodeAndStateMachineCodeFactorQuery as useGetStateInfo,
  useGetAdminCmsMenugroupsGetTransitionByEntityIdAndStateMachineCodeFactorQuery as useGetStateList,
  usePostAdminCmsMenugroupsChangeStateMutation,
} from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import { HBIcon } from '@hasty-bazar/core'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import MegaMenuPageMessages from '../MegaMenu.messages'

type TitleMegaMenuProps = {
  stateCode: string
  refetch?: () => void
}
const TitleMegaMenu = ({ stateCode, refetch }: TitleMegaMenuProps) => {
  const { formatMessage } = useIntl()
  const router = useRouter()
  const megaMenuId = router?.query?.id?.[0]

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <HBIcon type="apps"></HBIcon>
        <Typography variant="h5">{formatMessage(MegaMenuPageMessages.systemMenuGroup)}</Typography>
      </Box>
      {megaMenuId && (
        <HBWorkflow
          factor="1"
          entityId={megaMenuId!}
          machineCode={StateMachineCode.MegaMenu}
          useGetStateList={useGetStateList}
          useGetState={useGetStateInfo}
          useChangeState={usePostAdminCmsMenugroupsChangeStateMutation}
          stateCode={stateCode}
          onChangeState={refetch}
        />
      )}
    </Box>
  )
}
export default TitleMegaMenu
