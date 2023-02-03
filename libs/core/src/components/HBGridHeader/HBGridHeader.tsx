import { ListItem, ListProps } from '@mui/material'
import { AgGridReact } from 'ag-grid-react'
import PopupState, { bindTrigger } from 'material-ui-popup-state'
import React, { ForwardedRef, forwardRef } from 'react'
import { gridClasses } from '../HBAgGrid'
import { HBIconButton, HBIconButtonProps } from '../HBIconButton'
import { HBGridHeaderRootStyle } from './HBGridHeader.styles'
import HBGridHeaderSubMenu from './HBGridHeaderSubMenu'

export interface MenuItemProps extends Omit<HBIconButtonProps, 'children' | 'onClick'> {
  label: string
  onClick?: (props?: any) => void
  children?: MenuItemProps[]
  actionType?: string
  show?: boolean
}

export interface HBGridHeaderProps extends Omit<ListProps, 'ref'> {
  toolbarActions?: MenuItemProps[]
  gridRef?: React.RefObject<AgGridReact>
}

const HBGridHeader = forwardRef(
  <T extends HTMLUListElement>(
    { toolbarActions = [], gridRef }: HBGridHeaderProps,
    ref: ForwardedRef<T>,
  ) => {
    return (
      <HBGridHeaderRootStyle ref={ref}>
        {toolbarActions?.map(({ children, onClick, ...item }, index) => {
          return (
            <ListItem key={index} sx={{ position: 'relative' }}>
              <PopupState variant="popover">
                {(popupState) => (
                  <>
                    <HBIconButton
                      sx={gridClasses.gridToolbarIcon}
                      variant={item.variant || 'outlined'}
                      icon={item?.icon}
                      tooltip={item.label}
                      {...(!children && { onClick: () => onClick?.(gridRef?.current!) })}
                      {...(children && bindTrigger(popupState))}
                      {...item}
                    />
                    {children && (
                      <HBGridHeaderSubMenu
                        popupState={popupState}
                        children={children}
                        gridRef={gridRef}
                      />
                    )}
                  </>
                )}
              </PopupState>
            </ListItem>
          )
        })}
      </HBGridHeaderRootStyle>
    )
  },
)

HBGridHeader.displayName = 'HBGridHeader'
HBGridHeader.defaultProps = {}

export default HBGridHeader
