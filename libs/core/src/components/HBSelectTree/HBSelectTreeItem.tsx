import { TreeItem } from '@mui/lab'
import { Checkbox, Stack, Typography } from '@mui/material'
import React, { useCallback } from 'react'
import { HBSelectTreeDataProps } from './HBSelectTree'

export type HBSelectTreeItemProps = {
  tree: HBSelectTreeDataProps[]
  onClick?: (item: HBSelectTreeDataProps, event: React.ChangeEvent<HTMLInputElement>) => void
  selectedIds?: string[]
}

export default function HBSelectTreeItem({
  tree = [],
  selectedIds = [],
  onClick,
}: HBSelectTreeItemProps) {
  const handleCheckChecked = useCallback(
    (item: HBSelectTreeDataProps): boolean => {
      return selectedIds.includes(item.id)
    },
    [selectedIds],
  )

  return (
    <>
      {tree.map((item) => {
        const isSelectable = item.selectable || item.isAllocatableToProduct
        return (
          <TreeItem
            label={
              <Stack key={item.id} direction="row" alignItems="center">
                {isSelectable && (
                  <Checkbox
                    defaultChecked={handleCheckChecked(item)}
                    onChange={(event) => {
                      onClick && onClick(item, event)
                    }}
                    value={item.id}
                    sx={{ p: 0, ml: 0 }}
                  />
                )}
                {selectedIds.includes(item.id)}
                <Typography variant="subtitle2" sx={{ pl: 1 }}>
                  {item.label}
                </Typography>
              </Stack>
            }
            nodeId={item.id}
            sx={{ minWidth: 100 }}
          >
            {item.children && item.children.length > 0 && (
              <HBSelectTreeItem tree={item.children} onClick={onClick} selectedIds={selectedIds} />
            )}
          </TreeItem>
        )
      })}
    </>
  )
}
