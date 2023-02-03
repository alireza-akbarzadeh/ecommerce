import { GetCategoriesQueryResult } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { GetBusinessTypeValuesByBusinessTypeQueryResult } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBSelect, HBSelectTree } from '@hasty-bazar/core'
import { Box, styled } from '@mui/material'
import React from 'react'

export const CellBoxStyle = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  height: '100%',
}))

export const RelationCategoryRender = ({
  categoriesData,
  setValue,
}: {
  categoriesData?: GetCategoriesQueryResult[] | undefined | null
  setValue: (value: string | string[]) => void
}) => {
  return (
    <CellBoxStyle>
      <HBSelectTree
        size="small"
        sx={{ width: 180, height: 30, '& > label': { lineHeight: 1 } }}
        label=""
        rootParentValue={null}
        data={
          categoriesData?.map((item) => {
            return {
              id: item.id!,
              label: item.name!,
              parentId: item.parentId!,
              value: item.id!,
              isAllocatableToProduct: item.isAllocatableToProduct!,
            }
          }) || []
        }
        onChange={(value: string | string[]) => {
          setValue!(value)
        }}
      />
    </CellBoxStyle>
  )
}

export const RelationValueCode = ({
  data,
  valueCode,
  setValue,
}: {
  data: GetBusinessTypeValuesByBusinessTypeQueryResult[] | null | undefined
  valueCode?: string
  setValue?: (value: string) => void
}) => {
  return (
    <CellBoxStyle>
      <HBSelect
        sx={{ width: 180, height: 30, '& > label': { lineHeight: 1 } }}
        size="small"
        label=""
        menuItem={
          data?.map((item) => {
            return {
              value: item.fullCode!,
              title: item.title!,
            }
          }) || []
        }
        value={valueCode}
        onChange={(e) => setValue!(String(e.target.value))}
      />
    </CellBoxStyle>
  )
}
