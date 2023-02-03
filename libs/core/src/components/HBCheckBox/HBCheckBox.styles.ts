import { styled } from '@mui/material'
import Checked from './assets/Vector.svg'

export const HBCheckBoxUncheckedStyle = styled('span')((props) => {
  return {
    borderRadius: props.theme.shape.borderRadius,
    width: 26,
    height: 26,
    border: `1px solid ${props.theme.palette.grey[300]}`,
    backgroundColor: props.theme.palette.grey[200],
    'input:hover ~ &': {
      backgroundColor: props.theme.palette.grey[300],
    },
    'input:focus ~ &': {
      border: `1px solid ${props.theme.palette.grey[300]}`,
      backgroundColor: props.theme.palette.grey[200],
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      opacity: 0.6,
    },
  }
})

export const HBCheckBoxCheckedStyle = styled(HBCheckBoxUncheckedStyle)((props) => {
  return {
    borderRadius: props.theme.shape.borderRadius,
    width: 26,
    height: 26,
    background: props.theme.palette.primary.main,
    backgroundImage: `url(${Checked})`,
    backgroundSize: '80%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    'input:hover ~ &': {
      backgroundColor: props.theme.palette.primary.dark,
    },
    'input:focus ~ &': {
      border: `1px solid ${props.theme.palette.primary.light}`,
      background: props.theme.palette.primary.main,
      backgroundImage: `url(${Checked})`,
      backgroundSize: '80%',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      opacity: 0.3,
    },
  }
})
