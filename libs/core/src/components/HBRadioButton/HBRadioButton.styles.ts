import { styled } from '@mui/material'

export const HBSelectedRadio = styled('span')((props) => ({
  borderRadius: '50%',
  width: 25,
  height: 25,
  boxShadow: `inset 0 0 0 6px ${props.theme.palette.primary.main}`,
  backgroundColor: props.theme.palette.common.white,
  'input:hover ~ &': {
    boxShadow: `inset 0 0 0 6px ${props.theme.palette.primary.dark}`,
  },
  'input:focus ~ &': {
    border: `1px solid ${props.theme.palette.primary.light}`,
  },
  'input:disabled ~ &': {
    opacity: 0.6,
  },
}))

export const HBUnSelectedRadio = styled(HBSelectedRadio)((props) => ({
  backgroundColor: props.theme.palette.grey[200],
  boxShadow: 'none',
  'input:hover ~ &': {
    boxShadow: 'none',
    backgroundColor: props.theme.palette.grey[300],
  },
  'input:focus ~ &': {
    boxShadow: 'none',
    backgroundColor: props.theme.palette.grey[300],
    border: `1px solid ${props.theme.palette.grey[200]}`,
  },
  'input:disabled ~ &': {
    opacity: 0.6,
  },
}))
