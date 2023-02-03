import {
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import CommentCard from '@hasty-bazar-admin/domains/CommentReview/components/CommentCard'
import { Box } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import useUserFeedbackGrid from './useUserFeedbackGrid'

export type UserFeedbackGridProps = {
  query?: string
  partyId: string
}

export default function UserFeedbackGrid({ query, partyId }: UserFeedbackGridProps) {
  const userFilter = `?filter=PartyId_Equal_--PartyId&PartyId=${partyId}`
  const gridRef = useRef<HBDataGridClientRef>(null)
  const [actionUrl, setActionUrl] = useState('')

  const { refreshGridData, classes, columnDefs, autoGroupColumnDef } = useUserFeedbackGrid({
    gridRef,
    selectedRows: gridRef?.current?.api?.getSelectedNodes() || [],
  })

  useEffect(() => {
    setActionUrl(`${process.env.NEXT_PUBLIC_GATEWAY}/Admin/Social/comments${query || userFilter}`)
    setTimeout(() => {
      refreshGridData(true)
    }, 100)
  }, [query])

  return (
    <Box mt={10}>
      <HBDataGridClient
        actionUrl={actionUrl}
        columnDefs={columnDefs}
        classes={classes}
        pagination
        paginationPageSize={25}
        enableRtl
        detailRowAutoHeight
        sideBar
        autoGroupColumnDef={autoGroupColumnDef}
        ref={gridRef}
        noToolbar
        masterDetail
        detailCellRenderer={CommentCard}
        detailCellRendererParams={{ isDetailsGrid: true }}
      />
    </Box>
  )
}
