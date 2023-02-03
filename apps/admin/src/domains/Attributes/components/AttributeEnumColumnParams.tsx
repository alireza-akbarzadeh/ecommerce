import { GetBusinessTypeValuesQueryResult } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'

export const getEnumColumnParams = (enumMap?: GetBusinessTypeValuesQueryResult[]) => {
  if (!enumMap) return {}
  return {
    filterParams: {
      buttons: ['reset', 'apply'],
      closeOnApply: true,
      filterOptions: [
        'empty',
        ...enumMap.map((item) => {
          return {
            displayKey: item.id,
            displayName: item.name,
            test(filterValue: number, cellValue: number) {
              return String(cellValue) === item.id
            },
            hideFilterInput: true,
          }
        }),
      ],
      suppressAndOrCondition: true,
    },
  }
}
