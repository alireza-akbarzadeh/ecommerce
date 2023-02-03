import { Box, buttonBaseClasses, inputBaseClasses, styled, textFieldClasses } from '@mui/material'
import { HBDataGridSearchWrapperProps } from './HBGridSearch'

export const HBDataGridSearchStyleRoot = styled(Box)<HBDataGridSearchWrapperProps>(
  ({ inputWidth = 154, openPosition = 'left', isSearch, theme: { zIndex, spacing, palette } }) => ({
    position: 'relative',
    [`& .${buttonBaseClasses.root}`]: {
      zIndex: zIndex.modal - 1,
    },
    [`& .${textFieldClasses.root}`]: {
      position: 'absolute',
      minHeight: 33,
      left: openPosition === 'left' ? 0 : undefined,
      right: openPosition === 'right' ? 0 : undefined,
      top: 0,
      width: isSearch ? inputWidth : 0,
      opacity: isSearch ? 1 : 0,
      backgroundColor: palette.common.white,
      transition: 'width 0.3s',
      zIndex: isSearch ? zIndex.tooltip : 0,
      [`& .${inputBaseClasses.input}`]: {
        height: 16,
      },
      '& i': {
        marginTop: spacing(1),
      },
    },
  }),
)
