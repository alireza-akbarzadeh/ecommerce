import type { UniqueIdentifier } from '@dnd-kit/core'
import { ListItem, SxProps } from '@mui/material'
import { Theme } from '@mui/system'
import classNames from 'classnames'
import React, { forwardRef, HTMLAttributes } from 'react'
import styles from './dragAbleItem.module.scss'

export enum Position {
  Before = -1,
  After = 1,
}

export enum Layout {
  Horizontal = 'horizontal',
  Vertical = 'vertical',
  Grid = 'grid',
}

export interface Props extends Omit<HTMLAttributes<HTMLButtonElement>, 'id'> {
  active?: boolean
  clone?: boolean
  insertPosition?: Position
  id: UniqueIdentifier
  index?: number
  sx?: SxProps<Theme>
  layout: Layout
  onRemove?(): void
}

export const Item = forwardRef<HTMLLIElement, Props>(function Page(
  {
    id,

    children,
    index,
    active,
    clone,
    sx,
    insertPosition,
    layout,
    onRemove,
    style,
    ...props
  },
  ref,
) {
  return (
    <ListItem
      className={classNames(
        styles.Wrapper,
        active && styles.active,
        clone && styles.clone,
        insertPosition === Position.Before && styles.insertBefore,
        insertPosition === Position.After && styles.insertAfter,
        layout === Layout.Vertical && styles.vertical,
      )}
      style={style}
      ref={ref}
      sx={sx}
    >
      <button className={styles.Page} data-id={id + ''} {...props} type="button">
        {children}
      </button>
    </ListItem>
  )
})
