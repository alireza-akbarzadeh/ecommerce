import {
  GetCategoriesForProductQueryResult,
  GetCategoriesQueryResult,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { HBSelectTree, HBSelectTreeDataProps } from '@hasty-bazar/core'
import React, { useMemo } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { CellBoxStyle } from './relationCategoryRender'

interface RelationCategoryRenderControllerProps {
  categoriesData?: GetCategoriesForProductQueryResult[] | undefined | null
  setValue: (value: string | string[], defaultValue: boolean) => void
  defaultValue?: string | null
  name?: string
  label?: string
  renderValueEmptyLabel?: string
  disabled?: boolean
  required?: boolean
  categoryId?: string
}

export const RelationCategoryRenderController = ({
  categoriesData,
  setValue,
  renderValueEmptyLabel = '',
  label,
  defaultValue,
  name = 'categoryId',
  disabled,
  required = true,
  categoryId,
}: RelationCategoryRenderControllerProps) => {
  const { setError, clearErrors } = useFormContext()

  const categories = useMemo(() => {
    if (!categoriesData) {
      return []
    } else {
      return categoriesData?.map<HBSelectTreeDataProps>((item) => {
        return {
          id: item.id!,
          label: item.name!,
          parentId: item.parentId!,
          value: item.id!,
          selectable: item.isAllocatableToProduct,
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
      <Controller
        rules={{
          required,
        }}
        name={name}
        render={({ field, fieldState }) => (
          <HBSelectTree
            disabled={disabled}
            size="small"
            fullWidth
            label={label}
            onBlur={() => {
              if (!field.value) {
                setError(name, {
                  message: '',
                  type: 'required',
                })
              } else {
                clearErrors(name)
              }
            }}
            defaultValue={defaultCategory}
            renderValueEmptyLabel={renderValueEmptyLabel}
            rootParentValue={null}
            data={categories}
            value={categoryId}
            onChange={(value: string | string[]) => {
              setValue!(value, defaultValue === value)
            }}
          />
        )}
      />
    </CellBoxStyle>
  )
}
