import { HBButton, HBIcon, HBTreeView } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { useIntl } from 'react-intl'
import SearchTree from './components/SearchTree/SearchTree'
import TreeViewItem from './components/TreeViewItem/TreeViewItem'
import { HBViewContainerWithTreeClasses as classes } from './HBViewContainerWithTree.classes'
import { hbViewContainerWithTreeMessages as messages } from './HBViewContainerWithTree.messages'
import { IHBContainerWithTreeProps } from './types/IHBContainerWithTreeProps'

function HBViewContainerWithTree(props: IHBContainerWithTreeProps) {
  const { pageTitleBar, breadcrumb, treeProps, children } = props
  const hasAddButton = treeProps?.rootAddButtonProps || treeProps?.addButton
  const { formatMessage } = useIntl()

  const handleIncrementLevel = () => {
    treeProps?.setExpandedLevel?.((x: number[]) => {
      let temp: number[] = [...x]
      if (x.length < (Number(treeProps?.maxExpandedLevel) - 1 || 3)) {
        temp = [...x, x.length + 1]
      }
      return temp
    })
  }

  const handleDecrementLevel = () => {
    treeProps?.setExpandedLevel?.((x: number[]) => x.splice(0, x.length - 1))
  }

  return (
    <>
      <Box sx={classes.toolsContainer}>
        <Box>{breadcrumb}</Box>
        <Box sx={classes.pageTitleBar}>{pageTitleBar}</Box>
      </Box>
      <Box sx={classes.mainContainer}>
        {treeProps && (
          <Box sx={classes.treeColumn} bgcolor="common.white">
            {treeProps.showSearch && (
              <SearchTree
                treeItems={treeProps?.treeItems}
                id={treeProps.id}
                handleSearch={treeProps.handleSearch}
                onIncrementLevel={handleIncrementLevel}
                onDecrementLevel={handleDecrementLevel}
              />
            )}
            <Box sx={classes.treeItems}>
              {hasAddButton && (
                <Box display="flex" alignItems="center" sx={{ my: 2, width: 200 }}>
                  {treeProps.addButton ? (
                    treeProps.addButton
                  ) : (
                    <HBButton {...treeProps.rootAddButtonProps}>
                      <HBIcon type="plus" size="small" />
                      {formatMessage(messages.addButton)}
                    </HBButton>
                  )}
                </Box>
              )}
              {treeProps?.treeItemsConfig?.isSuccess && treeProps?.treeItems?.length <= 0 ? (
                <Box sx={classes.dataNotFound}>{formatMessage(messages.dataNotFound)}</Box>
              ) : (
                <HBTreeView
                  {...treeProps}
                  ItemComponent={
                    (treeProps.ItemComponent ? treeProps.ItemComponent : TreeViewItem) as any
                  }
                />
              )}
            </Box>
          </Box>
        )}
        <Box sx={classes.optionsColumn}>{children}</Box>
      </Box>
    </>
  )
}

export default HBViewContainerWithTree
