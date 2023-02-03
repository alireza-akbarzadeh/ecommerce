import { OtherVendorItem } from '@hasty-bazar-commerce/containers/OtherVendors'
import { HBAccordion, HBIcon } from '@hasty-bazar/core'
import { Box, Stack, styled, Typography } from '@mui/material'
import { FC, useEffect, useRef, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import ProductionDetailMessages from '../../productDetail.messages'
import { useProductDetail } from '../../ProductDetailContext'
import { ProductDetailSubjectFuncs } from '../../ProductDetailSubjects'

const ClickableStyle = styled(Stack)(() => ({
  cursor: 'pointer',
}))

const OtherVendors: FC = (props) => {
  const { activeOtherVendors, activeUniqueProduct } = useProductDetail()
  const [expanded, setExpanded] = useState<boolean>(false)
  const refWrapper = useRef<HTMLDivElement>()
  useEffect(() => {
    const subsribtion = ProductDetailSubjectFuncs.getExpandedChange().subscribe((res) => {
      setExpanded(true)
      refWrapper.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
    return () => {
      subsribtion.unsubscribe()
    }
  }, [])
  return (
    <Box ref={refWrapper} sx={{ width: '100%', px: { xs: 0, sm: 2, md: 0 } }}>
      {activeOtherVendors && !!activeOtherVendors.length && (
        <Stack>
          <HBAccordion
            customSummary={
              <ClickableStyle
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                onClick={() => setExpanded(!expanded)}
                sx={{
                  bgcolor: 'grey.100',
                  width: '100%',
                  py: 2,
                  paddingLeft: 4,
                  paddingRight: 2,
                  borderRadius: 4,
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Typography color="text.prmary" variant="subtitle1">
                    <FormattedMessage
                      {...ProductionDetailMessages.otherVendorCount}
                      values={{ count: `${activeOtherVendors?.length}` }}
                    />
                  </Typography>
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                      height: 32,
                      width: 32,
                    }}
                  >
                    <HBIcon
                      type="angleDown"
                      sx={{
                        color: 'grey.500',
                        transition: 'transform 0.2s',
                        ...(expanded && { transform: 'rotate(180deg)' }),
                      }}
                    />
                  </Stack>
                </Stack>
              </ClickableStyle>
            }
            expanded={expanded}
            sx={{
              '& .Mui-expanded': {
                margin: (theme) => `${theme.spacing(1)}!important`,
              },
              '& .MuiAccordionSummary-content': {
                margin: (theme) => `${theme.spacing(1)}!important`,
              },
              boxShadow: 'none',
              '& .MuiAccordionSummary-root': { minHeight: 'unset', padding: 0 },
              '& .MuiAccordionDetails-root': {
                p: 0,
              },
              bgcolor: 'grey.100',
            }}
            detail={
              <Stack sx={{ paddingBottom: 4 }} px={4} spacing={4}>
                {activeOtherVendors.map((vendor) => (
                  <OtherVendorItem
                    inventory={activeUniqueProduct?.inventory ?? 0}
                    vendor={vendor}
                  />
                ))}
              </Stack>
            }
          />
        </Stack>
      )}
    </Box>
  )
}

export default OtherVendors
