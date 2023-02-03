import { HBCircularProgressBtn, HBIcon, ItemComponentProps } from '@hasty-bazar/core'
import { useTreeItem } from '@mui/lab'
import { Avatar, Typography } from '@mui/material'
import { Box } from '@mui/system'
import clsx from 'clsx'
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
  const Icon = () => {
    if (labelIcon) {
      if (labelIcon?.includes('upload')) {
        return (
          <Avatar
            sx={{
              width: 30,
              height: 30,
            }}
            alt="country"
            src={process.env.NEXT_PUBLIC_CDN + labelIcon}
          />
        )
      }

      return <HBIcon type={labelIcon} />
    }
    return null
  }

  return (
    <Box
      className={clsx(className, classes.root, isAnyChildrenSelected ? 'children-selected' : '', {
        [classes.expanded]: expanded,
        [classes.selected]: selected,
        [classes.focused]: focused,
        [classes.disabled]: disabled,
      })}
      onMouseDown={handleMouseDown}
      ref={ref as React.Ref<HTMLDivElement>}
    >
      <div onClick={handleExpansionClick} className={classes.iconContainer}>
        {!loading && icon}
        {loading && <HBCircularProgressBtn size={15} />}
      </div>
      <Icon />
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
