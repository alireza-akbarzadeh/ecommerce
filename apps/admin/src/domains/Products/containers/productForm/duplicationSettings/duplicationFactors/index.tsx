import HBTable, { HBDataGridClasses, TheadType } from '@hasty-bazar/admin-shared/components/HBTable'
import {
  useGetAdminCatalogConfigurableProductsByIdVariantAgentsQuery,
  useGetAdminCatalogConfigurableProductsByIdVariantEffectiveAttributesQuery,
  usePutAdminCatalogConfigurableProductsByIdVariantAgentsMutation,
} from '@hasty-bazar-admin/domains/Products/catalogApi.enhanced'
import { ProductExplanation } from '@hasty-bazar-admin/domains/Products/components'
import { GetVariantEffectiveAttributeQueryModel } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { HBCheckBox, HBSwitch, openToast } from '@hasty-bazar/core'
import { Box, Grid, styled } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { DuplicationSectionProps } from '..'
import DuplicationSettingsMessages from '../duplicationSettings.messages'
import DuplicationFactorsMessages from './duplicationFactors.messages'

const RootGrid = styled(Grid)(({ theme }) => ({
  [`& .${HBDataGridClasses.th}`]: {
    backgroundColor: theme.palette.grey['200'],
    color: theme.palette.text.primary,
    fontSize: theme.typography.subtitle1,
    fontWeight: theme.typography.fontWeightMedium,
  },
}))

type RowDataType = GetVariantEffectiveAttributeQueryModel & { hasVariantAgent: boolean }

function DuplicationFactors({
  expanded,
  onNext,
  onPrev,
  disabled: hasChildren,
}: DuplicationSectionProps) {
  const router = useRouter()
  const id = router.query.id as string
  const { data: productAttrData, isSuccess: productAttrSuccess } =
    useGetAdminCatalogConfigurableProductsByIdVariantEffectiveAttributesQuery({
      'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
      'client-version': '1.0.1.100',
      id,
    })

  const {
    data: variantAgentsData,
    isSuccess: variantAgentsSuccess,
    isFetching,
  } = useGetAdminCatalogConfigurableProductsByIdVariantAgentsQuery({
    'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
    'client-version': '1.0.1.100',
    id,
  })

  const { formatMessage } = useIntl()

  const [selectedSwitchValue, setSelectedSwitchValue] = useState<string>()

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    rowData: RowDataType,
    name: 'hasVariantAgent' | 'isEffective',
  ) => {
    const { checked } = event.target
    const { attributeId: rowId } = rowData
    let newData = [...tableData]
    const index = newData.findIndex(({ attributeId }) => attributeId === rowId)
    if (name === 'isEffective') {
      if (!event.target.checked) {
        setSelectedSwitchValue('')
      } else {
        if (rowData.hasVariantAgent) {
          setSelectedSwitchValue(event.target.value)
        }
      }

      newData = newData?.map((item) => ({
        ...item,
        isEffectiveInDisplay: false,
      }))
      newData[index] = { ...rowData, isEffectiveInDisplay: checked }
    } else {
      newData[index] = {
        ...rowData,
        hasVariantAgent: checked,
        ...(!checked && { isEffectiveInDisplay: false }),
      }
      if (!checked) {
        if (rowData.attributeName === selectedSwitchValue) {
          setSelectedSwitchValue('')
        }
      }
    }
    setTableData(newData)
  }

  const disabled = !!variantAgentsData?.data?.variantAgentItems?.length && hasChildren

  const columns: TheadType<RowDataType>[] = [
    {
      title: '',
      key: 'action',
      render: (param, rowData) => {
        return (
          <HBCheckBox
            disabled={disabled}
            onChange={(event) => handleChange(event, rowData, 'hasVariantAgent')}
            checked={rowData?.hasVariantAgent}
          />
        )
      },
    },
    {
      title: formatMessage(DuplicationFactorsMessages.attributes),
      key: 'attributeName',
    },
    {
      title: formatMessage(DuplicationFactorsMessages.isEffective),
      key: 'isEffectiveInDisplay',
      render: (param, rowData) => {
        return (
          <HBSwitch
            disabled={disabled}
            onChange={(event) => {
              const isEffective = productAttrData?.data?.items?.find(
                (item) => item.attributeId === rowData.attributeId,
              )?.isEffectiveInDisplay
              if (isEffective) {
                handleChange(event, rowData, 'isEffective')
              }
            }}
            checked={selectedSwitchValue === rowData?.attributeName}
            value={rowData?.attributeName}
          />
        )
      },
    },
  ]

  const [tableData, setTableData] = useState<RowDataType[]>([])

  useEffect(() => {
    if (productAttrSuccess && variantAgentsSuccess) {
      setSelectedSwitchValue('')
      const duplicationFactorsData =
        productAttrData?.data?.items?.map((item) => ({
          ...item,
          isEffectiveInDisplay: Boolean(item.isEffectiveInDisplay),
          hasVariantAgent: false,
        })) || []

      const reformedTableData = duplicationFactorsData?.map((row) => {
        const agent = variantAgentsData?.data?.variantAgentItems?.find(
          (item) => item.attributeId === row.attributeId,
        )

        row.hasVariantAgent = agent ? agent.hasVariantAgent! : false
        row.isEffectiveInDisplay = agent ? agent.isDisplayEffective! : false

        if (agent?.isDisplayEffective) setSelectedSwitchValue(agent?.attributeTitle as string)

        return {
          ...row,
        }
      })

      setTableData(reformedTableData)
    }
  }, [variantAgentsData?.data?.variantAgentItems, productAttrData?.data?.items])

  const [submitData, { isLoading: isSubmitting }] =
    usePutAdminCatalogConfigurableProductsByIdVariantAgentsMutation()

  const handleSubmit = async () => {
    const setProductVariantAgentsModel = {
      variantAgents: [
        ...tableData?.map((i) => ({
          attributeId: i.attributeId! as string,
          isDisplayEffective: i.isEffectiveInDisplay! as boolean,
          hasVariantAgent: i.hasVariantAgent! as boolean,
        })),
      ],
    }

    try {
      await submitData({
        'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
        'client-version': '1.0.1.100',
        id,
        setProductVariantAgentsModel,
      }).unwrap()

      openToast({
        message: formatMessage(DuplicationFactorsMessages.successPut),
        type: 'success',
      })
      onNext()
    } catch (error) {}
  }

  return (
    <ProductExplanation
      summaryProps={{
        title: formatMessage(DuplicationSettingsMessages.duplicationFactors),
        icon: 'tagAlt',
        statusLabel: variantAgentsData?.data?.variantAgentItems?.length ? '1' : '0',
      }}
      expanded={expanded}
      nextStepButtonProps={{
        loading: isSubmitting,
        onClick: handleSubmit,
      }}
      prevStepButtonProps={{ onClick: onPrev }}
    >
      <Box sx={{ p: 6, maxWidth: 500 }}>
        <RootGrid item xs={8} spacing={6}>
          <HBTable
            columns={columns}
            data={tableData}
            keyExtractor={(item) => String(item?.attributeId)}
          />
        </RootGrid>
      </Box>
    </ProductExplanation>
  )
}

export default DuplicationFactors
