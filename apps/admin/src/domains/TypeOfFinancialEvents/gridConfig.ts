import { HBAgGridClasses } from '@hasty-bazar/core'
import TypeOfFinancialEventsMessages from './typeOfFinancialEvents.message'

export const breadcrumbsItems = (formatMessage: (params: {}) => string) => [
  {
    url: '/',
    title: formatMessage(TypeOfFinancialEventsMessages.dashboard),
  },
  {
    url: '#',
    title: formatMessage(TypeOfFinancialEventsMessages.typeOfFinancialEvents),
  },
]

export const classes: HBAgGridClasses = {
  wrapper: {
    height: `calc(100vh - 240px)`,
  },
}
