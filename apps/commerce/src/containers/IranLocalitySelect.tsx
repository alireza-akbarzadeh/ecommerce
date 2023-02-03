import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import {
  GetGeosQueryResult,
  useGetWebLocalityIranByProvinceIdQuery,
  useGetWebLocalityIranQuery,
} from '@hasty-bazar-commerce/services/localityApi.generated'
import { HBAutocompleteController, HBSelect, HBSelectProps } from '@hasty-bazar/core'
import { HBSelectControllerProps } from 'libs/auth/src/components/HBSelectController/HBSelectController'
import { FC, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'

interface IIranLocalitySelectProps {
  type: 'simple' | 'controlled'
  controlledProps?: Omit<HBSelectControllerProps, 'menuItem'> & {
    menuItem?: Array<{ title: string; value: string | number }>
  }
  simpleProps?: HBSelectProps
  localityType: 'province' | 'city'
  provinceId?: string
  readOnly?: boolean
}

interface IMenuItemProps {
  title: string
  value: string
}

const IranLocalitySelect: FC<IIranLocalitySelectProps> = (props) => {
  const { watch, setValue, getValues } = useFormContext()
  const { type, controlledProps, simpleProps, localityType, provinceId } = props
  const [firstTime, setFirstTime] = useState<boolean>(false)
  const { refetch: refetchProvince, data: provincesData } = useGetWebLocalityIranQuery(
    {
      ...ApiConstants,
    },
    { skip: firstTime },
  )

  const { refetch: refetchCity, data: citiesData } = useGetWebLocalityIranByProvinceIdQuery(
    {
      ...ApiConstants,
      provinceId: provinceId! as any,
    },
    { skip: !provinceId },
  )

  const [proviceItems, setProvinceItems] = useState<IMenuItemProps[]>([])
  const [citiesItems, setCitiesItems] = useState<IMenuItemProps[]>([])

  useEffect(() => {
    if (provincesData?.data?.items) {
      setProvinceItems(
        provincesData.data!.items!.map((value) => {
          return { title: value.title!, value: value.id!.toString() }
        }),
      )
      setFirstTime(true)
    }
  }, [provincesData])

  const setNullCity = (cities: GetGeosQueryResult[]) => {
    if (
      !!controlledProps?.name &&
      !cities.find((i) => i.id === watch(controlledProps?.name ?? ''))
    ) {
      setValue(controlledProps?.name, '')
    }
  }

  useEffect(() => {
    if (citiesData?.data?.items) {
      setNullCity(citiesData?.data?.items)
      setCitiesItems(
        citiesData.data!.items!.map((value) => {
          return { title: value.title!, value: value.id!.toString() }
        }),
      )
    }
  }, [citiesData])

  useEffect(() => {
    if (provinceId && localityType === 'city') {
      refetchCity()
    }
  }, [provinceId])

  useEffect(() => {
    if (localityType === 'province') {
      refetchProvince()
    }
  }, [])

  if (type === 'simple') {
    if (localityType === 'province') {
      return <HBSelect {...simpleProps!} menuItem={proviceItems} />
    } else {
      return <HBSelect {...simpleProps!} menuItem={citiesItems} />
    }
  } else {
    if (localityType === 'province') {
      return (
        <HBAutocompleteController
          fieldName={controlledProps?.name || ''}
          options={proviceItems}
          label={controlledProps?.label || ''}
          isOptionEqualToValue={(o, v) => o.value === getValues(controlledProps?.name || '')}
          getOptionLabel={(option) => `${option.title}`}
          autoCompleteProps={{
            onChange: (_, value) => {
              setValue(controlledProps?.name as unknown as string, value?.value || '')
            },
          }}
        />
      )
    } else {
      return (
        <HBAutocompleteController
          fieldName={controlledProps?.name || ''}
          options={citiesItems}
          label={controlledProps?.label || ''}
          isOptionEqualToValue={(o, v) => o.value === getValues(controlledProps?.name || '')}
          getOptionLabel={(option) => `${option.title}`}
          autoCompleteProps={{
            onChange: (_, value) => {
              setValue(controlledProps?.name as unknown as string, value?.value || '')
            },
          }}
        />
      )
    }
  }
}

export default IranLocalitySelect
