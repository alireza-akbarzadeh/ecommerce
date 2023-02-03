import { Nothing } from '@hasty-bazar-commerce/components'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import {
  catalogApi,
  GetAllSavedVendorsQueryResult,
  useDeleteWebCatalogCommerceSavedVendorVendorsMutation,
} from '@hasty-bazar-commerce/services/catalogApi.generated'
import { Divider, Stack } from '@mui/material'
import { useSession } from 'next-auth/react'
import { FC, useEffect, useState } from 'react'
import { SavedVendorSkelton } from '../components'
import VendorCard from '../SavedCard/VendorCard'
import SavedActions from './SavedActions'

const SavedVendorsPage: FC = () => {
  const [selectedItems, setSelectedItems] = useState<GetAllSavedVendorsQueryResult[]>([])
  const [isAllSelected, setIsAllSelected] = useState<boolean>(false)
  const session = useSession()

  const [getSavedQuery, { isFetching, data, error }] =
    catalogApi.useLazyGetWebCatalogCommerceSavedVendorQuery()
  const [vendors, setVendors] = useState<GetAllSavedVendorsQueryResult[] | null>(null)

  const [removeMutations, { isLoading: removingLoading }] =
    useDeleteWebCatalogCommerceSavedVendorVendorsMutation()

  useEffect(() => {
    if (!session.data?.user.partyId) return
    geFunction()
  }, [session.data?.user.partyId])

  const geFunction = async (newPageNumber?: number) => {
    try {
      const payload = await getSavedQuery({
        ...ApiConstants,
        partyId: session.data?.user.partyId,
      }).unwrap()
      if (newPageNumber) {
        setVendors([...(payload.data ?? [])])
      } else {
        setVendors([...(vendors ?? []), ...(payload.data ?? [])])
      }
    } catch {
      return
    }
  }

  const handleAddToSelectedItems = (
    lastSelectedValue: boolean,
    item: GetAllSavedVendorsQueryResult,
  ) => {
    if (!lastSelectedValue) {
      setSelectedItems([...selectedItems, item])
    } else {
      setSelectedItems([...selectedItems.filter((i) => i.id !== item.id)])
    }
  }

  useEffect(() => {
    if (selectedItems.length === data?.data?.length && !!selectedItems.length) {
      setIsAllSelected(true)
    } else {
      setIsAllSelected(false)
    }
  }, [selectedItems, data])

  const handleAllSelected = () => {
    if (isAllSelected) {
      setSelectedItems([])
    } else if (data?.data) {
      setSelectedItems([...data.data])
    }
  }

  const handleRefetch = () => {
    removeFromUi()
    setSelectedItems([])
  }

  const removeFromUi = () => {
    const selectedIds = selectedItems.map((i) => i.id)
    setVendors([...(vendors?.filter((i) => !selectedIds.includes(i.id)) ?? [])])
  }

  const remove = async () => {
    try {
      await removeMutations({
        ...ApiConstants,
        body: selectedItems.map((i) => {
          return i.id!
        }),
      })
      handleRefetch()
    } catch {
      return
    }
  }

  return (
    <Stack spacing={6}>
      {!!vendors && vendors.length !== 0 && (
        <>
          <SavedActions
            isAllSelected={isAllSelected}
            allSelectedCallBack={handleAllSelected}
            removeItemsCallback={remove}
            removeButtonProps={{
              loading: removingLoading,
              disabled: selectedItems.length === 0,
            }}
          />
          <Divider sx={{ borderColor: 'grey.200' }} />
        </>
      )}
      {vendors?.map((item, index) => {
        return (
          <Stack spacing={6} key={index}>
            <VendorCard
              isSelected={selectedItems.some((i) => i.id === item.id)}
              key={item.id}
              item={item}
              checkedCallBack={handleAddToSelectedItems}
            />
            <Divider sx={{ borderColor: 'grey.200' }} />
          </Stack>
        )
      })}

      {(isFetching || !vendors) && !error ? (
        [1, 1, 1, 1].map((_, index) => {
          return <SavedVendorSkelton key={index} />
        })
      ) : !isFetching && (!vendors?.length || !!error) ? (
        <Stack pb={15}>
          <Nothing />
        </Stack>
      ) : null}
    </Stack>
  )
}

export default SavedVendorsPage
