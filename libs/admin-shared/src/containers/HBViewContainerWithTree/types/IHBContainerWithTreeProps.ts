import { HBButtonProps, HBTreeViewProps } from '@hasty-bazar/core'
import { Dispatch, ReactNode, SetStateAction } from 'react'

export interface IHBContainerWithTreeProps {
  breadcrumb: ReactNode
  pageTitleBar: ReactNode
  treeProps?: HBTreeViewProps & {
    rootAddButtonProps?: HBButtonProps
    addButton?: ReactNode
    showSearch?: boolean
    handleSearch?: (search: string) => void
    onClickAddChild?: (id: string) => void
    treeItemsConfig?: { isSuccess: boolean }
    expanded?: string[] | null | undefined
    unVisibleAddButton?: (id: string) => boolean
    setExpandedLevel?: Dispatch<SetStateAction<number[]>>
    maxExpandedLevel?: number | undefined
    id?: string
  }
  children: ReactNode
}
