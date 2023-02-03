import { ProductAttributeDto } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { Divider, Grid, List, ListItem, ListItemText, Stack, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import { FC, useEffect, useMemo, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import ShowMore from '../../../components/ShowMore'
import ProductionDetailMessages from '../../../productDetail.messages'
export interface IProductAttributesSectionProps {
  content: ProductAttributeDto[]
}
interface IGroupedAttributes {
  [x: string]: ProductAttributeDto[]
}

const ProductAttributesSection: FC<IProductAttributesSectionProps> = ({ content }) => {
  const [expand, setExpand] = useState(false)
  const [attributes, setAttributes] = useState<ProductAttributeDto[] | IGroupedAttributes[]>([])

  const groupBy = (arr: any[], property: string): IGroupedAttributes => {
    return arr.reduce((memo, x) => {
      if (!memo[x[property]]) {
        memo[x[property]] = []
      }
      memo[x[property]].push(x)
      return memo
    }, {})
  }

  const preparedAttributes = useMemo(() => {
    const attrs = []
    if (content.some((attr) => attr.groupTypeCode)) {
      const groupedAttributes = groupBy(content, 'groupTypeCode')
      for (const [key, value] of Object.entries(groupedAttributes)) {
        const groupTypeCode =
          groupedAttributes[key]?.find((item) => item.groupTypeCode)?.groupTypeCode ?? ''
        const groupTypeName =
          groupedAttributes[key]?.find((item) => item.groupTypeName)?.groupTypeName ?? ''
        const myObject = { groupTypeCode, groupTypeName, children: value }
        attrs.push(myObject)
      }
      return attrs
    } else return content
  }, [content])

  useEffect(() => {
    if (content.some((attr) => attr.groupTypeCode)) {
      setAttributes(preparedAttributes.slice(0, 1))
    } else {
      setAttributes(content.slice(0, 5))
    }
  }, [content])

  const getBodyText = () => {
    if (!expand) {
      return setAttributes(preparedAttributes)
    }
    return setAttributes(preparedAttributes.slice(0, 1) ?? [])
  }

  const handleShowMore = () => {
    setExpand(!expand)
    getBodyText()
  }

  let easing = [0.6, -0.05, 0.01, 0.99]
  const fadeInUp = {
    initial: {
      height: 60,
      opacity: 0,
      transition: { duration: 0.6, ease: easing },
    },
    animate: {
      height: 'auto',
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: easing,
      },
    },
  }

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.4,
      },
    },
  }

  return (
    <Stack spacing={8}>
      <Typography variant="subtitle1">
        <FormattedMessage {...ProductionDetailMessages.attributesSection} />
      </Typography>
      <motion.div variants={stagger} initial="initial" animate="animate">
        <List
          sx={(theme) => ({
            width: '100%',
            bgcolor: 'grey.100',
            borderRadius: theme.spacing(4),
          })}
        >
          {attributes?.map((item, index) => {
            return (
              <motion.div key={index} variants={fadeInUp}>
                <ListItem key={index} alignItems="flex-start">
                  <Grid container spacing={5}>
                    {'children' in item ? (
                      <>
                        <Grid item xs={12}>
                          <ListItemText sx={{ color: 'text.secondary' }}>
                            {typeof item?.groupTypeName === 'string' && item?.groupTypeName}
                          </ListItemText>
                        </Grid>
                        {item?.children?.map((child, idx) => {
                          return (
                            <Grid item container xs={12} columnSpacing={4} mx={1}>
                              <Grid item xs={4.5} sm={3}>
                                <ListItemText>{child.name}</ListItemText>
                              </Grid>
                              <Grid item xs={7.5} sm={9}>
                                <ListItemText
                                  primary={
                                    <Typography
                                      sx={{ display: 'inline' }}
                                      component="span"
                                      variant="body2"
                                      color="text.primary"
                                    >
                                      {child.displayValue}
                                    </Typography>
                                  }
                                />
                                {idx < item?.children.length - 1 ? (
                                  <Divider
                                    variant="fullWidth"
                                    sx={({ spacing }) => ({ borderColor: 'white', py: spacing(2) })}
                                  />
                                ) : null}
                              </Grid>
                            </Grid>
                          )
                        })}
                      </>
                    ) : (
                      <>
                        <Grid item xs={4.5} sm={3}>
                          <ListItemText sx={{ color: 'text.secondary' }}>
                            {typeof item?.name === 'string' && item.name}
                          </ListItemText>
                        </Grid>
                        <Grid item xs={7.5} sm={9}>
                          <ListItemText
                            primary={
                              <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                {typeof item?.displayValue === 'string' && item.displayValue}
                              </Typography>
                            }
                          />
                          {index < attributes.length - 1 ? (
                            <Divider
                              variant="fullWidth"
                              sx={({ spacing }) => ({ borderColor: 'white', py: spacing(2) })}
                            />
                          ) : null}
                        </Grid>
                      </>
                    )}
                  </Grid>
                </ListItem>
              </motion.div>
            )
          })}
        </List>
      </motion.div>
      {(preparedAttributes.length ? preparedAttributes?.length > 1 : attributes.length > 5) && (
        <ShowMore expandState={expand} onClickHandler={handleShowMore} />
      )}
    </Stack>
  )
}

export default ProductAttributesSection
