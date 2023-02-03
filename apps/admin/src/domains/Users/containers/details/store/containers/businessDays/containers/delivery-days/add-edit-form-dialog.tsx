import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { GetBusinessTypeValuesQueryResult } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import {
  GetVendorStoreResultApiResult,
  GetWorkingDaysQueryResult,
  UpdateAssignedWorkingDaysModel,
  usePostAdminIdrVendorsByIdWorkingDaysMutation,
  usePutAdminIdrVendorsByIdWorkingDaysAndWorkingDayIdMutation,
} from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { HBForm, openToast } from '@hasty-bazar/core'
import { Dispatch, SetStateAction } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import AddEditFormItemsDialog from './add-edit-form-items-dialog'
import { stableDate } from './delivery-days-filter'

type AddEditFormProps = {
  data?: GetWorkingDaysQueryResult
  setIsOpenAddEditDialog: Dispatch<
    SetStateAction<{ show: boolean; data?: GetWorkingDaysQueryResult }>
  >
  refreshGridData: (isClearSearch?: boolean | undefined) => void
  DayTypeData: GetBusinessTypeValuesQueryResult[] | null
  WeekDaysData: GetBusinessTypeValuesQueryResult[] | null
  vendorData: GetVendorStoreResultApiResult
}

export type UpdateWorkingDayType = Omit<
  UpdateAssignedWorkingDaysModel,
  'dayType' | 'weekDays' | 'deliveryFromHours' | 'deliveryToHours' | 'isActive'
> & {
  dayType?: any
  weekDays?: any
  deliveryFromHours?: string | Date | null
  deliveryToHours?: string | Date | null
  isActive?: boolean | null
}

const AddEditFormDialog = ({
  data,
  setIsOpenAddEditDialog,
  refreshGridData,
  DayTypeData,
  WeekDaysData,
  vendorData,
}: AddEditFormProps) => {
  const { formatMessage } = useIntl()
  const formProvider = useForm<UpdateWorkingDayType>({
    mode: 'all',
    defaultValues: {
      ...data,
      dayType: data?.dayType
        ? {
            id: data?.dayType,
            title: data?.dayTypeTitle,
          }
        : null,
      weekDays: data?.weekDays?.length
        ? data?.weekDays
            ?.split(',')
            ?.slice(0, -1)
            ?.map((day) => ({
              id: day,
              title: WeekDaysData?.find((item) => item.id === day.trim())?.title,
            }))
        : null,
      deliveryToHours: data?.deliveryToHours || null,
      deliveryFromHours: data?.deliveryFromHours || null,
    },
  })

  const [createWorkingDate, { isLoading: isLoadingCreate }] =
    usePostAdminIdrVendorsByIdWorkingDaysMutation()
  const [editWorkingDate, { isLoading: isLoadingEdit }] =
    usePutAdminIdrVendorsByIdWorkingDaysAndWorkingDayIdMutation()

  const handleSubmit = (values: UpdateWorkingDayType) => {
    const fromHours =
      values.deliveryFromHours &&
      `${new Date(values.deliveryFromHours).getHours()}:${new Date(
        values.deliveryFromHours,
      ).getMinutes()}`
    const toHours =
      values.deliveryToHours &&
      `${new Date(values.deliveryToHours).getHours()}:${new Date(
        values.deliveryToHours,
      ).getMinutes()}`

    const body = {
      ...values,
      weekDays: values.weekDays?.map((value: any) => +value.id),
      dayType: values.dayType?.id && +values.dayType?.id,
      deliveryFromHours: fromHours
        ? new Date(`${stableDate} ${fromHours}`).toISOString()
        : undefined,
      deliveryToHours: toHours ? new Date(`${stableDate} ${toHours}`).toISOString() : undefined,
      isActive: values.isActive || true,
    }
    if (data?.workingDaysId) {
      editWorkingDate({
        'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
        'client-version': '1.0.1.100',
        id: vendorData?.data?.id!,
        updateAssignedWorkingDaysModel: body,
        workingDayId: data.workingDaysId!,
      }).then((res) => {
        //@ts-ignore
        if (res?.data?.success) {
          refreshGridData()
          openToast({
            message: formatMessage(phrasesMessages.successUpdate),
            type: 'success',
          })
          setIsOpenAddEditDialog({ show: false })
        }
      })
    } else {
      createWorkingDate({
        'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
        'client-version': '1.0.1.100',
        id: vendorData?.data?.id!,
        assignWorkingDaysModel: {
          ...body,
          isActive: true,
        },
      }).then((res) => {
        // @ts-ignore
        if (res?.data?.success) {
          refreshGridData()
          openToast({
            message: formatMessage(phrasesMessages.successAdd),
            type: 'success',
          })
          setIsOpenAddEditDialog({ show: false })
        }
      })
    }
  }

  return (
    <HBForm onSubmit={handleSubmit} formProviderProps={formProvider}>
      <AddEditFormItemsDialog
        WeekDaysData={WeekDaysData}
        DayTypeData={DayTypeData}
        isLoadingEdit={isLoadingEdit}
        isLoadingCreate={isLoadingCreate}
      />
    </HBForm>
  )
}
export default AddEditFormDialog

// TODO: Maybe we need this code for timezone offset
// function getIsoStringWithOffset() {
//   const toIsoString = (date: Date) => {
//     const tzo = 0,
//       dif = tzo >= 0 ? '+' : '-',
//       pad = function (num: number) {
//         return (num < 10 ? '0' : '') + num
//       }
//     return (
//       date.getFullYear() +
//       '-' +
//       pad(date.getMonth() + 1) +
//       '-' +
//       pad(date.getDate()) +
//       'T' +
//       pad(date.getHours()) +
//       ':' +
//       pad(date.getMinutes()) +
//       ':' +
//       pad(date.getSeconds()) +
//       dif +
//       pad(Math.floor(Math.abs(tzo) / 60)) +
//       ':' +
//       pad(Math.abs(tzo) % 60)
//     )
//   }
//   return toIsoString
// }
