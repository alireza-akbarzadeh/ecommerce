import { Chip, ChipProps, styled } from '@mui/material'

export type HBTagProps = ChipProps

export const HBTagRootStyle = styled(Chip)(({ theme }) => {
  return {
    backgroundColor: theme.palette.grey[200],
    fontWeight: '400',
    color: theme.palette.grey[900],
    height: 32,
    display: 'flex',
    fontSize: theme.typography.fontSize,
    alignItems: 'center',
    justifyContent: 'flex-start',
    textAlign: 'center',
    padding: theme.spacing(1.5),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    borderRadius: theme.spacing(2),
  }
}) as React.ComponentType<HBTagProps>
