import { SectionByContentQueryResult } from '@hasty-bazar-commerce/services/cmsApi.generated'
import { HBCountDownTimer } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import { FC } from 'react'

interface HBAdsHeaderProps {
  sections?: SectionByContentQueryResult[]
}

const HBAdsHeader: FC<HBAdsHeaderProps> = (props) => {
  const { sections } = props
  const router = useRouter()

  const handleLink = () => {
    if (metaData?.button?.link) router.push(metaData?.button?.link)
    else if (metaData?.url) router.push(metaData?.url)
  }

  const section = sections?.find(
    (section) =>
      section.componentType === 'IMAGE_ONLY' || section.componentType === 'IMAGE_WITH_TIMER',
  )
  const metaData = section?.content?.metaData ? JSON.parse(section?.content?.metaData) : {}
  if (!section || !section?.content?.imageUrl) return null
  if (section?.endDate && new Date(section?.endDate || '').getTime() < new Date().getTime())
    return null

  return (
    <Box
      id="ads-header"
      sx={{
        height: 60,
        zIndex: 100,
        width: '100%',
        position: 'fixed',
        backgroundImage: `url("${process.env.NEXT_PUBLIC_CDN + section?.content?.imageUrl}")`,
        backgroundPosition: 'center',
        cursor: metaData?.button?.link ? 'pointer' : 'default',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
      display="flex"
      justifyContent={'flex-start'}
      alignItems="center"
      onClick={handleLink}
    >
      {/* {section?.content?.imageUrl && (
          <Image
            src={process.env.NEXT_PUBLIC_CDN + section?.content?.imageUrl}
            alt="image-promotion"
            layout="fill"
            style={{ position: 'absolute' }}
          />
        )} */}
      {section.componentType === 'IMAGE_WITH_TIMER' && section?.endDate && (
        <Box
          maxWidth={1128}
          margin="0 auto"
          width="100%"
          display="flex"
          justifyContent="flex-start"
        >
          <Box
            // ml={8}
            sx={{
              zIndex: 2,
              '& > span >h5:last-of-type,& > span p:last-of-type': {
                display: 'none',
              },
            }}
          >
            <HBCountDownTimer
              linkText=""
              targetDate={new Date(section?.endDate || '').getTime()!}
              sx={{
                '& > h5': (theme) => ({
                  backgroundColor: theme.palette.primary.lighter,
                  padding: theme.spacing(2, 2.5),
                  color: theme.palette.primary.darker,
                  borderRadius: theme.spacing(2),
                  minWidth: 45,
                  width: '100%',
                }),
                '& > p': (theme) => ({
                  color: theme.palette.primary.darker,
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: 30,
                }),
              }}
            />
          </Box>
        </Box>
      )}
      {/* <Typography
          component="div"
          dangerouslySetInnerHTML={{ __html: section?.content?.description || '' }}
          color={metaData?.fontColor}
          mx={16}
          sx={{
            zIndex: 2,
          }}
        />
        {metaData?.button?.name && (
          <HBButtonStyle
            variant="text"
            sx={{
              bgcolor: metaData?.button?.backgroundColor,
              color: metaData?.button?.fontColor,
              zIndex: 2,
            }}
          >
            {metaData?.button?.name}
            <HBIcon type="arrowLeft" sx={{ ml: 2 }} />
          </HBButtonStyle>
        )} */}
    </Box>
  )
}

export default HBAdsHeader
