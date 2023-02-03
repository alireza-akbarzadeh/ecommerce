import { PaginationItem, PaginationProps, Stack } from '@mui/material'
import { ForwardedRef, forwardRef, useState } from 'react'
import { HBIcon } from '../HBIcon'
import {
  HBPaginationGotoButtonStyle,
  HBPaginationGotoInputStyle,
  HBPaginationRootStyle,
} from './HBPagination.styles'

export interface HBPaginationProps extends PaginationProps {
  gotoPage?: (page: number) => void
}

const HBGridPagination = forwardRef(
  <T extends HTMLDivElement>(
    {
      color = 'primary',
      variant = 'outlined',
      shape = 'rounded',
      gotoPage,
      ...props
    }: HBPaginationProps,
    ref: ForwardedRef<T>,
  ) => {
    const [pageNumber, setPageNumber] = useState('')

    const handleGotoPage = () => {
      if (!pageNumber || pageNumber == '0') return
      if (
        pageNumber &&
        !isNaN(Number(pageNumber)) &&
        props.count &&
        Number(pageNumber) <= props.count
      ) {
        gotoPage?.(+pageNumber)
      }
    }
    //test

    return (
      <Stack direction="row" spacing={4} alignItems="center" className="paginationWrapper">
        {!!gotoPage && (
          <Stack direction="row" spacing={2} alignItems="center">
            <HBPaginationGotoButtonStyle
              variant={'contained'}
              color={'primary'}
              size="small"
              onClick={handleGotoPage}
            >
              برو
            </HBPaginationGotoButtonStyle>
            <HBPaginationGotoInputStyle
              size="small"
              placeholder={'برو به ...'}
              value={pageNumber}
              onChange={(e) => setPageNumber(e.target.value)}
              maskOptions={{ mask: Number, min: 1 }}
              onKeyDown={(e) => e.key === 'Enter' && handleGotoPage()}
            />
          </Stack>
        )}

        <HBPaginationRootStyle
          ref={ref}
          color={color}
          variant={variant}
          shape={shape}
          showFirstButton
          showLastButton
          siblingCount={0}
          renderItem={(items) => (
            <PaginationItem
              components={{
                previous: () => <HBIcon type={'angleLeft'} size="small" />,
                next: () => <HBIcon type={'angleRight'} size="small" />,
                first: () => <HBIcon type={'angleDoubleLeft'} size="small" />,
                last: () => <HBIcon type={'angleDoubleRight'} size="small" />,
              }}
              {...items}
            />
          )}
          {...props}
          onChange={(_, page) => {
            setPageNumber('')
            props?.onChange?.(_, page)
          }}
        />
      </Stack>
    )
  },
)

HBGridPagination.displayName = 'HBGridPagination'
HBGridPagination.defaultProps = {}

export default HBGridPagination
