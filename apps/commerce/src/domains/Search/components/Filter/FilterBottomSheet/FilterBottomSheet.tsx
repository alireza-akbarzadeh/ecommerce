import { HBIconButton } from '@hasty-bazar/core'
import { Grid, Paper, Typography } from '@mui/material'
import { FC } from 'react'
import { FormattedMessage } from 'react-intl'
import SearchMessages from '../../../Search.messages'

interface IProps {
  searchQty: number
  showResult: (show: boolean) => void
}
export const FilterBottomSheet: FC<IProps> = (props) => {
  const { showResult } = props
  return (
    <Grid
      container
      alignItems="center"
      justifyContent="space-between"
      component={Paper}
      onClick={() => showResult(false)}
      sx={(theme) => ({
        display: {
          md: 'none',
        },
        height: theme.spacing(14),
        position: 'sticky',
        bottom: 0,
        borderRadius: theme.spacing(2, 2, 0, 0),
      })}
    >
      <Grid item xs={10} container alignItems="center" gap={1}>
        <Typography variant="subtitle2" ml={2}>
          <FormattedMessage {...SearchMessages.view} />
        </Typography>
        <Typography variant="h6">{String(props.searchQty)}</Typography>
        <Typography variant="h6">
          <FormattedMessage {...SearchMessages.product} />
        </Typography>
      </Grid>
      <Grid item xs={2} container justifyContent="flex-end">
        <HBIconButton variant="text" icon="angleUp" />
      </Grid>
    </Grid>
  )
}
