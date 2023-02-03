import { HBLink } from '@hasty-bazar/admin-shared/components'
import { ICellRendererParams } from 'ag-grid-community'
import React from 'react'

export default function UserColumnLink({ value, data }: ICellRendererParams) {
  return <HBLink href={`/users/detail/${data?.id}`}>{value}</HBLink>
}
