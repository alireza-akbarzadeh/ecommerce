import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import SignInModal from '@hasty-bazar-commerce/domains/Auth/AuthPage/containers/SignInModal'
import {
  useDeleteWebCatalogCommerceFavoriteProductMutation,
  useGetWebCatalogCommerceFavoriteProductAllQuery,
  usePostWebCatalogCommerceFavoriteProductMutation,
} from '@hasty-bazar-commerce/Service-Enhancers/FavoriteEnhances'
import { HBIcon, HBIconButton } from '@hasty-bazar/core'
import { styled } from '@mui/material'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { FC, useEffect, useState } from 'react'

const ButtonStyle = styled(HBIconButton)(({ theme }) => ({
  border: 'none',
  backgroundColor: 'inherit!important',
  color: `${theme.palette.grey[500]}!important`,
}))

interface AddOrRemoveFavoriteProps {
  productId: string
}

const AddOrRemoveFavorite: FC<AddOrRemoveFavoriteProps> = (props) => {
  const { productId } = props
  const { data, status } = useSession()
  const [openLoginModal, setOpenLoginModal] = useState<boolean>(false)
  const [addedToFavorite, setAddedToFavorite] = useState<boolean>(false)
  const [addToFavoriteMutation] = usePostWebCatalogCommerceFavoriteProductMutation()
  const [removeFromFavoriteMutation] = useDeleteWebCatalogCommerceFavoriteProductMutation()
  const { data: favorites } = useGetWebCatalogCommerceFavoriteProductAllQuery(
    {
      ...ApiConstants,
    },
    { skip: status === 'unauthenticated' },
  )

  const handleAddToFavorite = () => {
    setAddedToFavorite(true)
    addToFavoriteMutation({
      ...ApiConstants,
      createFavoriteProductModel: { productId },
    })
      .unwrap()
      .then((res) => {
        if (!res.success) {
          setAddedToFavorite(false)
        }
      })
      .catch(() => {
        setAddedToFavorite(true)
      })
  }

  const handleRemoveFromFavorite = () => {
    setAddedToFavorite(false)
    removeFromFavoriteMutation({
      ...ApiConstants,
      deleteFavoriteProductModel: { productId },
    })
      .unwrap()
      .then((res) => {
        if (!res.success) {
          setAddedToFavorite(true)
        }
      })
      .catch(() => {
        setAddedToFavorite(true)
      })
  }

  const handleClickHeart = () => {
    if (status === 'unauthenticated') {
      setOpenLoginModal(true)
    } else {
      if (!addedToFavorite) {
        handleAddToFavorite()
      } else {
        handleRemoveFromFavorite()
      }
    }
  }

  useEffect(() => {
    if (favorites?.data) {
      const findProduct = favorites.data.some((i) => i.productId === productId)
      if (findProduct) {
        setAddedToFavorite(true)
      } else {
        setAddedToFavorite(false)
      }
    }
  }, [favorites, productId])

  return (
    <>
      <ButtonStyle
        onClick={() => handleClickHeart()}
        icon={
          !addedToFavorite ? (
            <HBIcon sx={{ color: 'grey.500' }} type="heartSign" />
          ) : (
            <Image src="/assets/svg/FilledHeart.svg" width={24} height={24} />
          )
        }
      />
      <SignInModal
        open={openLoginModal}
        onClose={() => setOpenLoginModal(false)}
        onSuccess={() => handleClickHeart()}
      />
    </>
  )
}

export default AddOrRemoveFavorite
