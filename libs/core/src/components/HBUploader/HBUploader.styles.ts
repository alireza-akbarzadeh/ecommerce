import { Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'

export const useHBUploaderStyle = makeStyles((theme: Theme) => {
  const { palette, spacing } = theme
  return {
    root: {
      padding: spacing(2),
      border: `solid 1px ${palette.grey[500]}`,
      borderRadius: spacing(2),
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    description: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      gap: spacing(1),
    },
    files: {
      listStyleType: 'none',
      padding: 0,
      '& li': {
        padding: spacing(1),
        borderRadius: spacing(4),
        border: `solid ${spacing(0.3)} ${palette.grey[500]}`,
        maxWidth: 400,
        height: 'auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing(1),
        '& button': {
          all: 'unset',
          cursor: 'pointer',
          color: palette.error.main,
        },
      },
    },
  }
})
