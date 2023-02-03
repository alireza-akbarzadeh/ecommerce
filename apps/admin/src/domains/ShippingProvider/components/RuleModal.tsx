import { HBDialog } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import DialogContent from '../containers/DialogContent'
import ShippingProviderMessages from '../shippingProvider.message'

interface RuleModalProps {
  ruleId: string
  showRuleModal: boolean
  setRulIdAndShowItsModal: (id: string, show: boolean) => void
}

const RuleModal: FC<RuleModalProps> = ({ ruleId, showRuleModal, setRulIdAndShowItsModal }) => {
  const { formatMessage } = useIntl()

  return (
    <HBDialog
      title={formatMessage(ShippingProviderMessages.shipmentRuleDetail)}
      onReject={() => setRulIdAndShowItsModal(ruleId, false)}
      open={showRuleModal}
      onClose={() => setRulIdAndShowItsModal(ruleId, false)}
      PaperProps={{ sx: { width: 1600 } }}
    >
      <Box>
        <DialogContent {...{ ruleId }} />
      </Box>
    </HBDialog>
  )
}

export default RuleModal
