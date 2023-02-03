import { CommerceAccordion } from '@hasty-bazar-commerce/components'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { useGetWebCatalogProductRulesGetallPublishedQuery } from '@hasty-bazar-commerce/services/catalogApi.generated'
import { HBDialog } from '@hasty-bazar/core'
import { fontWeights } from '@hasty-bazar/material-provider'
import { Stack, Typography } from '@mui/material'
import { useIntl } from 'react-intl'
import ProductionDetailMessages from '../productDetail.messages'

interface ShareModalProps {
  onClose: VoidFunction
  open: boolean
}

function ProductReturnRulesModal({ open, onClose }: ShareModalProps) {
  const { formatMessage } = useIntl()

  const { data } = useGetWebCatalogProductRulesGetallPublishedQuery({
    ...ApiConstants,
    processEventName: 'Catalog_ReturnRule_ViewReturnRules',
    filter: 'ProcessEventName_Equal_--ProcessEventName',
  })

  return (
    <HBDialog
      open={open}
      maxWidth="sm"
      fullWidth
      onClose={onClose}
      onBackdropClick={onClose}
      title={
        <Typography variant="h5" fontWeight={fontWeights.fontWeightBold}>
          {formatMessage(ProductionDetailMessages.returnRules)}
        </Typography>
      }
    >
      <Stack gap={6}>
        {data?.data?.items?.map((rule) => (
          <CommerceAccordion
            open
            key={rule.id}
            summaryTitle={(rule.name && <Typography variant="h6">{rule.name}</Typography>) || ''}
          >
            <Typography
              variant="body2"
              component="div"
              px={2}
              sx={{
                '& *': {
                  fontFamily: (theme) => `${theme.typography.fontFamily} !important`,
                  textAlign: 'justify !important',
                },
                lineHeight: `2.3 !important`,
              }}
              dangerouslySetInnerHTML={{
                __html: rule?.description || '',
              }}
            />
          </CommerceAccordion>
        ))}
      </Stack>
    </HBDialog>
  )
}
export default ProductReturnRulesModal
