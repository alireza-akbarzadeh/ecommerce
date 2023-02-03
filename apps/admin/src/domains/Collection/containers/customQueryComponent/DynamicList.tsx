import { useAppDispatch, useAppSelector } from '@hasty-bazar/admin-shared/core/redux/hooks'
import services from '@hasty-bazar/admin-shared/services'
import { HBAutoComplete, HBCheckBox, HBTextField } from '@hasty-bazar/core'
import type { ValueEditorProps } from '@hasty-bazar/query-builder'
import { Chip, useTheme } from '@mui/material'
import { FC, useEffect, useMemo, useState } from 'react'

const DynamicList: FC<ValueEditorProps> = (props) => {
  const dispatch = useAppDispatch()
  const { palette } = useTheme()
  const [items, setItems] = useState<object[]>([])
  const [value, setValue] = useState<object[]>([])
  const onChangeValue = (event: React.SyntheticEvent, newValue: any[]) => {
    props.handleOnChange(newValue.map((item) => item[props?.fieldData.metaData.valueMember]))
  }

  const param =
    props?.fieldData?.metaData?.frontEndAPISignature ===
    'getAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessType'
      ? { businessType: props?.fieldData?.metaData?.businessTypeValue, pageSize: 1000 }
      : { pageSize: 1000 }

  useEffect(() => {
    const result = dispatch(
      //@ts-ignore//
      services[props?.fieldData?.metaData?.frontEndApiName].endpoints[
        props?.fieldData?.metaData?.frontEndAPISignature
      ].initiate({
        'client-name': 'Swagger on HIT.Hastim.GeneralData.Endpoints.WebApi',
        'client-version': '1.0.1.100',
        ...param,
      }) as any,
    )

    return result.unsubscribe
  }, [
    dispatch,
    props?.fieldData?.metaData?.frontEndApiName,
    props?.fieldData?.metaData?.frontEndAPISignature,
    props?.fieldData?.metaData?.businessTypeValue,
  ])

  const selectCollection = useMemo(
    () =>
      //@ts-ignore//
      services[props?.fieldData?.metaData?.frontEndApiName]?.endpoints[
        props?.fieldData?.metaData?.frontEndAPISignature
      ]?.select({
        'client-name': 'Swagger on HIT.Hastim.GeneralData.Endpoints.WebApi',
        'client-version': '1.0.1.100',
        ...param,
      }) as any,
    [
      props?.fieldData?.metaData?.frontEndApiName,
      props?.fieldData?.metaData?.frontEndAPISignature,
      props?.fieldData?.metaData?.businessTypeValue,
    ],
  )

  const { data } = useAppSelector(selectCollection)

  useEffect(() => {
    data && setItems([...data?.data?.items])
  }, [data?.data?.items])

  useEffect(() => {
    setValue(
      items.filter(
        (item) =>
          //@ts-ignore//
          props?.value?.indexOf(item[props?.fieldData?.metaData?.valueMember].toString()) > -1,
      ),
    )
  }, [props.value, items])

  return (
    <>
      {items.length > 0 && (
        <HBAutoComplete
          value={value}
          options={items}
          getOptionLabel={(option: any) =>
            option[props?.fieldData?.metaData.displayMember] + option?.id || ''
          }
          renderInput={(params) => (
            <HBTextField {...params} label={''} placeholder={''} sx={{ verticalAlign: 'unset' }} />
          )}
          onChange={onChangeValue}
          renderOption={(params, option, { selected }) => (
            <li {...params}>
              <HBCheckBox sx={{ mr: 1 }} checked={selected} />
              {option[props?.fieldData?.metaData.displayMember]}
            </li>
          )}
          renderTags={(tagValue, getTagProps) =>
            tagValue.map((option: any, index) => (
              <Chip
                label={option[props?.fieldData?.metaData.displayMember]}
                sx={{ backgroundColor: palette.primary.light }}
                {...getTagProps({ index })}
              />
            ))
          }
          multiple
          size="small"
          sx={{ maxWidth: 900, minWidth: 300 }}
          disabled={false}
          limitTags={2}
        />
      )}
    </>
  )
}
export default DynamicList
