import RenderDynamicSection from '@hasty-bazar-commerce/domains/Landing/components/RenderDynamicSection'
import { SectionByContentQueryResult } from '@hasty-bazar-commerce/services/cmsApi.generated'
import { Box } from '@mui/material'
import { FC } from 'react'

interface IProps {
  sections?: SectionByContentQueryResult[] | null
}
export const Vitrin: FC<IProps> = (props) => {
  return (
    <Box p={4} sx={{ overflowX: 'hidden' }}>
      <RenderDynamicSection sections={props.sections} />
    </Box>
  )
}
