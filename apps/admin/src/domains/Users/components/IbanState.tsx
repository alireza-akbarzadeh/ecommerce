import { Box } from '@mui/material'
import { ICellRendererParams } from 'ag-grid-community'
import React from 'react'

interface IStatusFinancial extends ICellRendererParams {
  typeComponent: string
}

const StatusFinancial = (props: IStatusFinancial) => {
  const { stateName } = props?.data

  return <Box>{stateName}</Box>
}
export default StatusFinancial
