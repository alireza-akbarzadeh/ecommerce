import HBTable, { HBDataGridClasses, TheadType } from '@hasty-bazar/admin-shared/components/HBTable'
import {
  AttributeValueModel,
  VariantValueItem,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { HBCheckBox, HBSwitch } from '@hasty-bazar/core'
import { Box, Grid, styled } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import DuplicationSettingsMessages from '../duplicationSettings.messages'

const RootGrid = styled(Grid)(({ theme }) => ({
  [`& .${HBDataGridClasses.th}`]: {
    backgroundColor: theme.palette.grey['200'],
    color: theme.palette.text.primary,
    fontSize: theme.typography.subtitle1,
    fontWeight: theme.typography.fontWeightMedium,
  },
}))

export type AttributeDataType = AttributeValueModel & {
  hasVariantValue: boolean
  isDisplayEffective: boolean
}

type AttributeGridProps = {
  columnName: string
  columnData: AttributeValueModel[]
  isDisplayEffective: boolean
  onDataChange: (param: AttributeDataType[]) => void
  variantValueItems: VariantValueItem[]
}

function AttributeGrid({
  columnName,
  columnData,
  isDisplayEffective,
  onDataChange,
  variantValueItems,
}: AttributeGridProps) {
  const router = useRouter()
  const [tableData, setTableData] = useState<AttributeDataType[]>([])

  const { formatMessage } = useIntl()

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    rowData: AttributeDataType,
    name: 'hasVariantValue' | 'isEffective',
  ) => {
    const { checked } = event.target
    const { attributeValueId: rowId } = rowData
    const newData = [...tableData]
    const index = newData.findIndex(({ attributeValueId }) => attributeValueId === rowId)
    if (name === 'isEffective') {
      if (rowData.hasVariantValue) {
        newData[index] = { ...rowData, isDisplayEffective: checked as boolean }
      }
    } else {
      newData[index] = { ...rowData, hasVariantValue: checked as boolean }
      if (!checked) {
        newData[index] = { ...rowData, isDisplayEffective: false, hasVariantValue: false }
      }
    }
    setTableData(newData)
  }

  const columns: TheadType<AttributeDataType>[] = [
    {
      title: '',
      key: 'action',
      render: (param, rowData) => {
        return (
          <HBCheckBox
            onChange={(event) => handleChange(event, rowData, 'hasVariantValue')}
            checked={rowData?.hasVariantValue}
          />
        )
      },
    },
    {
      title: columnName,
      key: 'value',
    },
    {
      style: {
        display: 'none',
      },
      title: formatMessage(DuplicationSettingsMessages.isEffectiveInDisplay),
      key: 'isEffectiveInDisplay',
      render: (param, rowData) => {
        return (
          <>
            {isDisplayEffective && (
              <HBSwitch
                onChange={(event) => handleChange(event, rowData, 'isEffective')}
                checked={rowData?.isDisplayEffective}
              />
            )}
          </>
        )
      },
    },
  ]

  useEffect(() => {
    if (columnData && columnName && variantValueItems) {
      const duplicationFactorValuesData =
        columnData?.map((item) => ({
          ...item,
          isDisplayEffective: false,
          hasVariantValue: false,
        })) || []

      const reformedTableData = duplicationFactorValuesData?.map((row) => {
        const value = variantValueItems?.find(
          (item) => item.attributeValueId === row.attributeValueId,
        )

        if (value) {
          row.hasVariantValue = value.hasVariantValue!
          row.isDisplayEffective = value.isDisplayEffective!
        }

        return {
          ...row,
        }
      })

      setTableData(reformedTableData)
    }
  }, [columnData, columnName, variantValueItems])

  useEffect(() => {
    onDataChange(tableData)
  }, [tableData])

  return (
    <Box sx={{ p: 6, maxWidth: 500 }}>
      <RootGrid item xs={8} spacing={6}>
        <HBTable columns={columns} data={tableData} keyExtractor={(item) => String(item.value)} />
      </RootGrid>
    </Box>
  )
}

export default AttributeGrid
