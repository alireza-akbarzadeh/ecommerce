import { Typography } from '@mui/material'

type EmptyIsLoadingComponentProps = {
  text: string
}

function EmptyIsLoadingComponent({ text }: EmptyIsLoadingComponentProps) {
  return (
    <Typography sx={{ textAlign: 'center' }} variant="body2">
      {text}
    </Typography>
  )
}

export default EmptyIsLoadingComponent
