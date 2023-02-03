import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import { HBRecordHistory } from '@hasty-bazar/admin-shared/containers'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import sidebarMessages from '@hasty-bazar-admin/core/translations/sidebar.messages'
import {
  MeasuringUnitType,
  useGetAdminCatalogApiUnitOfMeasurementByIdQuery,
  usePostAdminCatalogApiUnitOfMeasurementMutation,
  usePutAdminCatalogApiUnitOfMeasurementByIdMutation,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { HBClassesType, HBForm, openToast } from '@hasty-bazar/core'
import { Grid, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import MeasurementUnitForm from './containers/measurement-unit-form'
import { MeasurementUnitPageType } from './measurement-unit'
import measurementUnitMessages from './measurement-unitMessages.messages'

type HBPageClassNames = 'mainContainer'
const classes: HBClassesType<HBPageClassNames> = {
  mainContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
}

const MeasurementUnitAddEditPage: FC = () => {
  const { formatMessage } = useIntl()
  const router = useRouter()
  const id = router?.query?.id?.[0]
  const action = router?.query?.id?.[0] ? 'edit' : 'add'

  const { data: measurementUnit = {}, refetch: getMeasurementUnit } =
    useGetAdminCatalogApiUnitOfMeasurementByIdQuery(
      {
        'client-name': 'generalData',
        'client-version': '0',
        id: id!,
      },
      {
        skip: !id,
      },
    )

  const formProviderProps = useForm<MeasurementUnitPageType>({ mode: 'all' })

  const breadcrumbs = [
    { url: '/', title: formatMessage(sidebarMessages.dashboard) },
    { url: '/measurement-unit', title: formatMessage(sidebarMessages.measurementUnit) },
    {
      url: '#',
      title: id ? formatMessage(phrasesMessages.edit) : formatMessage(phrasesMessages.create),
    },
  ]

  const [createMeasurementUnit] = usePostAdminCatalogApiUnitOfMeasurementMutation()
  const [editMeasurementUnit] = usePutAdminCatalogApiUnitOfMeasurementByIdMutation()

  const handleSave = (values: MeasurementUnitPageType) => {
    let body = {
      ...values,
      measuringUnitType: +values?.measuringUnitType?.value as MeasuringUnitType,
      displaySort: values.displaySort || null,
    }
    if (action === 'add') {
      createMeasurementUnit({
        'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
        'client-version': '1.0.1.100',
        createUnitOfMeasurementModel: body,
      })
        .unwrap()
        .then((res) => {
          if (res?.success) {
            openToast({
              message: formatMessage(phrasesMessages.successAdd),
              type: 'success',
            })
            router.push(`/measurement-unit`)
          }
        })
    } else {
      editMeasurementUnit({
        'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
        'client-version': '1.0.1.100',
        id: id!,
        updateUnitOfMeasurementModel: body,
      })
        .unwrap()
        .then((res) => {
          if (res?.success) {
            openToast({
              message: formatMessage(phrasesMessages.successUpdate),
              type: 'success',
            })
            router.push(`/measurement-unit`)
          }
        })
    }
  }

  return (
    <>
      <BreadCrumbSection
        title={formatMessage(measurementUnitMessages.breadcrumbTitle)}
        breadItems={breadcrumbs}
      />
      <Box sx={classes.mainContainer} p={4} bgcolor="common.white" gap={4}>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h4">{formatMessage(measurementUnitMessages.formTitle)}</Typography>
        </Grid>
        <HBForm onSubmit={handleSave} mode="all" formProviderProps={formProviderProps}>
          <MeasurementUnitForm
            measurementUnit={measurementUnit}
            getMeasurementUnit={getMeasurementUnit}
          />
        </HBForm>
      </Box>
      <HBRecordHistory data={measurementUnit?.data} isBorder isShowAccordion disabled={!id} />
    </>
  )
}
export default MeasurementUnitAddEditPage
