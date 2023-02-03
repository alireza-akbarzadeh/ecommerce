import HBDatePickerController from '@hasty-bazar/admin-shared/containers/HBDatePickerController'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  GetHolidayDatesQueryResult,
  GetVendorStoreResultApiResult,
  usePostAdminIdrVendorsByIdHolidayDateMutation,
} from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { HBButton, HBForm, openToast } from '@hasty-bazar/core'
import { Grid } from '@mui/material'
import { Dispatch, SetStateAction } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import businessDaysMessages from '../../businessDays.messages'

type AddFormProps = {
  setIsOpenAddDialog: Dispatch<SetStateAction<{ show: boolean; data?: GetHolidayDatesQueryResult }>>
  refreshGridData: (isClearSearch?: boolean | undefined) => void
  vendorData: GetVendorStoreResultApiResult
}

const AddFormDialog = ({ setIsOpenAddDialog, refreshGridData, vendorData }: AddFormProps) => {
  const { formatMessage } = useIntl()
  const formProvider = useForm({ mode: 'all' })

  const [createHolidayDate, { isLoading: isLoadingCreate }] =
    usePostAdminIdrVendorsByIdHolidayDateMutation()

  const handleSubmit = (values: GetHolidayDatesQueryResult) => {
    createHolidayDate({
      'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
      'client-version': '1.0.1.100',
      id: vendorData?.data?.id!,
      assignHolidayDateModel: values,
    }).then((res) => {
      // @ts-ignore
      if (res?.data?.success) {
        refreshGridData()
        openToast({
          message: formatMessage(phrasesMessages.successAdd),
          type: 'success',
        })
        setIsOpenAddDialog({ show: false })
      }
    })
  }

  return (
    <HBForm onSubmit={handleSubmit} formProviderProps={formProvider}>
      <Grid container spacing={6} mt={4}>
        <Grid item xs={12} md={8}>
          <HBDatePickerController
            name="date"
            ampm={false}
            label={formatMessage(businessDaysMessages.date)}
            formRules={{ required: false }}
          />
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'end' }}>
          <HBButton
            variant="contained"
            type="submit"
            color="primary"
            disabled={
              !formProvider.formState.isValid || !formProvider.formState.isDirty || isLoadingCreate
            }
          >
            {formatMessage(phrasesMessages.save)}
          </HBButton>
        </Grid>
      </Grid>
    </HBForm>
  )
}
export default AddFormDialog
