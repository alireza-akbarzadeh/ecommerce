import { TreeItemContentProps, useTreeItem } from '@mui/lab/TreeItem'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/system'
import clsx from 'clsx'
import * as React from 'react'

const CustomContent = React.forwardRef(function CustomContent(props: TreeItemContentProps, ref) {
  const { className, classes, label, nodeId, icon: iconProp, expansionIcon, displayIcon } = props
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

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    preventSelection(event)
  }

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    handleExpansion(event)
    handleSelection(event)
  }

  return (
    <Box
      className={clsx(className, classes.root, {
        'Mui-expanded': expanded,
        'Mui-selected': selected,
        'Mui-focused': focused,
        'Mui-disabled': disabled,
      })}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      ref={ref as React.Ref<HTMLDivElement>}
    >
      <div className="MuiTreeItem-contentBar" />
      <div className={classes.iconContainer}>{icon}</div>
      <Typography component="div" className={classes.label}>
        {label}------
      </Typography>
    </Box>
  )
})

export default CustomContent
