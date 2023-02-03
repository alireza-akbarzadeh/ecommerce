import HBTable, { HBDataGridClasses, TheadType } from '@hasty-bazar/admin-shared/components/HBTable'
import {
  useGetAdminCatalogConfigurableProductsByIdVariantAgentsQuery,
  useGetAdminCatalogConfigurableProductsByIdVariantEffectiveAttributesQuery,
  usePutAdminCatalogConfigurableProductsByIdChildProductChangeDisplayEffectiveMutation,
} from '@hasty-bazar-admin/domains/Products/catalogApi.enhanced'
import { GetVariantEffectiveAttributeQueryModel } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { HBCheckBox, HBDialog, HBSwitch, openToast } from '@hasty-bazar/core'
import { Box, Grid, styled } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import DuplicationFactorsMessages from '../duplicationFactors/duplicationFactors.messages'
import DuplicationSettingsMessages from '../duplicationSettings.messages'
const RootGrid = styled(Grid)(({ theme }) => ({
  [`& .${HBDataGridClasses.th}`]: {
    backgroundColor: theme.palette.grey['200'],
    color: theme.palette.text.primary,
    fontSize: theme.typography.subtitle1,
    fontWeight: theme.typography.fontWeightMedium,
  },
}))
type RowDataType = GetVariantEffectiveAttributeQueryModel & { hasVariantAgent: boolean }

interface Props {
  open: boolean
  onClose: () => void
}
function ChangeDialogEffective({ open, onClose }: Props) {
  const router = useRouter()
  const id = router.query.id as string
  const [selectedSwitchValue, setSelectedSwitchValue] = useState<string>()
  const [tableData, setTableData] = useState<RowDataType[]>([])
  const {
    data: productAttrData,
    isSuccess: productAttrSuccess,
    refetch: productAttrRefetch,
  } = useGetAdminCatalogConfigurableProductsByIdVariantEffectiveAttributesQuery({
    'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
    'client-version': '1.0.1.100',
    id,
  })

  const {
    data: variantAgentsData,
    isSuccess: variantAgentsSuccess,
    isFetching: variantAgentsIsFetching,
    refetch: variantAgentsRefetch,
  } = useGetAdminCatalogConfigurableProductsByIdVariantAgentsQuery({
    'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
    'client-version': '1.0.1.100',
    id,
  })

  const { formatMessage } = useIntl()
  const columns: TheadType<RowDataType>[] = [
    {
      title: '',
      key: 'action',
      render: (param, rowData) => {
        return (
          <HBCheckBox
            disabled={true}
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
        if (agent) {
          row.hasVariantAgent = agent.hasVariantAgent!
          row.isEffectiveInDisplay = agent.isDisplayEffective!
        }

        if (agent?.isDisplayEffective) setSelectedSwitchValue(agent?.attributeTitle as string)

        return {
          ...row,
        }
      })

      setTableData(reformedTableData)
    }
  }, [productAttrSuccess, variantAgentsSuccess, variantAgentsIsFetching])

  const [putChangeDisplayEffective] =
    usePutAdminCatalogConfigurableProductsByIdChildProductChangeDisplayEffectiveMutation()

  const handleChangeEffectiveDialog = async () => {
    const changeChildProductDisplayEffectiveModel = {
      variantAgentAttributes: [
        ...tableData?.map((i) => ({
          attributeId: i.attributeId! as string,
          isDisplayEffective: i.isEffectiveInDisplay! as boolean,
          hasVariantAgent: i.hasVariantAgent! as boolean,
        })),
      ],
    }

    await putChangeDisplayEffective({
      'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.AdminApi',
      'client-version': '1.0.1.100',
      id,
      changeChildProductDisplayEffectiveModel,
    }).unwrap()

    openToast({
      message: formatMessage(DuplicationSettingsMessages.successfullyChangeEffective),
      type: 'success',
    })

    onClose()

    await productAttrRefetch()
    await variantAgentsRefetch()
  }

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
      newData[index] = { ...rowData, hasVariantAgent: checked }
      if (!checked) {
        if (rowData.attributeName === selectedSwitchValue) {
          setSelectedSwitchValue('')
        }
      }
    }
    setTableData(newData)
  }

  return (
    <HBDialog
      content={
        <Box sx={{ p: 6, maxWidth: 500 }}>
          <RootGrid item xs={8} spacing={6}>
            <HBTable
              columns={columns}
              data={tableData?.filter((item) => item?.hasVariantAgent === true) as RowDataType[]}
              keyExtractor={(item) => String(item?.attributeId)}
            />
          </RootGrid>
        </Box>
      }
      title={formatMessage(DuplicationSettingsMessages.changeEffective)}
      acceptBtn={formatMessage(DuplicationSettingsMessages.confirm)}
      open={open}
      onClose={onClose}
      onReject={onClose}
      onAccept={handleChangeEffectiveDialog}
    />
  )
}

export default ChangeDialogEffective
