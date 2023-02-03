import { Button, buttonClasses, circularProgressClasses, styled } from '@mui/material'

export const HBButtonRootStyle = styled(Button)((props) => ({
  borderRadius: props.theme.spacing(2),
  paddingRight: props.theme.spacing(4),
  paddingLeft: props.theme.spacing(4),

  [`&.${buttonClasses.sizeLarge}`]: {
    paddingTop: props.theme.spacing(3),
    paddingBottom: props.theme.spacing(3),
    height: 48,
  },

  [`&.${buttonClasses.sizeMedium}`]: {
    paddingTop: props.theme.spacing(2),
    paddingBottom: props.theme.spacing(2),
    height: 40,
  },

  [`&.${buttonClasses.sizeSmall}`]: {
    paddingTop: props.theme.spacing(1.5),
    paddingBottom: props.theme.spacing(1.5),
    height: 32,
  },

  // circularProgress color style
  [`&.${buttonClasses.root}`]: {
    [`&.${buttonClasses.contained}`]: {
      [`& .${circularProgressClasses.root}`]: {
        color: props.theme.palette.common.white,
      },
    },
    [`&.${buttonClasses.outlined} , &.${buttonClasses.text}`]: {
      [`& .${circularProgressClasses.root}`]: {
        color:
          props.theme.palette[props.color && props.color !== 'inherit' ? props.color : 'primary']
            .main,
      },
    },
  },

  // disabled root style
  [`&.${buttonClasses.disabled}`]: {
    opacity: 0.3,
  },

  // contained
  [`&.${buttonClasses.contained}`]: {
    boxShadow: 'none',
    [`&.${buttonClasses.disabled}`]: {
      background:
        props.theme.palette[props.color && props.color !== 'inherit' ? props.color : 'primary']
          .main,
      color: props.theme.palette.common.white,
    },
  },

  // outlined
  [`&.${buttonClasses.outlined}`]: {
    '&:focus': {
      border: `2px solid ${
        props.theme.palette[props.color && props.color !== 'inherit' ? props.color : 'primary'].main
      }`,
    },
  },

  // text
  [`&.${buttonClasses.text}`]: {
    '&:hover': {
      backgroundColor:
        props.theme.palette[props.color && props.color !== 'inherit' ? props.color : 'primary']
          .lighter,
    },
    '&:focus': {
      border: `2px solid ${
        props.theme.palette[props.color && props.color !== 'inherit' ? props.color : 'primary']
          .lighter
      }`,
    },
  },
})) as typeof Button
