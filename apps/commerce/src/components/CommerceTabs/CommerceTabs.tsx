import { HBIcon, HBIconType } from '@hasty-bazar/core'
import { Box, styled, SxProps, Tab, tabClasses, Tabs, TabsProps, Theme } from '@mui/material'
import { FC, ForwardedRef, forwardRef, PropsWithChildren, ReactNode, useState } from 'react'

export const CommerceTabStyle = styled(Tab)(({ theme: { palette } }) => ({
  minHeight: 'auto',
  color: palette.grey[700],
  [`&.${tabClasses.selected}`]: {
    background: palette.common.white,
    color: palette.primary.main,
  },
})) as typeof Tab

interface ITabPanel {
  index: number
  value: number
  sx?: SxProps<Theme>
}

export const TabPanel: FC<PropsWithChildren<ITabPanel>> = ({
  children,
  value,
  index,
  ...other
}) => {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </Box>
  )
}

export interface ICommerceTabItem {
  tabLabel: ReactNode
  tabPanel: ReactNode
  iconPosition?: 'top' | 'bottom' | 'end' | 'start'
  tabIcon?: HBIconType
}
interface CommerceTabsProps {
  tabs: ICommerceTabItem[]
  tabPanelSx?: SxProps<Theme>
  tabsSx?: SxProps<Theme>
  TabIndicatorProps?: TabsProps['TabIndicatorProps']
}

function tabProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

const CommerceTabs = forwardRef(
  <T extends HTMLDivElement>(
    { tabs, tabPanelSx, TabIndicatorProps, tabsSx }: CommerceTabsProps,
    ref: ForwardedRef<T>,
  ) => {
    const [activeTab, setActiveTab] = useState<number>(0)
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setActiveTab(newValue)
    }

    return (
      <>
        <Box sx={{ borderBottom: 1, borderColor: 'grey.200' }}>
          <Tabs
            {...(tabsSx && { sx: tabsSx })}
            value={activeTab}
            onChange={handleChange}
            TabIndicatorProps={
              TabIndicatorProps ? TabIndicatorProps : { sx: { bgcolor: 'primary.main' } }
            }
          >
            {tabs.map((tab, index) => {
              return (
                <CommerceTabStyle
                  iconPosition={tab?.iconPosition ?? 'start'}
                  {...(tab?.tabIcon
                    ? {
                        icon: (
                          <Box>
                            <HBIcon type={tab.tabIcon} size="small" />
                          </Box>
                        ),
                      }
                    : {})}
                  key={index}
                  label={tab.tabLabel ?? ''}
                  {...tabProps(index)}
                />
              )
            })}
          </Tabs>
        </Box>
        {tabs.map((tab, index) => {
          return (
            <TabPanel value={activeTab} key={index} index={index} sx={tabPanelSx}>
              {tab.tabPanel}
            </TabPanel>
          )
        })}
      </>
    )
  },
)
export default CommerceTabs
