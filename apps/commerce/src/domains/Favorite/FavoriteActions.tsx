import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import useClientSession from '@hasty-bazar-commerce/core/hook/useClientSession'
import useGetMinimal from '@hasty-bazar-commerce/core/hook/useGetMinimal'
import { usePostWebSaleBasketByClientSessionIdItemsProductsMutation } from '@hasty-bazar-commerce/Service-Enhancers/BasketApi.enhanced'
import {
  GetAllFavoriteProductsQueryResult,
  useDeleteWebCatalogCommerceFavoriteProductProdutsMutation,
} from '@hasty-bazar-commerce/services/catalogApi.generated'
import { HBButton, HBCheckBox, HBDialog, HBIcon } from '@hasty-bazar/core'
import {
  buttonClasses,
  Skeleton,
  Stack,
  styled,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { FC, useMemo, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import FavoriteMessages from './favorite.messages'

interface IFavoriteActions {
  isAllSelected: boolean
  allSelectedCallBack: () => void
  selecteds: GetAllFavoriteProductsQueryResult[]
  needToRefetch: () => void
  loading: boolean
  deSelectCallBack: () => void
}

const CheckBoxWrapperStyle = styled(Stack)(({ theme }) => ({
  [theme.breakpoints.down(500)]: {
    width: '100%',
  },
}))

const ButtonStyle = styled(HBButton)(({ theme }) => ({
  gap: theme.spacing(1.5),
  minWidth: 'unset',
  [`&.${buttonClasses.disabled}`]: {
    bgcolor: `${theme.palette.primary.main}!important`,
    opacity: 0.3,
  },
  [theme.breakpoints.down('sm')]: {
    paddingRight: theme.spacing(1.5),
    paddingLeft: theme.spacing(1.5),
  },
  [theme.breakpoints.down(500)]: {
    width: 'calc(50% - 8px)',
  },
}))

const FavoriteActions: FC<IFavoriteActions> = (props) => {
  const {
    isAllSelected,
    allSelectedCallBack,
    selecteds,
    needToRefetch,
    loading,
    deSelectCallBack,
  } = props
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false)
  const [removeMutations, { isLoading: removingLoading }] =
    useDeleteWebCatalogCommerceFavoriteProductProdutsMutation()
  const [addToBasketMutation, { isLoading: addingToBasketLoading }] =
    usePostWebSaleBasketByClientSessionIdItemsProductsMutation()
  const { formatMessage } = useIntl()
  const clientSessionId = useClientSession()
  const { data: minimalBasket } = useGetMinimal()
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  const remove = async () => {
    try {
      const res = await removeMutations({
        ...ApiConstants,
        body: selecteds.map((i) => {
          return i.id!
        }),
      })
      needToRefetch()
    } catch (error) {}
  }

  const addToBasket = async () => {
    try {
      await addToBasketMutation({
        ...ApiConstants,
        clientSessionId: clientSessionId!,
        addItemsToBasketModel: {
          addItemsToShoppingCartDtos: selecteds.map((i) => {
            return { productId: i.productId, vendorId: i.vendor?.id }
          }),
        },
      })
      deSelectCallBack()
    } catch (error) {}
  }

  const needToShowNotification = useMemo(() => {
    let disabled = false
    for (const selected of selecteds) {
      if (!selected?.quantity) {
        disabled = true
        break
      }
      const productInBasket = minimalBasket?.vendors
        ?.find((i) => i.vendorId === selected.vendor?.id)
        ?.items?.find((i) => i.productId === selected.productId)
      if (productInBasket?.shoppingCartQuantity === selected.availableCount) {
        disabled = true
        break
      }
    }
    return disabled
  }, [selecteds, minimalBasket])

  return (
    <Stack direction="row" alignItems="center" gap={4} flexWrap="wrap">
      {!loading && (
        <>
          <CheckBoxWrapperStyle alignItems="flex-start">
            <HBCheckBox
              sx={(theme) => ({
                [theme.breakpoints.down('md')]: {
                  padding: 0,
                },
              })}
              checked={isAllSelected}
              onChange={() => allSelectedCallBack()}
            />
          </CheckBoxWrapperStyle>
          <ButtonStyle
            color="primary"
            disabled={!selecteds.length}
            onClick={() => addToBasket()}
            loading={addingToBasketLoading}
          >
            <Typography sx={{ color: 'common.white' }} variant={!isSmall ? 'button' : 'caption'}>
              <FormattedMessage {...FavoriteMessages.addToBasket} />
            </Typography>
            <HBIcon
              sx={{ color: 'common.white' }}
              type="shoppingBasket"
              {...(isSmall && { size: 'small' })}
            />
          </ButtonStyle>
          <ButtonStyle
            loading={removingLoading}
            disabled={selecteds.length === 0}
            variant="outlined"
            sx={{
              [`&.${buttonClasses.disabled}`]: {
                bgcolor: (theme) => `${theme.palette.grey[300]}!important`,
                opacity: 0.3,
              },
            }}
            onClick={() => setOpenConfirmDialog(true)}
          >
            <Typography sx={{ color: 'grey.700' }} variant={!isSmall ? 'button' : 'caption'}>
              <FormattedMessage {...FavoriteMessages.removeSelcteds} />
            </Typography>
            <HBIcon
              sx={{ color: 'grey.700' }}
              type="trashAlt"
              {...(isSmall && { size: 'small' })}
            />
          </ButtonStyle>

          <HBDialog
            maxWidth="xs"
            fullWidth
            open={openConfirmDialog}
            onReject={() => setOpenConfirmDialog(false)}
            onClose={() => setOpenConfirmDialog(false)}
            hideCloseButton
            title={formatMessage({ ...FavoriteMessages.removeConfirmMessage })}
            rejectBtn={formatMessage({ ...FavoriteMessages.cancel })}
            acceptBtn={formatMessage({ ...FavoriteMessages.remove })}
            onAccept={() => {
              remove()
              setOpenConfirmDialog(false)
            }}
          />
        </>
      )}

      {loading && (
        <>
          <Skeleton sx={{ borderRadius: 1 }} variant="rectangular" width={24} height={24} />
          <Skeleton sx={{ borderRadius: 6 }} variant="rectangular" width={168} height={40} />
          <Skeleton sx={{ borderRadius: 6 }} variant="rectangular" width={168} height={40} />
        </>
      )}
    </Stack>
  )
}

export default FavoriteActions
