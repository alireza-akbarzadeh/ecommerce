import {
  Box,
  DialogActions,
  DialogContent,
  DialogProps,
  IconButton,
  Stack,
  SxProps,
  Typography,
} from '@mui/material'
import { Theme } from '@mui/system'
import React, { ForwardedRef, forwardRef, ReactNode } from 'react'
import { HBButton, HBButtonProps } from '../HBButton'
import { HBIcon } from '../HBIcon'
import { HBDialogRootStyle } from './HBDialog.styles'

export interface HBDialogProps extends Omit<DialogProps, 'ref' | 'title'> {
  title?: string | ReactNode
  content?: ReactNode
  rejectBtn?: string
  acceptBtn?: string
  onAccept?: () => void
  onReject?: () => void
  hideCloseButton?: boolean
  onAcceptBtnProps?: Omit<HBButtonProps, 'children' | 'onClick'>
  loading?: boolean
  contentSx?: SxProps<Theme>
}

const HBDialog = forwardRef(
  <T extends HTMLDivElement>(
    {
      children,
      content,
      rejectBtn,
      acceptBtn,
      contentSx,
      onAcceptBtnProps,
      title,

      hideCloseButton,
      loading,
      onClose,
      ...props
    }: HBDialogProps,
    ref: ForwardedRef<T>,
  ) => {
    return (
      <HBDialogRootStyle {...props}>
        <DialogContent sx={contentSx}>
          {(title || !hideCloseButton) && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 4,
                bgcolor: 'background.paper',
                borderRadius: 1,
              }}
              className="HBDialogTitle"
            >
              {title && typeof title === 'string' && <Typography variant="h6">{title}</Typography>}
              {title && typeof title !== 'string' && title}

              {!hideCloseButton && (
                <IconButton onClick={(e) => onClose!(e, 'backdropClick')} sx={{ mr: -1.5 }}>
                  <HBIcon type="times" size="small" sx={{ color: 'grey.900', lineHeight: 0 }} />
                </IconButton>
              )}
            </Box>
          )}

          {content && (
            <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
              {content}
            </Typography>
          )}
          {children}
        </DialogContent>
        {(rejectBtn || acceptBtn) && (
          <DialogActions>
            <Stack
              direction="row"
              gap={4}
              width="100%"
              justifyContent="space-between"
              alignItems="center"
            >
              {rejectBtn && (
                <HBButton variant="outlined" sx={{ flexGrow: 1 }} onClick={props.onReject}>
                  {rejectBtn}
                </HBButton>
              )}
              {acceptBtn && (
                <HBButton
                  loading={loading}
                  disabled={loading}
                  sx={{ flexGrow: 1 }}
                  {...onAcceptBtnProps}
                  onClick={props.onAccept}
                >
                  {acceptBtn}
                </HBButton>
              )}
            </Stack>
          </DialogActions>
        )}
      </HBDialogRootStyle>
    )
  },
)

HBDialog.displayName = 'HBDialog'
HBDialog.defaultProps = { hideCloseButton: false }

export default HBDialog
