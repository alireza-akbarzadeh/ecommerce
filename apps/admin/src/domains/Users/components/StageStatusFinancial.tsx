import { HBChip } from '@hasty-bazar/core'
import { ICellRendererParams } from 'ag-grid-community'
import React, { useState } from 'react'

type IStatusFinancial = ICellRendererParams

const StatusFinancial = ({ value }: IStatusFinancial) => {
  const [checked, setChecked] = useState<boolean>(false)
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
  }

  return <HBChip color={'primary'} text={value} />
}

export default StatusFinancial
