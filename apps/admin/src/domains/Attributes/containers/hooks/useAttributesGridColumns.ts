import BusinessData from '@hasty-bazar/admin-shared/components/BusinessData'
import { useGetAdminCatalogApiUnitOfMeasurementGetAllQuery } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { useGetAdminGeneralDataBusinessTypeValueGetAllQuery } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { useIntl } from 'react-intl'
import attributesPageMessages from '../../Attributes.messages'
import AttributeCustomFilter from '../../components/AttributeCustomFilter'

function useAttributesGridColumns() {
  const { formatMessage } = useIntl()
  const { data: businessTypeData } = useGetAdminGeneralDataBusinessTypeValueGetAllQuery({
    'client-name': 'generalData',
    'client-version': '0',
    pageSize: 1000,
  })

  const { data: unitOfMeasurementIds } = useGetAdminCatalogApiUnitOfMeasurementGetAllQuery({
    'client-name': 'generalData',
    'client-version': '0',
    pageSize: 1000,
  })

  const attributesGridColumns = [
    {
      field: 'id',
      headerName: formatMessage(attributesPageMessages.attributeColumnId),
      filter: 'agNumberColumnFilter',
      minWidth: 100,
      hide: true,
    },
    {
      field: 'kindTypeTitle',
      headerName: formatMessage(attributesPageMessages.attributeColumnKindTypeCode),
      minWidth: 110,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'code',
      headerName: formatMessage(attributesPageMessages.attributeColumnCode),
      filter: 'agTextColumnFilter',
      minWidth: 110,
    },
    {
      field: 'name',
      headerName: formatMessage(attributesPageMessages.attributeColumnName),
      filter: 'agTextColumnFilter',
      minWidth: 130,
      tooltipField: 'name',
    },
    {
      field: 'orginName',
      headerName: formatMessage(attributesPageMessages.originName),
      filter: 'agTextColumnFilter',
      minWidth: 130,
      tooltipField: 'orginName',
    },
    {
      field: 'groupTypeTitle',
      headerName: formatMessage(attributesPageMessages.attributeColumnGroupTypeCode),
      filter: 'agTextColumnFilter',
      minWidth: 150,
    },
    {
      field: 'dataTypeEnumTitle',
      headerName: formatMessage(attributesPageMessages.attributeColumnDataTypeCode),
      filter: 'agTextColumnFilter',
      minWidth: 150,
    },
    {
      field: 'businessEntityId',
      headerName: formatMessage(attributesPageMessages.attributeColumnRelatedEntityId),
      filter: 'agTextColumnFilter',
      minWidth: 130,
      hide: true,
    },
    {
      field: 'whereCondition',
      headerName: formatMessage(attributesPageMessages.attributeColumnWhereCondition),
      filter: 'agTextColumnFilter',
      minWidth: 120,
      hide: true,
    },
    {
      field: 'displayTypeTitle',
      headerName: formatMessage(attributesPageMessages.attributeColumnDisplayTypeCode),
      filter: 'agTextColumnFilter',
    },
    {
      field: 'displayTitleBefore',
      headerName: formatMessage(attributesPageMessages.attributeColumnDisplayTitleBefore),
      filter: 'agTextColumnFilter',
      minWidth: 160,
      hide: true,
    },
    {
      field: 'displayTitleAfter',
      headerName: formatMessage(attributesPageMessages.attributeColumnDisplayTitleAfter),
      filter: 'agTextColumnFilter',
      minWidth: 160,
      hide: true,
    },
    {
      field: 'unitOfMeasurementId',
      headerName: formatMessage(attributesPageMessages.attributeColumnUnitOfMeasurementId),
      filter: AttributeCustomFilter,
      filterParams: {
        enums: unitOfMeasurementIds?.data?.items,
      },
      minWidth: 130,
      hide: true,
      cellRenderer: BusinessData,
      cellRendererParams: {
        data: unitOfMeasurementIds,
      },
    },
    {
      field: 'minValue',
      headerName: formatMessage(attributesPageMessages.attributeColumnMinValue),
      filter: 'agNumberColumnFilter',
      hide: true,
    },
    {
      field: 'maxValue',
      headerName: formatMessage(attributesPageMessages.attributeColumnMaxValue),
      filter: 'agNumberColumnFilter',
      hide: true,
    },
    {
      field: 'numberOfDecimal',
      headerName: formatMessage(attributesPageMessages.attributeColumnNumberOfDecimal),
      filter: 'agNumberColumnFilter',
      minWidth: 120,
      hide: true,
    },
  ]

  return { attributesGridColumns }
}

export default useAttributesGridColumns
