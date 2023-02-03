import {
  HBAdsHeader,
  HBDefaultFootter,
  HBDefaultHeader,
  HBMenuFootter,
  MainLayoutToolbar,
} from '@hasty-bazar-commerce/components'
import FixImageWidget from '@hasty-bazar-commerce/components/FixImageWidget'
import HBMegaMenu from '@hasty-bazar-commerce/components/HBMegaMenu'
import RenderInDom from '@hasty-bazar-commerce/components/RenderInDom'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { BasketPage } from '@hasty-bazar-commerce/domains/Basket'
import { BrandsBanner, BrandsInfo } from '@hasty-bazar-commerce/domains/Brands'
import RenderDynamicSection from '@hasty-bazar-commerce/domains/Landing/components/RenderDynamicSection'
import {
  OtherVendors,
  ProductBuySection,
  ProductInformationSection,
} from '@hasty-bazar-commerce/domains/ProductDetail/components'
import { SearchPage } from '@hasty-bazar-commerce/domains/Search'
import { VendorPage } from '@hasty-bazar-commerce/domains/Vendor/VendorPage'
import { VendorSummery } from '@hasty-bazar-commerce/domains/Vendor/VendorSummery/VendorSummery'
import useMutationObserver from '@hasty-bazar-commerce/hooks/useMutationObserver'
import {
  GetPageByContentQueryResultApiResult,
  GetPageQueryResultApiResult,
  PagePartByContentQueryResult,
  SectionByContentQueryResult,
  useGetWebCmsPagesByIdAndPlatformTypeQuery,
  useGetWebCmsPagesPlatformTypeByPlatformTypeNameAndNameQuery,
} from '@hasty-bazar-commerce/services/cmsApi.generated'
import { Box, Grid, Stack, styled, Theme, useMediaQuery } from '@mui/material'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { FC, ReactNode, useEffect, useRef, useState } from 'react'
import DefaultBottomNavigation from './containers/DefaultBottomNavigation'
import DynamicHeader from './containers/DynamicHeader'

enum PagePartsEnum {
  adsHeader = 'Ads_Header',
  profile = 'Profile',
  search = 'Search',
  menu = 'Menu',
  dynamic = 'Dynamic',
  footer = 'Footer',
  footerMenu = 'Footer_Menu',
  productDetail = 'ProductDetail',
  productInformation = 'ProductInformation',
  main = 'Main',
  vitrinVendorHeader = 'Vitrin_Vendor_Header',
  vitrinDynamic = 'Vitrin_Dynamic',
  filter = 'Filter',
  InfoBrand = 'Info_Brand',
  BanersBrand = 'Baners_Brand',
  fixImage = 'Fix_Image',
}

const ContainerWrapperStyle = styled(Stack)(({ theme }) => ({
  maxWidth: theme.breakpoints.values.lg,
  backgroundColor: theme.palette.grey[100],
  width: `100%`,
  [theme.breakpoints.down(1163)]: {
    width: `calc(100% - ${theme.spacing(12)})`,
  },
  [theme.breakpoints.down('sm')]: {
    width: `calc(100% - ${theme.spacing(8)})`,
  },
}))

const BasketContainerWrapperStyle = styled(Stack)(({ theme }) => ({
  maxWidth: theme.breakpoints.values.lg,
  width: '100%',
  backgroundColor: theme.palette.grey[100],
  paddingBottom: theme.spacing(6),
  [theme.breakpoints.only('xs')]: {
    paddingBottom: theme.spacing(4),
  },
}))

const ContainerWrapperProductDetailStyle = styled(Stack)(({ theme }) => ({
  maxWidth: theme.breakpoints.values.lg,
  width: '100%',
  backgroundColor: theme.palette.common.white,
  padding: theme.spacing(4, 6),
  borderRadius: theme.spacing(4),
  [theme.breakpoints.between('sm', 'md')]: {
    width: `calc(100% - ${theme.spacing(12)})`,
    marginBottom: theme.spacing(4),
  },
  [theme.breakpoints.down('sm')]: {
    borderRadius: 0,
  },
}))

export interface DynamicLayoutProps {
  pageName: string
  pagePartContainers?: Partial<Record<PagePartsEnum, FC<any>>>
  children?: ReactNode
}

const DynamicLayout: FC<DynamicLayoutProps> = (props) => {
  let data: GetPageByContentQueryResultApiResult | GetPageQueryResultApiResult | undefined
  const { query } = useRouter()
  const ref = useRef<HTMLDivElement | null>(null)
  const [height, setHeight] = useState('')
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') {
      signIn()
    }
  }, [session])

  const calculateHeight = () => {
    if (ref.current)
      setHeight(`${ref.current.children?.[0]?.getBoundingClientRect()?.height ?? 0}px`)
  }
  useMutationObserver(ref, calculateHeight)
  useEffect(() => {
    calculateHeight()
  }, [ref.current])

  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const { data: otherPageData } = useGetWebCmsPagesPlatformTypeByPlatformTypeNameAndNameQuery(
    {
      ...ApiConstants,
      name: props.pageName,
      platformType: 1021001,
    },
    { skip: !props.pageName },
  )

  const { data: brandPageData } = useGetWebCmsPagesByIdAndPlatformTypeQuery(
    {
      ...ApiConstants,
      id: query.brandPageId?.[0] || '',
      platformType: 1021001,
    },
    { skip: !!props.pageName },
  )

  const sortSectins = (sections: SectionByContentQueryResult[]) => {
    return [...sections].sort((x, y) => {
      let n = x.rowIndex! - y.rowIndex!
      if (n !== 0) {
        return n
      }

      return x.order! - y.order!
    })
  }
  const pagePart = (pagePart: PagePartByContentQueryResult): ReactNode => {
    const pagePartSelector: Record<PagePartsEnum, ReactNode> = {
      Profile: !isSmallScreen && (
        <RenderInDom containerId="mainHeader" key={pagePart.id}>
          <HBDefaultHeader />
        </RenderInDom>
      ),
      Search: (
        <RenderInDom containerId="mainHeader" key={pagePart.id}>
          <MainLayoutToolbar sections={pagePart.sections!} />
        </RenderInDom>
      ),
      Menu: !isSmallScreen && (
        <RenderInDom containerId="mainHeader" key={pagePart.id}>
          <HBMegaMenu />
        </RenderInDom>
      ),
      Fix_Image: <FixImageWidget pageName={props.pageName} key={pagePart.id} />,
      Ads_Header: <HBAdsHeader sections={pagePart?.sections!} key={pagePart.id} />,
      Dynamic: props?.pagePartContainers?.Dynamic?.(
        <RenderDynamicSection sections={sortSectins(pagePart.sections!)} key={pagePart.id} />,
      ) ?? (
        <ContainerWrapperStyle key={pagePart.id}>
          <RenderDynamicSection sections={sortSectins(pagePart.sections!)} />
        </ContainerWrapperStyle>
      ),
      Footer: <HBDefaultFootter key={pagePart.id} />,
      Footer_Menu: <HBMenuFootter key={pagePart.id} />,
      Main: (
        <BasketContainerWrapperStyle key={pagePart.id}>
          <BasketPage />
        </BasketContainerWrapperStyle>
      ),
      ProductDetail: (
        <>
          <ContainerWrapperProductDetailStyle spacing={6} key={pagePart.id}>
            <ProductBuySection
              pageTitle={data?.data?.pageTitle || ''}
              pageDescription={data?.data?.description || ''}
            />
            {!isSmallScreen && <OtherVendors />}
          </ContainerWrapperProductDetailStyle>
          {isSmallScreen && <OtherVendors key={pagePart.id + 'other-vendor'} />}
        </>
      ),
      ProductInformation: (
        <ContainerWrapperProductDetailStyle
          sx={(theme) => ({
            [theme.breakpoints.down('md')]: {
              pt: 0,
              px: 0,
            },
          })}
          key={pagePart.id}
        >
          <ProductInformationSection />
        </ContainerWrapperProductDetailStyle>
      ),
      Vitrin_Vendor_Header: <VendorSummery key={pagePart.id} />,
      Vitrin_Dynamic: <VendorPage sections={pagePart.sections} key={pagePart.id} />,
      Filter: <SearchPage key={pagePart.id} />,
      Info_Brand: (
        <ContainerWrapperStyle key={pagePart.id}>
          <BrandsInfo />
        </ContainerWrapperStyle>
      ),
      Baners_Brand: (
        <ContainerWrapperStyle key={pagePart.id}>
          <BrandsBanner />
        </ContainerWrapperStyle>
      ),
    }

    return pagePartSelector[pagePart.originName as PagePartsEnum]
  }

  data = otherPageData || brandPageData

  return (
    <Grid
      container
      direction="column"
      width="100%"
      alignItems="center"
      sx={{
        marginBottom: isSmallScreen ? height : 0,
      }}
    >
      <DynamicHeader />
      {data?.data?.pageParts &&
        [...data!.data!.pageParts!]
          ?.sort((a, b) => a.displaySortOrder! - b.displaySortOrder!)
          ?.map((p) => pagePart(p))}
      <Box ref={ref}>{isSmallScreen && <DefaultBottomNavigation />}</Box>
    </Grid>
  )
}

export default DynamicLayout
