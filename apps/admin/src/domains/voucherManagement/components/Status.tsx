import { Box, Theme } from '@mui/material'
import Typography from '@mui/material/Typography'
import { SxProps } from '@mui/system'
import { ICellRendererParams } from 'ag-grid-community'
import { SellerStatus, StatusStage } from '../enum/StatusStage'

interface IStatusProps extends ICellRendererParams {
  childStatus: boolean
}

const Status = (props: IStatusProps) => {
  const typography: SxProps = {
    fontSize: (theme: Theme) => theme.spacing(3.4),
    opacity: 1,
  }
  const { stateName, stateCode } = props.data
  const color =
    stateCode === StatusStage.draft
      ? 'primary'
      : stateCode === StatusStage.release
      ? 'success'
      : 'error'
  const girdStatusColor =
    stateCode === SellerStatus.draft
      ? 'primary'
      : stateCode === SellerStatus.release
      ? 'success'
      : 'error'

  const ThemeComponent: SxProps = {
    backgroundColor: (theme: Theme) =>
      theme.palette[props?.childStatus ? girdStatusColor : color].light,
    border: (theme: Theme) => theme.palette[props?.childStatus ? girdStatusColor : color].main,
    color: (theme: Theme) => theme.palette[props?.childStatus ? girdStatusColor : color].dark,
    height: (theme: Theme) => theme.spacing(8),
    width: (theme: Theme) => theme.spacing(25),
    borderRadius: (theme: Theme) => theme.spacing(10),
    mt: 1.3,
    p: 0,
    opacity: 0.8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  return stateName ? (
    <Box sx={ThemeComponent}>
      <Typography sx={typography} component={'span'}>
        {stateName}
      </Typography>
    </Box>
  ) : (
    '-'
  )
}

export default Status
