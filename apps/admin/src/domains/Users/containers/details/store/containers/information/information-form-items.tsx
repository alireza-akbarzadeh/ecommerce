import HBDatePickerController from '@hasty-bazar/admin-shared/containers/HBDatePickerController'
import HBSelectController from '@hasty-bazar/admin-shared/containers/HBSelectController'
import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import HBTinyEditorController from '@hasty-bazar/admin-shared/containers/HBTinyEditorController'
import validationsMessages from '@hasty-bazar-admin/core/translations/validations.messages'
import userPageMessages from '@hasty-bazar-admin/domains/Users/UserPage.messages'
import { GetPagesQueryResult } from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import {
  GetVendorAddressQueryResult,
  RoleResult,
} from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { HBButton, HBIcon } from '@hasty-bazar/core'
import { Box, Grid, Typography } from '@mui/material'
import { Dispatch, SetStateAction } from 'react'
import { useIntl } from 'react-intl'
import AddressSelectItem from './address-select-item'
import UploadBanners from './upload-banners'
import UploadImages from './upload-images'
import UploadRelatedProductGroups from './upload-related-product-groups'
import UploadVideos from './upload-videos'

export const formId = 'address'

type InformationFormItemsProps = {
  userId: string
  vitrinData: GetPagesQueryResult[] | null
  addressData: GetVendorAddressQueryResult[] | null
  setOpenAddressMapDialog: Dispatch<SetStateAction<boolean>>
  detailsRole: RoleResult
}

const InformationFormItems = ({
  userId,
  vitrinData,
  addressData,
  setOpenAddressMapDialog,
  detailsRole,
}: InformationFormItemsProps) => {
  const { formatMessage } = useIntl()

  return (
    <Grid container spacing={6}>
      <Grid item md={4} sm={6} xs={12}>
        <HBTextFieldController
          label={formatMessage(userPageMessages.name)}
          fullWidth
          name="storeName"
          autoComplete={'off'}
          formRules={{
            required: {
              value: true,
              message: formatMessage(validationsMessages.isRequired, {
                msg: formatMessage(userPageMessages.name),
              }),
            },
            maxLength: {
              value: 64,
              message: formatMessage(validationsMessages.maxValue, {
                maxValue: 64,
              }),
            },
          }}
        />
      </Grid>
      <Grid item md={4} sm={6} xs={12}>
        <HBDatePickerController
          label={`${formatMessage(userPageMessages.createDate)}`}
          name={'createDate'}
          disabled
          formRules={{
            required: {
              value: true,
              message: formatMessage(validationsMessages.isRequired, {
                msg: formatMessage(userPageMessages.createDate),
              }),
            },
          }}
        />
      </Grid>
      <Grid item md={4} sm={6} xs={12}>
        <HBSelectController
          label={formatMessage(userPageMessages.vitrin)}
          fullWidth
          disabled
          menuItem={
            vitrinData?.map(({ id, name }) => ({
              title: name ?? '',
              value: id ?? '',
            })) as { title: string; value: string | number }[]
          }
          name="vitrin"
          inputLabelProps={{ required: false }}
          formRules={{
            required: {
              value: false,
              message: formatMessage(validationsMessages.isRequired, {
                msg: formatMessage(userPageMessages.vitrin),
              }),
            },
          }}
        />
      </Grid>
      <Grid item md={8} xs={12}>
        <AddressSelectItem addressData={addressData} detailsRole={detailsRole} />
      </Grid>
      <Grid
        item
        md={4}
        sm={6}
        xs={12}
        sx={{
          display: 'flex',
          alignSelf: 'flex-start',
          alignItems: 'center',
        }}
      >
        <HBButton variant="text" onClick={() => setOpenAddressMapDialog(true)}>
          <HBIcon
            type={'plus'}
            sx={({ palette, spacing }) => ({
              color: palette.primary.main,
              border: `${spacing(0.5)} solid`,
              display: 'flex',
              alignItems: 'center',
              marginRight: spacing(2),
            })}
          />
          <Typography color={'primary'}>{formatMessage(userPageMessages.addAddress)}</Typography>
        </HBButton>
      </Grid>
      <Grid item xs={12}>
        <HBTextFieldController
          id="input-shortDescription"
          label={formatMessage(userPageMessages.shortDescription)}
          fullWidth
          name="shortDescription"
          autoComplete={'off'}
          multiline
          rows={3}
          maxRows={3}
          formRules={{ required: false, maxLength: 4000 }}
        />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ my: 1 }}>
          <Typography variant="button" color="primary.main">
            {formatMessage(userPageMessages.fullContent)}
          </Typography>
        </Box>
        <HBTinyEditorController
          name={`description`}
          init={{ max_height: 200 }}
          formRules={{ maxLength: 4000 }}
        />
      </Grid>
      <Grid item xs={12}>
        <UploadBanners userId={userId} />
      </Grid>
      <Grid item xs={12}>
        <UploadRelatedProductGroups detailsRole={detailsRole} />
      </Grid>
      <Grid item xs={12}>
        <UploadImages userId={userId} />
      </Grid>
      <Grid item xs={12}>
        <UploadVideos userId={userId} />
      </Grid>
    </Grid>
  )
}
export default InformationFormItems
