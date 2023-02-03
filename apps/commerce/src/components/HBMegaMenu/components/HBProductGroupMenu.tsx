import HBLink from '@hasty-bazar-commerce/components/HBLink'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import {
  GetCategoriesForCommerceQueryResult,
  useGetWebCatalogCategoriesGetAllCategoriesForCommerceQuery,
} from '@hasty-bazar-commerce/services/catalogApi.generated'
import { Box, Divider, Link, Stack, Typography } from '@mui/material'
import { stringify } from 'query-string'
import { useMemo, useState } from 'react'

export enum DisplayExtractTypeCodeEnum {
  page = 1030001,
  collection = 1030002,
  default = 1030003,
}

const HBProductGroupMenu = () => {
  const [menuItem, setMenuItem] = useState<
    GetCategoriesForCommerceQueryResult & {
      imageUrl?: string
      favorites?: GetCategoriesForCommerceQueryResult[]
      items?: GetCategoriesForCommerceQueryResult[]
    }
  >()

  const { data } = useGetWebCatalogCategoriesGetAllCategoriesForCommerceQuery({
    ...ApiConstants,
    pageSize: 1000,
  })

  const parents = data?.data?.items?.filter((_) => !_.parentId)?.splice(0, 10) || []

  const finalData = useMemo(
    () =>
      parents?.map((parent) => ({
        ...parent,
        link: '#',
        favorites: [],
        items: data?.data?.items
          ?.filter((_) => _.parentId === parent.id)
          .map((_) => ({ ..._, link: '#' })),
      })) as GetCategoriesForCommerceQueryResult[],
    [parents],
  )
  const sortingData = finalData.sort((a, b) => {
    return a.displaySortTypeCode! - b.displaySortTypeCode!
  })

  const handleLink = (item: GetCategoriesForCommerceQueryResult) => {
    const selector: Record<DisplayExtractTypeCodeEnum, string> = {
      [DisplayExtractTypeCodeEnum.page]: `/category/${item.pageOriginName}/?categoryId=${item.id}`,
      [DisplayExtractTypeCodeEnum.collection]: `/collection/?collectionId=${item.collectionId}`,
      [DisplayExtractTypeCodeEnum.default]: `/collection/?${stringify({
        baseFilter: JSON.stringify({ categories: [item.id] }),
      })}`,
    }

    return selector[item.displayExtractTypeCode! as unknown as DisplayExtractTypeCodeEnum] ?? '#'
  }

  const image = useMemo(() => {
    const images = menuItem?.defaultImage?.filter((_) => _ !== null)
    const metadata = menuItem?.imageMetaData?.filter((_) => _ !== null)

    return { url: images?.[0], metadata: metadata?.[0] ? JSON.parse(metadata[0]) : undefined }
  }, [menuItem])

  return (
    <Box display="flex">
      <Stack
        py={1.5}
        pl={2}
        pr={10}
        borderRight={(theme) => `1px solid ${theme.palette.grey[200]}`}
      >
        {sortingData?.map((item) => (
          <Link href={handleLink(item)} key={item.id} sx={{ textDecoration: 'none' }}>
            <Typography
              py={4.5}
              component="div"
              variant="subtitle2"
              sx={{
                cursor: item?.displayExtractTypeCode ? 'pointer' : 'default',
                color: item.name === menuItem?.name ? 'secondary.main' : 'text.secondary',
                bgcolor: item.name === menuItem?.name ? 'secondary.lighter' : 'unset',
                whiteSpace: 'nowrap',
              }}
              display="flex"
              alignItems="center"
              onMouseEnter={() => setMenuItem(item)}
              px={4}
              borderRadius={2}
            >
              <Box
                component={item.iconPath ? 'img' : 'div'}
                sx={{ objectFit: 'contain', objectPosition: 'center' }}
                width={18}
                height={18}
                src={process.env.NEXT_PUBLIC_CDN! + item.iconPath!}
                mr={2}
              />
              {item.name}
            </Typography>
          </Link>
        ))}
      </Stack>
      <Box py={6} pl={8} pr={4} width={'100%'} display="flex" justifyContent="space-between">
        <Box width={'100%'} display="flex">
          <Stack width={image?.url ? '50%' : '100%'}>
            <Typography variant="subtitle1" color="common.black" mb={4}>
              {menuItem?.name}
            </Typography>
            <Divider sx={{ borderColor: 'grey.200' }} />
            <Stack mt={1} sx={{ flexWrap: 'wrap', maxHeight: 400 }}>
              {menuItem?.items?.map((item: any, index: number) => (
                <Link
                  href={handleLink(item)}
                  sx={{ textDecoration: 'none' }}
                  key={item.name + index}
                >
                  <Typography
                    py={2.5}
                    variant="subtitle2"
                    color="textSecondary"
                    sx={{
                      pr: 4,
                      borderRadius: 2,
                      cursor: item?.displayExtractTypeCode ? 'pointer' : 'default',
                      '&:hover': {
                        color: item?.displayExtractTypeCode ? 'secondary.main' : 'textSecondary',
                        // bgcolor: item?.displayExtractTypeCode ? 'secondary.lighter' : 'unset',
                        // pl: item?.displayExtractTypeCode ? 2 : 'unset',
                      },
                    }}
                  >
                    {item.name}
                  </Typography>
                </Link>
              ))}
            </Stack>
          </Stack>
          {!!image?.url && (
            <Box width="49%" mt={13} display="flex" alignItems="center" justifyContent="flex-end">
              <HBLink
                href={image?.metadata?.link ?? '#'}
                passHref
                target="_blank"
                width="100%"
                sx={{ textAlign: 'center' }}
              >
                <Box
                  component="img"
                  src={process.env.NEXT_PUBLIC_CDN! + image?.url}
                  sx={{
                    borderRadius: 4,
                    objectFit: 'contain',
                    objectPosition: 'center',
                    maxWidth: '100%',
                  }}
                />
              </HBLink>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default HBProductGroupMenu
