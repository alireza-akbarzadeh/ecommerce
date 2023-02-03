import { CommerceTab, StickyBox } from '@hasty-bazar-commerce/components'
import { Box } from '@mui/system'
import { HBTabs } from 'libs/core/src/components/HBTab/HBTabContainer.styles'
import { FC } from 'react'
import { sectionType } from '../../ProductInformation'

interface TopNavigationProps {
  value: number
  handleChangeTab: (_event: React.SyntheticEvent, newValue: number) => void
  sections: sectionType[]
}

const TopNavigation: FC<TopNavigationProps> = ({ value, handleChangeTab, sections }) => {
  const renderMenuOptions = () => {
    return sections.map((item, index) => {
      return <CommerceTab key={index} label={item.label} />
    })
  }

  return (
    <StickyBox>
      <Box sx={{ bgcolor: 'common.white' }}>
        <HBTabs
          value={value}
          onChange={handleChangeTab}
          variant="scrollable"
          scrollButtons={false}
          TabIndicatorProps={{
            sx: ({ spacing }) => ({
              top: 0,
              height: spacing(1.1),
              borderTopLeftRadius: spacing(1.1),
              borderTopRightRadius: spacing(1.1),
            }),
          }}
          sx={{
            bgcolor: 'grey.100',
            borderRadius: ({ spacing }) => `${spacing(2)} ${spacing(2)} 0 0`,
          }}
        >
          {renderMenuOptions()}
        </HBTabs>
      </Box>
    </StickyBox>
  )
}

export default TopNavigation
