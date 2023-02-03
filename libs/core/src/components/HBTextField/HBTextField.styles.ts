import { formLabelClasses, inputLabelClasses, outlinedInputClasses, TextField } from '@mui/material'
import { styled } from '@mui/material/styles'

export const HBTextFieldRootStyle = styled(TextField)(({ theme, ...props }) => ({
  [`& .${formLabelClasses.asterisk}`]: {
    fontFamily: 'arial',
  },
  [`& .${outlinedInputClasses.root}`]: {
    flexDirection: theme.direction === 'rtl' && props.dir === 'ltr' ? 'row-reverse' : undefined,
  },
  [`& fieldset.${outlinedInputClasses.notchedOutline}`]: {
    borderColor: theme.palette.grey[300],
  },
  [`& .${outlinedInputClasses.root} `]: {
    [`&.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
      borderColor: theme.palette.grey[300],
      borderWidth: 1,
    },
    [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
      borderColor: theme.palette.primary.main,
    },
  },
  [`& .${formLabelClasses.root}.${inputLabelClasses.focused}`]: {
    color: theme.palette.primary.main,
  },
  [`& .${outlinedInputClasses.input}`]: {
    color: theme.palette.text.primary,
  },
})) as typeof TextField
export const HBHelperTextWrapperStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
}))

export const HBHelperTextStyle = styled('span')(({ theme }) => ({
  margin: theme.spacing(1),
}))
