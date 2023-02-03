import { Box, listClasses, styled } from '@mui/material'

export const HBGridToolbarStyleRoot = styled(Box)(({ theme: { spacing, palette } }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  minWidth: 400,
  gap: spacing(2),
  paddingTop: spacing(3),
  paddingBottom: spacing(3),
  color: palette.primary.main,
}))

export const HBGridToolbarSubMenuWrapperStyle = styled(Box)(({ theme: { spacing, palette } }) => ({
  minWidth: 200,
  minHeight: 100,
  color: palette.common.black,
  [`& .${listClasses.root}`]: {
    backgroundColor: palette.common.white,
    borderRadius: spacing(2),
    padding: spacing(1),
  },
}))
