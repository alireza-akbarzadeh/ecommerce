import { Box, Checkbox, Stack, Theme, Typography, useMediaQuery } from '@mui/material'
import { cloneElement, CSSProperties, forwardRef, Ref, useEffect } from 'react'
import { IndexRange, InfiniteLoader, List } from 'react-virtualized'
import { HBSelectMultiColumnColumnDefs } from '../HBSelectMultiColumn'

export interface ListboxProps {
  pageSize: number
  columnDefs: HBSelectMultiColumnColumnDefs<any>[]
  items: any[]
  totalItems?: number
  loadNextPage?: () => void
  role: any
  children: any
  inputValue: string
  rowHeight?: number
  height?: number
  style: CSSProperties
  setScrollToIndex: (startIndex: number) => void
  scrollToIndex: number
  value: any[]
  multiple: boolean
}

const Listbox = forwardRef(function Listbox(props: ListboxProps, ref: Ref<any>) {
  const breakpointMdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))
  const {
    children,
    role,
    height,
    rowHeight,
    pageSize,
    items,
    loadNextPage,
    inputValue,
    columnDefs,
    totalItems,
    setScrollToIndex,
    scrollToIndex,
    value,
    multiple,
    ...other
  } = props

  const CHECKBOX_WIDTH = 40
  const HORIZONTAL_PADDING = 32

  const isRowLoaded = ({ index }: { index: number }) => {
    return !!items[index]
  }

  useEffect(() => {
    if (items.length > 0) {
      if (pageSize > items.length) {
        const index = (items?.length || pageSize + 1) - pageSize
        if (items.length > scrollToIndex) {
          setScrollToIndex(index)
        }
      }
    }
  }, [items])

  const loadMoreRows: (params: IndexRange) => Promise<any> = async ({ startIndex, stopIndex }) => {
    if (scrollToIndex !== startIndex) {
      setScrollToIndex(startIndex)
      loadNextPage?.()
    }
  }

  const rowRenderer = ({
    key,
    index,
    style,
  }: {
    key: string
    index: number
    style: CSSProperties
  }) => {
    const isChecked = (index: number) => {
      const idField = columnDefs.filter((col) => col.isIdField)[0]?.field
      if (multiple) {
        //@ts-ignore//
        return (
          items[index] && value?.findIndex((item) => item[idField] === items[index][idField]) > -1
        )
      } else {
        //@ts-ignore//
        return items[index] && value && value[idField] === items[index][idField]
      }
    }

    return (
      children[index] &&
      cloneElement(children[index], {
        style,
        children: (
          <Box key={key} style={props.style} sx={{ width: '100%' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row-reverse',
                width: '100%',
              }}
            >
              {multiple && (
                <Stack
                  sx={{
                    display: 'flex',
                    width: 40,
                  }}
                  component={'div'}
                >
                  <Checkbox checked={isChecked(index)} />
                </Stack>
              )}
              {columnDefs
                .filter((col) => !col.hidden)
                .map((col) => {
                  if (col.cellRenderer) {
                    return (
                      <Stack
                        sx={{
                          display: 'flex',
                          width: col.width,
                          alignItems: 'center',
                          justifyContent: 'center',
                          minWidth: col.width,
                        }}
                        component={'div'}
                      >
                        {col.cellRenderer(items[index])}
                      </Stack>
                    )
                  }
                  return (
                    <Stack
                      sx={{
                        display: 'flex',
                        width: col.width,
                        minWidth: col.width,
                        flexDirection: 'row-reverse',
                      }}
                      component={'div'}
                    >
                      <Typography>
                        {
                          //@ts-ignore//
                          items[index] && items[index][col.field]
                        }
                      </Typography>
                    </Stack>
                  )
                })}
            </Box>
          </Box>
        ),
      })
    )
  }

  return (
    <Box ref={ref}>
      <Box
        {...other}
        sx={{
          width: breakpointMdUp
            ? '100%'
            : Number(
                columnDefs
                  .filter((column) => !column.isIdField)
                  .map((column) => column.width)
                  .reduce((a, b) => Number(a) + Number(b)) || 0,
              ) +
              HORIZONTAL_PADDING +
              (props.multiple ? CHECKBOX_WIDTH : 0),
        }}
      >
        <InfiniteLoader
          isRowLoaded={isRowLoaded}
          loadMoreRows={loadMoreRows}
          rowCount={totalItems}
          threshold={1}
        >
          {({ onRowsRendered, registerChild }) => (
            <List
              height={height || 200}
              rowCount={totalItems!}
              rowHeight={rowHeight || 40}
              onRowsRendered={onRowsRendered}
              ref={registerChild}
              rowRenderer={rowRenderer}
              width={1}
              scrollToIndex={scrollToIndex}
              overscanCount={2}
              containerStyle={{
                width: '100%',
                maxWidth: '100%',
              }}
              style={{
                width: '100%',
              }}
              role={role}
            />
          )}
        </InfiniteLoader>
      </Box>
    </Box>
  )
})

export default Listbox
