import {
  GetCategoriesQueryResult,
  useDeleteAdminCatalogCategoriesByIdCommissionMutation,
  usePostAdminCatalogCategoriesByIdCommissionMutation,
  usePutAdminCatalogCategoriesByIdCommissionMutation,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { HBIcon, openToast } from '@hasty-bazar/core'
import { Box, IconButton } from '@mui/material'
import { Dispatch, SetStateAction } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useIntl } from 'react-intl'
import productGroupPageMessages from '../../ProductGroupPage.messages'

type PropTypes = {
  commissionFormProvider: UseFormReturn<GetCategoriesQueryResult, any>
  isEditMode: boolean
  catalogId: any
  setIsEditMode: Dispatch<SetStateAction<boolean>>
  refetchData: () => void
}

const Actions = (props: PropTypes) => {
  const { commissionFormProvider, isEditMode, catalogId, setIsEditMode, refetchData } = props
  const [addCommission] = usePostAdminCatalogCategoriesByIdCommissionMutation()
  const [updateCommission] = usePutAdminCatalogCategoriesByIdCommissionMutation()
  const [deleteCommission] = useDeleteAdminCatalogCategoriesByIdCommissionMutation()
  const { formatMessage } = useIntl()
  const { isDirty, isValid } = commissionFormProvider.formState

  const handleResponseSuccess = (message: object) => {
    openToast({
      message: formatMessage(message),
      type: 'success',
    })

    refetchData()
  }

  const handleSubmit = (values: GetCategoriesQueryResult) => {
    if (isEditMode) handleUpdate(values)
    else handleAdd(values)
  }

  const handleAdd = (values: any) => {
    addCommission({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      id: catalogId,
      assignCategoryCommissionModel: {
        description: String(values.commissionDescription),
        calculationType: values?.commissionCalculationType?.value,
        ...(Number(values.minimumCommission) > 0 && {
          minimumCommission: Number(values.minimumCommission),
        }),
        ...(Number(values.maximumCommission) > 0 && {
          maximumCommission: Number(values.maximumCommission),
        }),
        settlementDays: Number(values.commissionSettlementDays),
        targetValue: Number(values.commissionTargetValue),
      },
    }).then((res: any) => {
      if (res?.data?.success) {
        handleResponseSuccess(productGroupPageMessages.addSuccess)
        setIsEditMode(true)
      }
    })
  }

  const handleUpdate = (values: any) => {
    updateCommission({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      id: catalogId,
      updateAssignedCategoryCommissionModel: {
        description: String(values.commissionDescription),
        calculationType: values?.commissionCalculationType?.value,
        ...(Number(values.minimumCommission) > 0 && {
          minimumCommission: Number(values.minimumCommission),
        }),
        ...(Number(values.maximumCommission) > 0 && {
          maximumCommission: Number(values.maximumCommission),
        }),
        settlementDays: Number(values.commissionSettlementDays),
        targetValue: Number(values.commissionTargetValue),
      },
    }).then((res: any) => {
      if (res?.data?.success) {
        handleResponseSuccess(productGroupPageMessages.updateSuccess)
      }
    })
  }

  const handleDelete = () => {
    deleteCommission({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      id: catalogId,
    }).then((res: any) => {
      if (res?.data?.success) {
        handleResponseSuccess(productGroupPageMessages.deleteSuccess)
        commissionFormProvider.reset({
          commissionCalculationType: undefined,
          commissionDescription: undefined,
          commissionSettlementDays: undefined,
          minimumCommission: undefined,
          maximumCommission: undefined,
          commissionTargetValue: undefined,
        })
        setIsEditMode(false)
      }
    })
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        right: 48,
        top: 16,
      }}
    >
      <IconButton
        color="primary"
        size="medium"
        type="button"
        onClick={commissionFormProvider.handleSubmit(handleSubmit)}
        disabled={!isDirty || !isValid}
      >
        <HBIcon type="check" />
      </IconButton>
      {isEditMode && (
        <IconButton
          color="primary"
          size="medium"
          type="button"
          onClick={commissionFormProvider.handleSubmit(handleDelete)}
        >
          <HBIcon type="trashAlt" />
        </IconButton>
      )}
    </Box>
  )
}

export default Actions
