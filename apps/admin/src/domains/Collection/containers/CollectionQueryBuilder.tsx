import { CollectionOeratorsEnums } from '@hasty-bazar/admin-shared/core/enums'
import {
  CollectionType,
  CreateCollectionModel,
  GetCollectionFieldsQueryResultCollectionQueryResult,
  useGetAdminGeneralDataCollectionCollectionDataTypesQuery,
  useGetAdminGeneralDataCollectionCollectionFieldsProductAttributesQuery,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { openToast } from '@hasty-bazar/core'
import {
  defaultRuleProcessorMongoDB,
  defaultValueProcessorByRule,
  Field,
  formatQuery,
  HBQueryBuilder,
  parseMongoDB,
  RuleGroupType,
  RuleProcessor,
  ValueProcessorByRule,
} from '@hasty-bazar/query-builder'
import { NoSsr } from '@mui/material'
import HBGrigToolbarItem from 'libs/core/src/components/HBGrigToolbar/components/HBGrigToolbarItem'
import HBGridToolbar from 'libs/core/src/components/HBGrigToolbar/HBGrigToolbar'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useIntl } from 'react-intl'
import collectionPageMessages from '../CollectionPage.messages'
import {
  useGetAdminGeneralDataCollectionByIdQuery,
  usePutAdminGeneralDataCollectionByIdMutation,
} from '../generalDataApi.enhanced'
import FieldSelector from './customQueryComponent/FieldSelector'
import ValueEditor from './customQueryComponent/ValueEditor'

export interface CollectionAddEditFormType extends CreateCollectionModel {
  id: string
}
export interface CollectionQueryBuilderProps {
  collectionType?: CollectionType | undefined
  formProviderProps?: UseFormReturn<any, any>
  collectionFieldData?: GetCollectionFieldsQueryResultCollectionQueryResult
  collectionFieldsRefetch: () => void
  changeQuery?: () => void
}

const CollectionQueryBuilder: FC<CollectionQueryBuilderProps> = ({
  collectionType,
  formProviderProps,
  collectionFieldData,
  collectionFieldsRefetch,
  changeQuery,
}) => {
  const router = useRouter()
  const id = router.query.id?.[0]
  const { formatMessage } = useIntl()

  const { data: collectionData } = useGetAdminGeneralDataCollectionByIdQuery(
    {
      'client-name': 'Swagger on HIT.Hastim.GeneralData.Endpoints.WebApi',
      'client-version': '1.0.1.100',
      id: id!,
    },
    {
      skip: !id,
    },
  )

  const { data: productAttributes, refetch: productAttributesRefetch } =
    useGetAdminGeneralDataCollectionCollectionFieldsProductAttributesQuery(
      {
        'client-name': 'Swagger on HIT.Hastim.GeneralData.Endpoints.WebApi',
        'client-version': '1.0.1.100',
        collectionType,
      },
      {
        skip: !collectionType,
      },
    )

  const { data: collectionDataTypes } = useGetAdminGeneralDataCollectionCollectionDataTypesQuery({
    'client-name': 'Swagger on HIT.Hastim.GeneralData.Endpoints.WebApi',
    'client-version': '1.0.1.100',
  })

  const [updateCollection, { error: updateError, data: updateCollectionData }] =
    usePutAdminGeneralDataCollectionByIdMutation()

  const initialQuery: RuleGroupType = {
    combinator: 'and',
    rules: [],
  }

  const [query, setQuery] = useState(initialQuery)
  const [fields, setFields] = useState<Field[]>([])

  useEffect(() => {
    collectionFieldsRefetch()
    productAttributesRefetch()
  }, [collectionType])

  const getOeratorsValue = (value: number) => {
    switch (value) {
      case CollectionOeratorsEnums.Equal:
        return '='
      case CollectionOeratorsEnums.Bigger:
        return '>'
      case CollectionOeratorsEnums.Smaller:
        return '<'
      case CollectionOeratorsEnums.GreaterEqual:
        return '>='
      case CollectionOeratorsEnums.SmallerEqual:
        return '<='
      case CollectionOeratorsEnums.Against:
        return '!='
      case CollectionOeratorsEnums.In:
        return 'in'
      case CollectionOeratorsEnums.NotIn:
        return 'notIn'
      case CollectionOeratorsEnums.IsNull:
        return 'null'
      case CollectionOeratorsEnums.IsNotNull:
        return 'notNull'
      case CollectionOeratorsEnums.Contains:
        return 'contains'
      case CollectionOeratorsEnums.DoesNotContain:
        return 'doesNotContain'
      default:
        return '='
    }
  }

  const getOerators = (dataTypeValue: number) => {
    return (
      collectionDataTypes?.data?.items?.filter(
        (dataType) => dataType.dataType === dataTypeValue,
      )[0] as any
    )?.operationTypes?.map((item: any) => {
      let label = ''
      try {
        //@ts-ignore//
        label = formatMessage(collectionPageMessages[item.operationTypeTitle.toLowerCase()])
      } catch {
        label = item.operationTypeTitle
      }

      return {
        name: getOeratorsValue(item.operationType),
        label,
      }
    })
  }

  useEffect(() => {
    if (collectionDataTypes?.data?.totalItems! > 0 && collectionFieldData?.totalItems! > 0) {
      const fieldsData = collectionFieldData?.items?.map((item) => {
        return {
          name: item.name,
          label: item.title,
          operators: getOerators(item.dataType!),
          type: item.dataTypeTitle,
          isShow: true,
          metaData: item.metaData,
        } as Field
      })

      productAttributes?.data?.items?.forEach((item) => {
        fieldsData?.push({
          name: item.name,
          label: item.title,
          operators: getOerators(item.dataType!),
          type: item.dataTypeTitle,
          values: item.items,
          isShow: false,
          metaData: item.metaData,
        } as Field)
      })

      setFields([...fieldsData!])
    }
  }, [collectionFieldData?.items, collectionDataTypes, productAttributes?.data?.items?.length])

  useEffect(() => {
    if (updateCollectionData?.success) {
      openToast({ message: formatMessage(collectionPageMessages.successEdit), type: 'success' })
    }
  }, [updateCollectionData])

  useEffect(() => {
    if (collectionData?.data?.query?.json) {
      setQuery(JSON.parse(collectionData?.data?.query?.json))
    } else {
      setQuery({
        combinator: 'or',
        rules: [],
        not: false,
      })
    }
  }, [collectionData, collectionFieldData, collectionDataTypes])

  const customRuleProcessor: RuleProcessor = (rule, options) => {
    if (rule.field === 'Username' || rule.field === 'CellPhoneNumber') {
      return defaultRuleProcessorMongoDB(rule, { parseNumbers: false })
    }

    return defaultRuleProcessorMongoDB(rule, options)
  }

  const handleSubmit = async () => {
    const data = formProviderProps?.getValues() as CollectionAddEditFormType
    const putModel: CreateCollectionModel = {
      name: data.name,
      code: data.code,
      collectionType: Number(data.collectionType) as CollectionType,
      maxDisplayResult: data.maxDisplayResult,
      query: {
        json: formatQuery(query, 'json')
          .replace(/(?<="field"\s*:\s*"Username"[^}]*"value"\s*:\s*)(\d+(?=\s+))/gm, '"0$1"')
          .replace(
            /(?<="field"\s*:\s*"CellPhoneNumber"[^}]*"value"\s*:\s*)(\d+(?=\s+))/gm,
            '"0$1"',
          ),
        sql: formatQuery(query, 'sql'),
        mongo: formatQuery(query, 'mongodb', customRuleProcessor)
          .replace(/":("\d{4}-\d{2}-\d{2}[^"]*")/gm, "\":ISODate('$1')")
          .replace(/"(\d{4}-\d{2}-\d{2}[^"]*)"/gm, '$1'),
      },
      queryType: data.queryType,
      collectionSortOptionId: data.collectionSortOptionId || null,
      originName: data.originName,
    }

    updateCollection({
      'client-name': 'update-attribute',
      'client-version': '1.0.0',
      updateCollectionModel: putModel,
      id: data.id,
    }).then((res: any) => {
      if (res && res?.data?.success) {
        changeQuery?.()
      }
    })
  }

  return (
    <NoSsr>
      <HBGridToolbar
        searchProps={{ show: false }}
        editProps={{ show: false }}
        addProps={{ show: false }}
        deleteProps={{ show: false }}
        refreshProps={{ show: false }}
        statusProps={{ show: false }}
      >
        <HBGrigToolbarItem icon="check" onClick={handleSubmit} type={'submit'} />
      </HBGridToolbar>
      {fields.length > 0 && (
        <HBQueryBuilder
          fields={fields}
          query={query}
          onQueryChange={(q) => setQuery(q as any)}
          controlElements={{ fieldSelector: FieldSelector, valueEditor: ValueEditor }}
        />
      )}
    </NoSsr>
  )
}

export default CollectionQueryBuilder
