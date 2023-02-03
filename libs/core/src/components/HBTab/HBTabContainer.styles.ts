import { TabContext, TabList, TabPanel, tabPanelClasses } from '@mui/lab'
import { styled, Tab, tabClasses, Tabs, tabsClasses } from '@mui/material'

export const HBTabs = styled(Tabs)(({ theme: { palette } }) => ({})) as typeof Tabs
export const HBTab = styled(Tab)(({ theme: { palette } }) => ({
  [`&.${tabClasses.selected}`]: {
    background: palette.common.white,
    color: palette.grey[700],
  },
})) as typeof Tab
export const HBTabList = styled(TabList)(({ theme: { palette } }) => ({
  [`&.${tabsClasses.root}`]: {
    background: palette.grey[200],
  },
})) as typeof TabList
export const HBTabPanel = styled(TabPanel)(({ theme: { palette } }) => ({
  [`&.${tabPanelClasses.root}`]: {
    background: palette.common.white,
  },
})) as typeof TabPanel
export const HBTabContext = styled(TabContext)(({ theme }) => ({})) as typeof TabContext
