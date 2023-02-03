import HBSelectController from '@hasty-bazar/admin-shared/containers/HBSelectController'
import { BusinessTypeEnums } from '@hasty-bazar/admin-shared/core/enums'
import validationsMessages from '@hasty-bazar-admin/core/translations/validations.messages'
import { useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { checkPositiveNumber } from '@hasty-bazar/admin-shared/utils/checkPositiveNumber'
import { HBFormItemTextField, HBIcon, HBToolTip } from '@hasty-bazar/core'
import { Avatar, Grid, IconButton, SelectChangeEvent, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useIntl } from 'react-intl'
import GeographicalMessages from '../Geographical.messages'
import { useGetAdminLocalityGeosQuery } from '../localityApi.enhanced'
import { GeoForm } from './PageTitleBar'
import instance from '@hasty-bazar/admin-shared/core/handler'

export default function GeoInformationFormSection() {
  const { formatMessage } = useIntl()
  const { control, reset, setValue } = useFormContext<GeoForm>()
  const router = useRouter()
  const action = router.query.action as string
  const [disabled, setDisabled] = useState(action === 'show')
  const id = router.query?.id as unknown as string
  const formData = useWatch({
    control,
  })
  useEffect(() => {
    if (action === 'show') {
      setDisabled(true)
    } else {
      setDisabled(false)
    }
  }, [action])
  const { iconUrl, geoTypeValueName, geoTypeValueCode } = formData || {}
  const res = formData || {}

  const handleChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    change: (url: string) => void,
  ) => {
    const file = event.target.files
    if (file) {
      try {
        const formData = new FormData()
        formData.append('file', file[0])
        const res: any = await instance.post(
          `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/CMS/Files`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'client-name': 'Swagger on HIT.Hastim.FileServer.Endpoints.WebApi',
              'client-version': '1.0.1.100',
              Accept: '*/*',
            },
          },
        )
        if (res?.data?.success) {
          change(res?.data?.data?.path as string)
        }
      } catch (error) {
        return ''
      }
    }
  }
  const {
    data: { data: { items: geoItems = [] } = {} } = {},
    isSuccess,
    isFetching,
  } = useGetAdminLocalityGeosQuery(
    {
      'client-name': 'GetLocalityGeosQuery',
      'client-version': '1',
      pageNumber: 0,
      pageSize: 10000,
    },
    { skip: !id },
  )

  const { data: { data: { items = [] } = {} } = {} } =
    useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery({
      'client-name': 'generalData',
      'client-version': '0',
      businessType: BusinessTypeEnums.GeometricDivisionType,
    })
  const handleChangeGeoType = (event: SelectChangeEvent<unknown>) => {
    const title = items?.find((item) => item.code == event.target.value)?.title!
    setValue('geoTypeValueCode', event.target.value as string)
    setValue('geoTypeValueName', title)
    setValue('geoTypeTypeCode', '1000005')
  }
  useEffect(() => {
    if (geoItems?.length !== 0) {
      const currentGeo = geoItems?.find((item) => item.id === id) ?? {}
      reset({
        ...currentGeo,
        polygonJson: JSON.parse(currentGeo?.polygonJson || '[]'),
      })
    }
  }, [isSuccess, id, isFetching])

  return (
    <>
      <Box m={4}>
        <Typography variant="h6">{formatMessage(GeographicalMessages.generalInfo)}</Typography>
      </Box>
      <Grid container spacing={5}>
        <Grid item xs={12} sm={6}>
          <HBSelectController
            label={formatMessage(GeographicalMessages.selectGeographicDivision)}
            name={'geoTypeValueCode' as keyof GeoForm}
            disabled={disabled}
            sx={{ width: '100%' }}
            onChange={handleChangeGeoType}
            inputLabelProps={{ required: true }}
            formRules={{
              required: true,
            }}
            menuItem={
              items?.map(({ name, id, code }) => ({
                value: code!,
                title: name!,
              })) || []
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <HBFormItemTextField
            disabled={disabled}
            formName={'title' as keyof GeoForm}
            fullWidth
            InputLabelProps={{
              required: true,
            }}
            inputProps={{ maxLength: 150 }}
            rules={{
              required: {
                value: true,
                message: formatMessage(validationsMessages.isRequired),
              },
            }}
            label={`${formatMessage(GeographicalMessages.title)} ${geoTypeValueName || ''}`}
            InputProps={{
              endAdornment: (
                <HBToolTip
                  placement="bottom-end"
                  title={formatMessage(GeographicalMessages.selectFile)}
                  arrow
                >
                  <IconButton>
                    <label htmlFor="uploadFile">
                      {iconUrl ? (
                        <Avatar
                          sx={{
                            width: 30,
                            height: 30,
                          }}
                          alt="country"
                          src={process.env.NEXT_PUBLIC_CDN + iconUrl}
                        />
                      ) : (
                        <HBIcon
                          sx={{
                            color: 'gray.800',
                          }}
                          size="medium"
                          type={'cameraChange'}
                        />
                      )}
                    </label>
                  </IconButton>
                </HBToolTip>
              ),
            }}
            sx={{
              mb: 0,
            }}
          />
          <input
            type="file"
            id="uploadFile"
            disabled={disabled}
            hidden
            onChange={(event) =>
              handleChange(event, (url) => setValue('iconUrl', url, { shouldDirty: true }))
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <HBFormItemTextField
            disabled={disabled}
            formName={'latinTitle' as keyof GeoForm}
            fullWidth
            label={`${formatMessage(GeographicalMessages.latinTitle)} ${geoTypeValueName || ''}`}
            inputProps={{ maxLength: 150 }}
            InputLabelProps={{
              required: false,
            }}
            rules={{
              required: false,
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <HBFormItemTextField
            disabled={disabled}
            formName={'areaCode' as keyof GeoForm}
            fullWidth
            type="number"
            label={`${formatMessage(GeographicalMessages.areaCode)} ${geoTypeValueName || ''}`}
            InputLabelProps={{
              required: false,
            }}
            rules={{
              required: false,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <HBFormItemTextField
            disabled={disabled}
            formName={'code' as keyof GeoForm}
            fullWidth
            label={formatMessage(GeographicalMessages.code)}
            InputLabelProps={{
              required: false,
            }}
            rules={{
              required: false,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <HBFormItemTextField
            disabled={disabled}
            formName={'distanceFromCenter' as keyof GeoForm}
            fullWidth
            onInput={checkPositiveNumber}
            label={formatMessage(GeographicalMessages.distanceFromCenter)}
            type={'number'}
            InputLabelProps={{
              required: false,
            }}
            rules={{
              required: false,
            }}
          />
        </Grid>
      </Grid>
    </>
  )
}
