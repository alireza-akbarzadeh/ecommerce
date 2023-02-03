import React from 'react'
import { DuplicationSectionProps } from '..'
import DuplicationProductsPricing from './duplicationProductsPricing'
import DuplicationProductsPricingEmpty from './duplicationProductsPricingEmpty'

const DuplicationProductsPricingStep = ({ expanded, onNext, onPrev }: DuplicationSectionProps) => {
  if (expanded) {
    return <DuplicationProductsPricing onNext={onNext} onPrev={onPrev} expanded={true} />
  }
  return <DuplicationProductsPricingEmpty onNext={onNext} onPrev={onPrev} expanded={false} />
}
export default DuplicationProductsPricingStep
