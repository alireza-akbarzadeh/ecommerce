import { ChipProps, Stack } from '@mui/material'
import { ForwardedRef, forwardRef } from 'react'
import { HBIconButton } from '../HBIconButton'
import { HBTagRootStyle } from './HBTag.styles'

export type HBTagProps = Omit<ChipProps, 'ref'>

const HBTag = forwardRef(
  <T extends HTMLDivElement>({ ...props }: HBTagProps, ref: ForwardedRef<T>) => {
    return (
      <HBTagRootStyle
        ref={ref}
        icon={
          props.onDelete ? (
            <Stack
              onClick={props.onDelete}
              direction="row"
              mr={4.5}
              alignItems="center"
              height={'100%'}
              component={'div'}
            >
              <HBIconButton
                iconSize="small"
                icon="multiply"
                sx={{ backgroundColor: (theme) => theme.palette.grey[200], height: 25 }}
              />
            </Stack>
          ) : undefined
        }
        {...props}
        deleteIcon={<></>}
      />
    )
  },
)

HBTag.displayName = 'HBTag'

export default HBTag
