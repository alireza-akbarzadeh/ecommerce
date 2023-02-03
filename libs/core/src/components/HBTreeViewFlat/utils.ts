type ValueOf<T> = T[keyof T]

export type listToTreeProps<Structure> = {
  rootParentValue: string | null | undefined | number
  childField: keyof Structure
  parentField: keyof Structure
  titleField: keyof Structure
  valueField: keyof Structure
  currentLevel?: number
  onLeafletExecute?: {
    action: (props: Structure) => void
    name: string
  }
  maxLevel?: number
  leafletNotInclude?: string | number | null
  nullChildrenAlias?: null | []
  [key: string]: any
}
export type listToTreeReturnType<Structure> = Structure & {
  children: listToTreeProps<Structure>['nullChildrenAlias'] | listToTreeReturnType<Structure>[]
  value: string | number
  title: string | number
  currentLevel: number
}
const listToTree = <Structure>(
  items: Structure[],
  props: listToTreeProps<Structure>,
): listToTreeReturnType<Structure>[] => {
  const {
    rootParentValue = null,
    childField = null,
    parentField = '',
    valueField = '',
    titleField = '',
    currentLevel = 1,
    onLeafletExecute = { action: () => {}, name: '' },
    maxLevel = 0,
    leafletNotInclude = null,
    nullChildrenAlias = null,
    ...other
  } = props
  //@ts-ignore
  return (
    items
      //@ts-ignore
      .filter((item) => item[parentField] === rootParentValue)
      //@ts-ignore
      .filter((item) => leafletNotInclude !== item[valueField])
      //@ts-ignore
      .map((item) => {
        let children: Structure[] = []
        if ((maxLevel !== 0 && maxLevel > currentLevel) || maxLevel === 0) {
          const newProps = {
            ...props,
            //@ts-ignore
            rootParentValue: item[childField],
            currentLevel: currentLevel + 1,
          }
          //@ts-ignore
          children = listToTree<Structure>(items, newProps)
        }
        return {
          ...item,
          ...other,
          currentLevel,
          // @ts-ignore
          value: item[valueField],
          //@ts-ignore
          title: item[titleField],
          [onLeafletExecute.name]: onLeafletExecute.action(item),
          children: children.length > 0 ? children : nullChildrenAlias,
        }
      })
  )
}

export { listToTree }
