import { Stack, Typography } from '@mui/material'
import { FC, ReactNode } from 'react'
import HBLink from '../../HBLink'
import HBSellerCardWidget from './HBSellerCardWidget'

export interface HBSellerListWidgetProps {
  data?:
    | {
        parentId?: string
        imageUrl?: string
        id: string
        storeName?: string
        followingCount?: number
      }[]
    | null
  title?: string | null
  metaData?: string | null
  saveVendor: FC<{ vendorId: string }>
  prefixImageUrl: string
  folowerTitle?: ReactNode
  noAction?: boolean
}

const HBSellerListWidget: FC<HBSellerListWidgetProps> = (props) => {
  const {
    data,
    title,
    metaData: metaDataProps,
    saveVendor: SaveVendorButton,
    prefixImageUrl,
    folowerTitle,
    noAction,
  } = props
  const metaData = JSON.parse(metaDataProps!)

  const parents = data?.filter((_) => !_.parentId)
  const finalData = parents
    ?.map((_) => ({
      ..._,
      children: data?.filter((item) => item.parentId === _.id && !!item.imageUrl),
    }))
    .filter((_) => !!_?.children?.length)

  return (
    <Stack
      sx={(theme) => ({
        bgcolor: 'common.white',
        p: 6,
        overflow: 'hidden',
        width: {
          md: 'unset',
          sm: `calc(100% + ${theme.spacing(12)})`,
          xs: `calc(100% + ${theme.spacing(8)})`,
        },
        ml: { xs: theme.spacing(-4), sm: theme.spacing(-6), md: 'unset' },
        borderRadius: { xs: 'unset', md: 4 },
      })}
    >
      {!!title && (
        <Stack direction="row" alignItems="center" mb={12}>
          <Typography variant="h6" color="text.primary" sx={{ color: metaData?.fontColor }}>
            {title}
          </Typography>
        </Stack>
      )}
      <Stack
        sx={(theme) => ({
          flexDirection: { xs: 'column', sm: 'row' },
          flexWrap: { xs: 'wrap', sm: 'unset' },
          overflowX: 'auto',
          [theme.breakpoints.down('md')]: {
            '& > a:not(:last-child)': {
              marginRight: theme.spacing(6),
            },
            '& > a': {
              minWidth: 328,
            },
          },
          [theme.breakpoints.down('sm')]: {
            '& > a:not(:last-child)': {
              marginRight: 0,
            },
            '& > a': {
              minWidth: '100%',
            },
          },
          [theme.breakpoints.up('md')]: {
            '& > a:not(:last-child)': {
              marginRight: theme.spacing(6),
            },
            '& > a': {
              minWidth: 344,
            },
          },
          '& > a': {
            marginBottom: theme.spacing(6),
            width: 'calc(33.33% - 16px)',
          },
        })}
      >
        {finalData?.slice(0, 3).map((item) => (
          <HBLink
            href={
              noAction
                ? undefined
                : {
                    pathname: '/vendor',
                    query: {
                      baseFilter: JSON.stringify({ vendors: [item.id] }),
                    },
                  }
            }
            target="_blank"
            key={item.id}
          >
            <HBSellerCardWidget
              saveVendor={<SaveVendorButton vendorId={item.id!} />}
              avatarUrl={prefixImageUrl + item.imageUrl!}
              followerCount={item.followingCount!}
              imageUrls={item.children!}
              storeName={item.storeName!}
              prefixImageUrl={prefixImageUrl}
              folowerTitle={folowerTitle}
            />
          </HBLink>
        ))}
      </Stack>
    </Stack>
  )
}

export default HBSellerListWidget
