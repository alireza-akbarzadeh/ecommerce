import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import sidebarMessages from '@hasty-bazar-admin/core/translations/sidebar.messages'
import {
  MenuDirection,
  MenuDisplayType,
  MenuType,
  PlatformType,
  usePostAdminCmsMenugroupsMutation,
  usePutAdminCmsMenugroupsByIdMutation,
} from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import { errorsToString } from '@hasty-bazar/admin-shared/utils'
import { HBClassesType, HBForm, HBToast } from '@hasty-bazar/core'
import Box from '@mui/material/Box'
import { useRouter } from 'next/router'
import { isEmpty } from 'ramda'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { ShowTostType } from '../Attributes/AttributesAddEditPage'
import MegaMenuAddEditForm from './containers/menu-groups/add-edit-form'
import History from './containers/structure/history'
import MegaMenuPageMessages from './MegaMenu.messages'

type HBPageClassNames = 'mainContainer'
const classes: HBClassesType<HBPageClassNames> = {
  mainContainer: {
    width: '100%',
    minHeight: 'calc(100vh - 250px)',
    display: 'flex',
    flexDirection: 'column',
  },
}

export interface IMegaMenuAddEditFormType {
  code?: string | undefined
  title?: string | undefined
  menuType?: MenuType | undefined
  menuDirection?: MenuDirection | undefined
  menuDisplayType?: MenuDisplayType | undefined
  platformType?: PlatformType | undefined
  activeFromDate?: string | undefined
  description?: string | undefined
}

const MegaMenuAddEditPage = () => {
  const { formatMessage } = useIntl()
  const router = useRouter()
  const megaMenuId = router?.query?.id?.[0]

  const breadcrumbs = [
    { url: '/', title: formatMessage(sidebarMessages.dashboard) },
    { url: '/mega-menu', title: formatMessage(sidebarMessages.megaMenu) },
    {
      url: '#',
      title: megaMenuId
        ? formatMessage(phrasesMessages.edit)
        : formatMessage(phrasesMessages.create),
    },
  ]

  const [showTost, setShowToast] = useState<ShowTostType>({ open: false, message: '' })

  const [createMenuGroup, { error: createError, reset: resetCreate }] =
    usePostAdminCmsMenugroupsMutation()
  const [updateMenuGroup, { error: updateError, reset: resetUpdate }] =
    usePutAdminCmsMenugroupsByIdMutation()

  const handleSave = (values: IMegaMenuAddEditFormType) => {
    const body = {
      ...values,
      isActive: true,
      status: 1,
    }
    resetCreate()
    resetUpdate()
    if (megaMenuId) {
      updateMenuGroup({
        'client-name': 'update-rule',
        'client-version': '1.0.0',
        id: megaMenuId,
        updateMenuGroupModel: body,
      }).then((res) => {
        //@ts-ignore
        if (res?.data?.success) {
          router.push('/mega-menu')
        }
      })
    } else {
      createMenuGroup({
        'client-name': 'create-rule',
        'client-version': '1.0.0',
        createMenuGroupModel: body,
      }).then((res) => {
        //@ts-ignore
        if (res?.data?.success) {
          router.push('/mega-menu')
        }
      })
    }
  }

  useEffect(() => {
    if (createError || updateError) {
      if (!isEmpty(createError) || !isEmpty(updateError)) {
        setShowToast({
          open: true,
          message: errorsToString(createError || updateError),
          type: 'error',
        })
      }
    }
  }, [createError, updateError])

  return (
    <>
      <BreadCrumbSection
        title={formatMessage(MegaMenuPageMessages.megaMenu)}
        breadItems={breadcrumbs}
      />
      <Box sx={classes.mainContainer} p={4} bgcolor="common.white">
        <HBForm onSubmit={handleSave} mode="all">
          <MegaMenuAddEditForm megaMenuId={megaMenuId} />
        </HBForm>
      </Box>
      <History hidden />
      <HBToast
        open={showTost.open}
        message={showTost.message}
        type={showTost?.type || 'error'}
        vertical="top"
        autoHideDuration={6000}
        onClose={() => setShowToast({ open: false, message: '', type: showTost?.type })}
      />
    </>
  )
}
export default MegaMenuAddEditPage
