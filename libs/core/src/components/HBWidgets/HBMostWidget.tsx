import { HBButton } from '@hasty-bazar/core'
import { Box, Stack, Typography } from '@mui/material'
import { FC } from 'react'
import HBLink from '../HBLink'

export interface HBMostWidgetProps {
  columnIndex: number
  data: {
    id?: string
    parentId?: string
    imageUrl?: string
    title?: string
    hsin?: string
    slug?: string
  }[]
  prefixImageUrl: string
  title?: string
  description?: string
  metaData?: string
  noAction?: boolean
}

const HBMostWidget: FC<HBMostWidgetProps> = (props) => {
  const {
    data,
    title,
    description,
    metaData: metaDataProps,
    columnIndex,
    prefixImageUrl,
    noAction,
  } = props

  const metaData = JSON.parse(metaDataProps || '')
  return (
    <Stack
      direction="row"
      spacing={6}
      justifyContent={'space-between'}
      sx={(theme) => ({
        width: {
          xs: `calc(100% + ${theme.spacing(8)})`,
          sm: columnIndex < 40 ? '100%' : `calc(100% + ${theme.spacing(6)})`,
          md: '100%',
        },
        ml: { xs: -4, sm: 'unset' },
        overflow: { xs: 'hidden', md: 'unset' },
      })}
    >
      <Box
        key={title}
        sx={(theme) => ({
          bgcolor: metaData?.backgroundColor,
          borderTopLeftRadius: { xs: 0, sm: theme.spacing(4) },
          borderTopRightRadius: {
            xs: 0,
            sm: theme.spacing(columnIndex < 40 ? 4 : 0),
            md: theme.spacing(4),
          },
          borderBottomLeftRadius: { xs: 0, sm: theme.spacing(4) },
          borderBottomRightRadius: {
            xs: 0,
            sm: theme.spacing(columnIndex < 40 ? 4 : 0),
            md: theme.spacing(4),
          },
          p: 4,
          display: 'flex',
          justifyContent: {
            xs: columnIndex < 40 ? 'space-between' : 'flex-start',
            md: 'space-between',
          },
          width: '100%',
          overflowX: 'auto',
          [theme.breakpoints.down('md')]: {
            // '-ms-overflow-style': 'none',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          },
        })}
      >
        <Stack
          sx={(theme) => ({
            bgcolor: metaData?.backgroundColor?.includes('#fff') ? 'background.default' : 'white',
            opacity: 0.8,
            borderRadius: 4,
            width: columnIndex > 25 ? 400 : 179,
            minWidth: { sm: columnIndex > 25 ? 400 : 179, xs: 208 },
            height: 200,
            [theme.breakpoints.only('sm')]: {
              flex: 1,
            },
          })}
          justifyContent="space-between"
          p={6}
          mr={{ xs: 4, md: 0 }}
        >
          <Typography variant="h5" color={metaData?.fontColor}>
            {title}
          </Typography>
          <Typography
            variant="subtitle1"
            component="div"
            dangerouslySetInnerHTML={{ __html: description + '' }}
          />
          {metaData?.hasButton && (
            <HBLink
              href={
                noAction
                  ? undefined
                  : metaData?.button?.link || `/collection?collectionId=${metaData?.queryId}`
              }
              passHref
            >
              <HBButton
                sx={{
                  bgcolor: metaData?.button?.backgroundColor,
                  maxWidth: 'fit-content',
                  minWidth: 102,
                  borderRadius: 6,
                  boxShadow: 'none',
                  '&:hover': {
                    bgcolor: metaData?.button?.backgroundColor,
                  },
                }}
                size="small"
              >
                <Typography variant="subtitle2" color={metaData?.button?.fontColor}>
                  {metaData?.button?.text}
                </Typography>
              </HBButton>
            </HBLink>
          )}
        </Stack>
        <Stack
          direction="row"
          spacing={1}
          sx={({ spacing }) => ({
            '& > a:first-of-type': {
              borderTopLeftRadius: spacing(4),
              borderBottomLeftRadius: spacing(4),
            },
            '& > a:last-child': {
              borderTopRightRadius: spacing(4),
              borderBottomRightRadius: spacing(4),
            },
          })}
        >
          {data?.slice(0, columnIndex < 24 ? 2 : 4)?.map((item, index) => (
            <Box
              sx={{
                width: 145,
                height: 200,
                position: 'relative',
                overflow: 'hidden',
                bgcolor: 'common.white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              component={noAction ? 'div' : 'a'}
              href={`/product/${item?.hsin}/${item?.slug}`}
              key={item?.id! + index}
              target="_blank"
            >
              <Box
                component="img"
                src={item?.imageUrl ? `${prefixImageUrl}${item.imageUrl}` : '/'}
                sx={{
                  objectFit: 'contain',
                  objectPosition: 'center',
                  maxWidth: 137,
                }}
              />
            </Box>
          ))}
        </Stack>
      </Box>
    </Stack>
  )
}

export default HBMostWidget
