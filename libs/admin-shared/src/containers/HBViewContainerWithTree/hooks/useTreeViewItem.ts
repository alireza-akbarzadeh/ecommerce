import { useTreeItem } from '@mui/lab'
import { useTheme } from '@mui/material'
import { useState } from 'react'
import { TreeViewItemProps } from '../types/TreeViewItemProps'

export const useTreeViewItem = ({
  nodeId,
  iconProp,
  expansionIcon,
  displayIcon,
  count,
  onClickAddChild,
}: TreeViewItemProps) => {
  const {
    disabled,
    expanded,
    selected,
    focused,
    handleExpansion,
    handleSelection,
    preventSelection,
  } = useTreeItem(nodeId)

  const icon = iconProp || expansionIcon || displayIcon
  const { spacing } = useTheme()
  const [loading, setLoading] = useState<boolean>(false)

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    preventSelection(event)
  }

  const handleExpansionClick = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (count) handleExpansion(event)
  }

  const handleSelectionClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    handleSelection(event)
  }

  const handleClickAddChild = () => {
    onClickAddChild?.(nodeId + '', handleExpansionClick, expanded)
  }

  return {
    handleClickAddChild,
    disabled,
    expanded,
    selected,
    focused,
    icon,
    spacing,
    loading,
    setLoading,
    handleMouseDown,
    handleExpansionClick,
    handleSelectionClick,
  }
}
