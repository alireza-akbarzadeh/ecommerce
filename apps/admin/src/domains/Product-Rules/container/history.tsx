import { HBHistoryExplanation } from '@hasty-bazar/admin-shared/containers/HBHistoryExplanation'
import { AccordionProps, Box } from '@mui/material'

const History = (props: Omit<AccordionProps, 'children'>) => {
  return <HBHistoryExplanation detail={<Box />} {...props} />
}
export default History
