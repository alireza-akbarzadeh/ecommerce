import HBSelectController, {
  HBSelectControllerProps,
} from '@hasty-bazar/admin-shared/containers/HBSelectController'
import { HBCheckBox } from '@hasty-bazar/core'
import { Box, ListItemText } from '@mui/material'
import { SelectChangeEvent } from '@mui/material/Select'
import { FC, ReactNode, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import productGroupPageMessages from '../ProductGroupPage.messages'

export interface MultiSelectDataType {
  title: string
  value: string | number
  fullCode?: string | number
}

export interface HBMultiSelectControllerProps extends Omit<HBSelectControllerProps, 'menuItem'> {
  data: MultiSelectDataType[]
  onChangeSelected: (selected: string[]) => void
  selectedData: string[]
}

const HBMultiSelectController: FC<HBMultiSelectControllerProps> = ({
  data,
  onChangeSelected,
  selectedData = [],
  ...props
}) => {
  const { formatMessage } = useIntl()
  const [selectedItem, setSelectedItem] = useState<string[]>([])
  const [selectAll, setselectAll] = useState<boolean>(false)
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true)

  useEffect(() => {
    setSelectedItem([...selectedData])
  }, [])

  useEffect(() => {
    if (!isFirstLoad) {
      onChangeSelected(selectedItem)
    } else {
      setIsFirstLoad(false)
    }
  }, [selectedItem])

  useEffect(() => {
    if (selectedData.length === data.length) {
      setselectAll(true)
    }
  }, [data])

  const handleSelectAllOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { checked },
    } = event
    if (checked) {
      setSelectedItem(data.map((item) => item.value as string))
    } else {
      setSelectedItem([])
    }
    setselectAll(checked)
  }

  const handleOnChange = (event: SelectChangeEvent) => {
    const {
      target: { value },
    } = event
    const currentValues =
      typeof value === 'string' ? value.split(',') : (value as string[]).filter((i) => i !== '-1')
    if (currentValues.length !== data.length) {
      setselectAll(false)
    } else {
      setselectAll(true)
    }
    setSelectedItem(currentValues)
  }

  const renderMenuItem = () => {
    const menuItem: Array<{
      title: ReactNode
      value: string | number
    }> = []

    menuItem.push({
      title: (
        <Box display="flex" alignItems="center" gap={4}>
          <HBCheckBox checked={selectAll} onChange={handleSelectAllOnChange} />
          <ListItemText primary={formatMessage(productGroupPageMessages.selectAll)} />
        </Box>
      ),
      value: '-1',
    })

    data?.forEach((i) => {
      menuItem.push({
        title: (
          <Box display="flex" alignItems="center" gap={4}>
            <HBCheckBox checked={selectedItem.indexOf(i.value?.toString() ?? '') > -1} />
            <ListItemText primary={i.title} />
          </Box>
        ),
        value: i.value,
      })
    })

    return menuItem
  }

  const handleRenderValue = (selected: string[]) => {
    return data
      .filter((item) => {
        return selected.indexOf(String(item.value)) >= 0
      })
      .map((item) => item.title)
      .join(' , ')
  }

  return (
    <HBSelectController
      {...props}
      multiple
      value={selectedItem}
      onChange={handleOnChange}
      renderValue={handleRenderValue}
      menuItem={renderMenuItem()}
    />
  )
}

export default HBMultiSelectController
