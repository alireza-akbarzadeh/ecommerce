import { GetPagedCollectionQueryResult } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBAutocompleteController } from '@hasty-bazar/core'
import { useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import ProductGroupPageMessages from '../../ProductGroupPage.messages'

type Props = {
  disabled: boolean
  data?: GetPagedCollectionQueryResult[]
}
export default function FilterCollectionId({ disabled, data }: Props) {
  const { formatMessage } = useIntl()
  const [openCollectionId, setOpenCollectionId] = useState<boolean>(false)

  const dataList = useMemo(
    () =>
      data?.map(({ name, id, originName }) => ({
        title: name,
        value: id!,
        originName: originName!,
      })) || [],
    [data],
  )

  return (
    <HBAutocompleteController
      autoCompleteProps={{
        disabled,
        fullWidth: true,
        onClose: () => setOpenCollectionId(false),
        onOpen: () => setOpenCollectionId(true),
        open: openCollectionId,
      }}
      label={formatMessage(ProductGroupPageMessages.filterCollection)}
      fieldName={'collectionId'}
      isOptionEqualToValue={(o, v) => o.value == v?.value}
      getOptionLabel={(option) => `${option.title}`}
      options={dataList}
    />
  )
}
