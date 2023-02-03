import { GetBusinessTypeValuesByBusinessTypeQueryResultCollectionQueryResultApiResult } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import List from '@mui/material/List'
import ListItemButton, { listItemButtonClasses } from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

type OutputQueryListProps = {
  outputQueryData:
    | GetBusinessTypeValuesByBusinessTypeQueryResultCollectionQueryResultApiResult
    | undefined
}

const OutputQueryList = ({ outputQueryData }: OutputQueryListProps) => {
  const router = useRouter()
  const action = router.query.action as unknown as string
  const sortOptionId = router.query.sortOptionId as unknown as string
  const collectionType = router.query.collectionType as unknown as string

  const [selected, setSelected] = useState<string>('')

  useEffect(() => {
    if (action === 'add') {
      setSelected(collectionType ? collectionType : outputQueryData?.data?.items?.[0]?.id || '')
      router.replace(
        {
          pathname: `/sort-option/${action}/`,
          query: {
            collectionType: collectionType ? collectionType : outputQueryData?.data?.items?.[0]?.id,
          },
        },
        undefined,
        {
          shallow: true,
        },
      )
    } else if (action === 'edit') {
      setSelected(collectionType)
    }
  }, [outputQueryData, action])

  const handleListItemClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, id: string) => {
    setSelected(id)
    router.replace(
      {
        pathname: `/sort-option/${action}/`,
        query: {
          sortOptionId,
          collectionType: id,
        },
      },
      undefined,
      {
        shallow: true,
      },
    )
  }

  return (
    <List component="nav">
      {outputQueryData?.data?.items?.map((item) => (
        <ListItemButton
          selected={selected === item.id}
          onClick={(event) => handleListItemClick(event, item.id || '')}
          sx={({ palette, spacing }) => ({
            border: `1px solid ${palette.grey[200]}`,
            borderRadius: 4,
            margin: spacing(2, 0),
            padding: spacing(1, 2),
            [`&.${listItemButtonClasses.selected}`]: {
              color: palette.common.white,
              backgroundColor: palette.primary.main,
            },
            [`&.${listItemButtonClasses.selected}:hover`]: {
              color: palette.common.white,
              backgroundColor: palette.primary.main,
            },
          })}
        >
          <ListItemText primary={item.title} />
        </ListItemButton>
      ))}
    </List>
  )
}
export default OutputQueryList
