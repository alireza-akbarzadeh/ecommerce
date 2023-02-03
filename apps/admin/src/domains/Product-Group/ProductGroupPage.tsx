import { HBClassesType } from '@hasty-bazar/core'
import { Box, Fade } from '@mui/material'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import AssignAttributePage from './assignAttribute/assignAttributePage'
import MainPage from './ProductGroupPageMain'

type HBPageClassNames = 'container'
const classes: HBClassesType<HBPageClassNames> = {
  container: ({ palette }) => ({
    position: 'absolute',
    background: palette.background.paper,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 9,
  }),
}

const Page = () => {
  const { query: { slug = [], ...other } = {} } = useRouter()

  const AttributesPage = useCallback(
    () => <AssignAttributePage attributeId={other.rowId} />,
    [other.rowId],
  )

  const renderBySubRoute = () => {
    switch (other.subRoute) {
      case 'assignAttribute':
        return <AttributesPage />
      default:
        return null
    }
  }
  return (
    <MainPage>
      <Fade in={!!other.subRoute} mountOnEnter unmountOnExit>
        <Box sx={classes.container}>{renderBySubRoute()}</Box>
      </Fade>
    </MainPage>
  )
}

export default Page
