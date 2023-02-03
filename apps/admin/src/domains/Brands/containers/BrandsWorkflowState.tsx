import { Box, SxProps, Theme, useTheme } from '@mui/material'
import { FC } from 'react'

export enum stateType {
  draft = '1',
  release = '2',
}

export interface BrandAddEditFormProps {
  text: string
  stateCode: stateType
}
const BrandsWorkflowState: FC<BrandAddEditFormProps> = ({ text, stateCode }) => {
  const { palette } = useTheme()
  const getStyle = (): SxProps<Theme> => {
    let sx: SxProps<Theme> = {}
    switch (stateCode) {
      case stateType.draft:
        sx = { backgroundColor: palette.warning.light, color: palette.warning.dark }
        break
      case stateType.release:
        sx = { backgroundColor: palette.success.light, color: palette.success.dark }
        break
      default:
        break
    }
    return sx
  }

  return (
    <Box sx={{ ...getStyle(), borderRadius: 2, padding: 1 }} component="span">
      {text}
    </Box>
  )
}

export default BrandsWorkflowState
