import { HBRecordHistory } from '@hasty-bazar/admin-shared/containers'
import { HBExplanation } from '@hasty-bazar/admin-shared/containers/HBExplanation'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { GetCategoryQueryResult } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { HBClassesType, HBIconType } from '@hasty-bazar/core'
import Box from '@mui/material/Box'
import { useRouter } from 'next/router'
import React, { ReactElement, useMemo } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useIntl } from 'react-intl'
import ProductGroupPageMessages from '../ProductGroupPage.messages'
import { IProductGroupsFormTypes } from '../types'
import Certificates from './Certificates'
import Commission from './Commission'
import DisplaySetting from './DisplaySetting'
import { ProductContent } from './ProductContent'
import ProductFurtherDetails from './ProductFurtherDetails'
import ProductFurtherDetailsSummary from './ProductFurtherDetailsSummary'
import ProductInfo from './ProductInfo'
import { RelatedAttributes } from './RelatedAttributes'
import { RelationBetweenGroups } from './RelationBetweenGroups'

type HBPageClassNames = 'optionsColumn'
const classes: HBClassesType<HBPageClassNames> = {
  optionsColumn: { width: { xs: '100%', sm: '100%' } },
}
type accordionProps = {
  id: number
  title: string
  summaryIcon: HBIconType
  detail: ReactElement
  name: string
  statusLabel: number
  visible: boolean
  disabled: boolean
  dependsOnLastNode: boolean
  children:
    | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactFragment
    | React.ReactPortal
}

const Forms = ({
  data,
  refetchData,
}: {
  data: GetCategoryQueryResult
  refetchData: () => void
}) => {
  const router = useRouter()
  const { query: { slug: [action, nodeId] = [], activePanel } = {}, push } = router
  const { control } = useFormContext<IProductGroupsFormTypes>()
  const { isAllocatableToProduct } = useWatch({ control })
  const [expanded, setExpanded] = React.useState<string | false>(String(activePanel))
  const { formatMessage } = useIntl()

  const accordions: accordionProps[] = useMemo(
    () => [
      {
        id: 0,
        title: formatMessage(ProductGroupPageMessages.accordionFurtherInformationTitle),
        summaryIcon: 'infoCircle',
        detail: <ProductFurtherDetails />,
        name: 'info',
        statusLabel: 0,
        children: '',
        visible: true,
        dependsOnLastNode: false,
        disabled: action !== 'edit',
      },
      {
        id: 1,
        title: formatMessage(ProductGroupPageMessages.commission),
        summaryIcon: 'fileEditAlt',
        detail: (
          <Commission
            refetchData={refetchData}
            data={data}
            isAllocatableToProduct={isAllocatableToProduct}
          />
        ),
        name: 'commission',
        statusLabel: 0,
        children: '',
        visible: true,
        dependsOnLastNode: false,
        disabled: false || !isAllocatableToProduct,
      },
      {
        id: 2,
        title: formatMessage(ProductGroupPageMessages.relatedAttributesWithProductGroup),
        summaryIcon: 'fileAlt',
        detail: <RelatedAttributes />,
        name: 'relatedAttribute',
        statusLabel: data?.attributesCount || 0,
        children: '',
        visible: true,
        dependsOnLastNode: true,
        disabled: false || !isAllocatableToProduct,
      },
      {
        id: 3,
        title: formatMessage(ProductGroupPageMessages.accordionContentTitle),
        summaryIcon: 'fileAlt',
        detail: <ProductContent entityId={nodeId!} />,
        name: 'content',
        statusLabel: 0,
        children: '',
        visible: true,
        dependsOnLastNode: false,
        disabled: action !== 'edit',
      },
      {
        id: 4,
        title: formatMessage(ProductGroupPageMessages.accordionDisplaySettingTitle),
        summaryIcon: 'setting',
        detail: <DisplaySetting />,
        statusLabel: 0,
        name: 'setting',
        children: '',
        visible: true,
        dependsOnLastNode: false,
        disabled:
          // false || !(data?.displayExtractTypeCode === '1030001' && data.screenDisplayId === '32'), //TODO: After MVP
          false || data?.displayExtractTypeCode !== '1030003',
      },
      {
        id: 5,
        title: formatMessage(ProductGroupPageMessages.accordionCertificatesTitle),
        summaryIcon: 'fileEditAlt',
        detail: <Certificates />,
        name: 'filter',
        statusLabel: 0,
        children: '',
        visible: true,
        dependsOnLastNode: false,
        disabled: false || !isAllocatableToProduct,
      },
      {
        id: 6,
        title: formatMessage(ProductGroupPageMessages.accordionCommunicationBetweenGroupsTitle),
        summaryIcon: 'historyAlt',
        detail: <RelationBetweenGroups id={nodeId} />,
        name: 'history',
        statusLabel: 0,
        children: '',
        visible: true,
        dependsOnLastNode: true,
        disabled: false || !isAllocatableToProduct,
      },
      {
        id: 7,
        title: formatMessage(phrasesMessages.history),
        summaryIcon: 'historyAlt',
        detail: <Box />,
        name: 'history',
        statusLabel: 0,
        children: '',
        visible: false,
        dependsOnLastNode: true,
        disabled: false,
      },
    ],
    [isAllocatableToProduct, nodeId, action, data],
  )

  const handleChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
    if (newExpanded) {
      router.query.activePanel = panel
    } else {
      const { activePanel, ...rest } = router.query
      router.query = rest
    }
    push(router, undefined, {
      shallow: true,
    })
    setExpanded(newExpanded ? panel : false)
  }

  return (
    <Box sx={classes.optionsColumn}>
      <ProductInfo action={action} data={data} refreshData={refetchData} />
      {accordions
        .filter((accordion: accordionProps) => accordion.visible)
        .map((accordion) => (
          <HBExplanation
            key={accordion.id}
            summary={
              <ProductFurtherDetailsSummary
                title={accordion.title}
                icon={accordion.summaryIcon}
                statusLabel={accordion.statusLabel}
              />
            }
            expanded={expanded === accordion.name && !!nodeId && !accordion.disabled}
            onChange={handleChange(accordion.name)}
            detail={expanded === accordion.name ? accordion.detail : <></>}
            disabled={accordion.disabled}
          />
        ))}
      <HBRecordHistory data={data} isBorder isShowAccordion disabled={!nodeId} />
    </Box>
  )
}

export default Forms
