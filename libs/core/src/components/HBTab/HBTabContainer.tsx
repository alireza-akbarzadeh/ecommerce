import { HBIconType } from '@hasty-bazar/core'
import { TabContextProps, TabPanelProps } from '@mui/lab'
import { Box, SxProps, TabProps, Theme } from '@mui/material'
import { ForwardedRef, forwardRef, ReactNode, useEffect, useState } from 'react'
import { HBIcon } from '..'
import { HBTab, HBTabContext, HBTabList, HBTabPanel } from './HBTabContainer.styles'

export type tabItemS = {
  tabTitles: string
  tabTitleProps?: TabProps
  tabContents: string | ReactNode
  tabContentsProps?: TabPanelProps
  tabIndex?: string
  tabIcon?: HBIconType
  tabVisible?: boolean
  onClick?: () => void
}
export interface HBTabContainerProps extends Omit<TabContextProps, 'ref'> {
  tabItemS: tabItemS[]
  tabPanelSx?: SxProps<Theme>
  className?: string
  hideTabPanel?: true
}

const HBTabContainer = forwardRef(
  <T extends HTMLDivElement>(
    {
      tabItemS,
      value: defaultValue = '0',
      tabPanelSx,
      className,
      hideTabPanel,
    }: HBTabContainerProps,
    ref: ForwardedRef<T>,
  ) => {
    const [value, setValue] = useState<string>(defaultValue)
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(String(newValue))
    }
    useEffect(() => {
      setValue(defaultValue)
    }, [defaultValue])

    return (
      <Box className={className}>
        <HBTabContext value={value as any}>
          <HBTabList
            onChange={handleChange}
            TabIndicatorProps={{
              sx: ({ spacing }) => ({
                top: 0,
                height: spacing(1.1),
                borderTopLeftRadius: spacing(1.1),
                borderTopRightRadius: spacing(1.1),
              }),
            }}
          >
            {tabItemS.map(
              (
                { tabTitles, tabTitleProps, tabIndex, tabIcon, tabVisible = true, onClick },
                index,
              ) =>
                tabVisible && (
                  <HBTab
                    onClick={onClick}
                    iconPosition="top"
                    {...(tabIcon
                      ? {
                          icon: (
                            <Box>
                              <HBIcon type={tabIcon} size="small" />
                            </Box>
                          ),
                        }
                      : {})}
                    label={tabTitles}
                    value={String(tabIndex ?? index)}
                    key={index}
                    {...tabTitleProps}
                  />
                ),
            )}
          </HBTabList>
          {!hideTabPanel &&
            tabItemS.map(({ tabContents, tabContentsProps, tabIndex }, index) => (
              <HBTabPanel
                sx={tabPanelSx}
                value={String(tabIndex ?? index)}
                {...tabContentsProps}
                key={index}
              >
                {tabContents}
              </HBTabPanel>
            ))}
        </HBTabContext>
      </Box>
    )
  },
)

HBTabContainer.displayName = 'HBTabContainer'
HBTabContainer.defaultProps = {}

export default HBTabContainer
