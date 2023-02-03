import { Box, inputBaseClasses, styled } from '@mui/material'

export const ContentFieldWrapper = styled(Box)(({ theme }) => {
  return {
    [`& .${inputBaseClasses.focused}:not(.MuiInputBase-colorError) fieldset`]: {
      borderColor: `${theme.palette.grey[400]} !important`,
    },
    [`& .${inputBaseClasses.error} i`]: {
      marginTop: theme.spacing(0.5),
    },
  }
})

export default ContentFieldWrapper
