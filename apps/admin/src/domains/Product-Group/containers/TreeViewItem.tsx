import { HBCircularProgressBtn, ItemComponentProps } from '@hasty-bazar/core'
import { useTreeItem } from '@mui/lab'
import { Avatar, Typography } from '@mui/material'
import { Box } from '@mui/system'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import { forwardRef, useState } from 'react'

const TreeViewItem = forwardRef((props: ItemComponentProps, ref) => {
  const {
    classes,
    className,
    label,
    nodeId,
    icon: iconProp,
    expansionIcon,
    displayIcon,
    count,
    isAnyChildrenSelected,
    labelIcon,
  } = props
  const { disabled, expanded, focused, handleExpansion, handleSelection, preventSelection } =
    useTreeItem(nodeId)

  const icon = iconProp || expansionIcon || displayIcon

  const [loading, setLoading] = useState<boolean>(false)

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    preventSelection(event)
  }

  const handleExpansionClick = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    handleExpansion(event)
  }

  const handleSelectionClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    handleSelection(event)
  }

  const { query: { slug: [action, queryId = ''] = [] } = {} } = useRouter()
  return (
    <Box
      className={clsx(className, classes.root, isAnyChildrenSelected ? 'children-selected' : '', {
        [classes.expanded]: expanded,
        [classes.selected]: nodeId == queryId,
        [classes.focused]: focused,
        [classes.disabled]: disabled,
      })}
      sx={{ minWidth: 250 }}
      onMouseDown={handleMouseDown}
      ref={ref as React.Ref<HTMLDivElement>}
    >
      <div onClick={handleExpansionClick} className={classes.iconContainer}>
        {!loading && icon}
        {loading && <HBCircularProgressBtn size={15} />}
      </div>
      {labelIcon && (
        <Avatar
          src={`${process.env.NEXT_PUBLIC_CDN}/${labelIcon}`}
          sx={{ width: 20, height: 20 }}
        />
      )}
      <Typography onClick={handleSelectionClick} variant="caption" className={classes.label} noWrap>
        {label}
      </Typography>
      {Boolean(count && count > 0) && (
        <Typography variant="caption" className="HBTreeItem-count">
          {count}
        </Typography>
      )}
    </Box>
  )
})

export default TreeViewItem
