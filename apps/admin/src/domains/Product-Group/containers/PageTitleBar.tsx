import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { HBChangeRecordHistory } from '@hasty-bazar/admin-shared/containers/HBChangeRecordHistory'
import {
  useDeleteAdminCatalogCategoriesByIdMutation,
  useLazyGetAdminCatalogCategoriesByIdCreateExcelTemplateQuery,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { MenuItemProps } from '@hasty-bazar/core'
import { LinearProgress } from '@mui/material'
import HBGrigToolbarItem from 'libs/core/src/components/HBGrigToolbar/components/HBGrigToolbarItem'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useIntl } from 'react-intl'
import DataGrigToolbar from '../components/DataGrigToolbar'
import { IProductGroupsFormTypes } from '../types'

type PropTypes = {
  onClickAddChild: (
    id?: string | undefined,
    handleExpansionClick?: () => void,
    expanded?: boolean,
  ) => void
  setSelectedNodeId: Dispatch<SetStateAction<string>>
  onDelete: () => void
}

export default function PageTitleBar(props: PropTypes) {
  const { onClickAddChild, setSelectedNodeId } = props
  const { query: { slug: [action, nodeId] = [] } = {}, push, asPath } = useRouter()
  const { formatMessage } = useIntl()
  const [deleteCategory] = useDeleteAdminCatalogCategoriesByIdMutation()
  const [recordChangeHistory, setRecordChangeHistory] = useState({
    show: false,
    entityId: '',
  })
  const [getExcelTemplate, { isLoading }] =
    useLazyGetAdminCatalogCategoriesByIdCreateExcelTemplateQuery()

  const formContext = useFormContext<IProductGroupsFormTypes>()
  const { isAllocatableToProduct } = useWatch({
    control: formContext.control,
  })

  const handleRefresh = () => {
    setSelectedNodeId('')
    push({ pathname: '/product-group' })
  }
  const { isDirty, isValid, dirtyFields } = formContext?.formState || {}

  const handelRecordHistory = () => {
    setRecordChangeHistory({ show: true, entityId: nodeId })
  }

  const HandleDownloadExcelTemp = () => {
    getExcelTemplate({
      'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
      'client-version': '1.0.1.100',
      id: nodeId,
    }).then((res) => {
      if (res?.data?.success && res?.data?.data?.excelFile)
        window.open(process.env.NEXT_PUBLIC_CDN + '/' + res.data.data.excelFile, '_blank')
    })
  }

  const getAction = useMemo((): MenuItemProps[] => {
    if (!nodeId) return []
    const menuItems: MenuItemProps[] = [
      {
        label: formatMessage(phrasesMessages.recordHistory),
        icon: 'fileDownload',
        onClick: handelRecordHistory,
      },
    ]

    if (isAllocatableToProduct)
      menuItems.push({
        label: formatMessage(phrasesMessages.downloadAddGroupTemplate),
        icon: 'downloadAlt',
        onClick: HandleDownloadExcelTemp,
      })

    return menuItems
  }, [nodeId, isAllocatableToProduct])

  const isAllowSave = isDirty && isValid && Object.keys(dirtyFields).length > 0

  return (
    <>
      <DataGrigToolbar
        deleteProps={{ disabled: action === 'edit' ? false : true }}
        addProps={{
          type: 'submit',
          tooltip: formatMessage(phrasesMessages.save),
          disabled: !isAllowSave,
        }}
        editProps={{ show: false }}
        refreshProps={{ onClick: handleRefresh }}
        searchProps={{ show: false }}
        items={getAction}
        onClick={({ type }) => {
          if (type === 'refresh') push(asPath)
          if (type === 'delete') {
            deleteCategory({
              'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
              'client-version': '1.0.1.100',
              id: nodeId,
            }).then((res) => {
              //@ts-ignore
              if (res?.data?.success) {
                props?.onDelete()
                push('/product-group')
              }
            })
          }
        }}
      >
        <HBGrigToolbarItem
          icon="plus"
          tooltip={'جدید'}
          onClick={() => onClickAddChild('')}
          disabled={!!action}
        />
      </DataGrigToolbar>
      <HBChangeRecordHistory
        open={recordChangeHistory.show}
        entityId={recordChangeHistory.entityId!}
        onClose={() => setRecordChangeHistory({ show: false, entityId: '' })}
        tableName="category"
      />
      {isLoading && (
        <LinearProgress
          color="primary"
          sx={(theme) => ({
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            zIndex: theme.zIndex.appBar + 1,
          })}
        />
      )}
    </>
  )
}
