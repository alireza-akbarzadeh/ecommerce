import { RenderTree } from '@hasty-bazar/core'

export type SearchTreeProps = {
  handleSearch?: (search: string) => void
  onIncrementLevel?: () => void
  onDecrementLevel?: () => void
  id?: string | undefined
  treeItems?: RenderTree[]
}

export type HBPageClassnames = 'root' | 'angleIcon' | 'input'
