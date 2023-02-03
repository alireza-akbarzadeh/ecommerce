import { Box } from '@mui/material'
import { cloneElement, forwardRef, useRef } from 'react'
import { CellMeasurer, CellMeasurerCache, List, ListRowProps } from 'react-virtualized'
import { IPaginationProps } from './HBAutocompleteController'

export interface ListboxProps {
  children: []
  paginationProps: IPaginationProps
}

const Listbox = forwardRef(function Listbox(props: ListboxProps, ref) {
  const { children, paginationProps, ...other } = props
  const cache = useRef(
    new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 100,
    }),
  )

  const rowRenderer = ({ key, index, style, parent }: ListRowProps) => {
    return (
      children[index] &&
      cloneElement(children[index], {
        style,
        children: (
          <CellMeasurer
            key={key}
            cache={cache.current}
            parent={parent}
            columnIndex={0}
            rowIndex={index}
          >
            <Box component={'ul'}>
              <Box component={'li'}>{children[index]}</Box>
            </Box>
          </CellMeasurer>
        ),
      })
    )
  }

  return (
    <Box ref={ref} {...other}>
      <List
        rowCount={paginationProps?.totalItems}
        rowRenderer={rowRenderer}
        rowHeight={cache.current.rowHeight}
        deferredMeasurementCache={cache.current}
        height={350}
        width={1}
        containerStyle={{ width: '100%', maxWidth: '100%' }}
        style={{ width: '100%' }}
      />
    </Box>
  )
})

export default Listbox
