import useCopyToClipboard from '@hasty-bazar-commerce/hooks/useCopyToclipboard'
import { isServer } from '@hasty-bazar-commerce/utils'
import {
  HBButton,
  HBButtonProps,
  HBDialog,
  HBIcon,
  HBIconType,
  HBTextField,
  openToast,
} from '@hasty-bazar/core'
import { Grid, IconButton, SxProps, Theme } from '@mui/material'
import { ReactNode } from 'react'
import { useIntl } from 'react-intl'
import ShareModalMessages from './ShareModal.messages'

interface ShareModalProps {
  onClose: VoidFunction
  open: boolean
  shareUrl: string
  title: string
}

function ShareButton({
  icon,
  title,
  iconSx,
  sx,
  ...props
}: {
  title: string
  icon: HBIconType | ReactNode
  iconSx?: SxProps<Theme>
} & HBButtonProps) {
  return (
    <HBButton
      sx={{
        display: 'flex',
        gap: 2,
        flexDirection: 'row',
        justifyContent: 'center',
        borderRadius: 2,
        fontVariant: 'subtitle2',
        ...sx,
      }}
      {...props}
    >
      {typeof icon === 'string' ? <HBIcon size="small" type={icon as HBIconType} /> : icon}
      {title}
    </HBButton>
  )
}

type SocialMediaNameType = 'email' | 'whatsapp' | 'instagram' | 'twitter' | 'linkedin'

function ShareModal({ open, onClose, shareUrl, title }: ShareModalProps) {
  const [_, copy] = useCopyToClipboard()

  const { formatMessage } = useIntl()

  const links = {
    WHATSAPP: process.env.NEXT_PUBLIC_WHATSAPP_SHARE_URL,
    TWITTER: process.env.NEXT_PUBLIC_TWITTER_SHARE_URL,
    INSTAGRAM: process.env.NEXT_PUBLIC_INSTAGRAM_SHARE_URL,
    LINKEDIN: process.env.NEXT_PUBLIC_LINKEDIN_SHARE_URL,
  }

  function handleShare(socialMediaName: SocialMediaNameType) {
    const socialMedias: Record<SocialMediaNameType, string> = {
      email: `mailto:?subject=${shareUrl}&body=${shareUrl}`,
      whatsapp: `${links.WHATSAPP}${shareUrl}`,
      instagram: `${links.INSTAGRAM}${shareUrl}`,
      twitter: `${links.TWITTER}${shareUrl}`,
      linkedin: `${links.LINKEDIN}${shareUrl}`,
    }

    if (!isServer()) {
      window.open(socialMedias[socialMediaName], '_blank')
    }
  }
  const shareButtons: {
    title: string
    icon: HBIconType
    onClick: VoidFunction
    sx?: SxProps<Theme>
    color?: HBButtonProps['color']
    variant?: HBButtonProps['variant']
  }[] = [
    {
      title: formatMessage(ShareModalMessages.whatsapp),
      icon: 'whatsappAlt',
      color: 'success',
      onClick: () => handleShare('whatsapp'),
    },
    {
      title: formatMessage(ShareModalMessages.twitter),
      icon: 'twitterAlt',
      color: 'info',
      onClick: () => handleShare('twitter'),
    },
    {
      title: formatMessage(ShareModalMessages.instagram),
      icon: 'instagram',
      variant: 'outlined',
      onClick: () => handleShare('instagram'),
    },
    {
      title: formatMessage(ShareModalMessages.email),
      icon: 'envelopeAlt',
      onClick: () => handleShare('email'),
      variant: 'outlined',
    },
    {
      title: formatMessage(ShareModalMessages.linkedin),
      icon: 'linkedin',
      color: 'info',
      onClick: () => handleShare('linkedin'),
    },
  ]

  function handleCopy() {
    copy(shareUrl)
    openToast({
      message: formatMessage(ShareModalMessages.linkedCopied),
      type: 'success',
      horizontal: 'center',
      vertical: 'top',
    })
  }

  return (
    <HBDialog
      open={open}
      maxWidth="xs"
      fullWidth
      onClose={onClose}
      onBackdropClick={onClose}
      title={formatMessage(ShareModalMessages.share)}
    >
      <Grid container gap={6} justifyContent="center">
        <Grid item xs={12}>
          <HBTextField
            label={''}
            dir="ltr"
            fullWidth
            value={shareUrl}
            InputProps={{
              startAdornment: (
                <IconButton onClick={handleCopy}>
                  <HBIcon type="linkAlt" />
                </IconButton>
              ),
            }}
          />
        </Grid>
        <Grid container item xs={12} rowGap={2} columnSpacing={4}>
          {shareButtons.map((button, idx) => (
            <Grid item xs={6} key={idx}>
              <ShareButton key={button.title} {...button} fullWidth />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </HBDialog>
  )
}
export default ShareModal
