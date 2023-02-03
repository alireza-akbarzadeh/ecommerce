import { HBCircularProgressBtn, HBIcon, ItemComponentProps } from '@hasty-bazar/core'
import { Stack, Typography } from '@mui/material'
import { Box, SxProps, Theme } from '@mui/system'
import clsx from 'clsx'
import { forwardRef } from 'react'
import { HBViewContainerWithTreeClasses } from '../../HBViewContainerWithTree.classes'
import { useTreeViewItem } from '../../hooks/useTreeViewItem'
import { Icon } from './Icon'

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
    addNode,
    onClickAddChild,
    unVisibleAddButton,
    stateCode,
  } = props

  const {
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
  } = useTreeViewItem({
    nodeId,
    iconProp,
    expansionIcon,
    displayIcon,
    count,
    labelIcon,
    onClickAddChild,
  })

  const _unVisibleAddButton: boolean = unVisibleAddButton?.(nodeId) || false

  return (
    <Box
      className={clsx(
        className,
        classes.root,
        isAnyChildrenSelected || selected || focused ? 'children-selected' : '',
        {
          [classes.expanded]: expanded,
          [classes.selected]: selected,
          [classes.focused]: focused,
          [classes.disabled]: disabled,
        },
      )}
      sx={HBViewContainerWithTreeClasses.displayAddChildrenButton as SxProps<Theme> | undefined}
      onMouseDown={handleMouseDown}
      ref={ref as React.Ref<HTMLDivElement>}
    >
      {!_unVisibleAddButton && onClickAddChild && (
        <Box onClick={handleClickAddChild} className={'icon-wrapper'}>
          <HBIcon type="plus" sx={{ mr: 1, fontSize: spacing(4) }} />
        </Box>
      )}
      <Box
        sx={{ color: Number(count) > 0 ? null : 'grey[300]' }}
        onClick={handleExpansionClick}
        className={classes.iconContainer}
      >
        {!loading && icon}
        {loading && <HBCircularProgressBtn size={15} />}
      </Box>
      <Icon labelIcon={labelIcon} />
      <Typography onClick={handleSelectionClick} variant="caption" className={classes.label} noWrap>
        {label}
      </Typography>
      {Boolean(count && count > 0) && (
        <Typography variant="caption" className="HBTreeItem-count">
          {count}
        </Typography>
      )}
      {stateCode === '2' && <Stack className="bullet" sx={HBViewContainerWithTreeClasses.bullet} />}
    </Box>
  )
})

export default TreeViewItem
