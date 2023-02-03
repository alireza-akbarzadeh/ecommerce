import { HBSlider } from '@hasty-bazar/core'
import { Grid, Typography } from '@mui/material'
import { FC } from 'react'

interface IProps {
  label: string
  value: number
}
export const VendorDescSlider: FC<IProps> = (props) => {
  return (
    <>
      <Grid container justifyContent="space-between">
        <Typography variant="subtitle1" color="text.secondary">
          {props.label}
        </Typography>
        <Typography variant="subtitle1" color="info.main">
          % {props.value.toString()}
        </Typography>
      </Grid>
      <HBSlider
        sx={{ color: 'info.main' }}
        value={props.value}
        components={{
          Thumb: undefined,
        }}
        step={null}
      />
    </>
  )
}
