import { useScrollDirection } from '@hasty-bazar/core'
import { Box, Divider, Stack, Theme, useMediaQuery } from '@mui/material'
import { ScrollDirection } from 'libs/core/src/hooks/useScrollDirection'
import { FC, ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import ProductionDetailMessages from '../productDetail.messages'
import { useProductDetail } from '../ProductDetailContext'
import { ProductAttributesSection } from './Attributes'
import { Comments } from './Comments'
import { SectionWrapper, TopNavigation } from './components'
import { ProductInfo } from './ProductInfo'
import { useScrollspy } from './useScrollSpy'

export type sectionType = {
  label: string
  component: ReactNode
  id: string
}

const ProductInformation: FC = () => {
  const { formatMessage } = useIntl()
  const { product, activeUniqueProduct } = useProductDetail()
  const scrollDirection = useScrollDirection(0)
  const isFirstRun = useRef<boolean>(true)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [activeTab, setActiveTab] = useState<number>(0)
  const [scrollTrigger, setScrollTrigger] = useState<boolean>(false)
  const breakpointsSmDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const breakpointsMdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const { activeId, changeActiveId } = useScrollspy(
    ['INTRODUCE', 'REVIEW', 'ATTRIBUTES', 'COMMENT'],
    breakpointsMdDown ? 120 : breakpointsSmDown ? 175 : 220,
  )

  const productInfoSections = useMemo(() => {
    let sections: sectionType[] = [
      {
        label: formatMessage(ProductionDetailMessages.commentsSection),
        component: <Comments />,
        id: 'COMMENT',
      },
    ]

    if (activeUniqueProduct?.attributes && !!activeUniqueProduct.attributes.length)
      sections.unshift({
        label: formatMessage(ProductionDetailMessages.attributesSection),
        component: (
          <ProductAttributesSection
            content={activeUniqueProduct.attributes.filter(
              (attr) => attr.name && attr.values?.length,
            )}
          />
        ),
        id: 'ATTRIBUTES',
      })
    if (product?.review && !!product.review.length)
      sections.unshift({
        label: formatMessage(ProductionDetailMessages.reviewSection),
        component: (
          <ProductInfo
            label={formatMessage(ProductionDetailMessages.reviewSectionProduct)}
            content={product.review}
          />
        ),
        id: 'REVIEW',
      })
    if (product?.introduce)
      sections.unshift({
        label: formatMessage(ProductionDetailMessages.intoductionSection),
        component: (
          <ProductInfo
            label={formatMessage(ProductionDetailMessages.intoductionSectionProduct)}
            content={product.introduce}
          />
        ),
        id: 'INTRODUCE',
      })
    return sections
  }, [activeUniqueProduct])

  const handleChangeTab = (_event: React.SyntheticEvent, newValue: number) => {
    changeActiveId(productInfoSections[newValue].id)
  }

  const scrollIntoView = () => {
    if (scrollTrigger && containerRef && containerRef.current) {
      const El = containerRef.current
      window.scrollTo({
        top: El.offsetTop - (scrollDirection === ScrollDirection.up ? 250 : 200),
        behavior: 'smooth',
      })
      setTimeout(() => {
        setScrollTrigger(false)
      }, 500)
    }
    return
  }

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false
      return
    }
    scrollIntoView()
  }, [activeTab])

  useEffect(() => {
    if (activeId) {
      setActiveTab(productInfoSections.findIndex((x) => x.id === activeId))
    }
  }, [activeId])

  useEffect(() => {
    setActiveTab(productInfoSections.findIndex((x) => x.id === 'INTRODUCE'))
  }, [productInfoSections])

  return (
    <Stack spacing={4}>
      <TopNavigation
        value={activeTab}
        handleChangeTab={handleChangeTab}
        sections={productInfoSections}
      />
      <Stack
        divider={
          <Divider
            variant="fullWidth"
            sx={({ spacing }) => ({
              borderColor: 'grey.100',
              borderWidth: spacing(1),
            })}
          />
        }
        spacing={6}
        px={{ xs: 6, md: 0 }}
      >
        {productInfoSections.map((item, index) => {
          return (
            <Box key={index} ref={activeTab === index ? containerRef : null} id={item.id}>
              <SectionWrapper scrollTrigger={scrollTrigger} setActiveTab={setActiveTab} id={index}>
                {item.component}
              </SectionWrapper>
            </Box>
          )
        })}
      </Stack>
    </Stack>
  )
}

export default ProductInformation
