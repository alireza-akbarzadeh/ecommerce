import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import {
  GetBusinessTypeValuesQueryResult,
  useGetWebGeneralDataBusinessTypeValueGetAllValuesByBusinessTypeIdQuery,
} from '@hasty-bazar-commerce/services/generalDataApi.generated'
import { HBSelect, HBSelectProps } from '@hasty-bazar/core'
import HBSelectController, {
  HBSelectControllerProps,
} from 'libs/auth/src/components/HBSelectController/HBSelectController'
import { FC, useEffect } from 'react'

interface IGenderSelectProps {
  type: 'simple' | 'controlled'
  controlledProps?: HBSelectControllerProps
  simpleProps?: HBSelectProps
  returnedValues: (values: GetBusinessTypeValuesQueryResult[]) => void
}

const GenderSelect: FC<IGenderSelectProps> = (props) => {
  const { isLoading, data } =
    useGetWebGeneralDataBusinessTypeValueGetAllValuesByBusinessTypeIdQuery({
      ...ApiConstants,
      businessTypeCode: 1003,
    })

  const { type, controlledProps, simpleProps, returnedValues } = props

  const menuItems =
    data?.data?.items?.map((value) => {
      return { title: value.title!, value: value.id! }
    }) || []

  useEffect(() => {
    if (data?.data?.items) {
      returnedValues(data?.data?.items)
    }
  }, [data])

  if (type === 'simple') {
    return <HBSelect {...simpleProps!} menuItem={menuItems} />
  } else {
    return <HBSelectController {...controlledProps!} menuItem={menuItems} />
  }
}

export default GenderSelect
