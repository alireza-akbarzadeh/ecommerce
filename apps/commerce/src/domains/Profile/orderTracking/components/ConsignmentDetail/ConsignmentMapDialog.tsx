import { HBMap } from '@hasty-bazar-commerce/containers/HBMap'
import { HBDialog } from '@hasty-bazar/core'
import { dialogClasses, paperClasses } from '@mui/material'
import { LatLngExpression } from 'leaflet'
import { FC } from 'react'

interface IConsignmentMapDialogProps {
  open: boolean
  setClose: () => void
  title: string
  position: LatLngExpression
}

const ConsignmentMapDialog: FC<IConsignmentMapDialogProps> = (props) => {
  const { open, setClose, title, position } = props
  return (
    <HBDialog
      maxWidth="md"
      fullWidth
      title={title}
      open={open}
      onClose={() => setClose()}
      sx={(theme) => ({
        [theme.breakpoints.down('sm')]: {
          [`& .${dialogClasses.container}`]: {
            [`& .${paperClasses.root}`]: {
              minWidth: 300,
            },
          },
        },
      })}
      content={<HBMap sx={{ height: 430, width: '100%' }} hasZoomBox={false} center={position} />}
    ></HBDialog>
  )
}

export default ConsignmentMapDialog
