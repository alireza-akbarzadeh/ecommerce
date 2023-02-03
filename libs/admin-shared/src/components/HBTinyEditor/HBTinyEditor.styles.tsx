import { Box, styled } from '@mui/material'

export const HBTinyEditorRootStyle = styled(Box)(({ theme }) => {
  return {
    '& .tox-tinymce': {
      borderColor: theme.palette.grey[400],
      borderRadius: theme.spacing(1),
    },
    '& .tox-editor-header': {
      boxShadow: 'none !important',
    },
    '& .tox-statusbar__branding': {
      display: 'none !important',
    },
    '& .toolbar__primary': {
      backgroundImage: 'unset !important',
      transform: 'unset !important',
    },
  }
})

export default HBTinyEditorRootStyle
