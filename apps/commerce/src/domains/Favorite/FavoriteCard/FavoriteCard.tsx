import { HBLink, ImageShow } from '@hasty-bazar-commerce/components'
import {
  GetAllFavoriteProductsQueryResult,
  ProductPriceTiering,
} from '@hasty-bazar-commerce/services/catalogApi.generated'
import { HBCheckBox } from '@hasty-bazar/core'
import { Box, Stack, styled } from '@mui/material'
import { isNil } from 'ramda'
import { FC } from 'react'
import FavoriteCardInformation from './FavoriteCardInformation'
import FavoriteNote from './FavoriteNote'

export const EmptySpace = styled(Box)(({ theme }) => ({}))

interface IFavoriteCardProps {
  item: GetAllFavoriteProductsQueryResult
  price: ProductPriceTiering
  checkedCallBack: (lastSelectedValue: boolean, item: GetAllFavoriteProductsQueryResult) => void
  isSelected: boolean
}

const FavoriteCard: FC<IFavoriteCardProps> = (props) => {
  const { checkedCallBack, item, isSelected, price } = props

  return (
    <Stack direction="row" gap={2} alignItems="flex-start" flexWrap="wrap">
      <HBCheckBox
        sx={(theme) => ({
          [theme.breakpoints.down('md')]: {
            padding: 0,
          },
        })}
        checked={isSelected}
        onChange={() => checkedCallBack(isSelected, item)}
      />
      <EmptySpace />
      <HBLink href={`/product/${item.hsin}/${item.slug}`} target="_blank">
        <ImageShow
          width={160}
          height={160}
          src={item.imageUrl ?? ''}
          objectPosition="center"
          layout="fill"
          type="product"
          objectFit="contain"
        />
      </HBLink>

      <EmptySpace />
      <EmptySpace />
      <Stack spacing={4} sx={(theme) => ({ [theme.breakpoints.down('sm')]: { mt: 6 }, flex: 1 })}>
        <FavoriteCardInformation
          {...item}
          vendorId={item.vendor?.id ?? ''}
          discount={!!Number(item.discount) && !isNil(item.discount) ? item.discount : ''}
          coefficient={item?.orderAndInventorySettingDto?.multiplesOrder ?? 1}
          maximumOrder={item.orderAndInventorySettingDto?.maximalPerOrder ?? null}
          {...price}
          inventory={item.quantity ?? 0}
        />

        <FavoriteNote id={item.id ?? ''} note={item.note ?? ''} />
      </Stack>
    </Stack>
  )
}

export default FavoriteCard
