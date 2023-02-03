import { Typography } from '@mui/material'
import { Meta, Story } from '@storybook/react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import HBAutocompleteControllerController, {
  AutoCompleteMenuItemDependency,
  HBAutocompleteControllerProps,
} from './HBAutocompleteController'
import HBAutocompleteControllerDoc from './HBAutocompleteController.doc'
import { HBAutocompleteController } from './index'

interface FormType {
  albumId: number
  id: number
  title: string
  url: string
  thumbnailUrl: string
}

export default {
  component: HBAutocompleteControllerController,
  parameters: {
    docs: {
      page: HBAutocompleteControllerDoc,
    },
    options: {
      showPanel: true,
    },
  },
  title: 'core/HBAutocompleteControllerController',
  argTypes: {
    label: {
      name: 'label',
      type: 'string',
    },
  },
} as Meta<HBAutocompleteControllerProps<any, any, any, false, true>>

const Template: Story<HBAutocompleteControllerProps<any, any, false, true, any>> = (args) => {
  const { control } = useForm<FormType>()
  const [state, setState] = useState([])
  const fetch = async () => {
    await axios
      .get('https://jsonplaceholder.typicode.com/photos')
      .then((res) => setState(res?.data))
  }
  useEffect(() => {
    fetch()
  }, [])

  return (
    <HBAutocompleteController<FormType, AutoCompleteMenuItemDependency>
      autoCompleteProps={{
        disabled: false,
        renderOption: (props, option) => {
          return <Typography {...props}>{option.title}</Typography>
        },
        sx: {
          width: {
            md: 300,
            xs: '100%',
          },
        },
      }}
      controllerProps={{
        control,
      }}
      getOptionLabel={(option) => `${option.title}`}
      label={'Movies'}
      paginationProps={{ totalItems: state?.length }}
      fieldName={'title'}
      options={state?.map((item) => {
        return { title: item.title?.substring(1, 10), value: item.id }
      })}
      isOptionEqualToValue={(o, v) => o.value === v.value}
    />
  )
}

export const AutoComplete = Template.bind({})
export const VirtualizeAutoComplete = Template.bind({})

VirtualizeAutoComplete.args = {}
