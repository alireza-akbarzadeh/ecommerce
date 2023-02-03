import { InputBaseProps, Theme } from '@mui/material'
import React from 'react'
import { HBInputBase } from '../HBInputBase'

export type AgGridSearchProps = Omit<InputBaseProps, 'type'>

const HBAgGridSearch = ({ placeholder, sx, ...props }: AgGridSearchProps) => {
  return (
    <HBInputBase
      type="search"
      placeholder={placeholder || 'جستجو ...'}
      {...props}
      sx={(theme: Theme) => ({
        border: `solid 1px ${theme.palette.grey[200]}`,
        backgroundColor: theme.palette.common.white,
        width: 250,
        color: theme.palette.grey[400],
        p: 1,
        pl: 2,
        borderRadius: theme.spacing(2),
        '& input': {
          padding: 0,
          margin: 0,
        },
        '&::before': {
          content: `"\\e96b"`,
          fontFamily: 'unicons-line',
          color: theme.palette.grey[400],
          mr: 1,
        },
        ...sx,
      })}
    />
  )
}

export default HBAgGridSearch
