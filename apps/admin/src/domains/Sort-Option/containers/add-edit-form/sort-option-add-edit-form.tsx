import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import { BusinessTypeEnums, SortType } from '@hasty-bazar/admin-shared/core/enums'
import validationsMessages from '@hasty-bazar-admin/core/translations/validations.messages'
import {
  CollectionType,
  GetCollectionFieldsQueryResult,
  useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery,
  useGetAdminGeneralDataCollectionCollectionFieldsQuery,
  useGetAdminGeneralDataCollectionSortOptionsByIdQuery,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBClassesType, HBIcon } from '@hasty-bazar/core'
import { Box, Grid, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { Dispatch, RefObject, SetStateAction, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { collectionSortOptionListType } from '../../sort-option-add-edit-page'
import sortOptionMessages from '../../sort-option.messages'
import OutputQueryList from './output-query-list'
import SortOptionGrids from './sort-option-grids'
import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid/HBDataGridClient'

type SortOptionAddEditFormProps = {
  sortOptionId?: string
  collectionSortOptionList: collectionSortOptionListType
  setCollectionSortOptionList: Dispatch<SetStateAction<collectionSortOptionListType>>
  destinationGridRef: RefObject<HBDataGridClientRef>
  originGridRef: RefObject<HBDataGridClientRef>
}

type HBPageClassnames = 'columnBox'
const classes: HBClassesType<HBPageClassnames> = {
  columnBox: ({ palette, spacing }) => ({
    background: palette.common.white,
    height: '100%',
    borderRadius: spacing(2),
    padding: spacing(4),
  }),
}

const SortOptionAddEditForm = ({
  sortOptionId,
  collectionSortOptionList,
  setCollectionSortOptionList,
  originGridRef,
  destinationGridRef,
}: SortOptionAddEditFormProps) => {
  const { formatMessage } = useIntl()
  const { setValue } = useFormContext()
  const router = useRouter()
  const [originList, setOriginList] = useState<GetCollectionFieldsQueryResult[] | undefined>([])

  const collectionType = router.query.collectionType as unknown as string

  const { data: outputQueryData } =
    useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery({
      'client-name': 'generalData',
      'client-version': '0',
      businessType: BusinessTypeEnums.CollectionType,
    })

  const { data: originDataGrid, isSuccess } = useGetAdminGeneralDataCollectionCollectionFieldsQuery(
    {
      'client-name': 'test',
      'client-version': '0',
      collectionType: collectionType as unknown as CollectionType,
    },
    {
      skip: !collectionType,
    },
  )

  const { data: destinationDataGrid } = useGetAdminGeneralDataCollectionSortOptionsByIdQuery(
    {
      'client-name': 'test',
      'client-version': '0',
      id: sortOptionId || '',
    },
    {
      skip: !sortOptionId,
    },
  )

  useEffect(() => {
    setValue('name', destinationDataGrid?.data?.name)
    //@ts-ignore
    setValue('description', destinationDataGrid?.data?.description)
    if (
      originDataGrid?.data?.items?.length &&
      destinationDataGrid?.data?.collectionType === +collectionType
    ) {
      setCollectionSortOptionList(
        //@ts-ignore
        destinationDataGrid?.data?.collectionSortOptionList?.map((item) => ({
          ...item,
          title: originDataGrid?.data?.items?.find((x) => x.id === item.collectionFieldId)?.title,
          sortType: item.sortType || SortType.ascending,
          id: item.collectionFieldId,
        })) || [],
      )
    } else {
      setCollectionSortOptionList([])
    }
  }, [destinationDataGrid, originDataGrid])

  useEffect(() => {
    if (isSuccess) {
      const orgList = originDataGrid?.data?.items
      const destinationListIds = collectionSortOptionList?.map(
        (item: any) => item.collectionFieldId,
      )
      const d = orgList?.filter((item: any) =>
        destinationListIds?.length ? !destinationListIds?.includes(item.id) : orgList,
      )
      setOriginList(
        d?.map((i) => ({
          ...i,
          //@ts-ignore
          collectionTypeTitle: outputQueryData?.data?.items?.find((i) => i?.id === collectionType)
            .title,
        })),
      )
    }
  }, [isSuccess, collectionSortOptionList, originDataGrid])

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} sm={3}>
        <Box sx={classes.columnBox}>
          <OutputQueryList outputQueryData={outputQueryData} />
        </Box>
      </Grid>
      <Grid item xs={12} sm={9}>
        <Box sx={classes.columnBox}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <HBIcon type="setting" />
            <Typography variant={'h6'}>{formatMessage(sortOptionMessages.addEditTitle)}</Typography>
          </Box>
          <Grid container spacing={4} mt={4}>
            <Grid item xs={12} md={6}>
              <HBTextFieldController
                id="input-sort-option-name"
                label={`${formatMessage(sortOptionMessages.title)}`}
                fullWidth
                name={'name'}
                inputProps={{ maxLength: 150 }}
                formRules={{
                  validate: (value) =>
                    !!value.trim() ||
                    `${formatMessage(validationsMessages.isRequired, {
                      msg: '',
                    })}`,
                  required: {
                    value: true,
                    message: `${formatMessage(validationsMessages.isRequired, {
                      msg: formatMessage(sortOptionMessages.title),
                    })}`,
                  },
                }}
                autoComplete={'off'}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <HBTextFieldController
                id="input-sort-option-description"
                label={`${formatMessage(sortOptionMessages.description)}`}
                fullWidth
                name={'description'}
                autoComplete={'off'}
                formRules={{
                  required: false,
                }}
              />
            </Grid>
          </Grid>
          <SortOptionGrids
            collectionSortOptionList={collectionSortOptionList}
            originGridRef={originGridRef}
            destinationGridRef={destinationGridRef}
            originList={originList}
            setCollectionSortOptionList={setCollectionSortOptionList}
          />
        </Box>
      </Grid>
    </Grid>
  )
}
export default SortOptionAddEditForm
