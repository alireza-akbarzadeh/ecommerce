import { useGetAdminCatalogProductRulesByIdQuery } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { Box } from '@mui/material'
import { FC } from 'react'

interface DialogContentProps {
  ruleId: string
}

const DialogContent: FC<DialogContentProps> = ({ ruleId }) => {
  const { data: { data: productRulesData = {} } = {} } = useGetAdminCatalogProductRulesByIdQuery(
    {
      'client-name': 'ProductRulesById',
      'client-version': '0.0.1',
      id: ruleId!,
    },
    {
      skip: !ruleId,
    },
  )

  return (
    <>
      {productRulesData?.description && (
        <Box width={'100%'} dangerouslySetInnerHTML={{ __html: productRulesData?.description }} />
      )}
    </>
  )
}

export default DialogContent
