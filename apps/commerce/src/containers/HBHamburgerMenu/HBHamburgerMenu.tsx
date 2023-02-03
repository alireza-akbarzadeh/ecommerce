import { HBLink } from '@hasty-bazar-commerce/components'
import DefaultHeaderMessges from '@hasty-bazar-commerce/components/HBDefaultHeader/DefaultHeader.messages'
import { DisplayExtractTypeCodeEnum } from '@hasty-bazar-commerce/components/HBMegaMenu/components/HBProductGroupMenu'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import {
  GetCategoriesForCommerceQueryResult,
  useGetWebCatalogCategoriesGetAllCategoriesForCommerceQuery,
} from '@hasty-bazar-commerce/services/catalogApi.generated'
import { HBIcon } from '@hasty-bazar/core'
import { TreeItem, treeItemClasses, TreeView } from '@mui/lab'
import { Box, Dialog, Divider, Stack, styled, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { stringify } from 'query-string'
import { FC, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import ContainersMessages from '../Containers.message'

interface HBHamburgerMenuProps {
  open: boolean
  onClose: () => void
}

type FinalDataType = GetCategoriesForCommerceQueryResult & {
  items: GetCategoriesForCommerceQueryResult[]
}

const TreeItemStyle = styled(TreeItem)(({ theme }) => ({
  [`& .${treeItemClasses.content}`]: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(4),
    padding: 0,
    '&:hover': {
      backgroundColor: 'unset',
    },
    [`& .${treeItemClasses.label}`]: {
      paddingLeft: 0,
    },
    [`&.${treeItemClasses.selected}`]: {
      backgroundColor: 'unset !important',
      '&:hover': {
        backgroundColor: 'unset',
      },
      [`& .${treeItemClasses.label} > p, & .${treeItemClasses.iconContainer} i`]: {
        color: theme.palette.primary.main,
      },
    },
  },
}))

const HBHamburgerMenu: FC<HBHamburgerMenuProps> = (props) => {
  const { open, onClose } = props
  const router = useRouter()
  const [image, setImage] = useState<{ url: string | undefined; metadata: any } | undefined>()
  const { data } = useGetWebCatalogCategoriesGetAllCategoriesForCommerceQuery({
    ...ApiConstants,
    pageSize: 1000,
  })

  const parents = data?.data?.items?.filter((_) => !_.parentId) || []

  const finalData = parents?.map((parent) => ({
    ...parent,
    link: '#',
    items: data?.data?.items
      ?.filter((_) => _.parentId === parent.id)
      .map((_) => ({ ..._, link: '#' }))
      .sort((a, b) => a.displaySortTypeCode! - b.displaySortTypeCode!),
    favorites: [],
  })) as FinalDataType[]

  const sortingData = finalData.sort((a, b) => {
    return a.displaySortTypeCode! - b.displaySortTypeCode!
  })

  const handleLink = (item: FinalDataType) => {
    const selector: Record<DisplayExtractTypeCodeEnum, string> = {
      [DisplayExtractTypeCodeEnum.page]: `/category/${item.pageOriginName}/?categoryId=${item.id}`,
      [DisplayExtractTypeCodeEnum.collection]: `/collection/?collectionId=${item.collectionId}`,
      [DisplayExtractTypeCodeEnum.default]: `/collection/?${stringify({
        baseFilter: JSON.stringify({ categories: [item.id] }),
      })}`,
    }

    if (item?.displayExtractTypeCode)
      router.push(selector[item?.displayExtractTypeCode! as unknown as DisplayExtractTypeCodeEnum])
  }

  const handleImage = (item: FinalDataType) => {
    const images = item?.defaultImage?.filter((_) => _ !== null)
    const metadata = item?.imageMetaData?.filter((_) => _ !== null)

    setImage({ url: images?.[0], metadata: metadata?.[0] ? JSON.parse(metadata[0]) : undefined })
  }

  const renderTreeItem = (item: FinalDataType) => (
    <TreeItemStyle
      nodeId={item.name!}
      label={
        <Typography
          width="max-content"
          variant="body2"
          color="text.primary"
          onClick={() => handleLink(item)}
        >
          {item.name}
        </Typography>
      }
      onClick={() => (!item?.items?.length ? undefined : handleImage(item))}
    >
      {item?.items?.map((child: FinalDataType) => renderTreeItem(child))}
    </TreeItemStyle>
  )

  return (
    <Dialog fullScreen open={open}>
      <Box
        display="flex"
        justifyContent="space-between"
        py={3}
        px={{ xs: 4, sm: 6 }}
        onClick={onClose}
        sx={{
          borderBottom: (theme) => `1px solid ${theme.palette.grey[200]}`,
        }}
      >
        <HBIcon type="times" sx={{ color: 'grey.500' }} />
        <Typography variant="subtitle1" color="text.primary" ml={1}>
          <FormattedMessage {...ContainersMessages.menu} />
        </Typography>
        <Box />
      </Box>
      <Stack spacing={4} p={4}>
        <HBLink
          shallow
          href="/seller-landing"
          variant="subtitle2"
          underline="none"
          color="info.main"
        >
          <FormattedMessage {...DefaultHeaderMessges.saleInHit} />
        </HBLink>
        <HBLink
          shallow
          href="/discountDay"
          variant="subtitle2"
          underline="none"
          color="text.primary"
        >
          <FormattedMessage {...DefaultHeaderMessges.dayDiscount} />
        </HBLink>
        <HBLink
          shallow
          href="/best-sellers"
          variant="subtitle2"
          underline="none"
          color="text.primary"
        >
          <FormattedMessage {...DefaultHeaderMessges.mostSale} />
        </HBLink>
        <HBLink variant="subtitle2" underline="none" color="text.primary">
          <FormattedMessage {...DefaultHeaderMessges.help} />
        </HBLink>
        <Divider sx={{ color: 'grey.200' }} />
        <Typography variant="subtitle1" color="text.primary">
          دسته بندی
        </Typography>
        <TreeView
          defaultCollapseIcon={
            <HBIcon type="angleUp" size="small" sx={{ color: 'primary.main' }} />
          }
          defaultExpandIcon={<HBIcon type="angleDown" size="small" sx={{ color: 'grey.500' }} />}
          sx={{
            [`& .${treeItemClasses.group}`]: {
              pl: 6,
              ml: -4,
              backgroundColor: 'grey.100',
              pt: 4.5,
              mb: 4,
              width: (theme) => `calc(100% + ${theme.spacing(8)})`,
            },
          }}
        >
          {sortingData?.map((item: FinalDataType) => renderTreeItem(item))}
        </TreeView>
        {!!image?.url && (
          <Box
            component="img"
            src={process.env.NEXT_PUBLIC_CDN! + image?.url}
            sx={{
              borderRadius: 4,
              objectFit: 'contain',
              objectPosition: 'center',
              maxWidth: '100%',
            }}
            onClick={() => (image?.metadata?.link ? router.push(image?.metadata?.link) : undefined)}
          />
        )}
      </Stack>
    </Dialog>
  )
}

export default HBHamburgerMenu
