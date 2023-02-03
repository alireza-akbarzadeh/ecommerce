import { feedbackProps } from '@hasty-bazar/admin-shared/containers/HBContentUploader'
import {
  HBClassesType,
  HBIcon,
  HBIconButton,
  HBIconButtonProps,
  HBIconType,
} from '@hasty-bazar/core'
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Popover,
  Stack,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import HBImg from './HBImage.style'
import HBVideo from './HBVideo.style'

type HBPageClassnames =
  | 'mediaContainer'
  | 'mediaWrapper'
  | 'mediaCaption'
  | 'mediaOverlayText'
  | 'mediaOverlay'
  | 'shrinkIcon'
  | 'ellipsisHIcon'
  | 'video'
  | 'feedbackBox'

const classes: HBClassesType<HBPageClassnames> = {
  mediaContainer: ({ spacing, palette }) => ({
    width: spacing(30),
    height: spacing(30),
    border: 1,
    borderColor: palette.grey[500],
    borderRadius: 2,
    position: 'relative',
  }),
  mediaWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  mediaCaption: ({ palette }) => ({
    color: palette.grey[500],
    textAlign: 'center',
    mt: 1,
  }),
  feedbackBox: ({ palette }) => ({
    color: palette.grey[900],
  }),
  mediaOverlayText: {
    width: '100%',
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    textAlign: 'center',
  },
  mediaOverlay: ({ spacing }) => ({
    width: '100%',
    height: '100%',
    position: 'absolute',
    background: 'rgba(255, 255, 255, .3)',
    borderRadius: spacing(1 / 2),
  }),
  shrinkIcon: {
    position: 'absolute',
    m: 2,
  },
  ellipsisHIcon: {
    position: 'absolute',
    right: 0,
    m: 2,
  },
  video: ({ spacing }) => ({
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: spacing(2),
    objectFit: 'fill',
  }),
}
export type HBUploadItemPopUpItem = {
  title: string
  icon: HBIconType
  action?: string
  show?: boolean
}

export type HBUploadItemProps = {
  id: string | number
  caption: string
  media?: string
  text?: string
  disabled?: boolean
  popups?: HBUploadItemPopUpItem[]
  dragButtonProps?: HBIconButtonProps
  order?: number
  onPopupClick?: (
    popup: HBUploadItemPopUpItem,
    item: Omit<
      HBUploadItemProps,
      'onPopupClick' | 'dragButtonProps' | 'popups' | 'uploadButtonAcceptType'
    >,
  ) => void
  uploadButtonAcceptType: string
  showDragButton?: boolean
  showMoreButton?: boolean
  feedback?: feedbackProps
}

function HBUploadItem({
  dragButtonProps,
  onPopupClick,
  disabled,
  popups,
  uploadButtonAcceptType,
  showDragButton,
  showMoreButton,
  feedback,
  ...props
}: HBUploadItemProps) {
  const { media, caption, text } = props
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const openMenu = Boolean(anchorEl) && !disabled

  return (
    <Box sx={classes.mediaWrapper}>
      <Box sx={classes.mediaContainer}>
        {uploadButtonAcceptType.includes('image') && <HBImg src={media} sx={classes.video} />}
        {uploadButtonAcceptType.includes('video') && <HBVideo src={media} sx={classes.video} />}

        <Box sx={classes.mediaOverlay}></Box>
        <Typography variant="subtitle2" sx={classes.mediaOverlayText}>
          {text}
        </Typography>
        <Stack flexDirection="row" justifyContent="space-between">
          {showDragButton && (
            <HBIconButton icon={'shrink'} sx={classes.shrinkIcon} {...dragButtonProps} />
          )}
          {popups && showMoreButton && (
            <HBIconButton icon={'ellipsisH'} sx={classes.ellipsisHIcon} onClick={handleClick} />
          )}
        </Stack>
        {popups && (
          <Popover
            open={openMenu}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            onClose={() => setAnchorEl(null)}
          >
            <MenuList component="nav">
              {popups?.map((otherProps, index) => {
                const { title, icon, show } = otherProps
                return (
                  show && (
                    <MenuItem
                      onClick={() => {
                        onPopupClick && onPopupClick(otherProps, props)
                        setAnchorEl(null)
                      }}
                      key={index}
                    >
                      <ListItemIcon>
                        <HBIcon type={icon} />
                      </ListItemIcon>
                      <ListItemText>{title}</ListItemText>
                    </MenuItem>
                  )
                )
              })}
            </MenuList>
          </Popover>
        )}
      </Box>
      <Typography variant="subtitle2" sx={classes.mediaCaption}>
        {caption}
      </Typography>
      {feedback?.show && (
        <Box sx={classes.feedbackBox}>
          <List
            sx={{
              display: 'flex',
              padding: 0,
            }}
          >
            <ListItem>
              <Typography>{feedback.visitorsCount}</Typography>
              <HBIcon
                type="eye"
                sx={({ palette }) => ({
                  color: palette.info.main,
                })}
              />
            </ListItem>
            <ListItem>
              <Typography>{feedback.likeCount}</Typography>
              <HBIcon
                type="heart"
                sx={({ palette }) => ({
                  color: palette.primary.main,
                })}
              />
            </ListItem>
          </List>
        </Box>
      )}
    </Box>
  )
}

export default HBUploadItem
