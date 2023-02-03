import { HBIconButton, HBIconButtonProps, HBLoading } from '@hasty-bazar/core'
import { FC } from 'react'

interface ICommerceIconButtonProps extends HBIconButtonProps {
  loading?: boolean
}

const CommerceIconButton: FC<ICommerceIconButtonProps> = (props) => {
  const { sx, loading, icon, ...rest } = props
  return (
    <HBIconButton
      sx={{ border: 'none', bgcolor: 'inherit!important', ...sx }}
      icon={!loading ? icon : <HBLoading />}
      {...rest}
    />
  )
}

export default CommerceIconButton
