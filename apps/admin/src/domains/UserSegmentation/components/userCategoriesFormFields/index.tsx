import HBDateTimePickerController from '@hasty-bazar/admin-shared/containers/HBDateTimePickerController'
import { HBSwitchController } from '@hasty-bazar/admin-shared/containers/HBSwitchController'
import {
  GetBusinessTypeValuesByBusinessTypeQueryResult,
  GetPagedCollectionQueryResult,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { CreateReasonsSettingModel } from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { HBTextFieldController } from '@hasty-bazar/auth'
import { HBAutocompleteController } from '@hasty-bazar/core'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { FC, useEffect } from 'react'
import { useWatch } from 'react-hook-form'
import { useIntl } from 'react-intl'
import {
  ListCreationTypeCodeEnum,
  QueryResultTypeCodeEnum,
} from '../../enums/UserCategoriesValidationFormEnum'

import { userCategoriesFormFields } from '../../hooks'
import UserCategoriesMessage from '../../messages/UserCategoriesMessage'
import { IUserCategoriesFormFields } from '../../types/IUserCategoriesFormFields'
import { IUserCategoriesFormModel } from '../../types/IUserCategoriesFormModel'

const UserCategoriesFormFields: FC<IUserCategoriesFormFields> = ({ setValue, id, control }) => {
  const { formatMessage } = useIntl()
  const {
    UserTypeCodeItems,
    IntervalTypeCodeItems,
    ListCreationTypeItems,
    QueryResultTypeItems,
    RelatedQueryTypeItems,
    switchClass,
    isLoadingCreation,
  } = userCategoriesFormFields()

  const { queryResultTypeCode, listCreationType, hasOutputLimit } = useWatch({
    control,
  })
  const isInterVal = queryResultTypeCode?.id === QueryResultTypeCodeEnum.Interval
  const list = ListCreationTypeItems?.filter((x) => x.id === ListCreationTypeCodeEnum.Manual)

  const listWithoutStaticQuery = ListCreationTypeItems?.filter(
    (item) => item.id !== ListCreationTypeCodeEnum.StaticQuery,
  )
  useEffect(() => {
    if (listWithoutStaticQuery) {
      if (!id) {
        setValue('listCreationType', { id: list?.[0]?.id, title: list?.[0]?.title })
      }
    }
  }, [isLoadingCreation])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} sm={6} md={3}>
        <HBAutocompleteController<
          IUserCategoriesFormModel,
          GetBusinessTypeValuesByBusinessTypeQueryResult
        >
          label={formatMessage(UserCategoriesMessage.infoListType)}
          fieldName={'listCreationType'}
          isOptionEqualToValue={(o, v) => o.id === v?.id}
          getOptionLabel={(option) => option.title ?? ''}
          options={listWithoutStaticQuery || []}
          required
        />
      </Grid>

      <Grid item xs={12} sm={3}>
        <HBTextFieldController
          formRules={{
            required: {
              value: true,
              message: formatMessage(UserCategoriesMessage.categoryValidate, {
                msg: formatMessage(UserCategoriesMessage.categoriesCode),
              }),
            },
          }}
          name={'number' as keyof IUserCategoriesFormModel}
          label={formatMessage(UserCategoriesMessage.categoriesCode)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <HBTextFieldController
          formRules={{
            required: {
              value: true,
              message: formatMessage(UserCategoriesMessage.categoryValidate, {
                msg: formatMessage(UserCategoriesMessage.categoriesDes),
              }),
            },
          }}
          name={'name' as keyof IUserCategoriesFormModel}
          label={formatMessage(UserCategoriesMessage.categoriesDes)}
        />
      </Grid>
      {!!listCreationType && listCreationType.id === ListCreationTypeCodeEnum.DynamicQuery && (
        <Grid item xs={12} sm={6} md={3}>
          <HBAutocompleteController<IUserCategoriesFormModel, GetPagedCollectionQueryResult>
            label={formatMessage(UserCategoriesMessage.selectDynamicQuery)}
            fieldName={'collectionId'}
            isOptionEqualToValue={(o, v) => o.id === v}
            getOptionLabel={(option) => option.name ?? ''}
            options={RelatedQueryTypeItems || []}
            formRules={{ required: true }}
            required
          />
        </Grid>
      )}
      <Grid item xs={12} sm={6} md={3}>
        <Box sx={switchClass}>
          <Typography variant={'body1'}>
            {formatMessage(UserCategoriesMessage.usageLimitExit)}
          </Typography>
          <HBSwitchController
            formRules={{
              required: false,
            }}
            name={'hasOutputLimit' as keyof IUserCategoriesFormModel}
            onChange={(_, value) => {
              if (!value) setValue('outputLimit', undefined)
            }}
          />
        </Box>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <HBTextFieldController
          type={'number'}
          formRules={{
            required: {
              value: !!hasOutputLimit,
              message: formatMessage(UserCategoriesMessage.categoryValidate, {
                msg: formatMessage(UserCategoriesMessage.maxCount),
              }),
            },
          }}
          required={!!hasOutputLimit}
          disabled={!hasOutputLimit}
          name="outputLimit"
          label={formatMessage(UserCategoriesMessage.maxCount)}
          maskOptions={{ mask: Number, min: 1 }}
        />
      </Grid>
      {!!listCreationType && listCreationType.id === ListCreationTypeCodeEnum.Manual && (
        <Grid item xs={12} sm={6} md={3}>
          <HBAutocompleteController<
            CreateReasonsSettingModel,
            GetBusinessTypeValuesByBusinessTypeQueryResult
          >
            label={formatMessage(UserCategoriesMessage.categoriesType)}
            fieldName={'userTypeCode'}
            isOptionEqualToValue={(o, v) => o.id === v?.id}
            getOptionLabel={(option) => option.title ?? ''}
            options={UserTypeCodeItems || []}
            required
          />
        </Grid>
      )}
      {!!listCreationType && listCreationType?.id === ListCreationTypeCodeEnum.StaticQuery && (
        <Grid item xs={12} sm={6} md={3}>
          <HBAutocompleteController<
            IUserCategoriesFormModel,
            GetBusinessTypeValuesByBusinessTypeQueryResult
          >
            label={formatMessage(UserCategoriesMessage.saveInfoListType)}
            fieldName={'queryResultTypeCode'}
            isOptionEqualToValue={(o, v) => o.id === v.id}
            getOptionLabel={(option) => option.title ?? ''}
            options={QueryResultTypeItems || []}
            required
          />
        </Grid>
      )}
      {isInterVal && listCreationType?.id === ListCreationTypeCodeEnum.StaticQuery && (
        <>
          <Grid item xs={12} sm={6} md={3}>
            <Stack direction={'row'} gap={5}>
              <HBTextFieldController
                formRules={{
                  required: {
                    value: true,
                    message: formatMessage(UserCategoriesMessage.validate, {
                      msg: formatMessage(UserCategoriesMessage.interVal),
                    }),
                  },
                }}
                type="number"
                name={'interval' as keyof IUserCategoriesFormModel}
                label={formatMessage(UserCategoriesMessage.interVal)}
              />
              <HBAutocompleteController<
                IUserCategoriesFormModel,
                GetBusinessTypeValuesByBusinessTypeQueryResult
              >
                label={formatMessage(UserCategoriesMessage.interValTypeCode)}
                fieldName={'interValTypeCode'}
                isOptionEqualToValue={(o, v) => o.id === v.id}
                getOptionLabel={(option) => option.title ?? ''}
                options={IntervalTypeCodeItems || []}
                autoCompleteProps={{
                  fullWidth: true,
                }}
                required={isInterVal}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <HBDateTimePickerController
              defaultValue={new Date()}
              minDateTime={new Date()}
              formRules={{
                required: {
                  value: true,
                  message: formatMessage(UserCategoriesMessage.validate, {
                    msg: formatMessage(UserCategoriesMessage.start),
                  }),
                },
              }}
              label={`${formatMessage(UserCategoriesMessage.start)}*`}
              name={'plannedStartDateTime' as keyof IUserCategoriesFormModel}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <HBDateTimePickerController
              minDateTime={new Date()}
              label={`${formatMessage(UserCategoriesMessage.end)}`}
              name={'plannedEndDateTime' as keyof IUserCategoriesFormModel}
            />
          </Grid>
        </>
      )}
    </Grid>
  )
}

export default UserCategoriesFormFields
