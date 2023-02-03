import { ReactNode } from 'react'

export type TreeViewItemProps = {
  nodeId: string
  iconProp: ReactNode
  expansionIcon: ReactNode
  displayIcon: ReactNode
  count?: number | undefined
  labelIcon?: string | undefined
  onClickAddChild?: (
    id: string,
    fun: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => Promise<void>,
    expanded: boolean,
  ) => void
}
