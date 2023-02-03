import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import useToast from '@hasty-bazar/admin-shared/hooks/useToast'
import {
  useDeleteAdminCatalogApiAttributeValueByIdMutation,
  usePostAdminCatalogApiAttributeValueMutation,
  usePutAdminCatalogApiAttributeValueByIdMutation,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { useIntl } from 'react-intl'
import attributesPageMessages from '../../Attributes.messages'
import { IAttributeDetailSubjectForm } from '../../components'

export function useAttributesGridActions({
  attributeId,
  refreshGridData,
  cancelEdit,
}: {
  attributeId: string
  refreshGridData: () => void
  cancelEdit: () => void
}) {
  const [addAttributeValue] = usePostAdminCatalogApiAttributeValueMutation()
  const [updateAttributeValue] = usePutAdminCatalogApiAttributeValueByIdMutation()
  const [deleteAttributeValue] = useDeleteAdminCatalogApiAttributeValueByIdMutation()
  const [updateAttributeValueMutation] = usePutAdminCatalogApiAttributeValueByIdMutation()

  const { showToast } = useToast()
  const { formatMessage } = useIntl()

  const addAttributeDetailValue = (values: IAttributeDetailSubjectForm) => {
    addAttributeValue({
      'client-name': 'default',
      'client-version': '0',
      createAttributeValueModel: {
        attributeId,
        iconPath: values.attributeIcon,
        value: values.attributeValue,
        isActive: true,
        sortOrder: +values.displayOrder,
        color: values.attributeColor,
      },
    })
      .unwrap()
      .then((res) => {
        refreshGridData()
        cancelEdit()
      })
  }
  const updateAttributeDetailValue = (values: IAttributeDetailSubjectForm) => {
    updateAttributeValue({
      'client-name': 'default',
      'client-version': '0',
      id: values.id || '',
      updateAttributeValueModel: {
        attributeId,
        iconPath: values.attributeIcon,
        value: values.attributeValue,
        isActive: values.attributeStatus,
        sortOrder: +values.displayOrder,
        color: values.attributeColor,
      },
    })
      .unwrap()
      .then((res) => {
        refreshGridData()
        cancelEdit()
      })
  }

  const removeAttribute = async (id?: string) => {
    if (!id) return

    deleteAttributeValue({
      'client-name': 'default',
      'client-version': '0',
      id: id!,
      attributeId,
    })
      .unwrap()
      .then((res) => {
        refreshGridData()
      })
      .catch((err) => {})
      .finally(() => {
        cancelEdit()
      })
  }

  const gridColumns = [
    {
      field: 'value',
      headerName: formatMessage(attributesPageMessages.attributesColumnValue),
      minWidth: 120,
      filter: 'agTextColumnFilter',
      maxWidth: 120,
    },
    {
      field: 'sortOrder',
      headerName: formatMessage(attributesPageMessages.attributesColumnDisplayOrder),
      minWidth: 200,
      maxWidth: 200,
    },
  ]

  const gridMenuItems = (
    selectRowByIdForUpdate: (id: string) => void,
    handleRemoveAttribute: (id?: string) => void,
    id?: string,
  ) => {
    return [
      {
        label: formatMessage(phrasesMessages.public),
        children: [
          {
            icon: 'editAlt',
            label: formatMessage(phrasesMessages.edit),
            onClick: () => {
              selectRowByIdForUpdate(id!)
            },
          },
          {
            icon: 'trashAlt',
            label: formatMessage(phrasesMessages.delete),
            onClick: () => {
              handleRemoveAttribute(id)
            },
          },
        ],
      },
    ]
  }

  const changeActive = async (selectedRows: any[], status: boolean) => {
    for (const row of selectedRows) {
      await updateAttributeValueMutation({
        'client-name': 'default',
        'client-version': '0',
        id: row.id,
        updateAttributeValueModel: {
          ...row,
          isActive: status,
          attributeId,
        },
      })
    }
  }

  return {
    addAttributeDetailValue,
    updateAttributeDetailValue,
    removeAttribute,
    gridColumns,
    gridMenuItems,
    changeActive,
  }
}
