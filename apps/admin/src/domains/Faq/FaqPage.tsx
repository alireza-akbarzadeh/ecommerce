import BreadCrumbSection from '@hasty-bazar/admin-shared/components/BreadCrumb/BreadCrumbSection'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  ApiResult,
  useDeleteAdminCatalogFaqsCategoryByIdMutation,
  useGetAdminCatalogFaqsCategoriesQuery,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { HBDialog, HBIcon, openToast } from '@hasty-bazar/core'
import { Box, Grid, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import FaqQuestionCategoryList from './components/FaqQuestionCategoryList'
import FaqCategoryToolbar from './containers/FaqCategoryForm'
import FaqGrid from './containers/FAQGrid'
import FAQAddEditPage from './FAQAddEditPage'
import FaqPageMessages from './FaqPage.messages'

function FaqPage() {
  const [deleteDialogState, setDeleteDialogState] = useState<{ show: boolean; id?: string }>({
    show: false,
  })
  const { formatMessage } = useIntl()
  const router = useRouter()
  const action = router.query.action
  const questionCategoryId = router.query.questionCategoryId

  const breadcrumbs = [
    {
      url: '/',
      title: formatMessage(FaqPageMessages.dashboard),
    },
    {
      url: '/faq/show',
      title: formatMessage(FaqPageMessages.faqTitle),
    },
  ]
  if (action !== 'show') {
    breadcrumbs.push({
      url: '#',
      title:
        action === 'edit'
          ? formatMessage(FaqPageMessages.edit)
          : formatMessage(FaqPageMessages.addNewFAQ),
    })
  }

  const { data: { data: { items: faqsCategoryData = [] } = {} } = {}, refetch } =
    useGetAdminCatalogFaqsCategoriesQuery({
      'client-name': '',
      'client-version': '',
    })
  const faqsCategorySortedData = useMemo(() => {
    //@ts-ignore
    return [...faqsCategoryData]?.sort((a, b) => {
      return a?.sortOrderIndex - b?.sortOrderIndex
    })
  }, [faqsCategoryData])

  const MenuListMemo = useCallback(() => {
    return <FaqQuestionCategoryList data={faqsCategorySortedData} />
  }, [faqsCategoryData])

  const GridMemo = useCallback(() => <FaqGrid />, [router?.query?.questionCategoryId])

  const [deleteFaqCategory] = useDeleteAdminCatalogFaqsCategoryByIdMutation()

  const handleDeleteFaqCategory = async () => {
    deleteFaqCategory({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      id: deleteDialogState?.id!,
    }).then((res: { data: ApiResult }) => {
      if (res?.data?.success) {
        openToast({ message: formatMessage(phrasesMessages.successDelete), type: 'success' })
        setDeleteDialogState({ show: false, id: undefined })
        refetch()
      }
    })
  }

  return (
    <>
      <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
        <BreadCrumbSection
          title={formatMessage(FaqPageMessages.faqTitle)}
          breadItems={breadcrumbs}
        />
        <FaqCategoryToolbar
          id={(questionCategoryId as string) ?? ''}
          refetch={refetch}
          setDeleteDialogState={setDeleteDialogState}
        />
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <MenuListMemo />
        </Grid>
        <Grid item xs={9} container spacing={2}>
          {action === 'show' && (
            <Grid item xs={12}>
              <Box
                bgcolor="common.white"
                p={2}
                border="unset"
                borderRadius={({ spacing }) => spacing(4)}
                height={`calc(100vh - 200px)`}
              >
                <Typography variant="h4" display={'flex'} gap={2} sx={{ pt: 6, pl: 5 }}>
                  <HBIcon type="shieldQuestion" />
                  {formatMessage(FaqPageMessages.faqListTitle)}
                </Typography>
                <GridMemo />
              </Box>
            </Grid>
          )}
          {(action === 'edit' || action === 'create') && (
            <Grid item xs={12}>
              <FAQAddEditPage />
            </Grid>
          )}
        </Grid>
      </Grid>
      <HBDialog
        content={formatMessage(FaqPageMessages.confirmDeleteCategory)}
        title={formatMessage(FaqPageMessages.deleteFaqCategory)}
        onAccept={handleDeleteFaqCategory}
        onReject={() => setDeleteDialogState({ show: false, id: undefined })}
        open={deleteDialogState.show}
        onClose={() => setDeleteDialogState({ show: false, id: undefined })}
        acceptBtn={formatMessage(phrasesMessages.delete)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
    </>
  )
}

export default FaqPage
