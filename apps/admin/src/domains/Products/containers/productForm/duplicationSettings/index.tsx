import { useGetAdminCatalogConfigurableProductsByIdVariantProductItemsQuery } from '@hasty-bazar-admin/domains/Products/catalogApi.enhanced'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import ProductFormContainer from '../../productFormContainer'
import CreateReadyDuplicationProducts from './createReadyDuplicationProducts'
import DuplicationFactors from './duplicationFactors'
import DuplicationFactorsValues from './duplicationFactorsValues'
import DuplicationProductsPricing from './duplicationProductsPricing'
import DuplicationProductsProperties from './duplicationProductsProperties'

export const enum ExpandedSteps {
  DuplicationFactors = 1,
  DuplicationProductsValues = 2,
  DuplicationProductsProperties = 3,
  DuplicationProductsPricing = 4,
  CreateReadyDuplicationProducts = 5,
}
export interface DuplicationSectionProps {
  onNext: (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>, step?: ExpandedSteps) => void
  onPrev: (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>, step?: ExpandedSteps) => void
  expanded: boolean
  disabled?: boolean
}

function DuplicationPoint() {
  const [expandedStep, setExpandedStep] = useState<number>(ExpandedSteps.DuplicationFactors)
  const router = useRouter()
  const id = router.query.id as string

  const products = useGetAdminCatalogConfigurableProductsByIdVariantProductItemsQuery({
    'client-name': '1',
    'client-version': '1',
    id,
  })

  const onNext = (
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    step?: ExpandedSteps,
  ) => {
    if (step) {
      setExpandedStep(step)
      return
    }
    if (expandedStep !== ExpandedSteps.CreateReadyDuplicationProducts) {
      setExpandedStep(expandedStep + 1)
    }
  }
  const onPrev = (
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    step?: ExpandedSteps,
  ) => {
    if (step) {
      setExpandedStep(step)
      return
    }
    if (expandedStep > ExpandedSteps.DuplicationFactors) {
      setExpandedStep(expandedStep - 1)
    }
  }

  useEffect(() => {
    if (products.data?.data?.items?.length) {
      setExpandedStep(ExpandedSteps.CreateReadyDuplicationProducts)
    }
  }, [products.isLoading])

  return (
    <ProductFormContainer withDetails>
      <DuplicationFactors
        onNext={onNext}
        disabled={!!products.data?.data?.items?.length}
        onPrev={onPrev}
        expanded={expandedStep === ExpandedSteps.DuplicationFactors}
      />
      <DuplicationFactorsValues
        onNext={onNext}
        onPrev={onPrev}
        expanded={expandedStep === ExpandedSteps.DuplicationProductsValues}
      />
      <DuplicationProductsProperties
        onNext={onNext}
        onPrev={onPrev}
        expanded={expandedStep === ExpandedSteps.DuplicationProductsProperties}
      />

      <DuplicationProductsPricing
        onNext={onNext}
        onPrev={onPrev}
        expanded={expandedStep === ExpandedSteps.DuplicationProductsPricing}
      />

      <CreateReadyDuplicationProducts
        onNext={onNext}
        onPrev={onPrev}
        expanded={expandedStep === ExpandedSteps.CreateReadyDuplicationProducts}
      />
    </ProductFormContainer>
  )
}

export default DuplicationPoint
