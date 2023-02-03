import { HBTabContainer, HBTextField } from '@hasty-bazar/core'
import { styled } from '@mui/system'

export const HBVendorStyledTabs = styled(HBTabContainer)(({ theme }) => ({
  height: 56,

  [`& .MuiTabs-flexContainer`]: {
    backgroundColor: `${theme.palette.common.white} !important`,
  },

  [`& .MuiTabs-indicator`]: {
    top: 'auto',
    bottom: 0,
  },
}))

export const HBVendorStyledTextField = styled(HBTextField)(({ theme }) => ({
  [`& .MuiOutlinedInput-root`]: {
    borderRadius: theme.spacing(2),
  },
}))
