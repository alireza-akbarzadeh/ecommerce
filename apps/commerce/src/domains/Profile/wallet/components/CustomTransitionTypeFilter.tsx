import { Stack, styled } from '@mui/material'
import { IDoesFilterPassParams, IFilterParams } from 'ag-grid-community'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

const HBTinyEditorRootStyle = styled('select')(({ theme }) => ({
  flex: 1,
  margin: theme.spacing(2),
  padding: theme.spacing(2),
}))

const CustomTransitionTypeFilter = forwardRef<any, IFilterParams>((props, ref) => {
  const [filterText, setFilterText] = useState<string | undefined>(undefined)

  // expose AG Grid Filter Lifecycle callbacks
  useImperativeHandle(ref, () => {
    return {
      doesFilterPass(params: IDoesFilterPassParams) {
        const { api, colDef, column, columnApi, context } = props
        const { node } = params

        // make sure each word passes separately, ie search for firstname, lastname
        let passed = true
        if (filterText) {
          filterText
            .toLowerCase()
            .split(' ')
            .forEach((filterWord) => {
              const value = props.valueGetter({
                api,
                colDef,
                column,
                columnApi,
                context,
                data: node.data,
                getValue: (field) => node.data[field],
                node,
              })

              if (value.toString().toLowerCase().indexOf(filterWord) < 0) {
                passed = false
              }
            })
        }

        return passed
      },

      isFilterActive() {
        return filterText != null && filterText !== ''
      },

      getModel() {
        if (!this.isFilterActive()) {
          return null
        }

        return { value: filterText }
      },

      setModel(model: any) {
        setFilterText(model == null ? null : model.value)
      },
    }
  })

  useEffect(() => {
    props.filterChangedCallback()
  }, [filterText])

  return (
    <Stack sx={{ width: '100%' }}>
      <HBTinyEditorRootStyle
        name="transitionType"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      >
        <option value="واریز">واریز</option>
        <option value="برداشت">برداشت</option>
      </HBTinyEditorRootStyle>
    </Stack>
  )
})

export default CustomTransitionTypeFilter
