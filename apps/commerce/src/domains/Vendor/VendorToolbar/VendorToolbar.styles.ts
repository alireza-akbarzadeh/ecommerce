import { HBTabContainer, HBTextField } from '@hasty-bazar/core'
import {
  BoxProps,
  buttonBaseClasses,
  inputBaseClasses,
  outlinedInputClasses,
  tabClasses,
  tabsClasses,
} from '@mui/material'
import { styled } from '@mui/system'

export const HBVendorStyledTabs = styled(HBTabContainer)(({ theme }) => ({
  height: '100%',
  color: `${'primary.main !important'}`,
  [`& .${tabsClasses.flexContainer}`]: {
    backgroundColor: `${theme.palette.common.white} !important`,
  },
  [`& .${tabsClasses.indicator}`]: {
    top: 'auto',
    bottom: 0,
    borderRadius: theme.spacing(2, 2, 0, 0),
    height: 5,
  },
  [`& .${buttonBaseClasses.root} `]: {
    padding: 8,
    minWidth: 'unset',
    textAlign: 'center',
  },
  [`& .${tabClasses.selected}`]: {
    color: `${theme.palette.primary.main} !important`,
  },
  [`& .${tabsClasses.root} , & .${tabsClasses.flexContainer}`]: {
    height: '100%',
    background: `${theme.palette.common.white} !important`,
  },
}))

export interface HBVendorTextFieldProps extends BoxProps {
  isShowSearch?: boolean
}
export const HBVendorStyledTextField = styled(HBTextField)<HBVendorTextFieldProps>(({ theme }) => ({
  position: 'absolute',
  top: 0,
  transition: 'all 0.3s',
  [`& .${outlinedInputClasses.root}`]: {
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2.5, 2, 2),
    marginTop: -4,
  },
  [`& .${inputBaseClasses.input}`]: {
    padding: theme.spacing(0),
  },
}))
