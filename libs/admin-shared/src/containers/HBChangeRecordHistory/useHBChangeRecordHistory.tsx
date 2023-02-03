import { TablesColumnsSection } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'

export type ColumnType = {
  groupName?: string
  id: string
  tableName: string
  tableSchema: string
  propertyName: string
  propertyLocalName?: string | null
}

export type TablesColumnsSectionType = {
  groupName?: string
  columns: ColumnType[]
}

function useHBChangeRecordHistory() {
  const changeDataTree = (data: TablesColumnsSection[]) => {
    const result: TablesColumnsSectionType[] = []
    data.forEach((item) => {
      const { name: groupName, tableProperties: columns = [] } = item
      columns?.forEach((column) => {
        const { tableName, schema: tableSchema, properties } = column
        const newProperties = properties?.map((property) => {
          const { name: propertyName, localName } = property
          const id = `${tableName?.toLowerCase()}.${tableSchema?.toLowerCase()}.${propertyName?.toLowerCase()}`

          return {
            id,
            tableName: tableName!,
            tableSchema: tableSchema!,
            propertyName: propertyName!,
            propertyLocalName: localName,
          }
        })

        result.push({
          groupName: groupName!,
          columns: newProperties!,
        })

        result.forEach((item, index) => {
          const { groupName } = item
          const sameGroupName = result.filter((item) => item.groupName === groupName)
          if (sameGroupName.length > 1) {
            const newColumns: ColumnType[] = []
            sameGroupName.forEach((item) => {
              item.columns.forEach((column) => {
                if (newColumns.filter((item) => item.id === column.id).length === 0) {
                  newColumns.push(column)
                }
              })
            })
            result.splice(index, sameGroupName.length, { groupName, columns: newColumns })
          }
        })
      })
    })

    const result2 = result
      .map((item) => {
        const { groupName, columns } = item
        return columns.map((column) => {
          return {
            ...column,
            groupName,
          }
        })
      })
      .flat()

    return result2
  }

  return {
    changeDataTree,
  }
}

export default useHBChangeRecordHistory
