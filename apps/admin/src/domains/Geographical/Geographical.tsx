import { HBViewContainerWithTree } from '@hasty-bazar/admin-shared/containers/HBViewContainerWithTree'
import TreeViewItem from '@hasty-bazar/admin-shared/containers/HBViewContainerWithTree/components/TreeViewItem/TreeViewItem'
import sideBarMessages from '@hasty-bazar-admin/core/translations/sidebar.messages'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { errorsToString } from '@hasty-bazar/admin-shared/utils'
import { HBForm, HBIcon, HBIconButton, HBToast, openToast, RenderTree } from '@hasty-bazar/core'
import { Box, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { isEmpty } from 'ramda'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import { HBExplanation } from '@hasty-bazar/admin-shared/containers/HBExplanation'
import {
  GeoCenterSelectionFormSection,
  GeoForm,
  GeoInformationFormSection,
  GeoPolygonSelectionFormSection,
  PageTitleBar,
} from './containers'
import GeographicalMessages from './Geographical.messages'
import { classes } from './Geographical.style'
import {
  useGetAdminLocalityGeosQuery,
  usePostAdminLocalityGeosMutation,
  usePutAdminLocalityGeosByIdMutation,
} from './localityApi.enhanced'

interface ITreeNode extends RenderTree {
  depth: number
}

export type ShowTostType = {
  open: boolean
  message: string
  type?: 'error' | 'success'
}
export const FORM_ID = 'geoForm'
const Geographical = (): any => {
  const { formatMessage } = useIntl()
  const breadcrumbs = [
    {
      url: '/',
      title: formatMessage(sideBarMessages.dashboard),
    },
    {
      url: '#',
      title: formatMessage(sideBarMessages.geographical),
    },
  ]
  const router = useRouter()
  const action = router.query.action as string
  const id = router.query?.id as string
  const parentId = (router.query?.parentId as string) || null
  const [expandedLevel, setExpandedLevel] = useState<number[]>([])
  const formProviderProps = useForm<GeoForm>({ mode: 'onSubmit' })
  const [searched, setSearched] = useState('')

  const { reset } = formProviderProps

  const [showTost, setShowToast] = useState<ShowTostType>({ open: false, message: '' })
  const [selectedNodeId, setSelectedNodeId] = useState<string>(id)

  const [createGeo, { error: createError, isSuccess: createSuccess, reset: createReset }] =
    usePostAdminLocalityGeosMutation({
      fixedCacheKey: 'GetLocalityGeosQuery',
    })

  const [
    updateGeo,
    { data: updateData, error: updateError, isSuccess: updateSuccess, reset: updateReset },
  ] = usePutAdminLocalityGeosByIdMutation()

  const onSubmit = async (formData: GeoForm) => {
    createReset()
    updateReset()

    const { distanceFromCenter, ...body } = formData
    const polygonJson = JSON.stringify(body?.polygonJson || [])
    if (action === 'edit') {
      updateGeo({
        'client-name': 'createGeoModel',
        'client-version': '1.0.0',
        id: id! as unknown as string,
        updateGeoModel: {
          ...body,
          distanceFromCenter: distanceFromCenter ? distanceFromCenter : null,
          polygonJson,
        },
      }).then((res: any) => {
        if (res?.data?.success) {
          openToast({ message: formatMessage(phrasesMessages.successUpdate), type: 'success' })
        }
      })
    }

    if (action === 'add') {
      const treeNode = treeItems.filter((item) => item.id === parentId)[0]
      if (parentId !== '0' && treeNode.depth! >= Number(body?.geoTypeValueCode)) {
        openToast({
          message: formatMessage(
            GeographicalMessages.notPossibleToAddGeographicDivisionAtThisLevel,
          ),
          type: 'error',
        })
        return
      }
      createGeo({
        'client-name': 'createGeoModel',
        'client-version': '1.0.0',
        createGeoModel: {
          ...body,
          distanceFromCenter: distanceFromCenter ? distanceFromCenter : null,
          polygonJson,
          parentId: Number(body?.geoTypeValueCode) === 1 ? null : (parentId! as unknown as string),
        },
      }).then((res: any) => {
        //@ts-ignore
        if (res.data?.success) {
          openToast({ message: formatMessage(phrasesMessages.successAdd), type: 'success' })
          //@ts-ignore
          setSelectedNodeId(res?.data?.data?.id)
          router.push(
            {
              pathname: '/geographical/edit',
              query: {
                //@ts-ignore
                id: res?.data?.data?.id,
              },
            },
            undefined,
            {
              shallow: true,
            },
          )
        }
      })
    }
  }

  const {
    data: { data: { items = [] } = {} } = {},
    refetch: refetchLocalityGeos,
    isLoading,
    isSuccess,
  } = useGetAdminLocalityGeosQuery(
    {
      'client-name': 'GetLocalityGeosQuery',
      'client-version': '1',
      pageNumber: 0,
      pageSize: 10000,
    },
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    },
  )

  const maxExpandedLevel = useRef<number>(1)

  let treeItems = useMemo(
    () =>
      items?.map(({ id, title, geoTypeValueName, parentId, iconUrl, depth, path }): ITreeNode => {
        const level = (path?.split?.('/')?.length || 3) - 2
        if (level > maxExpandedLevel.current) {
          maxExpandedLevel.current = level
        }
        return {
          id: String(id),
          pid: parentId ? String(parentId) : null,
          name: `${geoTypeValueName} ${title}`,
          icon: (iconUrl as unknown as any) || 'Plus',
          depth: depth!,
          level,
        }
      }) || [],
    [items],
  )

  const onNodeSelect = (nodeId: string, type: string) => {
    setSelectedNodeId(nodeId)
    router.push(
      {
        pathname: `/geographical/${type}`,
        query: {
          [type === 'edit' ? 'id' : 'parentId']: nodeId,
        },
      },
      undefined,
      {
        shallow: true,
      },
    )
  }

  const handleAdd = () => {
    router.push(
      {
        pathname: '/geographical/add',
        query: {
          parentId: 0,
        },
      },
      undefined,
      {
        shallow: true,
      },
    )
  }

  const resetMap = (event: any) => {
    event.stopPropagation()
    refetchLocalityGeos()
  }

  const recursiveAddParent = (pid: string, allTreeData: ITreeNode[]) => {
    const parentItem = allTreeData.find((x) => x?.id === pid)
    if (parentItem) {
      treeItems.push(parentItem)
      if (parentItem?.pid) {
        recursiveAddParent(parentItem?.pid, allTreeData)
      }
    }
  }

  if (searched) {
    const allTreeData = [...treeItems]
    treeItems = allTreeData.filter((x) => x.name.includes(searched))
    treeItems.forEach((item: RenderTree) => {
      if (item?.pid) {
        recursiveAddParent(item.pid, allTreeData)
      }
    })
    treeItems = treeItems.filter(
      (value, index, self) => self.findIndex((v) => v.id === value.id) === index,
    )
  }

  const finalExpanded = useMemo<string[]>((): string[] => {
    let result = undefined

    if (expandedLevel.length > 0 && !searched) {
      result = treeItems.map((x: RenderTree) => expandedLevel?.includes(x?.level || 0) && x.id)
    } else {
      result = searched && !isLoading ? treeItems?.map((x) => x.id) : []
    }
    return result.filter((x) => x) as string[]
  }, [searched, expandedLevel])

  return (
    <>
      <HBViewContainerWithTree
        breadcrumb={
          <BreadCrumbSection
            title={formatMessage(GeographicalMessages.geographicalTitleBreadcrumb)}
            breadItems={breadcrumbs}
          />
        }
        pageTitleBar={
          <PageTitleBar
            onCreate={handleAdd}
            refetch={refetchLocalityGeos}
            onDeleteSuccess={() => reset({})}
            setSelectedNodeId={setSelectedNodeId}
          />
        }
        treeProps={{
          id: 'geographical',
          setExpandedLevel,
          maxExpandedLevel: maxExpandedLevel.current,
          expanded: finalExpanded,
          showSearch: true,
          handleSearch: (search: string) => setSearched(search),
          treeItemsConfig: {
            isSuccess,
          },
          onClickAddChild: (id) => {
            onNodeSelect(id, 'add')
          },
          treeItems: treeItems || [],
          selected: selectedNodeId as any,
          ItemComponent: TreeViewItem as any,
          sx: {
            width: '100%',
            minWidth: '100%',
          },
          onNodeSelect: ((e: unknown, id: string) => onNodeSelect(id, 'edit')) as any,
        }}
      >
        <HBForm<GeoForm> id={FORM_ID} formProviderProps={formProviderProps} onSubmit={onSubmit}>
          <Box sx={classes.optionsColumn}>
            <Box sx={classes.mainOptions} bgcolor="common.white">
              <GeoInformationFormSection />
            </Box>
            <HBExplanation
              defaultExpanded={true}
              elevation={0}
              summary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                    {items?.find((item) => item.id === id)?.lat && (
                      <HBIcon type="checkCircle" size="small" />
                    )}
                    {formatMessage(GeographicalMessages.selectCoordinatesCenter)}
                  </Typography>
                  <HBIconButton
                    icon="refresh"
                    variant="outlined"
                    onClick={resetMap}
                    tooltip={formatMessage(GeographicalMessages.reset)}
                  />
                </Box>
              }
              detail={<GeoCenterSelectionFormSection />}
            />
            <HBExplanation
              elevation={0}
              summary={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h6" mr={2} sx={{ display: 'flex', alignItems: 'center' }}>
                    {items?.find((item) => item.id == id)?.polygonJson &&
                      items?.find((item) => item.id == id)?.polygonJson !== '[]' && (
                        <HBIcon type="checkCircle" size="small" />
                      )}
                    {formatMessage(GeographicalMessages.selectAreaGeographical)}
                  </Typography>
                  <HBIconButton
                    icon="refresh"
                    variant="outlined"
                    onClick={resetMap}
                    tooltip={formatMessage(GeographicalMessages.reset)}
                  />
                </Box>
              }
              detail={<GeoPolygonSelectionFormSection localityGeoData={items} />}
            />
          </Box>
        </HBForm>
      </HBViewContainerWithTree>
      <HBToast
        open={showTost.open}
        message={showTost.message}
        type={showTost?.type || 'error'}
        autoHideDuration={6000}
        onClose={() => setShowToast({ open: false, message: '', type: showTost?.type })}
      />
    </>
  )
}

export default Geographical
