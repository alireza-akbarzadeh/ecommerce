import { Box } from '@mui/material'
import { IHeaderParams } from 'ag-grid-community'
import { useEffect, useState } from 'react'
import { HBIcon } from '../HBIcon'

export interface HBGridHeaderProps extends IHeaderParams {
  menuIcon: string
}

const HBAgGridColumnHeader = (props: HBGridHeaderProps) => {
  const [orderSort, setOrderSort] = useState<'asc' | 'desc' | ''>('')

  const onSortChanged = () => {
    const order = props.column.isSortAscending()
      ? 'asc'
      : props.column.isSortDescending()
      ? 'desc'
      : ''
    setOrderSort(order)
  }

  const onSortRequested = (order: 'asc' | 'desc' | '', event: any) => {
    if (orderSort === 'asc') {
      order = 'desc'
    } else if (orderSort === 'desc') {
      order = ''
    } else {
      order = 'asc'
    }
    setOrderSort(order)
    props.setSort(order || null, event.shiftKey)
  }

  useEffect(() => {
    props.column.addEventListener('sortChanged', onSortChanged)
    onSortChanged()
  }, [])

  return (
    <Box
      sx={(theme) => ({
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: theme.spacing(1),
        color: theme.palette.grey[700],
        '& i': {
          color: theme.palette.grey[500],
          fontSize: theme.spacing(4),
        },
      })}
      onClick={(event) => onSortRequested('', event)}
      onTouchEnd={(event) => onSortRequested('', event)}
    >
      <div>{props.displayName}</div>
      {props.enableSorting && (
        <div style={{ display: 'inline-block' }}>
          {orderSort === 'asc' && (
            <Box>
              <HBIcon type="arrowDown" size="small" />
            </Box>
          )}
          {orderSort === 'desc' && (
            <Box>
              <HBIcon type="arrowUp" size="small" />
            </Box>
          )}
          {orderSort === '' && (
            <Box>
              <span></span>
            </Box>
          )}
        </div>
      )}
    </Box>
  )
}

HBAgGridColumnHeader.displayName = 'HBGridHeader'
HBAgGridColumnHeader.defaultProps = {}

export default HBAgGridColumnHeader
