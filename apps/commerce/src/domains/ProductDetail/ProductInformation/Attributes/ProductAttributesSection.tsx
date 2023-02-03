import ShowMore from '@hasty-bazar-commerce/components/ShowMore'
import { ProductAttributeDto } from '@hasty-bazar-commerce/services/catalogApi.generated'
import {
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Stack,
  styled,
  Typography,
  typographyClasses,
} from '@mui/material'
import { motion } from 'framer-motion'
import { FC, useEffect, useMemo, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import ProductionDetailMessages from '../../productDetail.messages'
import dayjs from 'dayjs'

export interface IProductAttributesSectionProps {
  content: ProductAttributeDto[]
}
interface IGroupedAttributes {
  [x: string]: ProductAttributeDto[]
}

const ListItemTextStyle = styled(ListItemText)(() => ({
  [`& .${typographyClasses.root}`]: {
    userSelect: 'text',
  },
}))

const ProductAttributesSection: FC<IProductAttributesSectionProps> = ({ content }) => {
  const [expand, setExpand] = useState(false)
  const [attributes, setAttributes] = useState<ProductAttributeDto[] | IGroupedAttributes[]>([])
  const { formatDate } = useIntl()

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
        const groupTypeName = groupTypeCode
          ? groupedAttributes[key]?.find((item) => item.groupTypeName)?.groupTypeName ?? '#'
          : ''
        const myObject = {
          groupTypeCode,
          groupTypeName,
          children: value.filter((item) => item.name && item.displayValue),
        }
        attrs.push(myObject)
      }
      return attrs.filter((item) => item.children.length > 0)
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

  const returnDisplayValue = (value: string) => {
    if (dayjs(value).isValid() && value.includes('T')) {
      return formatDate(value, { year: 'numeric', day: '2-digit', month: '2-digit' })
    }
  }

  return (
    <Stack spacing={{ sm: 8, xs: 4 }}>
      <Typography variant="subtitle1">
        <FormattedMessage {...ProductionDetailMessages.attributesSectionProduct} />
      </Typography>
      <motion.div variants={stagger} initial="initial" animate="animate">
        <List
          sx={(theme) => ({
            width: '100%',
            bgcolor: 'grey.100',
            borderRadius: theme.spacing(4),
            p: { sm: 6, xs: theme.spacing(2, 5) },
            display: 'grid',
            rowGap: 6,
          })}
        >
          {attributes.map((item, index) => {
            return (
              <motion.div key={index} variants={fadeInUp}>
                <ListItem sx={{ p: 'unset' }}>
                  <Grid container spacing={4}>
                    {'children' in item ? (
                      <>
                        {item.groupTypeName ? (
                          <Grid item xs={12}>
                            <ListItem disablePadding disableGutters>
                              <ListItemTextStyle
                                primary={
                                  typeof item?.groupTypeName === 'string' && item?.groupTypeName
                                }
                                sx={{ userSelect: 'text' }}
                              />
                            </ListItem>
                          </Grid>
                        ) : null}
                        {item?.children?.map((child, idx) => {
                          return (
                            <Grid item container xs={12} columnSpacing={4} key={idx}>
                              <Grid item xs={4.5} sm={3}>
                                <ListItemTextStyle
                                  primary={child.name}
                                  primaryTypographyProps={{
                                    color: 'text.secondary',
                                    variant: 'caption',
                                  }}
                                  sx={{ userSelect: 'text' }}
                                />
                              </Grid>
                              <Grid item xs>
                                <ListItemTextStyle
                                  primary={returnDisplayValue(child.displayValue ?? '')}
                                  primaryTypographyProps={{
                                    variant: 'caption',
                                    color: 'text.primary',
                                  }}
                                  sx={{ userSelect: 'text' }}
                                />

                                {idx < item?.children.length - 1 ? (
                                  <Divider
                                    variant="fullWidth"
                                    sx={({ spacing }) => ({
                                      borderColor: 'common.white',
                                      py: spacing(2),
                                    })}
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
                          <ListItemTextStyle
                            primary={typeof item?.name === 'string' && item.name}
                            primaryTypographyProps={{ color: 'text.secondary' }}
                            sx={{ userSelect: 'text' }}
                          />
                        </Grid>
                        <Grid item xs={7.5} sm={9}>
                          <ListItemTextStyle
                            primary={returnDisplayValue((item.displayValue as string) ?? '')}
                            primaryTypographyProps={{
                              variant: 'body2',
                              color: 'text.primary',
                            }}
                            sx={{ userSelect: 'text' }}
                          />
                          {index < attributes.length - 1 ? (
                            <Divider
                              variant="fullWidth"
                              sx={({ spacing }) => ({
                                borderColor: 'common.white',
                                py: spacing(2),
                              })}
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
