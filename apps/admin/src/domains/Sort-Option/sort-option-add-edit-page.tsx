import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { SortType } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import sidebarMessages from '@hasty-bazar-admin/core/translations/sidebar.messages'
import {
  CollectionType,
  usePostAdminGeneralDataCollectionSortOptionsMutation,
  usePutAdminGeneralDataCollectionSortOptionsByIdMutation,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBClassesType, HBForm } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import { FC, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import PageTitleBar from './containers/add-edit-form/page-titlebar'
import SortOptionAddEditForm from './containers/add-edit-form/sort-option-add-edit-form'
import sortOptionMessages from './sort-option.messages'

type HBPageClassNames = 'mainContainer' | 'toolsContainer' | 'pageTitleBar'
const classes: HBClassesType<HBPageClassNames> = {
  mainContainer: {
    width: '100%',
    minHeight: 'calc(100vh - 120px)',
    display: 'flex',
    flexDirection: 'column',
  },
  toolsContainer: {
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    mb: 2,
  },
  pageTitleBar: {
    alignSelf: 'flex-end',
  },
}

export interface ISortOptionsAddEditFormType {
  name: string | null | undefined
  description?: string | null | undefined
}

export type collectionSortOptionListType = Array<
  SortType & { collectionFieldId: string; title?: 'string'; sortType: SortType; id?: string }
>

const SortOptionAddEditPage: FC = () => {
  const { formatMessage } = useIntl()
  const router = useRouter()
  const sortOptionId = router.query.sortOptionId as unknown as string
  const collectionType = router.query.collectionType as unknown as string
  const breadcrumbs = [
    { url: '/', title: formatMessage(sidebarMessages.dashboard) },
    { url: '/sort-option', title: formatMessage(sidebarMessages.sortOption) },
    {
      url: '#',
      title: router.query.sortOptionId
        ? formatMessage(phrasesMessages.edit)
        : formatMessage(phrasesMessages.create),
    },
  ]

  const [collectionSortOptionList, setCollectionSortOptionList] = useState<
    collectionSortOptionListType | []
  >([])
  const destinationGridRef = useRef<HBDataGridClientRef>(null)
  const originGridRef = useRef<HBDataGridClientRef>(null)

  const [createSortOption, { reset: resetCreate }] =
    usePostAdminGeneralDataCollectionSortOptionsMutation()
  const [updateSortOption, { reset: resetUpdate }] =
    usePutAdminGeneralDataCollectionSortOptionsByIdMutation()

  const handleSave = (values: ISortOptionsAddEditFormType) => {
    let destinationItems = []
    for (const node of destinationGridRef.current?.api?.getRenderedNodes() || []) {
      destinationItems.push(node.data)
    }
    const finalDestinationItems = destinationItems.map((item) => {
      return {
        collectionFieldId: item.id ? item.id : item.collectionFieldId,
        sortType: item.sortType,
      }
    })
    const body = {
      ...values,
      statusId: 1,
      collectionType: +collectionType as CollectionType,
      collectionSortOptionList: finalDestinationItems,
    }

    resetCreate()
    resetUpdate()
    if (sortOptionId) {
      updateSortOption({
        'client-name': 'update-sort-option',
        'client-version': '1.0.0',
        id: sortOptionId as string,
        updateCollectionSortOptionModel: body,
      }).then((res: any) => {
        if (res?.data?.success) {
          router.push('/sort-option')
        }
      })
    } else {
      createSortOption({
        'client-name': 'create-sort-option',
        'client-version': '1.0.0',
        createCollectionSortOptionModel: {
          ...body,
        },
      }).then((res: any) => {
        if (res?.data?.success) {
          router.push('/sort-option')
        }
      })
    }
  }

  const handleRefresh = () => {}

  return (
    <Box sx={classes.mainContainer}>
      <HBForm
        onSubmit={handleSave}
        mode="onSubmit"
        sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, height: '100%' }}
      >
        <Box sx={classes.toolsContainer}>
          <Box>
            <BreadCrumbSection
              title={formatMessage(sortOptionMessages.breadcrumbTitle)}
              breadItems={breadcrumbs}
            />
          </Box>
          <Box sx={classes.pageTitleBar}>
            <PageTitleBar handleRefresh={handleRefresh} />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexGrow: 1 }}>
          <SortOptionAddEditForm
            sortOptionId={sortOptionId as string}
            collectionSortOptionList={collectionSortOptionList}
            setCollectionSortOptionList={setCollectionSortOptionList}
            originGridRef={originGridRef}
            destinationGridRef={destinationGridRef}
          />
        </Box>
      </HBForm>
    </Box>
  )
}
export default SortOptionAddEditPage
