import { GetCategoriesQueryResult } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { HBSelectTree } from '@hasty-bazar/core'
import { Box, FormControl, InputLabel, styled } from '@mui/material'
import { isNil } from 'ramda'
import React, { useMemo } from 'react'
import { useIntl } from 'react-intl'
import AddSimpleProductMessages from '../productForm/addProduct/AddProduct.messages'

export const CellBoxStyle = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  height: '100%',
}))

export interface RelationCategoryRenderControllerProps {
  categoriesData?: GetCategoriesQueryResult[] | undefined | null
  setValue: (value: string | string[], defaultValue: boolean) => void
  defaultValue?: string | null
  renderValueEmptyLabel?: string
  label?: string
}

export const RelationCategoryRender = ({
  categoriesData,
  setValue,
  label,
  renderValueEmptyLabel = '',
  defaultValue,
}: RelationCategoryRenderControllerProps) => {
  const { formatMessage } = useIntl()

  const categories = useMemo(() => {
    if (!categoriesData) {
      return []
    } else {
      return categoriesData?.map((item) => {
        return {
          ...item,
          id: item.id!,
          label: item.name!,
          parentId: item.parentId!,
          value: item.id!,
          parentSelectable: item.isAllocatableToProduct,
        }
      })
    }
  }, [categoriesData])
  const defaultCategory = useMemo(() => {
    if (!defaultValue) {
      return undefined
    } else {
      return categories.find((item) => item.value === defaultValue)
    }
  }, [defaultValue, categories])

  return (
    <CellBoxStyle>
      <FormControl
        sx={{
          width: '100%',
        }}
      >
        {label && (
          <InputLabel
            sx={{
              backgroundColor: 'background.paper',
              zIndex: 1,
            }}
            size="small"
          >
            {label}
          </InputLabel>
        )}

        <HBSelectTree
          size="small"
          label={isNil(label) ? formatMessage(AddSimpleProductMessages.categoryId) : label}
          fullWidth
          defaultValue={defaultCategory}
          renderValueEmptyLabel={renderValueEmptyLabel}
          rootParentValue={null}
          data={categories}
          onChange={(value: string | string[]) => {
            setValue!(value, defaultValue === value)
          }}
        />
      </FormControl>
    </CellBoxStyle>
  )
}
