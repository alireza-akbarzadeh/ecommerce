import { Nothing } from '@hasty-bazar-commerce/components'
import { HBInfiniteScroll } from '@hasty-bazar-commerce/components/HBInfiniteScroll'
import ResponsiveBackHeader from '@hasty-bazar-commerce/components/ResponsiveBackHeader/ResponsiveBackHeader'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import {
  catalogApi,
  GetAllFavoriteProductsQueryResult,
} from '@hasty-bazar-commerce/services/catalogApi.generated'
import { HBDivider } from '@hasty-bazar/core'
import { Stack, styled, Theme, Typography, useMediaQuery } from '@mui/material'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { isNil } from 'ramda'
import { FC, useCallback, useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import FavoriteMessages from './favorite.messages'
import FavoriteActions from './FavoriteActions'
import { FavoriteSkelton } from './FavoriteCard'
import FavoriteCard from './FavoriteCard/FavoriteCard'

const FavoriteWrapper = styled(Stack)(({ theme }) => ({
  maxWidth: theme.breakpoints.values.lg,
  padding: theme.spacing(6),
  backgroundColor: theme.palette.common.white,
  height: '100%',
  marginBottom: `${theme.spacing(6)}!important`,
  [theme.breakpoints.down('md')]: {
    padding: 0,
  },
}))

const pageSize = 20

const FavoritePage: FC = () => {
  const router = useRouter()
  const [selecteds, setSelecteds] = useState<GetAllFavoriteProductsQueryResult[]>([])
  const [isAllSelected, setIsAllSelected] = useState<boolean>(false)
  const session = useSession()
  const [getFavoriteQuery, { isFetching, data, error }] =
    catalogApi.useLazyGetWebCatalogCommerceFavoriteProductQuery()
  const [favorites, setFavorites] = useState<GetAllFavoriteProductsQueryResult[]>([])
  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const isMobileScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  const [firstTime, setfirstTime] = useState<boolean | null>(null)

  const geFunction = useCallback(
    async (pageNumber: number, favoritesState: GetAllFavoriteProductsQueryResult[]) => {
      try {
        if (pageNumber === 1) {
          reset()
        } else {
          setfirstTime(false)
        }
        const favoritesRes = await getFavoriteQuery({
          ...ApiConstants,
          pageSize,
          pageNumber,
        })
        if (!favoritesRes.data?.data) {
          setfirstTime(true)
          return
        }

        if (pageNumber === 1) {
          setfirstTime(true)
        }

        if (pageNumber === 1) {
          setFavorites([...favoritesRes.data!.data])
        } else {
          setFavorites([...favoritesState, ...favoritesRes.data!.data])
        }
      } catch (error) {
        setfirstTime(true)
      }
    },
    [],
  )

  useEffect(() => {
    if (!session.data?.user.partyId) return
    geFunction(1, [])
  }, [session.data?.user.partyId, geFunction])

  const handleAddToSelecteds = (
    lastSelectedValue: boolean,
    item: GetAllFavoriteProductsQueryResult,
  ) => {
    if (!lastSelectedValue) {
      setSelecteds([...selecteds, item])
    } else {
      setSelecteds([...selecteds.filter((i) => i.id !== item.id)])
    }
  }

  useEffect(() => {
    if (selecteds.length === favorites.length && favorites.length !== 0) {
      setIsAllSelected(true)
    } else {
      setIsAllSelected(false)
    }
  }, [selecteds, data, setIsAllSelected, favorites])

  const handleAllSelected = () => {
    if (isAllSelected) {
      setSelecteds([])
    } else if (favorites) {
      setSelecteds([...favorites])
    }
  }

  const reset = () => {
    setfirstTime(null)
    setFavorites([])
  }

  const handleRefetch = () => {
    setSelecteds([])
    geFunction(1, [])
  }

  return (
    <Stack
      spacing={!isMobileScreen ? 6 : 1}
      sx={{ maxWidth: (theme) => theme.breakpoints.values.lg, width: '100%' }}
    >
      {isSmallScreen && router.pathname === '/favorite' && <ResponsiveBackHeader />}
      <FavoriteWrapper spacing={6}>
        {!!favorites.length && (
          <>
            <Typography variant="h4">
              <FormattedMessage
                {...FavoriteMessages.favoritesWithCount}
                values={{
                  count: `${(favorites[0] && favorites?.[0].totalCount) ?? ''}`,
                }}
              />
            </Typography>
            <FavoriteActions
              loading={isNil(firstTime)}
              selecteds={selecteds}
              isAllSelected={isAllSelected}
              allSelectedCallBack={handleAllSelected}
              needToRefetch={handleRefetch}
              deSelectCallBack={() => setSelecteds([])}
            />
            <HBDivider />
          </>
        )}

        <Stack spacing={6}>
          {favorites.length > 0 && (
            <HBInfiniteScroll
              allCount={(favorites[0] && favorites?.[0].totalCount) ?? 0}
              refetchCallback={(pageNumber: number) => geFunction(pageNumber, favorites)}
            >
              {favorites?.map((item) => {
                return (
                  <>
                    <FavoriteCard
                      price={{
                        exactPrice: item.orginalPrice,
                        originalPrice: item.orginalPrice,
                        priceBeforeTiering: item.finalPrice,
                        currency: item.currency,
                      }}
                      isSelected={selecteds.some((i) => i.id === item.id)}
                      key={item.id}
                      item={item}
                      checkedCallBack={handleAddToSelecteds}
                    />
                    <HBDivider />
                  </>
                )
              })}
            </HBInfiniteScroll>
          )}
          {favorites.length === 0 && firstTime && <Nothing sx={{ mt: 10, mb: 20 }} />}

          {isNil(firstTime) &&
            [1, 1, 1].map((_, index) => {
              return <FavoriteSkelton key={`favorite-skelton-${index}`} />
            })}
        </Stack>
      </FavoriteWrapper>
    </Stack>
  )
}

export default FavoritePage
