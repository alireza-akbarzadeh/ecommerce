import { HBLink } from '@hasty-bazar-commerce/components'
import { ProductFilter } from '@hasty-bazar-commerce/services/generalDataApi.generated'
import { HBBreadcrumbs, HBIcon } from '@hasty-bazar/core'
import { Box, Collapse, Grid, Paper, Typography } from '@mui/material'
import Image from 'next/image'
import { FC, useMemo, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useDispatch } from 'react-redux'
import SearchMessages from '../Search.messages'
import { replaceFilterItem } from '../SearchFilter.reducer'
import { IFilter, IFilterItems } from '../searchFilterModels'

interface IProps {
  categoriesFilter: IFilter
  handleSubmitFilters(v: IFilterItems): void
  selectedFilters: ProductFilter
  filterLoading: boolean
}
export const CategoriesWidget: FC<IProps> = (props) => {
  const [collapse, setCollapse] = useState(false)
  const { formatMessage } = useIntl()
  const dispatch = useDispatch()

  const selectedCategoriesChilds = useMemo(
    () =>
      props.categoriesFilter?.items
        ?.filter((item) => item.id === props.selectedFilters?.categories?.[0])
        ?.map((item) => item?.children)
        ?.flat(),
    [props.selectedFilters, props.categoriesFilter],
  )

  const breadcrumbsCategories = useMemo(() => {
    let breadcrumbs: IFilterItems[] = []

    props?.categoriesFilter?.items.forEach((parentCategories) => {
      if (String(parentCategories.id) === String(props.selectedFilters?.categories?.[0])) {
        breadcrumbs = parentCategories.breadCrumbs as IFilterItems[]
      } else {
        parentCategories?.children?.forEach?.((child) => {
          if (child.id === props.selectedFilters?.categories?.[0]) {
            breadcrumbs = child.breadCrumbs as IFilterItems[]
          }
        })
      }
    })

    return breadcrumbs
  }, [props.selectedFilters, props.categoriesFilter])

  return (
    <>
      <Grid item xs={12}>
        {props.filterLoading ? (
          <Box height={36} />
        ) : (
          <HBBreadcrumbs
            separator={<HBIcon type="angleLeft" size="small" />}
            sx={{ marginX: 4, paddingBottom: 4 }}
          >
            <HBLink href="/" underline="none" color="info.main">
              {formatMessage(SearchMessages.dartil)}
            </HBLink>
            {breadcrumbsCategories?.map((category) => (
              <HBLink
                key={category.id}
                underline="none"
                color="info.main"
                onClick={() => {
                  props.handleSubmitFilters(category)
                  dispatch(replaceFilterItem(category))
                }}
              >
                {category.filterItemTitle}
              </HBLink>
            ))}
          </HBBreadcrumbs>
        )}
      </Grid>

      {selectedCategoriesChilds?.length > 0 && (
        <Grid
          item
          xs={12}
          container
          component={Paper}
          elevation={0}
          mb={4}
          sx={{ borderRadius: 2 }}
        >
          <Grid item xs={12} p={4}>
            <Typography variant="h6">
              <FormattedMessage {...SearchMessages.productCategories} />
            </Typography>
          </Grid>
          <Grid
            item
            lg={12}
            p={{ xs: 2, lg: 10 }}
            container
            sx={{ overflowX: { xs: 'scroll', lg: 'unset' } }}
          >
            {selectedCategoriesChilds?.map?.((category, idx) =>
              idx < 8 ? (
                <Box
                  key={category?.filterItemTitle}
                  sx={{
                    cursor: 'pointer',
                    '& img': {
                      borderRadius: '100%',
                      backgroundColor: 'grey.100',
                    },
                  }}
                  mx={1}
                  onClick={() => {
                    if (category) {
                      props.handleSubmitFilters(category)
                      dispatch(replaceFilterItem(category))
                    }
                  }}
                >
                  <Image
                    alt=""
                    src={
                      category?.imageUrl
                        ? `${process.env.NEXT_PUBLIC_CDN}${category?.imageUrl}`
                        : '/assets/defaultImage.png'
                    }
                    width={107}
                    height={107}
                  />
                  <Typography variant="subtitle1" m={1} width={100} align="center">
                    {category?.filterItemTitle}
                  </Typography>
                </Box>
              ) : null,
            )}
            {selectedCategoriesChilds?.length > 8 && !collapse && (
              <Box
                width={107}
                height={107}
                sx={{
                  display: { xs: 'none', lg: 'flex' },
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: '100%',
                  backgroundColor: 'grey.100',
                  cursor: 'pointer',
                }}
                onClick={() => setCollapse(!collapse)}
              >
                <Typography variant="caption" align="center">
                  <FormattedMessage {...SearchMessages.view} />
                  <Typography variant="h6" align="center">
                    {selectedCategoriesChilds.length - 8}
                  </Typography>
                  <FormattedMessage {...SearchMessages.otherCategories} />
                </Typography>
              </Box>
            )}
          </Grid>

          <Collapse
            sx={{
              display: {
                xs: 'none',
                lg: 'block',
              },
              width: '100%',
            }}
            in={collapse}
          >
            {selectedCategoriesChilds.length > 8 && (
              <Grid item lg={12} p={10} container>
                {selectedCategoriesChilds?.map?.((category, idx) =>
                  idx > 7 ? (
                    <Box key={category?.filterItemTitle}>
                      <Image
                        alt=""
                        src={
                          category?.imageUrl
                            ? `${process.env.NEXT_PUBLIC_CDN}${category?.imageUrl}`
                            : '/assets/defaultImage.png'
                        }
                        width={107}
                        height={107}
                        style={{ borderRadius: '100%' }}
                      />
                      <Typography variant="subtitle1" m={1} width={100} align="center">
                        {category?.filterItemTitle}
                      </Typography>
                    </Box>
                  ) : null,
                )}
                <Box
                  width={107}
                  height={107}
                  sx={{
                    display: { xs: 'none', lg: 'flex' },
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '100%',
                    backgroundColor: 'grey.100',
                    cursor: 'pointer',
                    marginLeft: 'auto',
                  }}
                  onClick={() => setCollapse(!collapse)}
                >
                  <Typography variant="caption" align="center">
                    <FormattedMessage {...SearchMessages.noView} />
                  </Typography>
                </Box>
              </Grid>
            )}
          </Collapse>
        </Grid>
      )}
    </>
  )
}
