import { useGetAdminCatalogCategoriesQuery } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import {
  HBButton,
  HBIcon,
  HBIconType,
  HBTextField,
  HBTreeView,
  RenderTree,
} from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import productGroupMessages from '../ProductGroup.messages'
import TreeViewAddButton from './TreeViewAddButton'
import TreeViewItem from './TreeViewItem'

export type CategoryTreeProps = {}
export default function CategoryTree(props: CategoryTreeProps) {
  const { formatMessage } = useIntl()
  const Tree = useCallback(() => {
    const [nodes, setNodes] = useState<RenderTree[]>([])
    const { setValue } = useFormContext()
    const { push, query: { slug: [action, nodeId = ''] = [] } = {} } = useRouter()
    const {
      data: { data: { items = [] } = {} } = {},
      refetch,
      isFetching,
    } = useGetAdminCatalogCategoriesQuery({
      'client-name': 'test',
      'client-version': '0',
      pageNumber: 0,
      pageSize: 10000,
      ordering: 'DisplaySortTypeCode',
    })
    const handleSelect = (event: React.SyntheticEvent, nodeId: string) => {
      push(`/product-group/edit/${nodeId}`)
    }

    useEffect(() => {
      if (!action) refetch()
    }, [action])

    useEffect(() => {
      setValue('treeItems', nodes)
    }, [nodes])

    useEffect(() => {
      if (!isFetching) {
        const data =
          items?.map(
            ({ name = '', parentId = '', id = '', iconPath = '' }): RenderTree => ({
              id: String(id),
              pid: parentId ? String(parentId) : null,
              name: name ?? '',
              icon: (iconPath as HBIconType) ?? '',
            }),
          ) || []
        setNodes(data)
      }
    }, [isFetching])

    const [search, setSearch] = useState('')

    const {
      data: { data: { items: searchItems = [] } = {} } = {},
      refetch: refetchSearchQuery,
      isFetching: searchIsFetching,
    } = useGetAdminCatalogCategoriesQuery(
      {
        'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
        'client-version': '1.0.1.100',
        name: search.toString().trim(),
        includeFullPath: true,
        filter: 'Name.Contains(--Name)',
      },
      {
        skip: search === '',
      },
    )

    const convertData = (data: any): Array<any> => {
      return (
        data?.map(
          ({ name = '', parentId = '', id = '', iconPath = '' } = {}): RenderTree => ({
            id: String(id),
            pid: parentId ? String(parentId) : null,
            name: name ?? '',
            icon: (iconPath as HBIconType) ?? '',
          }),
        ) || []
      )
    }

    useEffect(() => {
      if (search.toString().length !== 0) {
        refetchSearchQuery()
      } else if (search.toString().length === 0) {
        refetch()
      }
    }, [search])

    useEffect(() => {
      if (search.toString().length !== 0 && !searchIsFetching && searchItems) {
        const data = convertData(searchItems)
        setNodes(data)
      } else if (search.toString().length === 0 && !isFetching && items) {
        const data = convertData(items)
        setNodes(data)
      }
    }, [isFetching, searchIsFetching])

    return (
      <>
        <Box
          sx={({ palette }) => ({
            backgroundColor: palette.grey[200],
            p: 4,
          })}
        >
          <HBTextField
            sx={({ spacing, palette }) => ({
              backgroundColor: '#FFF',
              borderRadius: 4,
              '& .MuiOutlinedInput-root': {
                '& > fieldset': { borderColor: palette.grey[200] },
              },
              '& .MuiOutlinedInput-root.Mui-focused': {
                '& > fieldset': {
                  borderRadius: 4,
                },
              },
              '& .MuiOutlinedInput-root:hover': {
                '& > fieldset': {
                  borderRadius: 4,
                },
              },
            })}
            fullWidth
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            placeholder={formatMessage(productGroupMessages.search)}
            InputProps={{
              startAdornment: (
                <HBIcon type="search" sx={{ mr: 2, color: ({ palette }) => palette.grey[300] }} />
              ),
            }}
          />
        </Box>
        <Box sx={{ p: 6 }}>
          <Box display="flex" alignItems="center" sx={{ my: 2, width: 200 }}>
            <HBButton
              sx={{ mr: 2, borderRadius: 4, height: 40, borderColor: 'grey.200' }}
              fullWidth
              variant="text"
              color="info"
              onClick={() => {
                push(`/product-group/add/`)
              }}
            >
              <HBIcon type="plus" size="small" />
              {formatMessage(productGroupMessages.add)}
            </HBButton>
          </Box>
          <HBTreeView
            selected={nodeId}
            //@ts-ignore
            AddComponent={TreeViewAddButton}
            //@ts-ignore
            ItemComponent={TreeViewItem}
            onNodeSelect={handleSelect}
            treeItems={nodes}
            sx={{ width: '100%' }}
          />
        </Box>
      </>
    )
  }, [])

  return <Tree />
}
