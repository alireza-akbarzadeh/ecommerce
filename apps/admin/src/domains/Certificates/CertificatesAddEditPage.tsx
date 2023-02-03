import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import { HBRecordHistory } from '@hasty-bazar/admin-shared/containers'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import sidebarMessages from '@hasty-bazar-admin/core/translations/sidebar.messages'
import {
  CreateCertificateModel,
  useGetAdminCatalogCertificatesByIdQuery,
  usePostAdminCatalogCertificatesMutation,
  usePutAdminCatalogCertificatesByIdMutation,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { HBClassesType, HBForm, openToast } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import certificatesMessages from './certificates.messages'
import { CertificatesForm } from './containers'
import RequiredDocuments from './containers/required-documents'

export type CertificateAddEditFormType = CreateCertificateModel

type HBPageClassNames = 'mainContainer'
const classes: HBClassesType<HBPageClassNames> = {
  mainContainer: ({ spacing }) => ({
    borderRadius: spacing(1),
  }),
}

const CertificatesAddEditPage = () => {
  const { formatMessage } = useIntl()
  const router = useRouter()
  const certificatesId = router?.query?.id?.[0]
  const action = router?.query?.id?.[0] ? 'edit' : 'add'

  const breadcrumbs = [
    { url: '/', title: formatMessage(sidebarMessages.dashboard) },
    { url: '/certificates', title: formatMessage(sidebarMessages.certificates) },
    {
      url: '#',
      title: certificatesId
        ? formatMessage(phrasesMessages.edit)
        : formatMessage(phrasesMessages.create),
    },
  ]

  const { data: certificate = {} } = useGetAdminCatalogCertificatesByIdQuery(
    {
      'client-name': 'generalData',
      'client-version': '0',
      id: certificatesId!,
    },
    {
      skip: !certificatesId,
    },
  )

  const [createCertificate] = usePostAdminCatalogCertificatesMutation()
  const [editCertificate] = usePutAdminCatalogCertificatesByIdMutation()

  const handleSave = (values: CertificateAddEditFormType) => {
    let body = {
      ...values,
      isRequestImage: values.icon ? true : false,
    } as CertificateAddEditFormType
    if (action === 'add') {
      createCertificate({
        'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
        'client-version': '1.0.1.100',
        createCertificateModel: body,
      }).then((res) => {
        //@ts-ignore
        if (res?.data?.success) {
          openToast({
            message: formatMessage(phrasesMessages.successAdd),
            type: 'success',
          })
          //@ts-ignore
          router.push(`/certificates/edit/${res?.data?.data?.id}/`)
        }
      })
    } else {
      editCertificate({
        'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
        'client-version': '1.0.1.100',
        id: certificatesId!,
        updateCertificateModel: body,
      }).then((res) => {
        //@ts-ignore
        if (res?.data?.success) {
          openToast({
            message: formatMessage(phrasesMessages.successUpdate),
            type: 'success',
          })
        }
      })
    }
  }

  return (
    <>
      <BreadCrumbSection
        title={formatMessage(certificatesMessages.certificatesByProductGroup)}
        breadItems={breadcrumbs}
      />
      <Box sx={classes.mainContainer} p={4} bgcolor="common.white" mb={4}>
        <HBForm onSubmit={handleSave} mode="all">
          <CertificatesForm certificate={certificate} />
        </HBForm>
      </Box>
      {action === 'edit' && (
        <Box sx={classes.mainContainer} p={4} bgcolor="common.white" mb={4}>
          <RequiredDocuments />
        </Box>
      )}
      <HBRecordHistory
        data={certificate?.data}
        isBorder
        isShowAccordion
        disabled={!certificatesId}
      />
    </>
  )
}
export default CertificatesAddEditPage
