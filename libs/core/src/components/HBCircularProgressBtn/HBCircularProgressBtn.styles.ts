import { CircularProgress, styled, Theme } from '@mui/material'
type color = 'white' | 'main' | 'dark'

type HBCircularProgressRootStyleProps = {
  customColor?: color
  theme: Theme
}

export const HBCircularProgressBtnRootStyle = styled(CircularProgress)(
  (props: HBCircularProgressRootStyleProps) => {
    return {
      color:
        props.customColor === 'main'
          ? props.theme.palette.primary.main
          : props.customColor === 'dark'
          ? props.theme.palette.primary.dark
          : props.customColor === 'white'
          ? props.theme.palette.common.white
          : props.theme.palette.primary.main,
    }
  },
)
