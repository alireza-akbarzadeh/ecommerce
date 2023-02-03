import { ProductExplanation } from '@hasty-bazar-admin/domains/Products/components'
import React from 'react'
import { useIntl } from 'react-intl'
import { DuplicationSectionProps } from '..'
import duplicationSettings from '../duplicationSettings.messages'

const DuplicationProductsPricingEmpty = ({ expanded, onNext, onPrev }: DuplicationSectionProps) => {
  const { formatMessage } = useIntl()
  return (
    <ProductExplanation
      summaryProps={{
        title: formatMessage(duplicationSettings.duplicationProductsPricing),
        statusLabel: '0',
        icon: 'dollarSign',
      }}
      expanded={expanded}
      prevStepButtonProps={{ onClick: onPrev }}
    >
      <></>
    </ProductExplanation>
  )
}

export default DuplicationProductsPricingEmpty
