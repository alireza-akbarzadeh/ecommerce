import { Stack } from '@mui/material'
import { useMemo, useState } from 'react'
import { CategoryChart, PriceChart, ProductChart } from '.'
import { MenuItemType } from '../components/ChartGroup'

export default function LeftCharts() {
  const [categories, setCategories] = useState<string[]>([])
  const [products, setProducts] = useState<string[]>([])
  const [limitedTime, setLimitedTime] = useState<number>()
  const [limitedTimeProduct, setLimitedTimeProduct] = useState<number>()

  const categoryChartClick = async (categoryIds: string) => {
    setCategories((prev) => {
      const isFine = prev.find((f) => f == categoryIds)
      return isFine ? prev.filter((f) => f != categoryIds) : [...prev, categoryIds]
    })
  }

  const productChartClick = async (productIds: string) => {
    setProducts((prev) => {
      const isFine = prev.find((f) => f == productIds)
      return isFine ? prev.filter((f) => f != productIds) : [...prev, productIds]
    })
  }

  const handleChangeLimitTime = (menuItem?: MenuItemType) => {
    setLimitedTime(menuItem?.id)
  }

  const handleChangeLimitTimeProduct = (menuItem?: MenuItemType) => {
    setLimitedTimeProduct(menuItem?.id)
  }

  const categoryChartMemo = useMemo(
    () => <CategoryChart onClick={categoryChartClick} onMenuClick={handleChangeLimitTime} />,
    [],
  )
  const productChartMemo = useMemo(
    () => (
      <ProductChart
        categories={categories}
        onClick={productChartClick}
        limitedTime={limitedTime}
        onMenuClick={handleChangeLimitTimeProduct}
      />
    ),
    [categories, limitedTime],
  )

  const priceChartMemo = useMemo(
    () => (
      <PriceChart
        categories={categories}
        products={products}
        limitedTime={limitedTime}
        limitedTimeProduct={limitedTimeProduct}
      />
    ),
    [categories, products, limitedTime, limitedTimeProduct],
  )

  return (
    <Stack spacing={6}>
      {categoryChartMemo}
      {productChartMemo}
      {priceChartMemo}
    </Stack>
  )
}
