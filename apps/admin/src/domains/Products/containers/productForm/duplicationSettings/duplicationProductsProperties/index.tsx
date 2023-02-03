import { ProductExplanation } from '@hasty-bazar-admin/domains/Products/components'
import { useIntl } from 'react-intl'
import { DuplicationSectionProps } from '..'
import ProductSpecifications from '../../contentSettings/productSpecifications'
import DuplicationSettingsMessages from '../duplicationSettings.messages'

function DuplicationProductsProperties({ expanded, onNext, onPrev }: DuplicationSectionProps) {
  const { formatMessage } = useIntl()
  return (
    <>
      {!expanded ? (
        <ProductExplanation
          summaryProps={{
            title: formatMessage(DuplicationSettingsMessages.duplicationProductsProperties),
            statusLabel: '0',
            icon: 'infoCircle',
          }}
          expanded={expanded}
          prevStepButtonProps={{ onClick: onPrev }}
        >
          <></>
        </ProductExplanation>
      ) : (
        <ProductSpecifications
          title={formatMessage(DuplicationSettingsMessages.duplicationProductsProperties)}
          onNext={onNext}
          onPrev={onPrev}
          expanded={expanded}
        />
      )}
    </>
  )
}

export default DuplicationProductsProperties
