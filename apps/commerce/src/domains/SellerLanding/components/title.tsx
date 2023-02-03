import { Typography } from '@mui/material'

export interface TitleProps {
  title: string
}

function Title({ title }: TitleProps) {
  return (
    <Typography
      variant="h5"
      sx={{
        position: 'relative',
        '&:after': {
          position: 'absolute',
          content: '""',
          bottom: (theme) => theme.spacing(-1),
          left: 0,
          width: (theme) => theme.spacing(10),
          height: (theme) => theme.spacing(0.25),
          backgroundColor: 'info.main',
        },
      }}
    >
      {title}
    </Typography>
  )
}

export default Title
