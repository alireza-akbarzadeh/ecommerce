import { CardType } from '@hasty-bazar/core'
import { Container } from '@mui/material'
import {
  AdBannersSkeleton,
  CategoriesSkeleton,
  ProductListSkeleton,
  VendorsListSkeleton,
  VendorsSkeleton,
} from './components'
interface InterfaceLoadingPageProps {
  type: CardType
}
function LoadingPage({ type }: InterfaceLoadingPageProps) {
  const Skeletons = {
    BUSINESS_SLIDER_CATEGORY: <VendorsSkeleton />,
    BUSINESS_SLIDER_BRANDS: <CategoriesSkeleton />,
    BUSINESS_SLIDER_DEFAULT: <ProductListSkeleton />,
    BUSINESS_SLIDER_SINGLE: <CategoriesSkeleton />,
    BUSINESS_SLIDER_WITH_SIDEBAR: <ProductListSkeleton />,
    BUSINESS_SLIDER_SELLER: <VendorsListSkeleton />,
    BUSINESS_SLIDER_SIMPLE: <VendorsSkeleton />,
    BUSINESS_SLIDER_BUYERCATEGORY: <></>,
    BUSINESS_SLIDER_MOST: <AdBannersSkeleton />,
    BUSINESS_SLIDER_SUGGESTED_CATEGORIES: <VendorsSkeleton />,
    SEARCH_AND_COLLECTION_RESULT: null,
  }

  return (
    <Container
      sx={{
        backgroundColor: 'grey.100',
        spacing: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      {Skeletons[type]}
    </Container>
  )
}

export default LoadingPage
