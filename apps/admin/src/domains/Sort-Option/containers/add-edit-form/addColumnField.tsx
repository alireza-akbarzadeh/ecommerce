import HBSelectController from '@hasty-bazar/admin-shared/containers/HBSelectController'
import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import { BusinessTypeEnums } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import validationsMessages from '@hasty-bazar-admin/core/translations/validations.messages'
import { useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBDialog, HBForm, HBIcon, HBIconButton } from '@hasty-bazar/core'
import { Grid } from '@mui/material'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import sortOptionMessages from '../../sort-option.messages'

const AddColumnField = () => {
  const { formatMessage } = useIntl()
  const router = useRouter()
  const collectionType = router.query.collectionType as unknown as string
  const [openColumnField, setOpenColumnField] = useState<boolean>(false)

  const { data: attributeDataTypeData } =
    useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery({
      'client-name': 'generalData',
      'client-version': '0',
      //@ts-ignore
      businessType: BusinessTypeEnums.AttributeDataType,
    })

  const attributeDataTypeItems = useMemo(
    () =>
      attributeDataTypeData?.data?.items?.map((item: any) => ({
        title: item.title,
        value: item.fullCode,
      })) || [],
    [attributeDataTypeData],
  )

  const { data: relatedEntityData } =
    useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery({
      'client-name': 'generalData',
      'client-version': '0',
      //@ts-ignore
      businessType: BusinessTypeEnums.RestrictionsOnUseType,
    })

  const relatedEntityItems = useMemo(
    () =>
      relatedEntityData?.data?.items?.map((item: any) => ({
        title: item.title,
        value: item.fullCode,
      })) || [],
    [relatedEntityData],
  )

  const handleOpenDialog = () => {
    setOpenColumnField(true)
  }

  return (
    <>
      <HBIconButton icon={<HBIcon type="plus" />} onClick={handleOpenDialog} />
      <HBDialog
        content={
          <HBForm
            onSubmit={() => {}}
            defaultValues={{
              relatedEntity: collectionType,
            }}
          >
            <Grid container spacing={5}>
              <Grid item xs={12} sm={6}>
                <HBTextFieldController
                  label={`${formatMessage(sortOptionMessages.columnTitle)}`}
                  fullWidth
                  name={'title'}
                  formRules={{
                    validate: (value) =>
                      !!value.trim() ||
                      `${formatMessage(validationsMessages.isRequired, {
                        msg: '',
                      })}`,
                    required: {
                      value: true,
                      message: `${formatMessage(validationsMessages.isRequired, {
                        msg: formatMessage(sortOptionMessages.title),
                      })}`,
                    },
                  }}
                  autoComplete={'off'}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <HBTextFieldController
                  label={`${formatMessage(sortOptionMessages.systemTitle)}`}
                  fullWidth
                  name={'systemTitle'}
                  formRules={{
                    validate: (value) =>
                      !!value.trim() ||
                      `${formatMessage(validationsMessages.isRequired, {
                        msg: '',
                      })}`,
                    required: {
                      value: true,
                      message: `${formatMessage(validationsMessages.isRequired, {
                        msg: formatMessage(sortOptionMessages.systemTitle),
                      })}`,
                    },
                  }}
                  autoComplete={'off'}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <HBSelectController
                  fullWidth
                  label={formatMessage(sortOptionMessages.attributeDataType)}
                  name={'attributeDataType'}
                  menuItem={attributeDataTypeItems}
                  formRules={{ required: false }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <HBSelectController
                  fullWidth
                  label={formatMessage(sortOptionMessages.relatedEntity)}
                  name={'relatedEntity'}
                  menuItem={relatedEntityItems}
                  formRules={{ required: false }}
                />
              </Grid>
            </Grid>
          </HBForm>
        }
        title={formatMessage(sortOptionMessages.modalTitle)}
        onAccept={() => setOpenColumnField(false)}
        onReject={() => setOpenColumnField(false)}
        onClose={() => setOpenColumnField(false)}
        open={openColumnField}
        acceptBtn={formatMessage(phrasesMessages.confirm)}
        rejectBtn={formatMessage(phrasesMessages.back)}
      />
    </>
  )
}
export default AddColumnField
