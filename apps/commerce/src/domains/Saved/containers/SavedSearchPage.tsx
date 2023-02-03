import { CommerceAccordion, Nothing } from '@hasty-bazar-commerce/components'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import {
  useDeleteWebCatalogSaveSearchDeleteMutation,
  useGetWebCatalogSaveSearchTotalQuery,
} from '@hasty-bazar-commerce/Service-Enhancers/SavedApi.enhances'
import { MonthlyItem } from '@hasty-bazar-commerce/services/catalogApi.generated'
import { HBCheckBox, HBDivider } from '@hasty-bazar/core'
import { FormControl, FormControlLabel, FormGroup, Stack } from '@mui/material'
import { FC, useEffect, useState } from 'react'
import { SavedSearchSkelton } from '../components'
import SavedSearchCard from '../SavedCard/SavedSearchCard'
import SavedActions from './SavedActions'

const SavedSearchPage: FC = () => {
  const [isAllSelected, setIsAllSelected] = useState<boolean>(false)
  const [selectedItems, setSelectedItems] = useState<MonthlyItem[]>([])
  const [deleteItems, { isLoading: deleteItemsIsLoading }] =
    useDeleteWebCatalogSaveSearchDeleteMutation()

  const {
    data: savedData,
    isFetching,
    error,
  } = useGetWebCatalogSaveSearchTotalQuery({
    ...ApiConstants,
  })

  useEffect(() => {
    const flatItems = savedData?.data?.monthlyItems?.flatMap((item) => item?.items ?? [])

    if (flatItems?.every((item) => selectedItems?.includes(item))) {
      setIsAllSelected(true)
    } else {
      setIsAllSelected(false)
    }
  }, [selectedItems, savedData])

  const handleAllSelected = () => {
    if (isAllSelected) {
      setSelectedItems([])
    } else if (savedData?.data?.monthlyItems && savedData?.data?.monthlyItems?.length > 0) {
      const items = savedData?.data?.monthlyItems?.flatMap((item) => item?.items ?? [])
      if (items.length) setSelectedItems(items)
    }
  }

  const handleSelectSingleItem = (item: MonthlyItem) => {
    setSelectedItems((prev) => {
      if (!prev.find((i) => i?.id === item.id)) return [...prev, item]
      else return [...prev.filter((i) => i?.id !== item.id)]
    })
  }

  const handleSelectGroupedItems = (date?: string) => {
    const selectedGroup = savedData?.data?.monthlyItems?.find((item) => item.startDate === date)
    const allSelected = selectedGroup?.items?.every((item) => selectedItems.includes(item))
    const notAllSelected = selectedGroup?.items?.every((item) => !selectedItems.includes(item))

    setSelectedItems((prev) => {
      if (allSelected) {
        return [...prev.filter((item) => !selectedGroup?.items?.includes(item))]
      } else if (notAllSelected && selectedGroup?.items) {
        return [...prev, ...selectedGroup.items]
      } else {
        const notSelectedItems = selectedGroup?.items?.filter((item) => !prev.includes(item)) ?? []
        return [...prev, ...notSelectedItems]
      }
    })
  }

  const removeSavedSearch = async () => {
    try {
      const ids: string[] = selectedItems.map((item) => item?.id ?? '').filter((i) => i)
      await deleteItems({
        ...ApiConstants,
        deleteSaveSearchMultiple: {
          ids,
        },
      })
    } catch {
      return
    } finally {
      setSelectedItems([])
    }
  }

  return (
    <Stack spacing={4}>
      {isFetching && !savedData?.data?.monthlyItems?.length && !error ? (
        Array.from({ length: 4 }).map((_) => {
          return (
            <>
              <SavedSearchSkelton />
              <HBDivider />
            </>
          )
        })
      ) : !isFetching && savedData?.data?.monthlyItems?.length && !error ? (
        <>
          <SavedActions
            isAllSelected={isAllSelected}
            allSelectedCallBack={handleAllSelected}
            removeItemsCallback={removeSavedSearch}
            removeButtonProps={{
              loading: deleteItemsIsLoading,
              disabled: selectedItems.length === 0,
            }}
          />
          {savedData.data.monthlyItems.map((saved, idx) => (
            <FormControl sx={{ m: 3 }} component="fieldset" variant="standard" key={idx}>
              <FormGroup>
                <CommerceAccordion
                  open
                  summaryContentStyle={{
                    width: '100%',
                    flexDirection: 'row-reverse',
                    justifyContent: 'space-between',
                  }}
                  summaryTitle={
                    <FormControlLabel
                      sx={{ width: 'fit-content' }}
                      onClick={(e) => e.stopPropagation()}
                      label={`${saved.monthName} ${saved.year}`}
                      componentsProps={{
                        typography: {
                          variant: 'subtitle1',
                        },
                      }}
                      control={
                        <HBCheckBox
                          checked={saved.items?.every(
                            (i) => i.id === selectedItems?.find((item) => i.id === item?.id)?.id,
                          )}
                          onChange={() => handleSelectGroupedItems(saved.startDate)}
                        />
                      }
                    />
                  }
                >
                  <Stack spacing={2} px={1} mt={-1} divider={<HBDivider />}>
                    {saved?.items?.map((item) => (
                      <FormControlLabel
                        key={item.id}
                        sx={{ m: 'inherit' }}
                        label={<SavedSearchCard {...item} />}
                        control={
                          <HBCheckBox
                            checked={selectedItems.some((i) => i?.id === item.id)}
                            onChange={() => handleSelectSingleItem(item)}
                          />
                        }
                      />
                    ))}
                  </Stack>
                </CommerceAccordion>
              </FormGroup>
            </FormControl>
          ))}
        </>
      ) : !isFetching && (!savedData?.data?.monthlyItems?.length || !!error) ? (
        <Stack pb={15}>
          <Nothing />
        </Stack>
      ) : null}

      {/* {!isFetching && !!savedData && savedData.data?.monthlyItems?.length === 0 && (
        <Stack pb={15}>
          <Nothing />
        </Stack>
      )} */}
    </Stack>
  )
}

export default SavedSearchPage
